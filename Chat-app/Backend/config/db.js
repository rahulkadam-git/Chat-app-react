const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const dbConnect = await mongoose.connect(
      "mongodb+srv://user_31:user31@cluster0.ijzwi.mongodb.net/Chat_app?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`Mongodb connected  ${dbConnect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = dbConnection;
