var mongoose = require('mongoose');
var {ObjectId} = mongoose.Schema

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    userId:{
        type: ObjectId,
        ref:'User'
    },
    Date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Blog',blogSchema)


