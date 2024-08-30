
import express, { Request, Response } from "express";
import { CondimentModel } from "../models/condiment";

const router = express.Router();

// Function to seed the database with default condiments
const seedCondiments = async () => {
  // Define default condiments
  const defaultCondiments = [
    { name: 'Guacamole', price: 0.5 },
    { name: 'Olives', price: 0.3 },
    { name: 'Black Beans', price: 0.25 },
    { name: 'Cilantro', price: 0.2 },
    { name: 'Lettuce', price: 0.15 },
  ];

  // Check if any condiments already exist
  const existingCondiments = await CondimentModel.countDocuments();
  
  // If no condiments exist, add the default ones
  if (existingCondiments === 0) {
    await CondimentModel.insertMany(defaultCondiments);
  }
};

router.get("/", async (req: Request, res: Response) => {
  try {
    // Seed the database with default condiments if necessary
    await seedCondiments();

    // Retrieve all condiments
    const condiments = await CondimentModel.find();

    // Transform condiments to match expected structure for frontend
    const transformedCondiments = condiments.map(condiment => ({
      _id: condiment._id,
      name: condiment.name,
      price: condiment.price
    }));

    res.json(transformedCondiments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/condiments - Create a new condiment
router.post('/', async (req, res) => {
  const { name, price } = req.body;

  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newCondiment = new CondimentModel({ name, price });
    const savedCondiment = await newCondiment.save();

    res.json({ condimentId: savedCondiment._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
