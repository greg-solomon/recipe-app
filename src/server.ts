import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
require("dotenv").config();
import connectDB from "./models/connect";
import authRoutes from "./routes/auth";
import recipeRoutes from "./routes/recipe";
import userRoutes from "./routes/users";
import * as firebase from "firebase";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

firebase.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(authRoutes);
app.use(recipeRoutes);
app.use(userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (request: Request, response: Response) => {
    response.sendFile(
      path.resolve(__dirname, "../client", "build", "index.html")
    );
  });
}
app.listen(PORT, () => {
  connectDB();
  if (process.env.NODE_ENV === "production")
    console.log(`Server live at http://recipe--share.herokuapp.com`);
  else console.log(`Server running at http://localhost:${PORT}`);
});
