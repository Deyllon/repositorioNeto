import express, { response } from "express"
import helmet from "helmet"
import  cors from  "cors"
import httpErrors from "http-errors"
import userRouter from "./routes/userRoute"
import securityRoute from "./routes/securityRoute"
import indexRoute from "./routes/index"
import {  Request, Response, NextFunction } from "express";
import pool from "./database/config"
import jwt from "jsonwebtoken"
import path from "path"
import localStore from "./helpers/storageHelper"


export class App{

    public express: express.Application

    constructor(){
        this.express = express()
        this.useViews()
        this.useCSS()
        this.middleware()
        this.route()
        this.createError()
        this.errorHandling()
    }

    private middleware(): void{
        this.express.use(cors())
        this.express.use(helmet())
        this.express.use(express.urlencoded({extended: true}))  
        this.express.use(express.json())
    }

    private createError(): void{
        this.express.use((req: Request, res: Response, next: NextFunction) => next(httpErrors(404)))
    }
    
    private errorHandling(): void{
        this.express.use((err: any, req: Request, res: Response, next: NextFunction) =>{
            if(err.status === 404){
                res.status(404).send({message: "Not Found"})
            }
            else if(err.message.startsWith("Illegal arguments:")){
                res.status(400).send({message: "Algum atributo não está correto ou está faltando"})
            }
            else if (err.message.startsWith("User not Found")){
                res.status(204).send({message: "Não foi encontrado nenhum resultado"})
            }
            else if (err.message.startsWith("Você não pode alterar")){
                res.status(400).send({message: "É proibido alterar apenas um campo do usuario"})
            }
            else{
                res.status(500).send({message: err.message})
            }
        })
    }
    private route(): void{
        
        this.express.use("/security", securityRoute)
        this.express.use("/",this.authenticateToken,indexRoute)
        
        this.express.use("/users",this.authenticateToken, userRouter)
        
    }    

    private useCSS(): void{
        this.express.use(express.static("public"))
    }

    private useViews():void{
        this.express.set("views", path.join(__dirname, "views"))
        this.express.set("view engine", "ejs")
    }

    private  authenticateToken(req: any, res: Response, next: NextFunction): any{
        
        const token = localStore.getItem("token")
        console.log(token)
        if (token == null) return res.redirect("/security/login")
        jwt.verify(token, "tokenDeAcesso", (err: any, user: any) =>{
        if (err) return next(httpErrors(403))
        pool.query("SELECT * FROM user_table WHERE username = $1", [user.user])
            .then(u => {
                req.user = u
                next()
            })
            .catch(err => next(err))
        })    
    }

}
