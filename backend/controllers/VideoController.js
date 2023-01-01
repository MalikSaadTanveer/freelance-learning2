const Gig = require("../models/VideoModel");
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");
const Stripe = require('stripe')

const stripe = new Stripe('sk_test_51MKI38FI7iMIbxw9G6LJ1oA5G16HuLGq4kLUuyTGX3UXQJNdK8aVkb6UD42XmaISDED1exb4GpoMpLRencwX8EFq00bWLJP3Mx')

//Creating the gig
exports.createVideo = catchAsyncErrors(async (req, res, next) => {

    try {
        req.body.user = req.user.id;
        const { title, description, price, searchTags, user } = req.body;

        const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "freelance-learning-platform/videoCourseImages",
            width: 1000,
            crop: "scale",
            resource_type: "auto",
        });

        const images = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }

        const videoCourse = new Gig({ title, description, price, searchTags: JSON.parse(searchTags), images, user });
        await videoCourse.save({ validateBeforeSave: false })


        res.status(200).json({
            success: true,
            videoCourse: videoCourse,
        })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});


// Video Course Edit

exports.editVideoCourse = catchAsyncErrors(async (req, res, next) => {

    try {

        req.body.user = req.user.id;
        let vidoeCourse = await Gig.findById(req.params.id);
        if (!vidoeCourse) {
            return next(new ErrorHander("Video not found", 404));
        }

        if (vidoeCourse.user._id != req.user.id) {
            return next(new ErrorHander("You have no rights to to edit this course", 404));
        }


        const { title, description, price, searchTags, user } = req.body;
        let newData = { title, description, price, searchTags: JSON.parse(searchTags), }
        if (req.file) {
            // console.log(gig.images);

            if (vidoeCourse?.images?.public_id) {
                await cloudinary.v2.uploader.destroy(vidoeCourse.images.public_id);
            }
            console.log('hello');
            const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "freelance-learning-platform/videoCourseImages",
                width: 1000,
                crop: "scale",
                resource_type: "auto",
            });
            newData = {
                ...newData,
                images: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }

        }
        console.log('hello2');

        const updatedData = await Gig.findByIdAndUpdate(req.params.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        res.status(200).json({
            success: true,
            videoCourse: updatedData,
        })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});



exports.deleteVideoFromServerOnUpdate = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body.public_id)
    // const a = await cloudinary.v2.uploader.destroy(req.body.public_id);
    // console.log(a)
    cloudinary.api.delete_resources(req.body.public_id,
        function (result) { console.log(result) }, { resource_type: "video" });


    res.status(200).json({
        success: true,
    })


})



