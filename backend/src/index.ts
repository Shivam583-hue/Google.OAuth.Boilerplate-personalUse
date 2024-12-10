import cors from "cors";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { upsertUser, getUserByID } from "./database";
import { InsertUserType } from "./schema";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Origin",
      "Accept",
    ],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userToInsert: InsertUserType = {
          id: uuidv4(),
          googleId: profile.id,
          email: profile.emails?.[0]?.value || "",
          name: profile.displayName || "Unknown",
          profilePicture: profile.photos?.[0]?.value || "",
          createdAt: new Date(),
        };

        const user = await upsertUser(userToInsert);
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUserByID(id);
    done(null, user || null);
  } catch (error) {
    done(error, null);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  ((req: Request, res: Response) => {
    const user = req.user as any;
    if (!user) {
      return res.status(401).send("Authentication failed");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });

    res
      .cookie("token", token, { httpOnly: true })
      .redirect(process.env.FRONTEND_URL!);
  }) as express.RequestHandler,
);

app.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("token").send("Logged out");
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
