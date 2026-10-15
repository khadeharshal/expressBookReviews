
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'User already exists!'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Task 1 and Task 10: Get all books using Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books',
            error: error.message
        });
    }
});

// Task 2 and Task 11: Get a book by ID using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found.'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving book',
            error: error.message
        });
    }
});

// Task 3 and Task 12: Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        const author = req.params.author.toLowerCase();

        const result = Object.values(response.data).filter(book =>
            book.author.toLowerCase().includes(author)
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books by author',
            error: error.message
        });
    }
});

// Task 4 and Task 13: Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        const title = req.params.title.toLowerCase();

        const result = Object.values(response.data).filter(book =>
            book.title.toLowerCase().includes(title)
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books by title',
            error: error.message
        });
    }
});

// Task 5: Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: 'Book not found.'
        });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
