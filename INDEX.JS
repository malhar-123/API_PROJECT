const express = require("express");

const database = require("./database");

const booky = express();

booky.get("/",(req,res) => {
    return res.json({books: database.books});
});
 booky.get("/:isbn", (req,res) =>{
 const getSpecificBook = database.books.filter(
     (book) => book.ISBN === req.params.isbn
 );

 if(getSpecificBook.length === 0){
     return res.json({
         error: `No book with for ISBN of ${req.params.isbn}`
     });
 }

 return res.json({book: getSpecificBook});

});

booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter((book) =>
    book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0){
        return res.json({
            error: `No book with for category of ${req.params.category}`
        });
    }
   
    return res.json({book: getSpecificBook});
   
});

booky.listen(3000,() => console.log("Server is up and running!!!"));