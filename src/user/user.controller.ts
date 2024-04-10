import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update.user.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get()
    getLoginUser(@Req() req: Request): Omit<User,"hashedPassword">{
        return req.user
    }

    @Patch()
    updateUser(
        @Req() req: Request,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<User,"hashedPassword">>{
        return this.userService.upDateUser(req.user.id,dto)
    }
}
