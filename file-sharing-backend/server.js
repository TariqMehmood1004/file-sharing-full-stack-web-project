const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('public'));

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Destination folder
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueId}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        cb(null, true); // Accept all files
    }
});

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or file too large.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const fileKey = path.basename(req.file.filename, fileExtension);

    // Calculate expiry time (for example, 1 hour from now)
    const expiryTime = new Date(Date.now() + 3600 * 1000).toISOString(); // Adjust as needed

    res.json({
        fileUrl,
        key: fileKey,
        extension: fileExtension,
        expiryTime // Include expiry time in the response
    });
});

app.get('/file-metadata/:key', (req, res) => {
    const fileKey = req.params.key;
    const uploadsDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read uploads directory' });
        }

        const matchingFile = files.find(file => file.startsWith(fileKey));

        if (matchingFile) {
            const fileExtension = path.extname(matchingFile);
            res.json({ extension: fileExtension });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    });
});

// Endpoint to download files
app.get('/download/:key', (req, res) => {
    const fileKey = req.params.key;
    const uploadsDir = path.join(__dirname, 'uploads');

    // Get a list of files in the 'uploads' directory
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read uploads directory' });
        }

        // Find a file with the matching key
        const matchingFile = files.find(file => file.startsWith(fileKey));

        if (matchingFile) {
            const filePath = path.join(uploadsDir, matchingFile);
            const fileExtension = path.extname(matchingFile).toLowerCase();
            const contentType = getContentType(fileExtension);

            res.setHeader('Content-Type', contentType);
            res.download(filePath, (err) => {
                if (err) {
                    res.status(404).json({ error: 'File not found' });
                }
            });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    });
});

// Utility function to get content type based on file extension
const getContentType = (extension) => {
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.pdf':
            return 'application/pdf';
        case '.txt':
            return 'text/plain';
        case '.doc':
            return 'application/msword';
        case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.xls':
            return 'application/vnd.ms-excel';
        case '.xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case '.ppt':
            return 'application/vnd.ms-powerpoint';
        case '.zip':
            return 'application/zip';
        case '.rar':
            return 'application/x-rar-compressed';
        case '.7z':
            return 'application/x-7z-compressed';
        default:
            return 'application/octet-stream';
    }
};

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
