import { Response, NextFunction } from "express"
import pool from "../database/config"

const updateUser = (next: NextFunction,res: Response,keys:any[], values: any[], id: any) => {
    const numberValues = [] as string[]
    for(let i=0; i < values.length; i++){
        numberValues.push(`$${i+1}`)    
    }
    pool.query(`UPDATE user_table SET (${keys.toString()}) = (${numberValues.toString()}) WHERE id = ${id} RETURNING *`,values)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err))
}


export default updateUser