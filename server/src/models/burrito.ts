import mongoose, { Document, Schema } from "mongoose";

// list of burritos available are driven through what the chef enters into the system
// hence database.burritos table drives the list that is shown to the customers

// database driven listing is used instead of a standard decorator pattern, since the availability
// can vary significantly and re-building the app doesn't make sense everytime an item is missing

// Burrito interface
export interface Burrito extends Document {
  name: string;
  size: string;
  price: number;
}

// create the Burrito schema
export const burritoSchema = new Schema<Burrito>({
  name: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

// build the model
export const BurritoModel = mongoose.model<Burrito>("Burrito", burritoSchema);
