const mongoose = require("mongoose");
const validator = require("validator");
const addDays = require('date-fns/add');

const premiumSearchSchema = new mongoose.Schema({

    
    sellerId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    projects: [
        {
            desc: {
                type: String,
                required: true,
            },
            keywords: [
                {
                    type:String,
                }
            ],
            gigId: {
                type: mongoose.Schema.ObjectId,
                ref: "Gigs",
                required: true,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
});




module.exports = mongoose.model("premiumSearchs", premiumSearchSchema);
