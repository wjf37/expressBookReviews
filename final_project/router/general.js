const express = require('express');
const axios = require('axios').default;
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
public_users.get('/',async (req, res) => {
    //Write your code here
    try {
        const booksOut = await Promise.resolve(books);
        console.log("Promise fulfilled");
        res.send(JSON.stringify(booksOut, null, 4));
    } catch (error) {
        console.log("Promise rejected");
        res.status(500).json({message: "Error fetching books."});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
    try {
        isbn = req.params.isbn;
        const booksOut = await Promise.resolve(books);
        console.log("Promise fulfilled");
        res.send(booksOut[isbn]);
    } catch (error) {
        console.log("Promise rejected");
        res.status(300).json({message: `Error fetching book with ISBN ${isbn}`});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  //Write your code here
    try {
        author = req.params.author;
        const booksOut = await Promise.resolve(books);
        let filtered_books = Object.entries(booksOut).filter(([,book]) => book.author === author);
        console.log("Promise fulfilled");
        res.send(filtered_books);
    } catch (error) {
        console.log("Promise rejected");
        res.status(300).json({message: `Error fetching books from author ${author}`});
}
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
    try {
        title = req.params.title;
        const booksOut = await Promise.resolve(books);
        let filtered_books = Object.entries(booksOut).filter(([,book]) => book.title === title);
        console.log("Promise fulfilled");
        res.send(filtered_books);
    } catch (error) {
        console.log("Promise rejected");
        res.status(300).json({message: `Error fetching books with title ${title}`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
