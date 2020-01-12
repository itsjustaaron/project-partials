const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// we need an array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log('submitted!');
  const name = e.currentTarget.item.value;
  console.log(name);
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  items.push(item);
  console.log(`There are ${items.length} item(s) in your state.`);
  e.target.reset();
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

const displayItems = () => {
  console.log(items);
  const html = items
    .map(
      item => `<li class="shopping-item">
  <input
  type="checkbox"
  value="${item.id}"
  ${item.complete ? 'checked' : ''}
  >
  <span class="itemName">${item.name}</span>
  <button aria-label="remove ${item.name}" value="${item.id}">&times;</button>
  </li>`
    )
    .join('');
  list.innerHTML = html;
};

function fileIntoStorage() {
  console.info('Saving items to localstorage');
  localStorage.setItem('items', JSON.stringify(items));
}

function retrieveFile() {
  console.info('Pulling from storage');
  const filedItems = JSON.parse(localStorage.getItem('items'));
  if (filedItems.length) {
    items.push(...filedItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.warn('DELETING ITEM', id);
  items = items.filter(item => item.id !== id);
  console.log(items);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

const markComplete = id => {
  console.log('marking as complete: ', id);
  const itemRef = items.find(item => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', fileIntoStorage);
// listen for click on list, delegate to button if it was clicked
list.addEventListener('click', e => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  } else if (e.target.matches('input[type="checkbox"]')) {
    markComplete(id);
  }
});
retrieveFile();
