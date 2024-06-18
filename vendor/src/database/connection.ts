import mongoose from 'mongoose';

async function dbconnection(){
    try{
        console.log("db connecting....");
        console.log("DB URL is ",process.env.DB_URL);
         await mongoose.connect(process.env.DB_URL || "");
        console.log("db connected");
    }
    catch(err){
        console.log(err)
    }
}

export { dbconnection }