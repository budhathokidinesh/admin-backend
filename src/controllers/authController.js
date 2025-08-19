import {
  createNewSession,
  deleteSession,
} from "../models/Session/sessionModel.js";
import {
  addNewUser,
  findAllUsers,
  findUserByEmail,
  removeUser,
  updateUser,
} from "../models/User/userModel.js";
import { comparePassword, hashPassword } from "../utility/bcrypt.js";
import { v4 as uuidv4 } from "uuid";
import responseClient from "../utility/responseClient.js";
import { generateJWTs } from "../utility/jwthelper.js";
import { sendResetPasswordLinkEmail } from "../utility/nodemailerHelper.js";

export const registerNewUser = async (req, res, next) => {
  try {
    if (req.body) {
      //  Hash the password before saving to database
      req.body.password = hashPassword(req.body.password);

      // Set emailVerified to true by default
      req.body.emailVerified = true;

      //  Create the new user
      const newuser = await addNewUser(req.body);

      if (newuser?._id) {
        return responseClient({
          req,
          res,
          message: "User registered successfully",
          data: newuser,
        });
      }

      return responseClient({
        req,
        res,
        message:
          "Could not create the user. Something went wrong, please try again later",
        statusCode: 500,
      });
    }
  } catch (error) {
    error.message.includes("E11000 duplicate key error")
      ? (error.message =
          "Email already exists. Please use a different email address.")
      : error.message;

    next(error);
  }
};

//update user
export const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    // Check if userId is provided
    if (!userId) {
      return responseClient({
        res,
        message: "User ID is required for updating user details",
        statusCode: 400,
      });
    }
    const updatedUser = await updateUser({ _id: userId }, userData);
    return responseClient({
      res,
      payload: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    responseClient({
      res,
      message: error.message,
      statusCode: 500,
    });
  }
  next(error);
};
//delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await removeUser({ _id: userId });
    return responseClient({
      res,
      payload: deletedUser,
      message: "User deleted successfully 🥲",
    });
  } catch (error) {
    responseClient({
      res,
      message: error.message,
      statusCode: 500,
    });
  }
  next(error);
};

// login user
export const loginUser = async (req, res) => {
  try {
    //destructure email and password from req.body
    const { email, password } = req.body;

    // check if user exist
    const user = await findUserByEmail(email);

    // if user not found
    if (!user?._id) {
      return responseClient({
        res,
        message: "User not found. Please register to login!",
        statusCode: 404,
      });
    }
    // if user is not admin
    if (user.role !== "admin") {
      return responseClient({
        res,
        message: "You are not admin. Not authorized.",
        statusCode: 403,
      });
    }

    if (user?._id && user.status === "active") {
      const isMatch = comparePassword(password, user.password);

      // if password match then generate token
      if (isMatch) {
        const jwt = await generateJWTs(user.email);

        return responseClient({
          res,
          message: "User logged in successfully!!",
          payload: jwt,
        });
      }

      // if password not match
      return responseClient({
        res,
        message: "your password is worng ",
        statusCode: 404,
      });
    }
    return responseClient({
      res,
      message: "your account is not active ",
      statusCode: 404,
    });
    // Compare password
  } catch (error) {
    console.error("Login error:", error);
    return responseClient({
      req,
      res,
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};

//get the user
export const getUser = async (req, res) => {
  //retrieves and returns user information.
  try {
    responseClient({
      res,
      payload: req.userInfo, // from auth middleware
      message: "User fetched successfully",
    });
  } catch (error) {
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

//get all the user
export const getAllUsers = async (req, res) => {
  //retrieves and returns user information.
  try {
    const users = await findAllUsers();
    responseClient({
      res,
      payload: users,
      message: "User fetched successfully",
    });
  } catch (error) {
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

// forget password
export const forgetPassword = async (req, res) => {
  try {
    //find if user exist
    const user = await findUserByEmail(req.body.email);

    // if user not found
    if (!user?._id) {
      return responseClient({
        res,
        message: "User not found",
        statusCode: 404,
      });
    }

    //if user found
    if (user?._id) {
      // if user is created send a verification email
      const secureID = uuidv4();

      // store this secure ID in session storage for that user
      const newUserSession = await createNewSession({
        token: secureID,
        association: user.email,
        expiry: new Date(Date.now() + 3 * 60 * 60 * 1000), //session will be expired in 3 hr
      });

      if (newUserSession?._id) {
        const resetPasswordUrl = `${process.env.ROOT_URL}/change-password?e=${user.email}&id=${secureID}`;

        //send mail via node mailer
        sendResetPasswordLinkEmail(user, resetPasswordUrl);
      }
    }

    // if user found
    user?._id
      ? responseClient({
          res,
          payload: {},
          message: "Check your inbox/spam to reset your password",
        })
      : responseClient({
          res,
          message: "Something went wrong",
          statusCode: 500,
        });
  } catch (error) {
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

// change password
export const changePassword = async (req, res) => {
  try {
    const { formData, token, email } = req.body;

    //check if user exists
    const user = await findUserByEmail(email);

    //delete token from session table after password reset for one time click
    const sessionToken = await deleteSession({ token, association: email });

    if (user && sessionToken) {
      const { password } = formData;
      const encryptPassword = hashPassword(password);
      const updatedPasword = await updateUser(
        { email },
        { password: encryptPassword }
      );
      responseClient({
        res,
        payload: updatedPasword,
        message: "Password Reset successfully!!",
      });
    } else {
      responseClient({
        res,
        message: "Token expired or invalid. Please try again",
        statusCode: 500,
      });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    const { email } = req.body;
    const { authorization } = req.headers;

    // Remove session for the user
    const result = await deleteSession({
      token: authorization,
      association: email,
    });

    // Use ternary operator to handle success or failure
    result
      ? responseClient({
          res,
          payload: {},
          message: "User logged out successfully!!",
        })
      : responseClient({
          res,
          message: "Session not found or already deleted.",
          statusCode: 500,
        });
  } catch (error) {
    console.error("Error logging out:", error);
    responseClient({ res, message: error.message, statusCode: 500 });
  }
};
