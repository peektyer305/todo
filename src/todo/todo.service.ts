import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
    constructor(private readonly prisma: PrismaService){}
    
    getTasks(userId: number): Promise<Task[]>{
        return this.prisma.task.findMany({
            where:{
                userId,
            },
            orderBy:{
                createdAt:"desc",
            },
        });
    }
    getTaskById(userId: number, taskId: number): Promise<Task>{
        return this.prisma.task.findFirst({
            where:{
                userId,
                id: taskId,
            },
        });
    }
}
