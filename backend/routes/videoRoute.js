const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    createVideo,
    editVideoCourse,
    editSingleVideo,
    editGig,
    getUserVideoCourse,
    videoDetail,
    deleteVideoFromServerOnUpdate,
    deleteSingleVideo,
    searchVideos,
    singleVideoItemBeforeBuying,
    createSubscriptionVideo,
    allGigs,
}  = require('../controllers/VideoController')
const router = express.Router();

const upload = require("../middleware/multer");

router
    .route('/video/new')
    .post(isAuthenticatedUser,upload.single('courseImage'),createVideo);

router
    .route('/video/:id')
    .put(isAuthenticatedUser,upload.single('courseImage'),editVideoCourse)
    
router
    .route('/videoItem/:id')
    .put(isAuthenticatedUser,editSingleVideo)

router
    .route('/videoItem/:id')
    .delete(isAuthenticatedUser,deleteSingleVideo)

router
    .route('/videoDeleteFromServer')
    .post(isAuthenticatedUser,deleteVideoFromServerOnUpdate)
    
router
    .route('/searchVideosByKeywords')
    .get(searchVideos)
    
router
    .route('/video/me')
    .get(isAuthenticatedUser,getUserVideoCourse)

router
    .route('/videoDetail/:id')
    .get(isAuthenticatedUser,videoDetail)

router
    .route('/singleVideoItemBeforeBuying/:id')
    .get(singleVideoItemBeforeBuying)

router
    .route('/create-subscription-video/:id')
    .post(isAuthenticatedUser,createSubscriptionVideo)









router
    .route('/gig/:id')
    .put(isAuthenticatedUser,editGig)
    

router
    .route('/allGigs')
    .get(allGigs)

module.exports = router;
