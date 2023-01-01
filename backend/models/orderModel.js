const mongoose = require("mongoose");
const validator = require("validator");
const addDays = require('date-fns/add');

const orderSchema = new mongoose.Schema({

  price: {
    amount: {
      type: Number,
      required: [true, "Please Enter Price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
    name: {
      type: String,
      required: [true, "Please Enter package name"]
    },
    description: {
      type: String,
      required: [true, "Please Enter package description"]
    },
    deliveryDays: {
      type: String,
      required: [true, "Please Enter Number of Days"],
    },
  },
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

  userFrom: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userTo: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name:{
      type: String,
      required: [true, "Username must be required..."],
    }
  },
  gigId: {
    id:{type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
    image:{
      type:String,
      required:[true,"gig Image must be required..."]
    }
  },
  chatBetween:[
    {
      userId:
        {type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      text:{
        type:String,
      },
      image:{
        type:String,
      },
      name:{
        type:String,
      }

    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endAt:{
    type: Date,
    
  },
  status: {
    type: String,
  }
});

orderSchema.pre("save", async function (next) {
  console.log("I am in")
  if (!this.isModified("createdAt")) {
    next();
  }
  console.log("I am in 2nd")

  const deliveryDays = parseInt(this.price.deliveryDays.substring(0,2))
  console.log(deliveryDays)
  this.endAt = addDays(this.createdAt,{days:deliveryDays})
  console.log(this.endAt)

});


module.exports = mongoose.model("Orders", orderSchema);
