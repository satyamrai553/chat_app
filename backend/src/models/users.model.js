import {Schema} from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true, 
    },
    username: {
        type: String,
        require: true, 
    },
    password:{
        type: String,
        require: true
    },
    
},{
    timestamps: true
})
