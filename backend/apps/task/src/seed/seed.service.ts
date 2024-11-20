import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../task.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async seed() {
    const taskCount = await this.taskRepository.count();

    if (taskCount > 0) {
      console.log('Database already seeded. Skipping seeding.');
      return;
    } else {
      const tasks = [
        { title: 'Learn NestJS', isCompleted: false },
        { title: 'Build a Todo App', isCompleted: false },
        { title: 'Write Tests', isCompleted: true },
      ];
      for (const task of tasks) {
        const existingTask = await this.taskRepository.findOneBy({
          title: task.title,
        });
        if (!existingTask) {
          await this.taskRepository.save(task);
        }
      }
      console.log('Seeding completed!');
    }
  }
}
