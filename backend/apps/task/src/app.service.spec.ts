import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';

describe('AppService', () => {
  let appService: AppService;

  const mockTaskRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [{ id: '1', title: 'Test Task', isCompleted: false }];
      mockTaskRepository.find.mockResolvedValue(tasks);

      const result = await appService.findAll();

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      const task = { id: '1', title: 'New Task', isCompleted: false };
      mockTaskRepository.create.mockReturnValue(task);
      mockTaskRepository.save.mockResolvedValue(task);

      const result = await appService.create('New Task');

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'New Task',
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a task', async () => {
      const task = { id: '1', title: 'Task', isCompleted: false };
      mockTaskRepository.findOneBy.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue({ ...task, isCompleted: true });

      const result = await appService.updateStatus('1', true);

      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockTaskRepository.save).toHaveBeenCalledWith({
        ...task,
        isCompleted: true,
      });
      expect(result).toEqual({ ...task, isCompleted: true });
    });
  });

  describe('delete', () => {
    it('should delete a task by id', async () => {
      mockTaskRepository.delete.mockResolvedValue({});

      await appService.delete('1');

      expect(mockTaskRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('clearCompleted', () => {
    it('should delete all completed tasks', async () => {
      mockTaskRepository.delete.mockResolvedValue({});

      await appService.clearCompleted();

      expect(mockTaskRepository.delete).toHaveBeenCalledWith({
        isCompleted: true,
      });
    });
  });

  describe('clearAll', () => {
    it('should clear all tasks', async () => {
      mockTaskRepository.clear.mockResolvedValue({});

      await appService.clearAll();

      expect(mockTaskRepository.clear).toHaveBeenCalled();
    });
  });
});
