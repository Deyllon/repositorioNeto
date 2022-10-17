import {Pool} from "pg"

class Pollzinha{
    public p: Pool
    constructor(){
        this.p = new Pool({
            user: 'postgres',
            host: 'db',
            database: 'mydatabase',
            password: 'Oitentaeum81',
            port: 5432,
        })
        this.p.connect()
        this.p.query("CREATE DATABASE mydb", (err, res) => {
            if(err) console.log("erro")
            if(res) console.log("entrou")
           
        })
        this.p.query(`CREATE TABLE user_table (id serial PRIMARY KEY , 
            username VARCHAR(100) NOT NULL , email VARCHAR(100) UNIQUE NOT NULL , 
            password VARCHAR(100) NOT NULL )`, (err, res) => {
            if(err) console.log(err)
            if(res)console.log("foi") 
        })

    }
}

export default new Pollzinha().p
