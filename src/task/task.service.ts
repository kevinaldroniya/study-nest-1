import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TaskService {
  //   private tasks: Task[] = [];
  private readonly tasksFilePath = path.resolve(
    __dirname,
    '../../src/task/tasks.json',
  );

  private readTasksFromFile(): Task[] {
    // console.log(`Checking file existence at: ${this.tasksFilePath}`);
    if (!fs.existsSync(this.tasksFilePath)) {
      console.log('ok');
      return [];
    }
    const fileContent = fs.readFileSync(this.tasksFilePath, 'utf-8');
    return JSON.parse(fileContent) as Task[];
  }

  private writeTasksToFile(tasks: Task[]): void {
    fs.writeFileSync(
      this.tasksFilePath,
      JSON.stringify(tasks, null, 2),
      'utf-8',
    );
  }

  getAllTasks(): Task[] {
    return this.readTasksFromFile();
  }

  getTaskById(id: string): Task {
    const tasks = this.readTasksFromFile();
    return tasks.find((task) => task.id === id);
  }

  createTask(title: string, description: string): Task {
    const tasks = this.readTasksFromFile();
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    tasks.push(task);
    this.writeTasksToFile(tasks);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const tasks = this.readTasksFromFile();
    const task = tasks.find((task) => task.id === id);
    if (task) {
      task.status = status;
      this.writeTasksToFile(tasks);
    }
    return task;
  }

  deleteTask(id: string): void {
    let tasks = this.readTasksFromFile();
    tasks = tasks.filter((task) => task.id !== id);
    this.writeTasksToFile(tasks);
  }
}
