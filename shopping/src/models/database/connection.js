import mongoose from 'mongoose'
import { globalObj } from '../../utils/envVariables.js'
import dotenv from 'dotenv'
dotenv.config()
export const dbConnection = async() => {
    try{
        await mongoose.connect(globalObj.DB_URL)
        console.log("DB connected")
    } catch(err){
        console.log("error connecting to db ",err);
        process.exit(1)
    }
}
