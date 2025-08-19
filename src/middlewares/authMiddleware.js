import { getSession } from "../models/Session/sessionModel.js";
import { findUserByEmail } from "../models/User/userModel.js";
import {
  generateAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utility/jwthelper.js";
import responseClient from "../utility/responseClient.js";

// Admin auth
export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // validate if accessJWT is valid
    const decoded = verifyAccessJWT(authorization);

    if (!decoded?.email) {
      return responseClient({
        res,
        message: "Invalid token, unauthorized",
        statusCode: 401,
      });
    }

    // Check if  session valid token exists
    if (decoded?.email) {
      const sessionToken = await getSession({
        token: authorization,
        association: decoded.email,
      });

      //if session token is valid fetch user from DB
      if (sessionToken?._id) {
        const user = await findUserByEmail(decoded.email);

        if (!user?._id) {
          return responseClient({
            res,
            message: "User not found",
            statusCode: 404,
          });
        }
        // isprivate part missed
        if (user?._id && user.role === "admin") {
          user.password = undefined;
          req.userInfo = user;

          return next();
        } else {
          return responseClient({
            res,
            message: "Unauthorized, not an admin",
            statusCode: 403,
          });
        }
      }
    }

    // throw new Error("Invalid token, unauthorized");
  } catch (error) {
    return responseClient({ res, message: error.message, statusCode: 500 });
  }
};

//refresh auth token for local storage
export const refreshAuth = async (req, res) => {
  try {
    const { authorization } = req.headers;

    // validate and decode refresh token
    const decoded = verifyRefreshJWT(authorization);

    if (!decoded?.email) {
      return responseClient({
        res,
        message: "Invalid token, unauthorized",
        statusCode: 401,
      });
    }

    // get the user based on email and generate new access token for the user
    if (decoded?.email) {
      const user = await findUserByEmail(decoded.email);

      if (user?._id) {
        // generate new access token and return back that token to client
        const accessJWT = await generateAccessJWT(user.email);

        return responseClient({
          res,
          message: "Access token generated successfully",
          payload: { accessJWT },
        });
      }
    }

    throw new Error("Invalid token!!");
  } catch (error) {
    return responseClient({ res, message: error.message, statusCode: 500 });
  }
};
