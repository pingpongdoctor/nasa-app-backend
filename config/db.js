const mongoose = require("mongoose");
const uri = process.env.MONGO_URI || "mongodb://localhost/test";

//FUNTION TO CONNECT TO MONGODB SERVER
const handleConnectMongoDBServer = async function () {
  try {
    //SET THE STRICTQUERY TO TRUE
    await mongoose.set("strictQuery", true);
    //CONNECT TO SERVER
    const conn = await mongoose.connect(uri);
    //LOG THE HOST TO THE CONSOLE
    console.log(conn.connection.host);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = handleConnectMongoDBServer;
