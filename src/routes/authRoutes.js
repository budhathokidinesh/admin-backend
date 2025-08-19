import express from "express";
import {
  changePassword,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getUser,
  loginUser,
  logout,
  registerNewUser,
  updateUserDetails,
} from "../controllers/authController.js";
import {
  registerUserValidtion,
  loginValidation,
} from "../validators/schemas/validationSchema.js";

import { authMiddleware, refreshAuth } from "../middlewares/authMiddleware.js";

export const authRouter = express.Router();

// register new user route
authRouter.post(
  "/register",
  registerUserValidtion,
  authMiddleware,
  registerNewUser
);

//update a userdetails
authRouter.patch("/update/:userId", authMiddleware, updateUserDetails);

//delete a user
authRouter.delete("/delete/:userId", authMiddleware, deleteUser);

//login user
authRouter.post("/login", loginValidation, loginUser);

//get the user-info
authRouter.get("/user-info", authMiddleware, getUser);

// get all the user
authRouter.get("/all-users", authMiddleware, getAllUsers);

// GET NEW ACCESS TOKEN | GET | PRIVATE ROUTE
authRouter.get("/accessjwt", refreshAuth);

// forget password
authRouter.post("/forget-password", forgetPassword);

// reset password
authRouter.patch("/change-password", changePassword);

//logout
authRouter.post("/logout", authMiddleware, logout);
