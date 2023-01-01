const mongoose = require("mongoose");
const validator = require("validator");


const videosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Title"],
    maxLength: [80, "Title cannot exceed 80 characters"],

  },
  description: {
    type: String,
    maxLength: [1200, "Description cannot exceed 1200 characters"],
    minLength: [10, "Description should have more than 10 characters"],
    required: [true, "Please Enter product Description"],
  },
  price: {
    type:Number,
  },
  searchTags:[{
    type:String,
    validate:{
      validator:function(){
        return !(this.searchTags?.length >5)
      },
      message:"Max 5 tags are allowed"
    }

  }],
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  images: 
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  purchasedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }],
  videos:[{
    public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      title:{
        type: String,
        required: true,
      },
      description:{
        type: String,
        required: true,
      },
      file_name:{
        type: String,
        required: true,
      }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  draft:{
    type:Boolean,
    default: true,
  }
  
});

module.exports = mongoose.model("Videos", videosSchema);
