const Gig = require("../models/gigModel");
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");


//Creating the gig
exports.createGig = catchAsyncErrors(async (req, res, next) => {

    try {
        req.body.user = req.user.id;
        const { title, category, subCategory, searchTags, user } = req.body;


        const gig = new Gig({ title, category, subCategory, searchTags, user });
        await gig.save({ validateBeforeSave: false })


        res.status(200).json({
            success: true,
            gigId: gig._id,
        })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});


//Edit the gig
exports.editGig = catchAsyncErrors(async (req, res, next) => {

    try {
        let gig = await Gig.findById(req.params.id);
        if (!gig) {
            return next(new ErrorHander("Gig not found", 404));
        }

        if (gig.user._id != req.user.id) {
            return next(new ErrorHander("You have no rights to to edit this gig", 404));
        }

        const p = req.query.p;
        let newData = {}
        if (p == 0) {
            const { title, category, subCategory, searchTags } = req.body;
            console.log(title + " "+ category + " "+searchTags);
            if (!title || !category || !searchTags) {
                return next(new ErrorHander("Please enter all the required fields", 404));
            }
            newData = { ...{ title, category, subCategory, searchTags } }
        }

        else if (p == 1) {
            let price = req.body.price;
            if (!price) {
                return next(new ErrorHander("All Fields are Empty", 404));
            }
            if (price.length < 3) {
                return next(new ErrorHander("Please fill all packages", 404));
            }

            console.log(price.length);
            // for(let i=0; i<price.length; i++){
            //     if(!price[i].amount || !price[i].name || !price[i].gigDescription || !price[i].deliveryDays){
            //         return next(new ErrorHander("Please enter all the required fields", 404));
            //     }
            // }
            newData = { price };
        }

        else if (p == 2) {
            let description = req.body.description;
            if (!description) {
                return next(new ErrorHander("Please write a detailed description", 404));
            }
            newData = { description }

        }
        else if (p == 3) {
            if (req.file) {
                // console.log(gig.images);

                if (gig?.images?.public_id) {
                    await cloudinary.v2.uploader.destroy(gig.images.public_id);
                }
                console.log('hello');
                const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: "freelance-learning-platform/gigs",
                    width: 1000,
                    crop: "scale",
                    resource_type: "auto",
                });
                newData = {
                    images: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    }
                }

            }
            else if(gig?.images?.url){
                newData = null
            }
            else{
                return next(new ErrorHander("Please upload image", 404));

            }



        }
        else if (p == 4) {
            
            newData = { draft: false }
            // console.log(newData);
        }

        if (newData != null) {
            const updatedData = await Gig.findByIdAndUpdate(req.params.id, newData, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            })
            

        }

        console.log("I am at that place");
        return res.status(200).json({
            success: true,
        })



    }
    catch (error) {
        console.log(error.message)
        return next(new ErrorHander(error.message, 500));
    }

});


// single user gigs
exports.getUserGigs = catchAsyncErrors(async (req, res, next) => {

    const gig = await Gig.find({ user: req.user.id });
    res.status(200).json({
        success: true,
        gig
    })
})




//single gigDetail with User
exports.gigDetail = catchAsyncErrors(async (req, res, next) => {
    const gig = await Gig.findById(req.params.id)
    const userRequired = req.query.user;

    if(!gig){
        return next(new ErrorHander("Gig not found", 404));
    }

    if(!userRequired){
        return res.status(200).json({
            success: true,
            data:{
                gig
            }
        })
    }


    const user = await User.findById(gig.user._id);
    if(!user){
        return next(new ErrorHander("Gig's owner not found", 404));
    }

    res.status(200).json({
        success: true,
        data:{
            gig,user
        }
    })

})


exports.allGigs = catchAsyncErrors(async (req, res, next) => {

    let category = req.query.category;
    let subCategory = req.query.subCategory;
    let keywords= req.query.keywords;
    let searchIt = {}

    if(category){
        searchIt = {category,draft:false}
    }
    else if(subCategory){
        searchIt = {subCategory,draft:false}
    }
    else if(keywords){
        const arr = {$text: {$search: keywords}}
        searchIt = {...arr,draft:false}
    }
    else{
        searchIt = {draft:false}
    }
    let gig;
    if(!category && !subCategory && !keywords)
    gig  = await Gig.find(searchIt).sort({numOfReviews:-1,ratings:-1}).limit(8)
    else
    gig  = await Gig.find(searchIt)

    
    const userData = []
    for(let i = 0; i <gig.length;i++){
        userData.push(await User.findById(gig[i].user._id).select(['avatar','name']))
    }
   
    res.status(200).json({
        success:true,
        data:{
            gig,
            userData}
    })
})


