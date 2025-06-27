const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "user1", "password":"pwd1"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filtered_usernames = users.filter((user) => user.username === username);
    if (filtered_usernames.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message: "Username or password not entered properly"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid login. Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review;
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!books[isbn]){
        return res.status(300).json({message: `No book with ISBN ${isbn} found.`});
    } else {
        books[isbn].reviews[username] = review;
        return res.status(200).json({message: `Review for book ${books[isbn].title} from user ${username} added successfully: ${review}`});
    }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!books[isbn].reviews[username]){
        return res.status(300).json({message: `Review for book ${books[isbn].title} from user ${username} not found.`});
    } else {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: `Review for book ${books[isbn].title} from user ${username} successfully deleted.`});
}
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
