import pool from "../database/config";
import bcrypt from "bcryptjs"
import { NextFunction, Request, Response } from "express";
import updateUser from "../helpers/updateHelpers";
import jwt from "jsonwebtoken"
import httpErrors from "http-errors"
import localStore from "../helpers/storageHelper";

export class UserControler{
    public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        pool.query("SELECT * FROM user_table")
        .then(result => res.json(result.rows))
        .catch(err => next(err))
    }
    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void>{
        bcrypt.hash(req.body.user.password, 10)
        .then(password => 
            pool.query("INSERT INTO user_table (username, email, password) VALUES ($1, $2, $3) RETURNING *", 
                [req.body.user.username, req.body.user.email, password])
            .then(() =>res.redirect("/"))
            .catch(err => next(err)))
        .catch(err => next(err))
    }

    public async updateUser(req: any, res: Response, next: NextFunction): Promise<void>{
        updateUser(next, res, Object.keys(req.body), Object.values(req.body), req.params.id)
    }

    public async getUserById(req: any, res: Response, next: NextFunction): Promise<void>{
        pool.query("SELECT * from user_table WHERE id = $1", [req.params.id])
        .then(result =>result.rows[0] ? res.json(result.rows[0]) : next( new Error("User not Found")))
        .catch(err => next(err))
    }

    public async deleteUserById(req: any, res: Response, next: NextFunction): Promise<void>{
        pool.query("DELETE FROM user_table WHERE id = $1", [req.params.id])
        .then(() => res.status(200).send({message: "Usuario deletado"}))
        .catch(err => next(err))
    }

    public async getUserByUsername(req: any, res: Response, next: NextFunction): Promise<void>{
        pool.query("SELECT * from user_table WHERE username = $1", [req.params.username])
        .then(result => result.rows[0] ? res.json(result.rows[0]) : next( new Error("User not Found")))
        .catch(err => next(err))
    }

    public async loginUser(req:any,res:Response, next: NextFunction): Promise<void>{
        pool.query("Select * from user_table WHERE username = $1", [req.body.user.username])
        .then(result => {result.rows[0] ? bcrypt.compare(req.body.user.password, result.rows[0].password)
            .then(passwordHash => { 
                if(passwordHash){
                    const accessToken = jwt.sign({user: result.rows[0].username}, "tokenDeAcesso")
                    localStore.setItem("token", accessToken)
                    res.redirect("/")
                } 
                else{
                    next(httpErrors(401))
                }
            })
            : httpErrors(401)})
        .catch(err => next(err))
    }
}
