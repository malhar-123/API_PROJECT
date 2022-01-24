import { Schema, model } from "mongoose";

//create book schema
 const BookSchema = Schema(
   {
     ISBN: String,
     title: String,
     pubDate: String,
     language: String,
     numPage: Number,
     author: [Number],
     publications: [Number],
     category: [String]
   }
 );

export const BookModel = model("books",BookSchema);
