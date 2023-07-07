const { v4: uuidv4 } = require("uuid");

const roomAddHelper = (floorName, roomTypes) => {
  const arr = [];
  let counter = 1;
  if (roomTypes.single !== "") {
    if (floorName === "Ground Floor") {
      for (let i = 1; i <= parseInt(roomTypes.single); i++) {
        let room = {};
        room.floor = "Ground Floor";
        room.name = "Ground" + counter;
        room.status = "Vacant";
        room.type = "Single";
        room.rate = 0;
        room.id = uuidv4();
        counter = counter + 1;
        arr.push(room);
      }
    } else {
      for (let i = 1; i <= parseInt(roomTypes.single); i++) {
        let floorNumber = floorName.split(" ")[1];
        let room = {};
        room.floor = floorName;
        room.name = floorNumber * 100 + counter;
        room.status = "Vacant";
        room.type = "Single";
        room.rate = 0;
        room.id = uuidv4();
        arr.push(room);
        counter = counter + 1;
      }
    }
  }
  if (roomTypes.double !== "") {
    if (floorName === "Ground Floor") {
      for (let i = 1; i <= parseInt(roomTypes.double); i++) {
        let room = {};
        room.floor = "Ground Floor";
        room.name = "Ground" + counter;
        room.status = "Vacant";
        room.type = "Double";
        room.rate = 0;
        room.id = uuidv4();
        arr.push(room);
        counter = counter + 1;
      }
    } else {
      for (let i = 1; i <= parseInt(roomTypes.double); i++) {
        let floorNumber = floorName.split(" ")[1];
        let room = {};
        room.floor = floorName;
        room.name = floorNumber * 100 + counter;
        room.status = "Vacant";
        room.type = "Double";
        room.rate = 0;
        room.id = uuidv4();
        arr.push(room);
        counter = counter + 1;
      }
    }
  }
  if (roomTypes.triple !== "") {
    if (floorName === "Ground Floor") {
      for (let i = 1; i <= parseInt(roomTypes.triple); i++) {
        let room = {};
        room.floor = "Ground Floor";
        room.name = "Ground" + counter;
        room.status = "Vacant";
        room.type = "Triple";
        room.rate = 0;
        room.id = uuidv4();
        arr.push(room);
        counter = counter + 1;
      }
    } else {
      for (let i = 1; i <= parseInt(roomTypes.triple); i++) {
        let floorNumber = floorName.split(" ")[1];
        let room = {};
        room.floor = floorName;
        room.name = floorNumber * 100 + counter;
        room.status = "Vacant";
        room.type = "Triple";
        room.rate = 0;
        room.id = uuidv4();
        arr.push(room);
        counter = counter + 1;
      }
    }
  }
  return arr;
};

module.exports = roomAddHelper;
