import { todoAPI } from './api.js';
import { TodoItem } from './components/TodoItem.js';
import { validateTodoText, debounce } from './utils/helpers.js';

class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all';
    this.isLoading = false;
    
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadTodos();
  }

  bindEvents() {
    const form = document.getElementById('add-todo-form');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const errorClose = document.querySelector('.close-error');

    form.addEventListener('submit', this.handleAddTodo.bind(this));
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', this.handleFilterChange.bind(this));
    });

    if (errorClose) {
      errorClose.addEventListener('click', this.hideError.bind(this));
    }
  }

  async loadTodos() {
    try {
      this.setLoading(true);
      this.todos = await todoAPI.getTodos();
      this.render();
    } catch (error) {
      this.showError('Failed to load todos');
    } finally {
      this.setLoading(false);
    }
  }

  async handleAddTodo(e) {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const text = input.value.trim();

    const validation = validateTodoText(text);
    if (!validation.isValid) {
      this.showError(validation.error);
      return;
    }

    try {
      this.setLoading(true);
      const newTodo = await todoAPI.createTodo(text);
      this.todos.push(newTodo);
      input.value = '';
      this.render();
    } catch (error) {
      this.showError('Failed to add todo');
    } finally {
      this.setLoading(false);
    }
  }

  async handleToggleTodo(id, completed) {
    try {
      await todoAPI.updateTodo(id, { completed });
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = completed;
        this.render();
      }
    } catch (error) {
      this.showError('Failed to update todo');
    }
  }

  async handleDeleteTodo(id) {
    try {
      await todoAPI.deleteTodo(id);
      this.todos = this.todos.filter(t => t.id !== id);
      this.render();
    } catch (error) {
      this.showError('Failed to delete todo');
    }
  }

  async handleEditTodo(id, newText) {
    const validation = validateTodoText(newText);
    if (!validation.isValid) {
      this.showError(validation.error);
      return;
    }

    try {
      await todoAPI.updateTodo(id, { text: newText });
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.text = newText;
        this.render();
      }
    } catch (error) {
      this.showError('Failed to update todo');
    }
  }

  handleFilterChange(e) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    this.currentFilter = e.target.dataset.filter;
    this.render();
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  render() {
    this.renderStats();
    this.renderTodos();
  }

  renderStats() {
    const totalElement = document.getElementById('total-todos');
    const completedElement = document.getElementById('completed-todos');
    
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    
    totalElement.textContent = `${total} todo${total !== 1 ? 's' : ''}`;
    completedElement.textContent = `${completed} completed`;
  }

  renderTodos() {
    const todosList = document.getElementById('todos-list');
    const emptyState = document.getElementById('empty-state');
    const filteredTodos = this.getFilteredTodos();

    if (filteredTodos.length === 0) {
      emptyState.style.display = 'block';
      todosList.innerHTML = '';
      todosList.appendChild(emptyState);
      return;
    }

    emptyState.style.display = 'none';
    todosList.innerHTML = '';

    filteredTodos.forEach(todo => {
      const todoItem = new TodoItem(
        todo,
        this.handleToggleTodo.bind(this),
        this.handleDeleteTodo.bind(this),
        this.handleEditTodo.bind(this)
      );
      todosList.appendChild(todoItem.render());
    });
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
      loadingElement.classList.remove('hidden');
    } else {
      loadingElement.classList.add('hidden');
    }
  }

  showError(message) {
    const errorToast = document.getElementById('error-toast');
    const errorMessage = document.querySelector('.error-message');
    
    errorMessage.textContent = message;
    errorToast.classList.remove('hidden');
    
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError() {
    const errorToast = document.getElementById('error-toast');
    errorToast.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});