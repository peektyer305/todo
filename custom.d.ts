import { User} from "@prisma/client";

declare module "express-serve-static-core"{
    //Requetインターフェースにuserプロパティをマージ
    interface Request{
        user?: Omit<User,"hashedPassword">;
    }
}