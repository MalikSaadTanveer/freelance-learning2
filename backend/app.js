const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path')
// const fileUpload = require("express-fileupload");
// const multer = require('multer')
const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
// app.use(fileUpload());
// app.use(multer)
// Route Imports
const user = require("./routes/userRoute");
const gig = require("./routes/gigRoute");
const order = require("./routes/orderRoute");
const video = require("./routes/videoRoute");
app.use("/api/v1", user);
app.use("/api/v1", gig);
app.use("/api/v1", order);
app.use("/api/v1", video);


app.use(express.static(path.join(__dirname,'../frontend/build')))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});



// Middleware for Errors
app.use(errorMiddleware);
module.exports = app;
