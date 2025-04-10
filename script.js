const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('task-input');
const todoBoard = document.getElementById('todo-items');
const container = document.getElementById('box');
const addbtnboard = document.getElementById('add-board');
const allBoards = document.querySelectorAll('.board');



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
  input.value = '';
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

function delboard(board){
  board.remove();
}


function addBoard(){
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
  editbtn.innerText = '✏️'
  editbtn.classList.add('edit-board-btn');

  const delteBtn = document.createElement('button');
  delteBtn.innerText = '🗑️'
  delteBtn.classList.add('delete-board-btn');

 
  editbtn.addEventListener('click', () => {
    const header = editbtn.closest('.input-header');
    edit_title(header);
  });

  const body = document.createElement('div');
  body.classList.add('items-container');

  
  edit_div.appendChild(editbtn);
  edit_div.appendChild(delteBtn);
  title.appendChild(inner_title);
  title.appendChild(edit_div);
  board.appendChild(title);
  board.appendChild(body);
 
  delteBtn.addEventListener('click' , () => {
    delboard(board);
  })
  attachBoardDragOver(board);
  container.appendChild(board);
}

function addInput() {
  const input = taskInput.value.trim();
  if (!input) return;

  const taskCard = document.createElement('div');
  taskCard.classList.add('item');
  taskCard.setAttribute('draggable', true);

  const taskText = document.createElement('div');
  taskText.classList.add('task-content');
  taskText.innerText = input;

  const action = document.createElement('div');
  action.classList.add('task-actions');

  const delbtn = document.createElement('button');
  delbtn.classList.add('delete-btn');
  delbtn.innerText = '🗑️';

  const editbtn = document.createElement('button');
  editbtn.classList.add('edit-btn');
  editbtn.innerText = '✏️';

  delbtn.addEventListener('click', () => {
    handleDelete(taskCard);
  });

  editbtn.addEventListener('click', () => {
    handleEdit(taskText, taskCard);
  });

  action.appendChild(editbtn);
  action.appendChild(delbtn);

  taskCard.appendChild(taskText);
  taskCard.appendChild(action);  

  attachDragEvents(taskCard);
  todoBoard.appendChild(taskCard);
  taskInput.value = '';
}


function edit_title(header){
    const titleDiv = header.querySelector('.board-title');
    const currentText = titleDiv.textContent.trim();

    const input = document.createElement('input');
    input.type = 'text';
    input.value = '';
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


function attachBoardDragOver(board) {
  board.addEventListener('dragover', (e) => {
    e.preventDefault();

    const curTask = document.querySelector('.flying');
    const itemsContainer = board.querySelector('.items-container');
    if(itemsContainer.id == 'todo-board'){
      board =todoBoard;
    }
    const bottomTask = insertAbove(itemsContainer, e.clientY);
    if (!bottomTask) {
      itemsContainer.appendChild(curTask);
    } else {
      itemsContainer.insertBefore(curTask, bottomTask);
    }
  });
}

const insertAbove = (zone, mouseY) => {
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
};

document.querySelectorAll('.edit-board-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const header = btn.closest('.input-header');
    edit_title(header);
  });

  document.querySelectorAll('.delete-board-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const board = btn.closest('.board');
      delboard(board);
    })
  });
});


addbtnboard.addEventListener('click' ,() => {
  addBoard();
});
addTaskBtn.addEventListener('click', addInput);

taskInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addInput();
  }
});



allBoards.forEach((board) => {
  attachBoardDragOver(board)
});




document.querySelectorAll('.item').forEach(attachDragEvents);
