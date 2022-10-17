import { Router } from "express";
import { UserControler } from "../controlers/userControler";
const userControler = new UserControler()

class Route{
    public router: Router
    constructor(){
        this.router = Router() 
        this.userRoute()
    }

    private userRoute(){
        this.router
            .route("/")
                .get(userControler.getAllUsers)
        this.router
            .route("/:id")
                .put(userControler.updateUser)
                .get(userControler.getUserById)
                .delete(userControler.deleteUserById)
        this.router
            .route("/getUserByUsername/:username")
                .get(userControler.getUserByUsername)
    }
    
}
    
export default new Route().router