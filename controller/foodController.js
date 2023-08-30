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
              title: "Dinner",
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
              title: "Thursday",
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
const updateTime = (req, res) => { };
const updateFood = (req, res) => {
  const { userId, propertyId } = req.query;
  const { title, breakfast, lunch, snacks, dinner } = req.body;
  Food.findOne({ userId, propertyId })
    .then((food) => {
      if (!food) {
        return res.json({ code: 404 });
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
const getFood = async (req, res) => {
  try {
    const { userId, propertyId, today } = req.query
    let food = await Food.findOne({ userId, propertyId })
    let arr = []
    if (food) {
      let obj = {}
      obj.title = "Breakfast"
      let time = food.time.filter((unit) => unit.title == "Breakfast")
      obj.start = time[0].start
      obj.end = time[0].end
      let day = food.days.filter((unit) => unit.title == today)
      obj.food = day[0].breakfast
      obj.fg = "#ffa839"
      obj.bg = "#fff4ee"
      obj.icon = "Assets/Food/breakfast.png"
      arr.push(obj)

      let obj1 = {}
      obj1.title = "Lunch"
      let time1 = food.time.filter((unit) => unit.title == "Lunch")
      obj1.start = time1[0].start
      obj1.end = time1[0].end
      let day1 = food.days.filter((unit) => unit.title == today)
      obj1.food = day1[0].lunch
      obj1.fg = "#FFAA44"
      obj1.bg = "#FFFCEC"
      obj1.icon = "Assets/Food/lunch.png"
      arr.push(obj1)

      let obj2 = {}
      obj2.title = "Snacks"
      let time2 = food.time.filter((unit) => unit.title == "Snacks")
      obj2.start = time2[0].start
      obj2.end = time2[0].end
      let day2 = food.days.filter((unit) => unit.title == today)
      obj2.food = day2[0].snacks
      obj2.fg = "#ffa839"
      obj2.bg = "#E8DDFF"
      obj2.icon = "Assets/Food/snacks.png"
      arr.push(obj2)

      let obj3 = {}
      obj3.title = "Dinner"
      let time3 = food.time.filter((unit) => unit.title == "Dinner")
      obj3.start = time3[0].start
      obj3.end = time3[0].end
      let day3 = food.days.filter((unit) => unit.title == today)
      obj3.food = day3[0].dinner
      obj3.fg = "#ffa839"
      obj3.bg = "#fff4ee"
      obj3.icon = "Assets/Food/dinner.png"
      arr.push(obj3)
      return res.json({ code: 200, model: arr })
    }
    else {
      return res.json({ code: 200, model: [] })
    }
  }
  catch (error) {
    return res.json({ code: 502, msg: error.message })
  }
}
module.exports = {
  getActivated,
  activateFood,
  updateFood,
  getFood,
};
