import express, { Request, Response } from "express";

import upload from "../lib/multer";
import { unlinkSync } from "fs";
import { uploads } from "../lib/cloudinary";
import Recipe from "../models/Recipe";
import axios from "axios";
import storeRecipes from "../lib/storeRecipes";
import insertResizeParameters from "../lib/insertResizeParameters";
import { verifySession } from "./auth";
import User from "../models/User";

export interface CloudinaryUpload {
  url: string;
  id: string;
}

const router = express.Router();

// @route GET /api/all
// @desc  Gets all recipes for news feed
router.get(`/api/all/:page`, async (request: Request, response: Response) => {
  const { page } = request.params;
  let p = +page;
  let pageSize = 20;
  if (p < 1) {
    return response.json({ msg: "Error" });
  }

  const query = {
    skip: pageSize * (p - 1),
    limit: pageSize,
  };

  try {
    const data = await Recipe.find({}, {}, query, (err, data) => {
      if (err) {
        return response.json({ error: "error" });
      } else {
        return data;
      }
    }).sort({ date: -1 });

    return response.json(data);
  } catch (error) {
    console.error(error.message);
    return response.status(404).json({ message: error.message });
  }
});

router.post(
  "/add-recipe",
  upload.single("image"),
  async (request: Request, response: Response) => {
    const uploader = async (path: any): Promise<CloudinaryUpload> =>
      await uploads(path, "Images");
    try {
      const { file, body } = request;

      const { path } = file;

      const newPath: CloudinaryUpload = await uploader(path);

      const finalPath = insertResizeParameters(newPath.url);
      const {
        label,
        healthLabels,
        dietLabels,
        cautions,
        ingredients,
        source,
        directions,
      } = body;

      const hl = JSON.parse(healthLabels);
      const d = JSON.parse(directions);
      const dl = JSON.parse(dietLabels);
      const c = JSON.parse(cautions);
      const i = JSON.parse(ingredients);
      const s = JSON.parse(source);

      console.log(s);
      const newRecipe = new Recipe({
        label: label,
        healthLabels: hl,
        dietLabels: dl,
        cautions: c,
        ingredients: i,
        image: finalPath,
        user_uploaded: true,
        directions: d,
        source: s,
        date: Date.now(),
      });

      await newRecipe.save();
      unlinkSync(path);
      return response.json(newPath);
    } catch (err) {
      console.error(err.message);
      return response.json({ err: err.message });
    }
  }
);

// @ROUTE POST /api/delete-recipe
// @desc Deletes recipe
router.post(
  "/api/delete-recipe",
  async (request: Request, response: Response) => {
    try {
      const { idToken, recipeId } = request.body;

      const verified = await verifySession(idToken);
      console.log(`Deleting recipe....`);
      console.log(`Verified ? `, verified);
      if (verified) {
        const recipe = await Recipe.findOneAndDelete({ _id: recipeId });
        console.log(recipe);
        if (recipe) {
          console.log(recipe);
          return response.json({ message: "Successfully deleted" });
        }
      } else {
        return response.status(401).json({ message: "Not authorized" });
      }
    } catch (error) {
      console.error(error.message);
      return response.status(401).json({ message: error.message });
    }
  }
);

router.post("/api/like/:id", async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { session, uid } = request.body;
    const recipe = await Recipe.findById(id);
    const user = await User.findOne({ uid: uid });
    if (recipe && user && verifySession(session)) {
      let currUser: any = user;
      if (currUser.likes.includes(recipe.id)) {
        await recipe.updateOne({
          $pull: { likes: uid },
        });
        await user.updateOne({
          $pull: { likes: recipe.id },
        });
        return;
      } else {
        await recipe.updateOne({
          $push: { likes: uid },
        });

        await user.updateOne({
          $push: { likes: id },
        });
      }
      return response.json({ success: true });
    }

    return response.json({ success: false });
  } catch (error) {
    console.error(error.message);
    return response.status(401).json({
      error: error.message,
    });
  }
});

// @route GET /api/store/:query
// @desc  Stores recipes in mongo from edamam API
// router.get(
//   "/api/store/:query",
//   async (request: Request, response: Response) => {
//     const { query } = request.params;
//     try {
//       const res = await axios.get(
//         `https://api.edamam.com/search?q=${query}&app_id=${process.env.EDAMAM_API_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=0&to=20`
//       );
//       const data = await res.data;

//       const { hits } = data;

//       await storeRecipes(hits);

//       return response.json({ data });
//     } catch (err) {
//       console.error(err.message);
//       return response.json({ message: err.message });
//     }
//   }
// );

router.get(
  "/api/search/:search/:page",
  async (request: Request, response: Response) => {
    try {
      const { search, page } = request.params;
      let p = +page;
      let pageSize = 20;
      if (search === "") {
        return response.json({ msg: "No query" });
      }
      const query = {
        skip: pageSize * (p - 1),
        limit: pageSize,
      };

      if (p < 1)
        return response
          .status(400)
          .json({ message: "Page number must be at least 1" });
      const data = await Recipe.find(
        {
          $text: { $search: search },
        },
        {},
        query,
        (err, data) => {
          if (err) {
            return response.json({ msg: "Error" });
          } else {
            return data;
          }
        }
      );

      return response.json(data);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }
);

export default router;
