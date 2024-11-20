import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../task.entity';

describe('SeedService', () => {
  let seedService: SeedService;
  const mockTask = [
    { title: 'Learn NestJS', isCompleted: false },
    { title: 'Build a Todo App', isCompleted: false },
    { title: 'Write Tests', isCompleted: true },
  ];
  const mockTaskRepository = {
    count: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seedService).toBeDefined();
  });

  describe('seed', () => {
    it('should not seed if database already contains tasks', async () => {
      mockTaskRepository.count.mockResolvedValue(1);

      await seedService.seed();

      expect(mockTaskRepository.count).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
      expect(mockTaskRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should seed tasks if database is empty', async () => {
      mockTaskRepository.count.mockResolvedValue(0);
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      const tasks = mockTask;

      await seedService.seed();

      expect(mockTaskRepository.count).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledTimes(tasks.length);
      expect(mockTaskRepository.save).toHaveBeenCalledTimes(tasks.length);

      tasks.forEach((task) => {
        expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
      });
    });
  });
});
