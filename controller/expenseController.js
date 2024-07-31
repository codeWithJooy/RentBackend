const mongoose = require("mongoose");
const Expense = require("../models/expense");
const Member = require("../models/member");
const s3 = require("../config/awsconfig");

const addExpense = async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      expenseName,
      amount,
      date,
      paidBy,
      paidTo,
      description,
      mode,
    } = req.body;
    const file = req.file;
    let location=""
    if(file){
    //s3 Upload
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        return res.status(500).send({ code: 500, message: error.message });
      }
      console.log("Image Uploaded",data.Location)
      await new Expense({
        userId,
        propertyId,
        expenseName,
        amount,
        date,
        paidBy,
        paidTo,
        description,
        mode,
        image: data.Location,
      }).save();
      return res.send({code:200,message:"Uploaded SuccessFully"})
    });
  }
  else{
    await new Expense({
      userId,
      propertyId,
      expenseName,
      amount,
      date,
      paidBy,
      paidTo,
      description,
      mode,
      image: "",
    }).save();
    return res.send({code:200,message:"Uploaded SuccessFully"})
  }
   
  } catch (error) {
    res.json({ code: 502, message: error.message });
  }
};
const getExpense = (req, res) => {
  const { userId, propertyId } = req.query;
  Expense.find({ userId, propertyId })
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.json({ code: 404, msg: "No Expense Found" });
      } else {
        return res.json({ code: 200, model: doc });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, msg: err.message });
    });
};
const getMemberName = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;

    let member = await Member.find({ userId, propertyId }).exec();
    let arr = [];
    if (member) {
      console.log(member.length);
      for (let i = 0; i < member.length; i++) {
        arr.push(member[i].personal.name);
      }
      return res.json({ code: 200, model: arr });
    } else {
      return res.json({ code: 200, model: arr });
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};
const getExpenseCount = async (req, res) => {
  try {
    let { userId, propertyId } = req.query;
    let expense = await Expense.find({ userId, propertyId }).exec();
    if (expense) {
      return res.json({ code: 200, model: expense.length });
    } else {
      return res.json({ code: 200, model: 0 });
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};
const getTotalExpense = async (req, res) => {
  try {
    let { userId, propertyId } = req.query;
    let expense = await Expense.find({ userId, propertyId }).exec();
    if (expense) {
      let totalExpense = expense.reduce(
        (acc, curr) => acc + parseInt(curr.amount),
        0
      );
      return res.json({ code: 200, model: totalExpense });
    } else {
      return res.json({ code: 200, model: 0 });
    }
  } catch (error) {
    return res.json({ code: 502, msg: error.message });
  }
};
module.exports = {
  addExpense,
  getExpense,
  getMemberName,
  getTotalExpense,
  getExpenseCount,
};
