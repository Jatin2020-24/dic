const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer');
const router = require("express").Router();
const date = require('date-and-time');

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello I am Jatin!!');
});

const now = new Date();
const value = date.format(now, 'DD-MM-YYYY--HH-mm-ss');
let fileExtension, uploadDate;

function bytesToSize(bytes, precision)
{  
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;
   
    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
 
    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';
 
    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';
 
    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';
 
    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';
 
    } else {
        return bytes + ' B';
    }
}

const fileStorage = multer.diskStorage({
    // Destination to store files  
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + value
            + path.extname(file.originalname))
        fileExtension = path.extname(file.originalname);
        uploadDate = value;
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

const fileUpload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 10000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|png|mp4|wmv|mkv|txt|doc|docx|xlsx|xls)$/)) {
            // upload only video, image, text format
            return cb(new Error('Please upload a Image, Video or Text File'))
        }
        cb(undefined, true)
    }
});

// For Single file upload
app.post('/uploadFile', fileUpload.single('file'), (req, res) => {
    // res.send(req.file.mimetype);
    res.send({
        "File Extension": fileExtension,
        "Upload Time": uploadDate,
        "File Size": bytesToSize(req.file.size, 2)
    });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.listen(process.env.PORT || 5000, () => {
    console.log(("Backend Server is running!!"));
});