import express, { Request, Response } from "express";
import { OrderModel } from "../models/order";
import { BurritoModel } from "../models/burrito";
import { CondimentModel } from "../models/condiment";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    const orderItems = await Promise.all(orderData.items.map(async (item) => {
      const burrito = await BurritoModel.findById(item.burrito._id);
      if (!burrito) {
        throw new Error(`Burrito not found: ID ${item.burrito._id}`);
      }

      const itemCondiments = await Promise.all(item.condiments.map(async (condiment) => {
        const condimentData = await CondimentModel.findById(condiment._id);
        if (!condimentData) {
          throw new Error(`Condiment not found: ID ${condiment._id}`);
        }
        return {
          details: condimentData,
          quantity: condiment.quantity || 1 // Default quantity to 1 if not provided
        };
      }));

      return {
        burrito: {
          details: burrito,
          quantity: item.quantity
        },
        condiments: itemCondiments
      };
    }));

    const totalCost = orderItems.reduce((sum, item) => {
      const burritoCost = (item.burrito.details.price || 0) * item.burrito.quantity;
      const condimentsCost = item.condiments.reduce((condimentSum, condiment) => {
        return condimentSum + ((condiment.details.price || 0) * condiment.quantity);
      }, 0);
      return sum + burritoCost + condimentsCost;
    }, 0);

    if (isNaN(totalCost)) {
      throw new Error('Invalid total cost calculation.');
    }

    const order = await OrderModel.create({ items: orderItems, totalCost: totalCost });
    res.status(200).json({ order, totalCost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

