const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered."});
    } else {
        return res.status(404).json({message: "Username already taken."});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn;

  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  author = req.params.author;
  let filtered_books = Object.entries(books).filter(([,book]) => book.author === author);
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  title = req.params.title;
  let filtered_books = Object.entries(books).filter(([,book]) => book.title === title);
  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
