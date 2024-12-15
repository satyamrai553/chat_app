import mongoose from "mongoose";


async function dbConnect (){
    const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(response);
}

export default dbConnect;