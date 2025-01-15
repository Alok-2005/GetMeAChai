import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, //this tells that cookie cannot be accessed by client side js
    secure: process.env.NODE_ENV === "production", //for security purpose as bcz in localhost we have http and in productions we have https where s=security
    sameSite: "strict", //prevents an attack called csrf
    maxAge: 7 * 24 * 60 * 60 * 1000,  //for expires in 7d logic 
  });

  return token
};

