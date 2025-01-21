
// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }
//     const decode = jwt.verify(token, process.env.SECRET_KEY);
//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }
//     req.id = decode.userId;
//     next();
//   } catch (error) {
//     const authHeader = req.headers.authorization;
//     console.log("Authorization Header:", authHeader); // Debug

//     console.log("Error in authentication middleware : ", error);
//     // console.log(error);
//   }
// };
// export default isAuthenticated;
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated. Token is missing.",
        success: false,
      });
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Attach user ID to the request object
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Error in authentication middleware:", error);

    // Return a detailed error response
    return res.status(500).json({
      message: error.name === "JsonWebTokenError" ? "Invalid token" : "Authentication failed",
      success: false,
    });
  }
};

export default isAuthenticated;
