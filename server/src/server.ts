import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from "body-parser";
import burritoRoutes from "../src/routes/burrito_routes";
import orderRoutes from "../src/routes/order_routes";
import condimentRoutes from "../src/routes/condiment_routes";

const app = express();
const port = 3001;


mongoose.connect("mongodb://mongodb:27017/burrito-shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}as ConnectOptions);
const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database Connected")
})



var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use("/api/burrito", burritoRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/condiments", condimentRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
