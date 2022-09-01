import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.getTaskById(id, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.repo.save(task);
    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    //error message is not working! Fix that
    const result = await this.tasksRepository.repo
      .createQueryBuilder('deleteByID')
      .delete()
      .where({ id })
      .andWhere({ user });

    if (!result) throw new NotFoundException(`Task with ID "${id}" not found`);

    result.execute();
  }
}
