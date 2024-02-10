const express = require('express');
const fs = require('fs');
const app = express();
const path =require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    // Serve the homepage
    res.sendFile(__dirname + '/index.html');
});

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}

app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public', imageName);
    
    // Check if the image file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Image not found');
        }
        
        // Set appropriate Content-Type header based on image type
        const contentType = getContentType(imagePath);
        res.setHeader('Content-Type', contentType);

        // Stream the image file to the response
        fs.createReadStream(imagePath).pipe(res);
    });
});




app.get('/products', (req, res) => {
    // Serve the products page
    res.sendFile(__dirname + '/products.html');
});

app.get('/static/', (req, res) => {
    // Get the file name from the query string parameter
    const fileName = req.query.page;

    if (!fileName) {
        return res.status(400).send('File name not provided');
    }

    // Read the file and send its content
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.setHeader('Content-Type', 'text/css');

        res.send(data);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
