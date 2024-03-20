const multer=require("multer");
const path = require("path");
const fs = require('fs');


//multer Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, require('path').resolve(__dirname, '..') + "/backend/upload");
    },
    filename: function (req, file, cb) {
        if(file.fieldname === "carImage"){
            console.log(file.fieldname)
            cb(null,req.params.brand +req.params.model+ '-' + file.fieldname + '.png');
        }
    }
})


const upload = multer({ storage: storage });

//middleware for product images uploading to multer
const carImageUpload = upload.fields([
    { name: 'carImage', maxCount: 1 }, 
    
])

module.exports = {
    carImageUpload
};