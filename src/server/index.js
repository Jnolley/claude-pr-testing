const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

let todos = [
  { id: '1', text: 'Learn Node.js', completed: false },
  { id: '2', text: 'Build a todo app', completed: true },
  { id: '3', text: 'Deploy to production', completed: false }
];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  // TODO: Add proper input validation and sanitization
  const newTodo = {
    id: uuidv4(),
    text: text,  // Potential XSS vulnerability - should sanitize
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  console.log('New todo created:', newTodo.text); // Logging user input without sanitization
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  
  // Missing input validation
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  // Potential race condition - not handling concurrent updates
  if (text !== undefined) todos[todoIndex].text = text;
  if (completed !== undefined) todos[todoIndex].completed = completed;
  todos[todoIndex].updatedAt = new Date().toISOString();
  
  // Should validate data before saving
  res.json(todos[todoIndex]);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  res.status(204).send();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});