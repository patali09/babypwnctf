const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser'); // Add this line

const app = express();
const port = 3002;

secretKey = "123"
// Use cookie parser middleware
app.use(cookieParser());
// Sample users (in a real application, these would be stored securely in a database)
const users = [
    { id: 1, username: 'admin', password: '68461UYGjhtyf$@!g654138', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Middleware to verify JWT token
function authenticateUserToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login'); // Redirect to login if no token
    try {
        const decoded = jwt.verify(token, secretKey);
        if (decoded.role === "user") {
            req.user = decoded;
            next();
        } else { res.redirect("/login") }
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.redirect('/login'); // Redirect to login if token verification fails
    }
}

function authenticateAdminToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login'); // Redirect to login if no token
    try {
        const decoded = jwt.verify(token, secretKey);
        if (decoded.role === "admin") {
            req.user = decoded;
            next();
        }
        else { res.redirect("/login"); }
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.redirect('/login'); // Redirect to login if token verification fails
    }
}


// Serve login page
// Redirect root path to the login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Login route (generate JWT token)
app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).send('Invalid username or password');
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey);
    res.cookie('token', token); // Set token as a cookie
    if (user.role === 'admin') {
         res.redirect(`http://${req.hostname}:${port}/admin`)
    } else {
        res.redirect(`http://${req.hostname}:${port}/portfolio`);
    }
});

// Portfolio route (protected, requires JWT token)
app.get('/portfolio', authenticateUserToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'portfolio.html'));
});

// Admin route (protected, requires JWT token)
app.get('/admin', authenticateAdminToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
