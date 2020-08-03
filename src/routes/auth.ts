import express, { Request, Response } from "express";
import * as admin from "firebase-admin";
import * as serviceAccount from "../serviceAccountKey.json";
const router = express.Router();

let srv: any = serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(srv),
  databaseURL: "https://recipe-app-aa8d5.firebaseio.com",
});

router.post(
  "/api/sessionLogin",
  async (request: Request, response: Response) => {
    try {
      console.log(`storing session`);
      const idToken = request.body.idToken.toString();
      const expiresIn = 60 * 60 * 24 * 5 * 1000;

      const cookie = await admin
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      const options = { maxAge: expiresIn, httpOnly: true };
      response.cookie("session", cookie, options);
      response.json({ session: cookie });
    } catch (err) {
      console.error(err);
      response.status(401).send("Unauthorized Request");
    }
  }
);

router.get("/api/sessionLogout", (request: Request, response: Response) => {
  response.clearCookie("session");
  response.redirect("/login");
});

export async function verifySession(session: string) {
  try {
    const credential = await admin.auth().verifySessionCookie(session);
    if (credential) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
export default router;
