const Member = require("../models/member");

const addMember = (req, res) => {
  const { userId, propertyId } = req.query;
  const { name, phone, doj, designation } = req.body;
  Member.findOne({ userId, propertyId, phone })
    .then((member) => {
      if (member) {
        return res.json({ code: 403, model: "Member Already Present" });
      }
      const newMember = new Member({
        userId,
        propertyId,
        phone,
        personal: {
          name: name,
          phone: phone,
          doj: doj,
          designation: designation,
        },
        kyc: {},
        current: {
          address: "",
          pincode: "",
          city: "",
          state: "",
        },
        permanent: {
          address: "",
          pincode: "",
          city: "",
          state: "",
        },
        job: {},
        bank: {
          account: "",
          name: "",
          ifsc: "",
          holder: "",
        },
      });
      newMember
        .save()
        .then(() => {
          return res.json({ code: 200, model: newMember });
        })
        .catch((err) => {
          return res.json({ code: 502, model: err.message });
        });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};

const getAMember = (req, res) => {
  const { userId, propertyId, phone } = req.query;
  Member.findOne({ userId, propertyId, phone })
    .then((member) => {
      if (!member) {
        return res.json({ code: 404, model: "No Member Found" });
      }
      return res.json({ code: 200, model: member });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};

const getMembers = (req, res) => {
  const { userId, propertyId } = req.query;
  Member.find({ userId, propertyId })
    .then((member) => {
      if (!member) {
        return res.json({ code: 404, model: "No Member Found" });
      }
      return res.json({ code: 200, model: member });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};

module.exports = {
  addMember,
  getAMember,
  getMembers,
};
