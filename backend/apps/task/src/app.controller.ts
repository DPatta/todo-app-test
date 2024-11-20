import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('task')
export class AppController {
  constructor(private readonly taskService: AppService) {}

  @Get()
  async findAll() {
    try {
      const res = await this.taskService.findAll();

      return res.length > 0 ? res : [];
    } catch (error) {
      throw new HttpException(
        `Failed to fetch tasks: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body('title') title: string) {
    return this.taskService.create(title);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isCompleted') isCompleted: boolean,
  ) {
    return this.taskService.updateStatus(id, isCompleted);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }

  @Delete('clear/completed')
  async clearCompleted() {
    return this.taskService.clearCompleted();
  }

  @Delete('clear/all')
  async clearAll() {
    return this.taskService.clearAll();
  }
}
