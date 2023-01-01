const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    createGig,
    editGig,
    getUserGigs,
    gigDetail,
    allGigs}  = require('../controllers/gigController')
const router = express.Router();

const upload = require("../middleware/multer");

router
    .route('/gig/new')
    .post(isAuthenticatedUser,createGig);

router
    .route('/gig/:id')
    .put(isAuthenticatedUser,upload.single('gigImages'),editGig)
    

router
    .route('/gig/me')
    .get(isAuthenticatedUser,getUserGigs)

router
    .route('/gigDetail/:id')
    .get(gigDetail)

router
    .route('/allGigs')
    .get(allGigs)

module.exports = router;
