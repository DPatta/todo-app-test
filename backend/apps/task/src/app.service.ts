import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ order: { createdAt: 'ASC' } });
  }

  async create(title: string): Promise<Task> {
    const task = this.taskRepository.create({ title });
    return this.taskRepository.save(task);
  }

  async updateStatus(id: string, isCompleted: boolean): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    task.isCompleted = isCompleted;
    return this.taskRepository.save(task);
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async clearCompleted(): Promise<void> {
    await this.taskRepository.delete({ isCompleted: true });
  }

  async clearAll(): Promise<void> {
    await this.taskRepository.clear();
  }
}
