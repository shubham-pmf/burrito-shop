import mongoose, { Document, Schema } from "mongoose";

// list of condiments available are driven through what the chef enters into the system
// hence database.condiments table drives the list that is shown to the customers

// Condiments interface
export interface Condiment extends Document {
  name: string;
  price: number;
}

// create the condiments schema
export const condimentSchema = new Schema<Condiment>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

// build the model
export const CondimentModel = mongoose.model<Condiment>("Condiment", condimentSchema);
