import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/todos');
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskText: text }),
      });
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: newStatus }),
      });
  
      if (!response.ok) throw new Error('Помилка оновлення');
  
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, is_completed: newStatus } : todo
      ));
      
    } catch (err) {
      console.error('Помилка:', err);
      alert('Не вдалося оновити статус задачі');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="todo-list">
      <AddTodo onAdd={handleAddTodo} />
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
