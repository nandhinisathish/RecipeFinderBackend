import { Router } from "express";
import userCTRL from "../controllers/userController.js";
import { check } from "express-validator";
import dotenv from "dotenv";
import auth from "../middlewares/basicAuth.js";

dotenv.config();
const router = Router();

router
  .route("/register")
  .post(
    [
    
      check("password", "Password must be at least 6 characters long").isLength(
        { min: 6 }
      ),
      check("email", "Please include a valid email").isEmail(),
    ],
    userCTRL.registerUser
  );
  
  router
  .route("/login")

  .post(
    [
      check("password", "Please Include a password").not().isEmpty(),
      check("email", "Please include an email").not().isEmpty(),
    ],
    userCTRL.loginUser
  );

export default router;
