const baseEndpoint = "https://swapi.co/api/";
const resultsGrid = document.querySelector('.cards');
const queryInput = document.querySelector('form.search');
const loadButton = document.querySelector('.load-more');
let nextURL = '';

function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchData(query) {
  const res = await fetch(`${baseEndpoint}${query}/`);
  const data = await res.json();
  nextURL = data.next;
  nextURL ? loadButton.classList.remove('hidden') : loadButton.classList.add('hidden');
  return data;
}

function handleError(err) {
  console.log('Danger... Error...');
  console.log(err);
}

function displayResults(results) {
  console.log('building out html...');
  const html = results.map(
    result => `<div class="result-card">
      <h2>${result.name || result.title}</h2>
    </div>`
  );
  // pulling this out of the function and into fetchAndDisplay for better versatility
  // resultsGrid.innerHTML = html.join('');
  // instead, return the html
  return html.join('');
}

async function fetchAndDisplay(query) {
  // prevent spamming submit button
  queryInput.submit.disabled = true;
  // submit the search request
  const dataCards = await fetchData(query).catch(handleError);
  console.log(dataCards);
  const searchStr = `<p class="search-results">Displaying results for <span class="highlight">${query}</span></p>`;
  const curData = displayResults(dataCards.results);
  resultsGrid.innerHTML = curData;
  const prevQuery = document.querySelector('.search-results');
  prevQuery ? prevQuery.remove() : null;
  resultsGrid.insertAdjacentHTML('beforebegin', searchStr);
  wait(2000).then((queryInput.submit.disabled = false));
}

async function fetchNext() {
  const res = await fetch(nextURL);
  const data = await res.json();
  // if there aren't more results, hide the load-more button

  if (!data.next) {
    loadButton.classList.add('hidden');
  } else {
    const getMore = await fetch(nextURL);
    nextURL = data.next;
    const moreCards = await getMore.json();
    console.log(moreCards);
    const moreResults = displayResults(moreCards.results);
    resultsGrid.insertAdjacentHTML('beforeend', moreResults);
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  await fetchAndDisplay(form.query.value);
  form.query.value = '';
}

queryInput.addEventListener('submit', handleSubmit);
loadButton.addEventListener('click', fetchNext);
