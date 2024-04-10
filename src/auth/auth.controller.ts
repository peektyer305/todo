import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/auth.interface';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly  authService: AuthService){}
   
  
    @Post("signup")
    signUp(@Body() dto: AuthDto): Promise<Msg>{
        return this.authService.signUp(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post("login")
    async login(
       @Body() dto: AuthDto,
       @Res({passthrough: true}) res: Response
    ):Promise<Msg> {
        const jwt = await this.authService.login(dto);
        res.cookie("access_token", jwt.accessToken,{
            httpOnly: true,
            //デプロイ時にhttpsメソッドにして，trueに書き換える．
            secure: false,
            sameSite: 'none',
            path: "/",
        })
        return{
            message:"ok",
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post("/logout")
    logout(@Req() req: Request, @Res({passthrough: true}) res: Response): Msg{
        res.cookie("access_token","",{
            httpOnly: true,
            //loginメソッドと同じく
            secure:false,
            sameSite:'none',
            path: "/",
        });
        return{
            message: "ok",
        }
    }
}
