import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';
import { Jwt } from './interfaces/auth.interface';
@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ){}
    async signUp(dto: AuthDto){
        const hashedPass = await bcrypt.hash(dto.password, 12);
        try{
            await this.prisma.user.create({
                data:{
                    email: dto.email,
                    hashedPassword: hashedPass,
                },
            })
            return{
                message:"ok",
            }
        }
        catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code = "P2002"){
                    throw new ForbiddenException("このメールアドレスは既に使われています．")
                }
            }
            throw error;
        }
    }
    
        async login(dto: AuthDto): Promise<Jwt>{
            const user = await this.prisma.user.findUnique({
                    where:{
                        email: dto.email
                    },
            });
            if(!user)throw new ForbiddenException("Eメールアドレスまたはパスワードが不正です．");
            const isValid = await bcrypt.compare(dto.password, user.hashedPassword);
            if(!isValid){
                throw new ForbiddenException("Eメールアドレスまたはパスワードが不正です．");
            }
            return this.generateJwt(user.id, user.email);
        }

        async generateJwt(userId: number, email: string): Promise<Jwt>{
            const payload = {
                sub: userId,
                email,
            };
            const secret = this.config.get("JWT_SECRET");
            const token = await this.jwt.signAsync(payload,{
                expiresIn:"5m",
                secret:secret,
            });
            return{
                accessToken: token,
            }
        }
    

}
