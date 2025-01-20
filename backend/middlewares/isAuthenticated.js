import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Access token from cookies
    const token = req.cookies.token;
    if (!token || typeof token === "undefined") {
      return res.status(401).json({ errorMessage: "Unauthorized User" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Assign userId from token to the request object
    req.id = decoded.userId;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ errorMessage: "Invalid or expired token" });
  }
};

export default isAuthenticated;
