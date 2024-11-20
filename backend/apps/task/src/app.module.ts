import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskModule } from './task.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'todo_postgres',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'todo_app',
      entities: [Task],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Task]),
    TaskModule,
    SeedModule,
  ],
})
export class AppModule {}
