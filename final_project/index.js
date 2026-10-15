
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Internal endpoint used by Axios to retrieve the local book database
app.get('/api/books', (req, res) => {
    const books = require('./router/booksdb.js');
    return res.status(200).json(books);
});

// Session middleware for customer routes
app.use(
    '/customer',
    session({
        secret: 'fingerprint_customer',
        resave: true,
        saveUninitialized: true
    })
);

// Protect authenticated customer endpoints
app.use('/customer/auth/*', (req, res, next) => {
    const authorization = req.session.authorization;

    if (!authorization || !authorization.accessToken) {
        return res.status(403).json({
            message: 'User not logged in'
        });
    }

    jwt.verify(authorization.accessToken, 'access', (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'User not authenticated'
            });
        }

        req.user = user;
        next();
    });
});

const PORT = 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
