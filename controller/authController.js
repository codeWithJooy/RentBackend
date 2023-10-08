const User = require("../models/user");
const userCredential = require("../models/userCredentials")
const moment = require("moment");
const PropertyDetails = require("../models/property");
const UserCredential = require("../models/userCredentials");
const Otp = require("../models/otpDB")
const twilio = require('twilio')

// Your Twilio Account SID and Auth Token
const accountSid = 'AC567d9e3d06e75d2cca3eb582fa7e8da5';
const authToken = '0683d9ae0ed07b932e935696fda2561b';
// Create a Twilio client
const client = new twilio(accountSid, authToken);

const Signup = async (req, res) => {
  try {
    const { first, last, email, number, password } = req.body;
    let user = await User.findOne({ email })
    if (user) {
      return res.json({ code: 409, msg: "User already Present" })
    }
    else {
      const lastVisit = moment(new Date()).format(
        "dddd, MMMM Do YYYY, h:mm:ss a"
      );
      const newUser = new User({ first, last, email, number, password, lastVisit })
      await newUser.save()
      const cred = new UserCredential({ email, password, userId: newUser._id })
      await cred.save()
      return res.json({
        code: 200,
        message: "Signup Successful",
        userId: newUser._id,
        email: newUser.email,
      })
    }
  } catch (error) {
    res.status(502).json({ code: 502, msg: error.message })
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let cred = await userCredential.findOne({ email })
    if (!cred) {
      return res.json({ code: 404, message: "User Not Found" })
    }
    else if (cred.password !== password) {
      return res.json({ code: 401, message: "Password Mismatch" });
    }
    else if (cred.password === password) {
      //modify the last modify later
      let property = await PropertyDetails.findOne({ userId: cred.userId })
      if (!property) {
        return res.json({ code: 200, userId: cred.userId, propertyId: "", propertyName: "" })
      }
      else {
        return res.json({
          code: 200,
          userId: property.userId,
          email: cred.email,
          pincode: property.pincode,
          contact: property.contact,
          propertyId: property._id,
          propertyName: property.name,
          propertyCode: property.code,
        })
      }
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
};
const addEmail = async (req, res) => {
  try {
    const { email } = req.query
    let user = await userCredential.findOne({ email })
    if (!user) {
      return res.json({ code: 404, msg: "User Not Found" })
    }
    let otp = Math.floor(100000 + Math.random() * 900000)
    //Check If Otp Present Earlier
    let otpCheck = await Otp.findOne({ email })
    if (otpCheck) {
      otpCheck.otp = otp
      otpCheck.markModified("otp")
      otpCheck.save()
      let data = await User.findOne({ email })
      if (data) {
        const fromNumber = 'whatsapp:+14155238886'; // Your Twilio WhatsApp number
        const toNumber = `whatsapp:+91${data.number}`; // The recipient's WhatsApp number
        let msg = `Hey ${data.first}, 
               
      Your One-time Password Is ${otp}
               
      Regards RentPG`
        client.messages
          .create({
            from: fromNumber,
            to: toNumber,
            body: msg,
          }).then((message) => {
            console.log(`Message sent: ${message.sid}`);
          })
        return res.json({ code: 200, msg: "Otp Send To Phone Number", email: email })
      }
    }
    else {
      let otpData = new Otp({ email, otp })
      await otpData.save()
      let data = await User.findOne({ email })
      if (data) {
        const fromNumber = 'whatsapp:+14155238886'; // Your Twilio WhatsApp number
        const toNumber = `whatsapp:+91${data.number}`; // The recipient's WhatsApp number
        let msg = `Hey ${data.first}, 
               
      Your One-time Password Is ${otp}
               
      Regards RentPG`
        client.messages
          .create({
            from: fromNumber,
            to: toNumber,
            body: msg,
          }).then((message) => {
            console.log(`Message sent: ${message.sid}`);
          })
        return res.json({ code: 200, msg: "Otp Send To Phone Number", email: email })
      }
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.query
    let data = await Otp.findOne({ email })
    if (data) {
      if (data.otp !== otp) {
        return res.json({ code: 404, msg: "PLease Enter Correct Otp" })
      }
      return res.json({ code: 200, msg: "Otp Matched" })
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.query
    let data = await userCredential.findOne({ email })
    if (data) {
      data.password = password
      data.markModified("password")
      data.save()
      return res.json({ code: 200, msg: "Password Changed Successfully" })
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
module.exports = {
  Signup,
  Login,
  addEmail,
  verifyOtp,
  updatePassword,
};
