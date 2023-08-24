const User = require("../models/user");
const moment = require("moment");
const PropertyDetails = require("../models/property");

const Signup = (req, res) => {
  const { first, last, email, password } = req.body;
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(200)
          .json({ code: 409, message: "User Already Present" });
      }
      const lastVisit = moment(new Date()).format(
        "dddd, MMMM Do YYYY, h:mm:ss a"
      );
      const newUser = new User({ first, last, email, password, lastVisit });

      newUser
        .save()
        .then(() =>
          res.json({
            code: 200,
            message: "Signup Successful",
            userId: newUser._id,
            email:newUser.email,
          })
        )
        .catch((err) =>
          res.status(400).json({ code: 400, message: err.message })
        );
    })
    .catch((err) => res.status(400).json({ code: 409, message: err.message }));
};
const Login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.json({
          code: 404,
          message: "User Not Found",
        });
      }
      if (user.password !== password) {
        return res.json({
          code: 401,
          message: "Password Mismatch",
        });
      }
      if (user.password === password) {
        user.lastVisit = moment(new Date()).format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        );
        user.markModified("lastVisit");
        user.save();
        PropertyDetails.findOne({ userId: user._id }).then((property) => {
          if (!property) {
            return res.json({
              code: 200,
              userId: user._id,
              propertyId: "",
              propertyName: "",
            });
          } else {
            return res.json({
              code: 200,
              userId: property.userId,
              email: user.email,
              pincode: property.pincode,
              contact:property.contact,
              propertyId: property._id,
              propertyName: property.name,
              propertyCode:property.code,
            });
          }
        });
      }
    })
    .catch((error) =>
      res.status(500).json({ code: 502, message: "Internal Server Error" })
    );
};
module.exports = {
  Signup,
  Login,
};
