
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();

const users = [];

// Check whether a username is already registered
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check username and password
const authenticatedUser = (username, password) => {
    return users.some(user =>
        user.username === username && user.password === password
    );
};

// Login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: 'Invalid Login. Check username and password'
        });
    }

    const accessToken = jwt.sign(
        { username },
        'access',
        { expiresIn: '1h' }
    );

    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({
        message: 'User successfully logged in',
        accessToken
    });
});

// Add or update a review for a book
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const { review } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Book not found.'
        });
    }

    if (typeof review !== 'string' || !review.trim()) {
        return res.status(400).json({
            message: 'A review is required.'
        });
    }

    books[isbn].reviews[username] = review.trim();

    return res.status(200).json({
        message: 'Review added or updated successfully.',
        reviews: books[isbn].reviews
    });
});


regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: 'You have no review for this book.' });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: 'Review deleted successfully.',
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
