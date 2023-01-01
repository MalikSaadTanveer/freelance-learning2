const mongoose = require("mongoose");
const validator = require("validator");


const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Title"],
    maxLength: [80, "Title cannot exceed 80 characters"],

  },
  category: {
    type: String,
    required: [true, "Please Enter gig Category"],
  },
  subCategory: {
    type: String,
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
  price: [{
    amount: {
      type: Number,
      required: [true, "Please Enter Price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
    name:{
      type: String,
      required:[true,"Please Enter package name"]
    },
    description:{
      type: String,
      required:[true,"Please Enter package description"]
    },
    deliveryDays:{
      type:String,
      required: [true, "Please Enter Number of Days"],
    },
  }],
  description: {
    type: String,
    maxLength: [1200, "Description cannot exceed 1200 characters"],
    minLength: [10, "Description should have more than 10 characters"],
    required: [true, "Please Enter product Description"],
  },
  
  ratings: {
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
 
  numOfReviews: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  draft:{
    type:Boolean,
    default: true,
  }
});

module.exports = mongoose.model("Gigs", productSchema);
