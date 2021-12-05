const books = [{
    ISBN: "12345Book",
    title: "Getting started with MEN",
    pubDate: "2021-11-25",
    language: "en",
    numPage: 250,
    author:[1,2],
    publication: [1],
    category: ["tech","programming","education"]
}];

const author = [
 {
  id: 1,
  name: "Aradhna",
  books: ["12345Book"]
 },
 {
     id: 2,
     name: "Elon Musk",
     books: ["12345Book"]
 }
];

const publication = [   
    {
        id: 1,
        name: "Writex",
        books: ["12345Book"]
    }
];

module.exports = {books, author, publication};