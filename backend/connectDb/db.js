import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.URI)
        console.log('database connected')
    }catch(err){
        console.log('database down ', err)
    }
}