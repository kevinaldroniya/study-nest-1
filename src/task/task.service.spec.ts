import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import * as fs from 'fs';
import * as path from 'path';

// jest.mock('fs');

describe('TaskService', () => {
  let service: TaskService;
  const taskFilePath = path.resolve(__dirname, '../../src/task/tasks.json');

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
      const tasks = fs.readFileSync(taskFilePath, 'utf-8');
      const okTask = JSON.parse(tasks);

      const result = service.getAllTasks();
      expect(result).toEqual(okTask);
      // console.log(okTask);
    });

    it('should handle file error', () => {
      const fileReadMock = jest.spyOn(fs, 'readFileSync');
      fileReadMock.mockImplementation(() => {
        throw new Error('file read error');
      });
      expect(() => service.getAllTasks()).toThrow('file read error');
    });
  });
});
