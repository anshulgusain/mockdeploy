const mongoose=require("mongoose")

const Connection=mongoose.connect("mongodb+srv://anshulgusain99:mOUyKg2zy5uAZre1@cluster0.vwiwavz.mongodb.net/mock")

module.exports={
    Connection
}

