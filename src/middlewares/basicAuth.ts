//BASIC AUTH

// https://www.base64encode.org/
// Encode to Base64 format: email@email.com:password

import { Request, Response, NextFunction } from "express"
import { User } from "../models/User";

export const Auth = {
   private: async (req: Request, res: Response, next: NextFunction) => {
      let success = false;

      if(req.headers.authorization){
         //authorization = basic hash(encode Base64 Format)
         let hash: string = req.headers.authorization.substring(6) //encoded
         let decoded: string = Buffer.from(hash, 'base64').toString(); //decoded
         let data: string[] = decoded.split(':') //email@email.com:password
         
         console.log(data[0]+':'+data[1]);

         if(data.length === 2){
            let hasUser = await User.findOne({ //check user in DataBase
               where:{
                  email: data[0],
                  password: data[1]
               }
            });

            if(hasUser){
               success = true;
               console.log('ok');
            }
         }
      }

      if(success){
         next();
      } else {
         res.status(403) //Not authorized
         res.json({ error: 'Não Autorizado!' })
      }
   }
}