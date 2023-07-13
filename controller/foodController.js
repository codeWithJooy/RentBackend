const mongoose = require("mongoose");
const Food = require("../models/food");

const activateFood = (req, res) => {
  const { userId, propertyId } = req.body;
  Food.findOne({ userId, propertyId })
    .then((food) => {
      if (!food) {
        const newFood = new Food({
          userId,
          propertyId,
          activated: true,
          timeSet: false,
          time: [
            {
              title: "Breakfast",
              start: "08:00",
              end: "10:00",
            },
            {
              title: "Lunch",
              start: "12:00",
              end: "14:00",
            },
            {
              title: "Snacks",
              start: "16:00",
              end: "18:00",
            },
            {
              title: "Breakfast",
              start: "20:00",
              end: "22:00",
            },
          ],
          days: [
            {
              title: "Monday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
            {
              title: "Tuesday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
            {
              title: "Wednesday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
            {
              title: "Thusday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
            {
              title: "Friday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
            {
              title: "Saturday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
            {
              title: "Sunday",
              breakfast: "",
              lunch: "",
              snacks: "",
              dinner: "",
            },
          ],
        });
        newFood
          .save()
          .then(() => res.json({ code: 200, model: newFood }))
          .catch((err) => res.send({ code: 502, model: err.message }));
      }
    })
    .catch((err) => res.json({ code: 502, model: err.message }));
};
const getActivated = (req, res) => {
  const { userId, propertyId } = req.query;
  Food.findOne({ userId, propertyId })
    .then((food) => {
      if (!food) {
        return res.json({ code: 404 });
      }
      return res.json({ code: 200, model: food });
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};
const updateFood = (req, res) => {
  const { userId, propertyId } = req.query;
  const { title, breakfast, lunch, snacks, dinner } = req.body;
  Food.findOne({ userId, propertyId })
    .then((food) => {
      if (!food) {
        return res.json({ cod: 404 });
      } else {
        const foodIndex = food.days.findIndex((food) => food.title == title);
        if (foodIndex == -1) {
          return res.json({ code: 403, model: "Food Not Found" });
        }
        food.days[foodIndex].breakfast = breakfast;
        food.days[foodIndex].lunch = lunch;
        food.days[foodIndex].snacks = snacks;
        food.days[foodIndex].dinner = dinner;
        food.markModified("days");
        food.save();
        res.json({ code: 200, model: food });
      }
    })
    .catch((err) => {
      return res.json({ code: 502, model: err.message });
    });
};

module.exports = {
  getActivated,
  activateFood,
  updateFood,
};
