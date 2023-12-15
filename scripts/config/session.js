//Packages for opening the session on MongoDB
const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");

//Create Session on MongoDB
function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);
  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "perseus-pedigree",
    collection: "sessions",
  });

  return store;
}

//Config session  -how long it can last open when entering a session
function createSessionConfig() {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 4 * 24 * 60 * 60 * 1000, //4 days
    },
  };
}

//Export function
module.exports = createSessionConfig;
