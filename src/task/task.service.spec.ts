import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

// jest.mock('fs');

describe('TaskService', () => {
  let service: TaskService;
  const taskFilePath = path.resolve(__dirname, '../../src/task/tasks.json');
  const tasks = fs.readFileSync(taskFilePath, 'utf-8');
  const okTask = JSON.parse(tasks);

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
      const readMock = jest.spyOn(fs, 'existsSync');
      readMock.mockReturnValue(false);
      // readMock.mockImplementation(() => {
      //   throw new InternalServerErrorException();
      // });
      expect(() => service.getAllTasks()).toThrow(InternalServerErrorException);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', () => {
      const readMock = jest.spyOn(fs, 'existsSync');
      readMock.mockReturnValue(true);
      const id = 'a8ba980c-51d7-40e9-a357-9ebdf8006ba1';
      const task = okTask.find((task) => task.id === id);
      //console.log({ task });
      const result = service.getTaskById(id);
      //console.log({ result });
      expect(result.id).toBe(task.id);
    });

    it('should return not found', () => {
      const readMock = jest.spyOn(fs, 'existsSync');
      readMock.mockReturnValue(true);
      const id = 'test';
      const task = okTask.find((task) => task.id === id);
      console.log({ task });
      expect(() => service.getTaskById(id)).toThrow(NotFoundException);
    });

    it('should throw internal exception', () => {
      const readMock = jest.spyOn(fs, 'existsSync');
      readMock.mockReturnValue(false);
      const id = 'test';
      const task = okTask.find((task) => task.id === id);
      console.log({ task });
      expect(() => service.getTaskById(id)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
