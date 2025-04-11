const container = document.getElementById('box');
const addbtnboard = document.getElementById('add-board');


function attachDragEvents(target) {
  target.addEventListener('dragstart', () => {
    target.classList.add('flying');
  });

  target.addEventListener('dragend', () => {
    target.classList.remove('flying');
  });
}


function handleDelete(taskCard) {
  taskCard.remove();
}


function handleEdit(taskText, taskCard) {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = taskText.innerText;
  input.classList.add('edit-input');

  taskCard.replaceChild(input, taskText);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText !== '') {
      taskText.innerText = newText;
    }
    taskCard.replaceChild(taskText, input);
  }

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  });

  input.addEventListener('blur', saveEdit);
}

function delboard(board) {
  board.remove();
}


function edit_title(header) {
  const titleDiv = header.querySelector('.board-title');
  const currentText = titleDiv.textContent.trim();

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;
  input.classList.add('edit-input');

  titleDiv.replaceWith(input);
  input.focus();

  const saveTitle = () => {
    const newText = input.value.trim() || currentText;

    const newTitleDiv = document.createElement('div');
    newTitleDiv.classList.add('board-title');
    newTitleDiv.textContent = newText;

    input.replaceWith(newTitleDiv);
  };

  input.addEventListener('blur', saveTitle);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveTitle();
  });
}


function addBoard() {
  const board = document.createElement('div');
  board.classList.add('board');

  const title = document.createElement('div');
  title.classList.add('input-header');

  const inner_title = document.createElement('div');
  inner_title.classList.add('board-title');
  inner_title.innerText = 'Untitled';

  const edit_div = document.createElement('div');
  edit_div.classList.add('task-actions');

  const editbtn = document.createElement('button');
  editbtn.innerText = '✏️';
  editbtn.classList.add('edit-board-btn');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = '🗑️';
  deleteBtn.classList.add('delete-board-btn');

  editbtn.addEventListener('click', () => {
    const header = editbtn.closest('.input-header');
    edit_title(header);
  });

  deleteBtn.addEventListener('click', () => {
    delboard(board);
  });

  edit_div.appendChild(editbtn);
  edit_div.appendChild(deleteBtn);
  title.appendChild(inner_title);
  title.appendChild(edit_div);

  const body = document.createElement('div');
  body.classList.add('items-container');

  const addTaskDiv = document.createElement('div');
  addTaskDiv.classList.add('add-task');

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('input');
  input.placeholder = 'Enter your task';

  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.innerText = 'Add Task';

  btn.addEventListener('click', () => addInput(board));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInput(board);
    }
  });

  addTaskDiv.appendChild(input);
  addTaskDiv.appendChild(btn);

  board.appendChild(title);
  board.appendChild(body);
  board.appendChild(addTaskDiv);

  attachBoardDragOver(board);
  container.appendChild(board);
}

function addInput(board) {
  const input = board.querySelector('.input');
  if (!input || input.value.trim() === '') return;

  const taskCard = document.createElement('div');
  taskCard.classList.add('item');
  taskCard.setAttribute('draggable', true);

  const taskText = document.createElement('div');
  taskText.classList.add('task-content');
  taskText.innerText = input.value.trim();

  const action = document.createElement('div');
  action.classList.add('task-actions');

  const delbtn = document.createElement('button');
  delbtn.classList.add('delete-btn');
  delbtn.innerText = '🗑️';

  const editbtn = document.createElement('button');
  editbtn.classList.add('edit-btn');
  editbtn.innerText = '✏️';

  delbtn.addEventListener('click', () => handleDelete(taskCard));
  editbtn.addEventListener('click', () => handleEdit(taskText, taskCard));

  action.appendChild(editbtn);
  action.appendChild(delbtn);
  taskCard.appendChild(taskText);
  taskCard.appendChild(action);

  attachDragEvents(taskCard);
  board.querySelector('.items-container').appendChild(taskCard);
  input.value = '';
}

function attachBoardDragOver(board) {
  board.addEventListener('dragover', (e) => {
    e.preventDefault();
    const curTask = document.querySelector('.flying');
    const itemsContainer = board.querySelector('.items-container');
    if (!curTask || !itemsContainer) return;

    const bottomTask = insertAbove(itemsContainer, e.clientY);
    if (!bottomTask) {
      itemsContainer.appendChild(curTask);
    } else {
      itemsContainer.insertBefore(curTask, bottomTask);
    }
  });
}

function insertAbove(zone, mouseY) {
  const items = zone.querySelectorAll('.item');
  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  items.forEach((item) => {
    const { top } = item.getBoundingClientRect();
    const offset = mouseY - top;
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = item;
    }
  });

  return closestTask;
}

document.querySelectorAll('.edit-board-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const header = btn.closest('.input-header');
    edit_title(header);
  });
});

document.querySelectorAll('.delete-board-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const board = btn.closest('.board');
    delboard(board);
  });
});

document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const board = btn.closest('.board');
    addInput(board);
  });
});

document.querySelectorAll('.input').forEach((input) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const board = input.closest('.board');
      addInput(board);
    }
  });
});

document.querySelectorAll('.board').forEach((board) => {
  attachBoardDragOver(board);
});

addbtnboard.addEventListener('click', addBoard);
