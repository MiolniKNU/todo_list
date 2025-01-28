const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Подключение к PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_db',
  password: 'aboba',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Маршруты
// Получение всех задач
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Добавление новой задачи
app.post('/todos', async (req, res) => {
  const { taskText } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (task_text, is_completed) VALUES ($1, $2) RETURNING *',
      [taskText, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновление статуса задачи
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET is_completed = $1 WHERE id = $2 RETURNING *',
      [isCompleted, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удаление задачи
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
