import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new InternalServerErrorException();
    }
    const fileContent = fs.readFileSync(this.tasksFilePath, 'utf-8');
    return JSON.parse(fileContent) as Task[];
  }

  private writeTasksToFile(tasks: Task[]): void {
    if (!fs.existsSync(this.tasksFilePath)) {
      throw new InternalServerErrorException();
    }
    fs.writeFileSync(
      this.tasksFilePath,
      JSON.stringify(tasks, null, 2),
      'utf-8',
    );
  }

  getAllTasks(): Task[] {
    try {
      const tasks = this.readTasksFromFile();
      return tasks;
    } catch (error) {
      const message = error.message;
      console.log({ message });
      throw new InternalServerErrorException();
    }
  }

  getTaskById(id: string): Task {
    const tasks = this.readTasksFromFile();
    console.log({ tasks });
    const task = tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID: ${id}, not found`);
    }
    return task;
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
    if (!task) {
      console.log('ok');
      throw new NotFoundException(`Task with given ID: ${id}, not found`);
    }
    task.status = status;
    this.writeTasksToFile(tasks);
    return task;
  }

  deleteTask(id: string): void {
    let tasks = this.readTasksFromFile();
    tasks = tasks.filter((task) => task.id !== id);
    this.writeTasksToFile(tasks);
  }
}
