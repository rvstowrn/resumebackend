const jwt = require("jsonwebtoken");
const jwtSecret = "DC46D6C4BC9E7BD52C3B0135B6C424FD0C8218E1EC54E0FD1BBB713FA5B20A7B";


module.exports = function(token) {
 
  // Check if no token
  if (!token) {
    return {"msg":"No token, auth denied"};
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.user.type !== "customer") {
      return {"msg":"Token is not valid"};
    }
    return {"msg":"success","decoded":decoded};
  } catch (err) {
    return {"msg":"Error decoding token"};
  }
};