import express, { Request, Response } from "express";
import User from "../models/User";
import Recipe from "../models/Recipe";
import { verifySession } from "./auth";
const router = express.Router();

router.get(
  "/api/user/recipes/:uid",
  async (request: Request, response: Response) => {
    try {
      const { uid } = request.params;
      const recipes = await Recipe.find({ "source.uid": uid });
      return response.json(recipes);
    } catch (error) {
      console.error(error.message);
      return response.status(400).json({ message: error.message });
    }
  }
);

router.get("/api/user/:uid", async (request: Request, response: Response) => {
  try {
    const { uid } = request.params;
    const user = await User.find({ uid: uid });
    return response.json({ user });
  } catch (err) {
    return response.status(404).json({ message: err.message });
  }
});

router.post(
  "/api/user/delete",
  async (request: Request, response: Response) => {
    try {
      const { session, uid } = request.params;
      const verified = verifySession(session);
      if (verified) {
        const user = await User.findOne({ "source.uid": uid });

        if (user) {
          await user.remove();
        }
        const recipes = await Recipe.find({ "source.uid": uid });

        if (recipes) {
          recipes.forEach(async (recipe: any) => {
            await recipe.delete();
          });
          return response.json({ msg: "deleted" });
        }
      } else {
        return response.json({ msg: "Invalid Session" });
      }
    } catch (error) {
      console.error(error.message);
      return response.status(400).json({ message: error.message });
    }
  }
);

router.post(
  "/api/user/updateColor",
  async (request: Request, response: Response) => {
    try {
      const { uid, session, color } = request.body;

      if (verifySession(session)) {
        const user = await User.findOne({ uid: uid });

        if (user) {
          await user.updateOne({
            color: color,
          });

          return response.json({
            success: true,
            message: "Profile updated successfully",
          });
        }
      } else {
        return response.json({
          success: false,
          message: "Could not update your color.",
        });
      }
    } catch (error) {
      console.error(error.message);
      return response
        .status(400)
        .json({ success: false, message: "Could not update your color" });
    }
  }
);

router.post(
  "/api/user/register",
  async (request: Request, response: Response) => {
    try {
      const { uid, displayName, color } = request.body;

      const user = new User({
        uid: uid,
        displayName: displayName,
        likes: [],
        color: color,
      });

      await user.save();

      return response.json({ success: true });
    } catch (err) {
      return response.json({ message: err.message });
    }
  }
);

router.post(
  "/api/user/updateName",
  async (request: Request, response: Response) => {
    const { uid, newName, session } = request.body;
    console.log({ uid, newName });
    if (!uid || !newName) return;
    try {
      if (verifySession(session)) {
        const recipes = await Recipe.find({ "source.uid": uid });
        const user = await User.findOne({ uid: uid });

        if (user) {
          await user.updateOne({
            displayName: newName,
          });

          if (recipes) {
            const promises = [];

            for (let i = 0; i < recipes.length; i++) {
              promises.push(
                await recipes[i].updateOne({
                  source: {
                    uid: uid,
                    displayName: newName,
                  },
                })
              );
            }

            await Promise.resolve(promises);
          }

          return response.json({ success: true });
        } else {
          return response.status(400).json({ error: `There was an error` });
        }
      } else {
        return response
          .status(403)
          .json({ message: "Could not verify your session" });
      }
    } catch (error) {
      return response.status(404).json({ message: error.message });
    }
  }
);

router.get(
  "/api/user/likes/:uid",
  async (request: Request, response: Response) => {
    try {
      const { uid } = request.params;
      const user = await User.findOne({ uid: uid });

      if (user) {
        let currUser: any = user;

        const { likes } = currUser;

        const likedRecipes = [];
        for (let i = 0; i < likes.length; i++) {
          const recipe = await Recipe.findById(likes[i]);
          if (recipe) {
            likedRecipes.push(recipe);
          }
        }

        return response.json(likedRecipes);
      } else {
        return response.status(401).json({ message: "User not found" });
      }
    } catch (err) {
      console.error(err.message);
      return response.json(err.message);
    }
  }
);
export default router;
