const mongoose = require("mongoose");
const subscriptionJob = require("../../services/subscriptionJob");
async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/rises");
    console.log("Connect Successfully!!!");
    subscriptionJob;
    console.log("Subscription job started successfully!");
  } catch (error) {
    console.log("Connect fail!!!");
  }
}
module.exports = { connect };
