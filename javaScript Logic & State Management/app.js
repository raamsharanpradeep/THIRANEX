// Global State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterGroup = document.getElementById('filter-group');

// Save to LocalStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Render Todos based on Filter State
function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true; // 'all'
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </div>
      <div>
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn delete-btn">Delete</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// Helper to prevent XSS injection
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- CRUD Operations ---

// CREATE
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  todoInput.value = '';
});

// Event Delegation for UPDATE & DELETE inside todo list
todoList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('.todo-item');
  if (!li) return;

  const id = li.dataset.id;
  const todo = todos.find((item) => item.id === id);

  // Toggle Complete Status
  if (target.classList.contains('todo-checkbox')) {
    todo.completed = target.checked;
    saveTodos();
    renderTodos();
    return;
  }

  // DELETE Task
  if (target.classList.contains('delete-btn')) {
    todos = todos.filter((item) => item.id !== id);
    saveTodos();
    renderTodos();
    return;
  }

  // UPDATE Task Text (Inline Edit)
  if (target.classList.contains('edit-btn')) {
    const textSpan = li.querySelector('.todo-text');
    const isEditing = li.classList.contains('editing');

    if (!isEditing) {
      li.classList.add('editing');
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'edit-input';
      input.value = todo.text;
      textSpan.replaceWith(input);
      input.focus();
      target.textContent = 'Save';
    } else {
      const editInput = li.querySelector('.edit-input');
      const newText = editInput.value.trim();
      if (newText) {
        todo.text = newText;
        saveTodos();
      }
      renderTodos();
    }
  }
});

// FILTER Switching via Delegation
filterGroup.addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;

  document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
  e.target.classList.add('active');

  currentFilter = e.target.dataset.filter;
  renderTodos();
});

// Initial Render on Page Load
renderTodos();