
/**
 * Authentication Middleware - Integrated with Auth Microservice
 * 
 * This middleware validates JWT tokens issued by the Auth microservice.
 * It uses the same JWT_SECRET as the Auth microservice to validate tokens locally
 * without making remote calls (for performance).
 */

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Try to get token from cookie first (for web), then from Authorization header (for API)
    let token = req.cookies?.token;
    
    if (!token) {
      // Try Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    console.log("Auth middleware - Token exists:", !!token);

    if (!token) {
      console.log("Auth middleware - No token found");
      return res.status(401).json({
        message: "User not authenticated. Token is missing.",
        success: false
      });
    }

    // Verify token using the SAME secret as Auth microservice
    // This allows us to validate tokens locally without calling Auth microservice
    const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
    
    if (!jwtSecret) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({
        message: "Authentication configuration error",
        success: false
      });
    }

    console.log("Auth middleware - Verifying token...");
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Auth middleware - Token verified successfully");

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false
      });
    }

    // Attach user info to request object
    // The token from Auth microservice contains: userId, email, role, etc.
    req.id = decoded.userId || decoded.sub || decoded.id;
    req._id = decoded.userId || decoded.sub || decoded.id;
    req.userId = decoded.userId || decoded.sub || decoded.id;
    req.email = decoded.email;
    req.role = decoded.role;
    
    console.log("Auth middleware - User authenticated:", {
      userId: req.userId,
      email: req.email,
      role: req.role
    });

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
        success: false
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        success: false
      });
    }

    return res.status(500).json({
      message: "Authentication failed",
      success: false
    });
  }
};

export default isAuthenticated;
