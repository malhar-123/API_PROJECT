import { Schema, model } from "mongoose";

//create publication schema
const PublicationSchema = Schema(
 {
   id: Number,
   name: String,
   books: [String]
 }
);

export const PublicationModel = model("publications",PublicationSchema);

