require("dotenv").config();

import express from "express";
import { connect } from "mongoose";
import { urlencoded, json } from "body-parser";
//Databse
import { books as _books, author as _author, publication as _publication } from "./database/database";

//Import models
import { find, findOne, create, findOneAndUpdate, findOneAndDelete } from "./database/book";
import { find as _find, create as _create, findOneAndUpdate as _findOneAndUpdate } from "./database/author";
import { find as __find } from "./database/publication";

//INITIALISE express
const booky = express();
booky.use(urlencoded({extended:true}));
booky.use(json());

connect(process.env.MONGO_URL,
 {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=> console.log("Connection Established"));

/*
Route               ROOT(/)
Description        Get all the books
Access             PUBLIC
Parameter          None
Methods            Get
*/
booky.get("/", async (req,res)=> {
const getAllBooks = await find();
  return res.json(getAllBooks);
});

/*
Route              /is
Description        Get specific book on isbn
Access             PUBLIC
Parameter          isbn
Methods            Get
*/
booky.get("/is/:isbn", async (req,res)=>{

  const getSpecificBook = await findOne({ISBN: req.params.isbn });

//null !0=1 & !1=0
  if(!getSpecificBook){
    return res.json({error:`No Book Found for the ISBN of ${req.params.isbn}`});
  }
  return res.json({book:getSpecificBook});
});

/*
Route              /c
Description        Get specific book on category
Access             PUBLIC
Parameter          category
Methods            Get
*/
booky.get("/c/:category", async (req,res)=>{
  const getSpecificBook= await findOne({category:req.params.category});

  if(!getSpecificBook){
    return res.json({error:`No book found for the category ${req.params.category}`});
  }
  return res.json({book:getSpecificBook});
});

/*
Route              /l/language
Description        Get specific book based on languages
Access             PUBLIC
Parameter          languages
Methods            Get
*/
booky.get("/l/:language",(req,res) =>{
  const getSpecificBook=_books.filter(
    (book) => book.language.includes(req.params.language)
  )
  if(getSpecificBook.length===0){
    return res.json({error:`No book found for the language ${req.params.language}`});
  }
  return res.json({book:getSpecificBook});
});
/*
Route              /author
Description        Get all authors
Access             PUBLIC
Parameter          None
Methods            Get
*/
booky.get("/author", async (req,res)=>{
  const getAllAuthors = await _find();
  return res.json(getAllAuthors);
});
/*
Route            /author
Description      Get all authors based on id
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/author/:id",(req,res) =>{
  const getSpecificAuthor=_author.filter(
    (author) => author.id === parseInt(req.params.id)
  );
  if(getSpecificAuthor.length === 0){
    return res.json({error:`No author found for the id of ${req.params.id}`});
    }
  return res.json({author:getSpecificAuthor});
});

/*
Route            /author/book
Description      Get all authors based on books isbn
Access           PUBLIC
Parameter        isbn
Methods          GET
*/

booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = _author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});

/*
Route              /publications
Description        Get all publication
Access             PUBLIC
Parameter          none
Methods            Get
*/
booky.get("/publications", async (req,res)=>{
  const getAllPublications = await __find();
  return res.json(getAllPublications);
});

/*
Route              /publications
Description        Get all publication based on name
Access             PUBLIC
Parameter          name
Methods            Get
*/
booky.get("/publications/:name",(req,res)=>{
  const getSpecificPublication = _publication.filter(
    (publication) =>publication.name === (req.params.name)
  );
  if(getSpecificPublication.length === 0){
    return res.json({error:`No book found for the publication of ${req.params.name}`});
  }
  return res.json({publication:getSpecificPublication});
});
/*
Route            /PUBLICATIONS/book
Description      Get all publication based on books
Access           PUBLIC
Parameter        BOOKS
Methods          GET
*/
booky.get("/publications/book/:isbn",(req,res) =>{
  const getSpecificPublication=_publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );
  if (getSpecificPublication.length===0) {
    return res.json({error:`No publication found for the book of ${req.params.isbn}`
    });
  }
  return res.json({publication:getSpecificPublication});
});

//post
/*
Route            /book/new
Description     add new books
Access           PUBLIC
Parameter        none
Methods          post
*/
booky.post("/book/new", async (req,res) =>{
const { newBook }=req.body;
const addNewBook = create(newBook);
return res.json({
  books:addNewBook,
  message:"book was added!!"
});
});

/*
Route            /author/new
Description     add new auhtor
Access           PUBLIC
Parameter        none
Methods          post
*/
booky.post("/author/new", async(req,res) =>{
 const { newAuthor }=req.body;
 const addNewAuthor=_create(newAuthor);
 return res.json(
   {
     author:addNewAuthor,
     message:"Author was Added!!"
   });
});

/*
Route            /publication/new
Description     add new publication
Access           PUBLIC
Parameter        none
Methods          post
*/

booky.post("/publications/new", (req,res) =>{
 const newPublication=req.body;
 _publication.push(newPublication);
  return res.json({updatedPublication: _publication});
});

/******************put******/
/*
Route            /book/update
Description      Update /add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/update/:isbn",async(req,res) =>{
const updatedBook= await findOneAndUpdate(
  {
    ISBN:req.params.isbn
  },
  {
    title:req.body.bookTitle
  },
  {
    new:true
  }
);
return res.json({
  books:updatedBook
});
});


/***********updating new author******/
/*
Route            /publication/update/book
Description      Update /add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/book/author/update/:isbn",async(req,res)=>{
  const updatedBook=await findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet:{
        authors:req.body.newAuthor
      }
      },
      {
        new:true
      }     );
     const updatedAuthor =await _findOneAndUpdate(
       {
         id:req.body.newAuthor
       },
       {
         $addToSet:{
           books:req.params.isbn
         }
         },
         {
           new:true
         }
       );
       return res.json(
         {
           books:updatedBook,
           authors:updatedAuthor,
           message:"New Books and Authors are Added"
         }
       );
});




/*
Route            /publication/update/book
Description      Update /add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  _publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  _books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: _books,
      publications: _publication,
      message: "Successfully updated publications"
    }
  );
});



/****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await findOneAndDelete(
    {
      ISBN:req.params.isbn
    }
  );
    return res.json({
      books: updatedBookDatabase
    });
});

/*
Route            /book/delete/author
Description      Delete a auhtor from a book and vice versa
Access           PUBLIC
Parameter        isbn and authorId
Methods          DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
  //update the book db
  _books.forEach((book)=>{
    if(book.ISBN ===req.params.isbn)    {
      const newAuthorList=book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author=newAuthorList;
      return;
    }
  });

//update  the author db
  _author.forEach((eachAuthor)=>{
  if(eachAuthor.id==parseInt(req.params.authorId)){
    const newBookList =eachAuthor.books.filter(
      (book)=> book !== req.params.isbn
    );
    eachAuthor.books= newBookList;
    return;
  }
});
return res.json({
  book:_books,
  author:_author,
  message:  "author was delete"
});
});

booky.listen(3000,() =>{
console.log("Server is up and running");
});