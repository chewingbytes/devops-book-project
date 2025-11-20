import express from "express";
import cors from "cors";

import deleteRoutes from "./utils/williamUtils.js";
import userRoutes from "./utils/jonathanUtils.js";


const app = express();
app.use(cors());
app.use(express.json());


// Grouping routes by the 3 people
app.use("/api/users", userRoutes);
app.use("/:user/:title", deleteRoutes);

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
