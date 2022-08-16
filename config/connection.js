const { connect, connection } = require("mongoose");
// connect to database locally or with Atlas
const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialDB";
// needed to silence mongoose warnings
connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
