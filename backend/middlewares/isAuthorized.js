import jwt from "jsonwebtoken";

const isAuthorized = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Retrieve the token from cookies
      const token = req.cookies?.token;
      console.log("Auth middleware - Token exists:", !!token);

      if (!token) {
        console.log("Auth middleware - No token found");
        return res.status(401).json({
          message: "User not authenticated. Token is missing.",
          success: false,
        });
      }

      // Verify the token
      const secretKey = process.env.SECRET_KEY || 'fallback_secret_key_for_development';
      console.log("Auth middleware - Secret key exists:", !!process.env.SECRET_KEY);
      const decode = jwt.verify(token, secretKey);
      console.log("Auth middleware - Token verified successfully");

      if (!decode) {
        return res.status(401).json({
          message: "Invalid token",
          success: false,
        });
      }

      // Get user from database to check role
      const { User } = await import("../models/user.model.js");
      const user = await User.findById(decode.userId);
      
      if (!user) {
        return res.status(401).json({
          message: "User not found",
          success: false,
        });
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          success: false,
        });
      }

      // Attach user ID and role to the request object
      req.id = decode.userId;
      req._id = decode.userId;
      req.userId = decode.userId;
      req.userRole = user.role;
      req.user = user;
      console.log("Auth middleware - User authorized:", decode.userId, "Role:", user.role);
      next();
    } catch (error) {
      console.log("Error in authorization middleware:", error);

      // Return a detailed error response
      return res.status(500).json({
        message: error.name === "JsonWebTokenError" ? "Invalid token" : "Authorization failed",
        success: false,
      });
    }
  };
};

export default isAuthorized;
