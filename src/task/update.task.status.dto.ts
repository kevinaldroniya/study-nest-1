import { IsEnum } from 'class-validator';
import { TaskStatus } from './task.model';
export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: 'status must be valid enum value',
  })
  status: TaskStatus;
}
