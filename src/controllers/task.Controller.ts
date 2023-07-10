import { Request, Response } from 'express';
import { db } from "../config/database.js"
import Joi from 'joi'; 


const taskSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  day: Joi.string().required(),
  responsible: Joi.string().required(),
  status: Joi.string().required(),
});

export const createTask = async (req: Request, res: Response) => {
  try {
   
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

  
    const { name, description, day, responsible, status } = value;
    const query = 'INSERT INTO tasks (name, description, day, responsible, status) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const newTask = await db.one(query, [name, description, day, responsible, status]);

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao criar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar a tarefa' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);

    // Busca a tarefa no banco de dados
    const task = await db.oneOrNone('SELECT * FROM tasks WHERE id = $1', taskId);

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao buscar a tarefa' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);

    
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }


    const { name, description, day, responsible, status } = value;
    const query = 'UPDATE tasks SET name = $1, description = $2, day = $3, responsible = $4, status = $5 WHERE id = $6 RETURNING *';
    const updatedTask = await db.oneOrNone(query, [name, description, day, responsible, status, taskId]);

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao atualizar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);

    // Deleta a tarefa do banco de dados
    const deletedTask = await db.oneOrNone('DELETE FROM tasks WHERE id = $1 RETURNING *', taskId);

    if (deletedTask) {
      res.json({ message: 'Tarefa deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao deletar a tarefa:', error);
    res.status(500).json({ error: 'Erro ao deletar a tarefa' });
  }
};