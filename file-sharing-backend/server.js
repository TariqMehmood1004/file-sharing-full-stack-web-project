const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.urlencoded({ extended: true }));

const app = express();
const port = 5000;

app.use(cors({
    origin: '*',
}));

app.use(express.static('public'));

app.use(bodyParser.json());

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

app.post('/webhook', (req, res) => {
    const event = req.body;

    // Log the received event
    console.log('Received event:', event);

    // Switch statement to handle different event types
    switch (event.type) {
        case 'order_created':
            console.log('Order created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order created',
                data: event.data
            });
            break;

        case 'order_updated':
            console.log('Order updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order updated',
                data: event.data
            });
            break;

        case 'order_deleted':
            console.log('Order deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order deleted',
                data: event.data
            });
            break;

        case 'order_status_updated':
            console.log('Order status updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order status updated',
                data: event.data
            });
            break;

        case 'order_refunded':
            console.log('Order refunded:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order refunded',
                data: event.data
            });
            break;

        case 'order_canceled':
            console.log('Order canceled:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order canceled',
                data: event.data
            });
            break;

        case 'order_customer_updated':
            console.log('Order customer updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order customer updated',
                data: event.data
            });
            break;

        case 'order_products_updated':
            console.log('Order products updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order products updated',
                data: event.data
            });
            break;

        case 'order_payment_updated':
            console.log('Order payment updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order payment updated',
                data: event.data
            });
            break;

        case 'order_coupon_updated':
            console.log('Order coupon updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order coupon updated',
                data: event.data
            });
            break;

        case 'order_total_price_updated':
            console.log('Order total price updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order total price updated',
                data: event.data
            });
            break;

        case 'order_shipment_creating':
            console.log('Order shipment creating:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipment creating',
                data: event.data
            });
            break;

        case 'order_shipment_created':
            console.log('Order shipment created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipment created',
                data: event.data
            });
            break;

        case 'order_shipment_canceled':
            console.log('Order shipment canceled:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipment canceled',
                data: event.data
            });
            break;

        case 'order_shipment_return_creating':
            console.log('Order shipment return creating:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipment return creating',
                data: event.data
            });
            break;

        case 'order_shipment_return_created':
            console.log('Order shipment return created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipment return created',
                data: event.data
            });
            break;

        case 'order_shipment_return_canceled':
            console.log('Order shipment return canceled:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipment return canceled',
                data: event.data
            });
            break;

        case 'order_shipping_address_updated':
            console.log('Order shipping address updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Order shipping address updated',
                data: event.data
            });
            break;

        case 'product_created':
            console.log('Product created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Product created',
                data: event.data
            });
            break;

        case 'product_updated':
            console.log('Product updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Product updated',
                data: event.data
            });
            break;

        case 'product_deleted':
            console.log('Product deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Product deleted',
                data: event.data
            });
            break;

        case 'product_available':
            console.log('Product available:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Product available',
                data: event.data
            });
            break;

        case 'product_quantity_low':
            console.log('Product quantity low:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Product quantity low',
                data: event.data
            });
            break;

        case 'product_channels_changed':
            console.log('Product channels changed:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Product channels changed',
                data: event.data
            });
            break;

        case 'customer_login':
            console.log('Customer login:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Customer login',
                data: event.data
            });
            break;

        case 'customer_created':
            console.log('Customer created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Customer created',
                data: event.data
            });
            break;

        case 'customer_updated':
            console.log('Customer updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Customer updated',
                data: event.data
            });
            break;

        case 'customer_otp_request':
            console.log('Customer OTP request:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Customer OTP request',
                data: event.data
            });
            break;

        case 'category_created':
            console.log('Category created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Category created',
                data: event.data
            });
            break;

        case 'category_updated':
            console.log('Category updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Category updated',
                data: event.data
            });
            break;

        case 'brand_created':
            console.log('Brand created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Brand created',
                data: event.data
            });
            break;

        case 'brand_updated':
            console.log('Brand updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Brand updated',
                data: event.data
            });
            break;

        case 'brand_deleted':
            console.log('Brand deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Brand deleted',
                data: event.data
            });
            break;

        case 'store_branch_created':
            console.log('Store branch created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store branch created',
                data: event.data
            });
            break;

        case 'store_branch_updated':
            console.log('Store branch updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store branch updated',
                data: event.data
            });
            break;

        case 'store_branch_setdefault':
            console.log('Store branch set as default:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store branch set as default',
                data: event.data
            });
            break;

        case 'store_branch_activated':
            console.log('Store branch activated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store branch activated',
                data: event.data
            });
            break;

        case 'store_branch_deleted':
            console.log('Store branch deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store branch deleted',
                data: event.data
            });
            break;

        case 'store_tax_created':
            console.log('Store tax created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store tax created',
                data: event.data
            });
            break;

        case 'store_tax_updated':
            console.log('Store tax updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store tax updated',
                data: event.data
            });
            break;

        case 'store_tax_deleted':
            console.log('Store tax deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store tax deleted',
                data: event.data
            });
            break;

        case 'store_currency_created':
            console.log('Store currency created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store currency created',
                data: event.data
            });
            break;

        case 'store_currency_updated':
            console.log('Store currency updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store currency updated',
                data: event.data
            });
            break;

        case 'store_currency_deleted':
            console.log('Store currency deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store currency deleted',
                data: event.data
            });
            break;

        case 'store_attribute_created':
            console.log('Store attribute created:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store attribute created',
                data: event.data
            });
            break;

        case 'store_attribute_updated':
            console.log('Store attribute updated:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store attribute updated',
                data: event.data
            });
            break;

        case 'store_attribute_deleted':
            console.log('Store attribute deleted:', event.data);
            res.status(200).send({
                status: 'success',
                message: 'Store attribute deleted',
                data: event.data
            });
            break;

        default:
            console.log('Unhandled event type:', event.type);
            res.status(400).send({
                status: 'error',
                message: 'Unhandled event type',
                eventType: event.type
            });
            break;
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
