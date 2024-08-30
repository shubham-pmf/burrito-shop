import express, { Request, Response } from "express";
import { BurritoModel } from "../models/burrito";

const router = express.Router();

// Function to seed the database with default burritos
const seedBurritos = async () => {
  // Define default burritos
  const defaultBurritos = [
    { name: 'Veggie', size: 'regular', price: 3 },
    { name: 'Beef', size: 'regular', price: 4 },
    { name: 'Chicken', size: 'regular', price: 3.5 },
  ];

  // Check if any burritos already exist
  const existingBurritos = await BurritoModel.countDocuments();

  // If no burritos exist, add the default ones
  if (existingBurritos === 0) {
    await BurritoModel.insertMany(defaultBurritos);
  }
};

router.get("/", async (req: Request, res: Response) => {
  try {
    // Seed the database with default burritos if necessary
    await seedBurritos();

    // Retrieve all burritos
    const burritos = await BurritoModel.find();

    // Transform burritos to match expected structure for frontend
    const transformedBurritos = burritos.map(burrito => ({
      _id: burrito._id,
      name: burrito.name,
      price: burrito.price
    }));

    res.json(transformedBurritos);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/burrito - Create a new burrito
router.post('/', async (req, res) => {
  const { name, size, price } = req.body;

  // Validate required fields
  if (!name || !size || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newBurrito = new BurritoModel({ name, size, price });
    const savedBurrito = await newBurrito.save();

    res.json({ burritoId: savedBurrito._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
