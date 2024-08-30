
import mongoose, { Document, Schema } from "mongoose";
import { Burrito, burritoSchema } from "./burrito";
import { Condiment, condimentSchema } from "./condiment";

export interface OrderItem {
  burrito: {
    details: Burrito;
    quantity: number;
  };
  condiments: Array<{
    details: Condiment;
    quantity: number;
  }>;
}

export interface Order extends Document {
  items: OrderItem[];
  totalCost?: number; // Optionally include total cost in the order
}

// Define a schema for the nested condiment in an order item
const condimentItemSchema = new Schema({
  details: { type: condimentSchema, required: true },
  quantity: { type: Number, required: true }
});

// Define a schema for an order item
const orderItemSchema = new Schema({
  burrito: {
    details: { type: burritoSchema, required: true },
    quantity: { type: Number, required: true }
  },
  condiments: [condimentItemSchema]
});

// Define the order schema
const orderSchema = new Schema({
  items: [orderItemSchema],
  totalCost: { type: Number }
});

export const OrderModel = mongoose.model<Order>("Order", orderSchema);
