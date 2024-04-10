import { Controller, Req, UseGuards, Get, ParseIntPipe, Param, Post, Body, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { Request } from 'express';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('todo')
export class TodoController {
    constructor(private readonly todo: TodoService){}

    @Get()
    getTasks(@Req() req: Request): Promise<Task[]>{
        return this.todo.getTasks(req.user.id);
    }

    @Get(":id")
    getTaskById(@Req() req: Request, @Param("id",ParseIntPipe) taskId: number,): Promise<Task>{
        return this.todo.getTaskById(req.user.id, taskId);
    }

    @Post()
    createTask(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task>{
        return this.todo.createTask(req.user.id,dto);
    }

    @Patch(":id")
    updateTaskById(@Req() req: Request, @Param("id", ParseIntPipe) taskId: number,@Body() dto: UpdateTaskDto): Promise<Task>{
        return this.todo.updateTaskById(req.user.id,taskId,dto);
    }

    //deleteなのでステータスをカスタマイズ
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    deleteTaskById(@Req() req: Request, @Param("id",ParseIntPipe) taskId: number,): Promise<void>{
        return this.todo.deleteTaskById(req.user.id, taskId);
    }
}
