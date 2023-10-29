const mongoose = require("mongoose")
const blogshema= new mongoose.Schema({
    title:String,
    discription: String,
    firstname: String
})

const  allblogs = mongoose.model("allblogs", blogshema)
module.exports = allblogs