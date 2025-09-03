export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateTodoText = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Todo text is required' };
  }
  
  if (text.trim().length === 0) {
    return { isValid: false, error: 'Todo text cannot be empty' };
  }
  
  if (text.length > 500) {
    return { isValid: false, error: 'Todo text cannot exceed 500 characters' };
  }
  
  return { isValid: true };
};