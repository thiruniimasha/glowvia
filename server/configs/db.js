import mongoose from "mongoose";

const connectDB = async() => {
    try{
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${Process.env.MONGODB_URI}/glowia`)
    } catch(error){
        console.error(error.message);
    }

}

export default connectDB;
