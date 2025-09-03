import { escapeHtml } from '../utils/helpers.js';

export class TodoItem {
  constructor(todo, onToggle, onDelete, onEdit) {
    this.todo = todo;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.onEdit = onEdit;
    this.isEditing = false;
  }

  render() {
    const todoElement = document.createElement('div');
    todoElement.className = `todo-item ${this.todo.completed ? 'completed' : ''}`;
    todoElement.dataset.id = this.todo.id;

    if (this.isEditing) {
      todoElement.innerHTML = this.renderEditMode();
    } else {
      todoElement.innerHTML = this.renderViewMode();
    }

    this.attachEventListeners(todoElement);
    return todoElement;
  }

  renderViewMode() {
    return `
      <div class="todo-content">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${this.todo.completed ? 'checked' : ''}
        >
        <span class="todo-text">${escapeHtml(this.todo.text)}</span>
        <div class="todo-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  }

  renderEditMode() {
    return `
      <div class="todo-edit">
        <input 
          type="text" 
          class="edit-input" 
          value="${escapeHtml(this.todo.text)}"
        >
        <div class="edit-actions">
          <button class="save-btn">Save</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `;
  }

  attachEventListeners(element) {
    const checkbox = element.querySelector('.todo-checkbox');
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');
    const saveBtn = element.querySelector('.save-btn');
    const cancelBtn = element.querySelector('.cancel-btn');
    const editInput = element.querySelector('.edit-input');

    if (checkbox) {
      checkbox.addEventListener('change', () => {
        this.onToggle(this.todo.id, checkbox.checked);
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.startEditing();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.onDelete(this.todo.id);
      });
    }

    if (saveBtn && editInput) {
      const save = () => {
        const newText = editInput.value.trim();
        if (newText) {
          this.onEdit(this.todo.id, newText);
          this.stopEditing();
        }
      };

      saveBtn.addEventListener('click', save);
      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') this.stopEditing();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.stopEditing();
      });
    }
  }

  startEditing() {
    this.isEditing = true;
    const element = document.querySelector(`[data-id="${this.todo.id}"]`);
    if (element) {
      element.replaceWith(this.render());
      const input = document.querySelector(`[data-id="${this.todo.id}"] .edit-input`);
      if (input) {
        input.focus();
        input.select();
      }
    }
  }

  stopEditing() {
    this.isEditing = false;
    const element = document.querySelector(`[data-id="${this.todo.id}"]`);
    if (element) {
      element.replaceWith(this.render());
    }
  }
}