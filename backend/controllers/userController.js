const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");



// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
   
    const { name, email, password } = req.body;
    
    if(name.includes(' ')){
        return next(new ErrorHander("Username should not contain white spaces", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
    });
  
    sendToken(user, 201, res);
  });


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      console.log("user not present")
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      console.log("password not matched")
      return next(new ErrorHander("Invalid email or password", 402));
    }
  
    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });



// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
});


exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log("hello1");
  console.log(req.body.oldPassword);
  console.log(req.body.newPassword );
  console.log(req.body.confirmPassword);
  const user = await User.findById(req.user.id).select("+password");
  console.log("hello02");
  console.log(user);
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword[0]);
    console.log("hello2");
    if (!isPasswordMatched) {
      return next(new ErrorHander("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword[0] !== req.body.confirmPassword[0]) {
      return next(new ErrorHander("password does not match", 400));
    }
    console.log("hello3");

    user.password = req.body.newPassword[0];
  
    await user.save();
  
    sendToken(user, 200, res);
});



// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      languages:req.body.languages,
      description:req.body.description,
    };
    
    console.log(newUserData);
    // if (req.body.avatar !== "") {
    //   const user = await User.findById(req.user.id);
      
    //   if(user.avatar?.public_id){
    //   const imageId = user.avatar.public_id;
  
    //   await cloudinary.v2.uploader.destroy(imageId);
    // }
    // console.log("Hello0");
    
    //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "freelance-learning-platform/users",
    //     width: 150,
    //     crop: "scale",
    //     resource_type: "image",
        
    //   });
    //   newUserData.avatar = {
    //     public_id: myCloud.public_id,
    //     url: myCloud.secure_url,
    //   };
    // }
    // console.log(req.file);
    // console.log(req.file);

    if(req.file){
      const user = await User.findById(req.user.id);
      
      if(user?.avatar?.public_id){
      const imageId = user.avatar.public_id;
  
      await cloudinary.v2.uploader.destroy(imageId);
    }
    const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "freelance-learning-platform/users",
          width: 500,
          crop: "scale",
          resource_type: "auto",
          
        });
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

    }


    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });