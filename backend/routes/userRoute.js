const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const upload = require("../middleware/multer");


const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);


router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser,upload.single('myFile') , updateProfile);


module.exports = router;
