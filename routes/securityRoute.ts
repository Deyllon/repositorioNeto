import { UserControler } from "../controlers/userControler"
const userControler = new UserControler()
import { Request, Router, Response, NextFunction } from "express";
import localStore from "../helpers/storageHelper";

class Route{
    public router: Router
    constructor(){
        this.router = Router()
        this.security()
    }
    private security(){
        this.router
            .route("/createUser")
                .get((req: Request, res: Response, next: NextFunction) => res.render("createUser") )
                .post(userControler.createUser)
        this.router
            .route("/login")
                .get((req: Request, res: Response, next: NextFunction) => res.render("login"))
                .post(userControler.loginUser)
        this.router
            .route("/logout")
                .get((req: Request, res: Response, next: NextFunction) => {
                    localStore.clear()
                    res.redirect("/")
                })
    }
}

export default new Route().router


