////Neo4j DB connection
//Package
const neo4j = require("neo4j-driver");

//Neo4J connection and local installation
const driver = neo4j.driver(
  "neo4j://localhost:7687", // Change with your local installation
  neo4j.auth.basic("YOURUSER", "YOURPASSWORD") // Change with your user and password
);

//Neo4J New Session
const session = driver.session({ database: "neo4j" });

//Export
module.exports = {
  session: session,
  driver: driver,
};
