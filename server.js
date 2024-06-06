const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const prefixData = require('./prefixData');

const app = express();
const port = process.env.PORT || 3000; // Use port 80 or any other available port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const getFirmwareInfo = (productModel) => {
    const series5Models = ['LS425', 'LS445', 'MD435', 'SP2', 'S-PLAY-2000-C', 'S-STBP-HD2', 'CV-HD3', 'CV-UHD3', 'XD235', 'XT1145', 'XT2145', 'XT245'];
    if (series5Models.includes(productModel)) {
        return {
            version: 'OS 9.0.145.1',
            link: 'https://brightsignbiz.s3.amazonaws.com/firmware/xc5/9.0/9.0.145.1/brightsign-xc5-update-9.0.145.1.zip'
        };
    } else {
        return {
            version: 'OS 8.5.47',
            link: 'https://brightsignbiz.s3.amazonaws.com/firmware/4k/8.5/8.5.47/brightsign-4k-update-8.5.47.zip'
        };
    }
};

app.post('/getFirmware', (req, res) => {
    const { serialNumber } = req.body;

    if (serialNumber) {
        const prefix = serialNumber.slice(0, 2).toUpperCase();  // Assuming the prefix is the first 2 characters
        const productModel = prefixData[prefix] || 'Unknown product model';
        const firmwareInfo = getFirmwareInfo(productModel);
        return res.json({ productModel, firmwareVersion: firmwareInfo.version, firmwareLink: firmwareInfo.link });
    }
    return res.status(400).json({ error: 'Invalid serial number' });
});

app.listen(port, '0.0.0.0', () => { // Listen on all IP addresses
    console.log(`Server running at http://localhost:${port}/`);
});
