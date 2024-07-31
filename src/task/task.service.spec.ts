import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task.model';

// jest.mock('fs');

describe('TaskService', () => {
  let service: TaskService;
  const taskFilePath = path.resolve(__dirname, '../../src/task/tasks.json');
  const tasks = fs.readFileSync(taskFilePath, 'utf-8');
  const okTask = JSON.parse(tasks);
  const readMock = jest.spyOn(fs, 'existsSync');
  const max = 10;
  const randomInt = Math.floor(Math.random() * max);
  const title = 'from-unit-test-' + randomInt;
  const description = 'from-unit-test';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', () => {
      const result = service.getAllTasks();
      expect(result).toEqual(okTask);
      // console.log(okTask);
    });

    it('should handle file error', () => {
      readMock.mockReturnValue(false);
      // readMock.mockImplementation(() => {
      //   throw new InternalServerErrorException();
      // });
      expect(() => service.getAllTasks()).toThrow(InternalServerErrorException);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', () => {
      readMock.mockReturnValue(true);
      const id = 'a8ba980c-51d7-40e9-a357-9ebdf8006ba1';
      const task = okTask.find((task) => task.id === id);
      //console.log({ task });
      const result = service.getTaskById(id);
      //console.log({ result });
      expect(result.id).toBe(task.id);
    });

    it('should return not found', () => {
      readMock.mockReturnValue(true);
      const id = 'test';
      const task = okTask.find((task) => task.id === id);
      console.log({ task });
      expect(() => service.getTaskById(id)).toThrow(NotFoundException);
    });

    it('should throw internal exception', () => {
      readMock.mockReturnValue(false);
      const id = 'a8ba980c-51d7-40e9-a357-9ebdf8006ba1';
      const task = okTask.find((task) => task.id === id);
      console.log({ task });
      expect(() => service.getTaskById(id)).toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('createTask', () => {
    it('should create new task', () => {
      readMock.mockReturnValue(true);
      const result = service.createTask(title, description);
      const newTasks = fs.readFileSync(taskFilePath, 'utf-8');
      const jsonNewTasks = JSON.parse(newTasks);
      const x = jsonNewTasks[jsonNewTasks.length - 1];
      console.log({ result });
      expect(result.id).toEqual(x.id);
    });

    it('should throw internal server error if error when reading file', () => {
      readMock.mockReturnValue(false);
      expect(() => service.createTask(title, description)).toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update task', () => {
      readMock.mockReturnValue(true);
      const id = '882a751d-e541-464e-9ba2-4e2098f734c8';
      const status = TaskStatus.IN_PROGRESS;
      const result = service.updateTaskStatus(id, status);
      console.log({ result });
      const newTasks = fs.readFileSync(taskFilePath, 'utf-8');
      const jsonNewTasks = JSON.parse(newTasks);
      const task = jsonNewTasks.find((task) => task.id === id);
      console.log(task.id);
      // console.log({ jsonNewTasks });
      expect(result.id).toEqual(task.id);
      expect(result.status).toEqual(task.status);
    });

    it('should throw 404 when id is not found', () => {
      readMock.mockReturnValue(true);
      const id = 'asd';
      const status = TaskStatus.IN_PROGRESS;
      expect(() => service.updateTaskStatus(id, status)).toThrow(
        new NotFoundException(`Task with given ID: ${id}, not found`),
      );
    });

    it('should throw 500 when error reading file', () => {
      readMock.mockReturnValue(false);
      const id = '882a751d-e541-464e-9ba2-4e2098f734c8';
      const status = TaskStatus.IN_PROGRESS;
      expect(() => service.updateTaskStatus(id, status)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
