////Functions to select the entire graph of a species (general), or by individual and species (specific). In here it is the search given to Neo4j DB.
//Packages
//DB
const graphNeo4j = require("../data/graph-db");

function postGeneral(req, res, next) {
  const species = req.body.species;
  const session = graphNeo4j.driver.session({ database: "neo4j" });
  var searchNeo4j = `MATCH(n:${species})-[j]->(m) RETURN { id: id(n), label:head(labels(n)), caption:n.name, properties: properties(n)} as source, { id: id(m), label:head(labels(m)), caption:m.name, properties: properties(m) } as target, {value:j} as relationship`;

  //For now, remember to change "Peach_variant" to "Apple_variant" when visualizing the apple pedigree instead of the peach pedigree
  session
    .run(searchNeo4j)
    .then((result) => {
      res.status(200).send(JSON.stringify(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error when fecthing Neo4j data");
    });
}
function postSpecific(req, res, next) {
  const species = req.body.species;
  const individual = req.body.individual;
  const numberJumps = req.body.jumps; ///The names of req.body are the ones used on the api axios.post from the 2d-graph-discover-specific-d3.js code on the frontend.

  const session = graphNeo4j.driver.session({ database: "neo4j" });
  var searchNeo4j = `MATCH (n:${species}{name: "${individual}"})-[j*..${numberJumps}]-(m) RETURN { id: id(n), label:head(labels(n)), caption:n.name, properties: properties(n)} as source, { id: id(m), label:head(labels(m)), caption:m.name, properties: properties(m) } as target, {value:j} as relationship`;

  //For now, remember to change "Peach_variant" to "Apple_variant" when visualizing the apple pedigree instead of the peach pedigree
  session
    .run(searchNeo4j)
    .then((result) => {
      res.status(200).send(JSON.stringify(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error when fecthing Neo4j data");
    });
}

module.exports = { postGeneral: postGeneral, postSpecific: postSpecific };
