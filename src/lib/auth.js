const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign(
    {
      brandId: user.brandId,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
