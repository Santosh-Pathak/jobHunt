import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookie.token;
    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthorized User" });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ errorMessage: "Invalid Token" });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;