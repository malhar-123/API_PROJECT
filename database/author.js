import { Schema, model } from "mongoose";

//create author schema
const AuthorSchema = Schema(
 {
   id: Number,
   name: String,
   books: [String]
 }
);

export const AuthorModel = model("authors",AuthorSchema);


