import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/clients", clientRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
