import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
      <label className="checkbox-container">
        <input 
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggle(todo.id, todo.is_completed)}
        />
        <span className="checkmark"></span>
        <span className="task-text">{todo.task_text}</span>
      </label>
      <button 
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </div>
  );
};

export default TodoItem;
