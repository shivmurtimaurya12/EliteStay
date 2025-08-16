const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongoose_Url = 'mongodb://127.0.0.1:27017/wanderLust';
main()
  .then(() => {
    console.log("connectd to DB");
  })
  .catch((err) => {
    console.log(err);
  })

async function main() {
  await mongoose.connect(mongoose_Url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: '68959965f25ddb5cdf573e70' }));
  await Listing.insertMany(initData.data);
  console.log("data was saved");


};
initDB();