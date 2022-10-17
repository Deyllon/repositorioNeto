import { NextFunction, Request, Response, Router } from "express";

class Route{
    public router: Router
    constructor(){
        this.router = Router()
        this.index()
    }
    private index(): void{
        this.router.get("/",(req: Request, res: Response, next: NextFunction) => res.render("index"))
    }
}

export default new Route().router