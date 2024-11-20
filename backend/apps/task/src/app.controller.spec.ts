import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    findAll: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    clearCompleted: jest.fn(),
    clearAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [{ id: '1', title: 'Test Task', isCompleted: false }];
      mockAppService.findAll.mockResolvedValue(tasks);

      const result = await appController.findAll();

      expect(mockAppService.findAll).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });

    it('should return an empty array if no tasks are found', async () => {
      mockAppService.findAll.mockResolvedValue([]);

      const result = await appController.findAll();

      expect(mockAppService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw an HttpException on error', async () => {
      mockAppService.findAll.mockRejectedValue(new Error('Database error'));

      await expect(appController.findAll()).rejects.toThrow(
        new HttpException(
          'Failed to fetch tasks: Database error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const task = { id: '1', title: 'New Task', isCompleted: false };
      mockAppService.create.mockResolvedValue(task);

      const result = await appController.create('New Task');

      expect(mockAppService.create).toHaveBeenCalledWith('New Task');
      expect(result).toEqual(task);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a task', async () => {
      const updatedTask = { id: '1', title: 'Task', isCompleted: true };
      mockAppService.updateStatus.mockResolvedValue(updatedTask);

      const result = await appController.updateStatus('1', true);

      expect(mockAppService.updateStatus).toHaveBeenCalledWith('1', true);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('delete', () => {
    it('should delete a task by id', async () => {
      mockAppService.delete.mockResolvedValue({ success: true });

      const result = await appController.delete('1');

      expect(mockAppService.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('clearCompleted', () => {
    it('should clear all completed tasks', async () => {
      mockAppService.clearCompleted.mockResolvedValue({ success: true });

      const result = await appController.clearCompleted();

      expect(mockAppService.clearCompleted).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe('clearAll', () => {
    it('should clear all tasks', async () => {
      mockAppService.clearAll.mockResolvedValue({ success: true });

      const result = await appController.clearAll();

      expect(mockAppService.clearAll).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});
