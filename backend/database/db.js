const mongoose= require('mongoose');

const connectToDB= async()=>
{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/BookStore4")
        console.log("mongoDB connected successfully!");
    }
    catch(error )
    {
        console.error("MongoDB Connection Failed", error)
        process.exit(1);
    }
};
module.exports=connectToDB;
