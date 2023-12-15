////MongoDB database.
//Package
const mongodb = require("mongodb");

//Access to MongoDB
const MongoClient = mongodb.MongoClient;

let database;

//Function connect to DB
async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("perseus-pedigree"); //create a DB on MongoDB if it doesn't exists yet.
}

//Get the DB
function getDb() {
  if (!database) {
    throw new Error("MongoDB Error: You must connect first!");
  }

  return database;
}

//Export
module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};