exports.editSingleVideo = catchAsyncErrors(async (req, res, next) => {

    try {
        req.body.user = req.user.id;
        let vidoeCourse = await Gig.findById(req.params.id);
        if (!vidoeCourse) {
            return next(new ErrorHander("Video not found", 404));
        }

        if (vidoeCourse.user._id != req.user.id) {
            return next(new ErrorHander("You have no rights to to edit this Video", 404));
        }


        const { videos, index } = req.body;

        if (index === -1) {
            vidoeCourse.videos?.push(videos)
        }
        else {
            vidoeCourse.videos[index] = videos
        }
        const newData = { videos: vidoeCourse.videos, draft: false }


        const updatedData = await Gig.findByIdAndUpdate(req.params.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        res.status(200).json({
            success: true,
            videoCourse: updatedData,
        })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});



exports.deleteSingleVideo = catchAsyncErrors(async (req, res, next) => {

    try {
        req.body.user = req.user.id;
        let vidoeCourse = await Gig.findById(req.params.id);
        if (!vidoeCourse) {
            return next(new ErrorHander("Video not found", 404));
        }

        if (vidoeCourse.user._id != req.user.id) {
            return next(new ErrorHander("You have no rights to to edit this Video", 404));
        }


        const public_id = req.query.public_id || ''

        const filteredVideos = vidoeCourse.videos.filter(item => item.public_id !== public_id)

        const newData = { videos: filteredVideos, draft: filteredVideos.length === 0 ? true : false }
        cloudinary.api.delete_resources(public_id,
            function (result) { console.log(result) }, { resource_type: "video" });


        const updatedData = await Gig.findByIdAndUpdate(req.params.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        res.status(200).json({
            success: true,
            videoCourse: updatedData,
        })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});

// single user Video
exports.getUserVideoCourse = catchAsyncErrors(async (req, res, next) => {

    const videoCourses = await Gig.find({ user: req.user.id });
    res.status(200).json({
        success: true,
        videoCourses
    })
})




//single videoDetail for admin
exports.videoDetail = catchAsyncErrors(async (req, res, next) => {
    const videoCourses = await Gig.findById(req.params.id)
    const userRequired = req.query.user;

    if (!videoCourses) {
        return next(new ErrorHander("Video Coure not found", 404));
    }
    if (vidoeCourse.user._id != req.user.id) {
        return next(new ErrorHander("You have no rights to see this course", 404));
    }

    if (!userRequired) {
        return res.status(200).json({
            success: true,
            data: {
                videoCourses
            }
        })
    }


    const user = await User.findById(videoCourses.user._id);
    if (!user) {
        return next(new ErrorHander("Gig's owner not found", 404));
    }

    res.status(200).json({
        success: true,
        data: {
            videoCourses, user
        }
    })

})


exports.searchVideos = catchAsyncErrors(async (req, res, next) => {

    let keywords = req.query.keywords;
    const arr = { $text: { $search: keywords } }
    let searchIt = { ...arr, draft: false }

    let videoCourses = await Gig.find(searchIt, { videos: 0 }).sort({ numOfReviews: -1, ratings: -1 })

    res.status(200).json({
        success: true,
        videoCourses: videoCourses,
    })

})


exports.singleVideoItemBeforeBuying = catchAsyncErrors(async (req, res, next) => {

    let videoCourse = await Gig.findById(req.params.id);
    if (!videoCourse) {
        return next(new ErrorHander("Video Course not found", 404));
    }

    delete videoCourse.videos;
    res.status(200).json({
        success: true,
        videoCourse: videoCourse,
    })

})


const YOUR_DOMAIN = 'http://localhost:3000'

exports.createSubscriptionVideo = catchAsyncErrors(async (req, res, next) => {

    let videoCourse = await Gig.findById(req.params.id);
    if (!videoCourse) {
        return next(new ErrorHander("Video Course not found", 404));
    }
    console.log("I am here")
    console.log(req.user)

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data:{
                currency:'usd',
                unit_amount:videoCourse.price * 100,
                product_data: {
                    name:videoCourse.title,
                    images:[videoCourse.images.url]
                }
            },
            quantity:1
          }
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });
    

      console.log(session.url)
     

    res.send({
        url:session.url
    })

})




















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
            console.log(title + " " + category + " " + searchTags);
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
            else if (gig?.images?.url) {
                newData = null
            }
            else {
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






exports.allGigs = catchAsyncErrors(async (req, res, next) => {

    let category = req.query.category;
    let subCategory = req.query.subCategory;
    let keywords = req.query.keywords;
    let searchIt = {}

    if (category) {
        searchIt = { category, draft: false }
    }
    else if (subCategory) {
        searchIt = { subCategory, draft: false }
    }
    else if (keywords) {
        const arr = { $text: { $search: keywords } }
        searchIt = { ...arr, draft: false }
    }
    else {
        searchIt = { draft: false }
    }
    let gig;
    if (!category && !subCategory && !keywords)
        gig = await Gig.find(searchIt).sort({ numOfReviews: -1, ratings: -1 }).limit(8)
    else
        gig = await Gig.find(searchIt)


    const userData = []
    for (let i = 0; i < gig.length; i++) {
        userData.push(await User.findById(gig[i].user._id).select(['avatar', 'name']))
    }

    res.status(200).json({
        success: true,
        data: {
            gig,
            userData
        }
    })
})


