////Controllers of the /perseus paths.
//Packages
const { get } = require("mongoose");
const neo4j = require("neo4j-driver");

//Models
const Image = require("../models/images.models");
const Query = require("../models/query.model");

//Validation
const validation = require("../util/validation");

//DB
const graphNeo4j = require("../data/graph-db");

//Function to have all images at once
async function images() {
  const facebook = await Image.findOne("6233797944c602d05039e6d5");
  const instagram = await Image.findOne("6233798f44c602d05039e6d7");
  const twitter = await Image.findOne("6233798444c602d05039e6d6");
  const linkedin = await Image.findOne("623379f544c602d05039e6db");
  const crag = await Image.findOne("6238afe8c43c9830258c5ea3");
  const irta = await Image.findOne("62337a0944c602d05039e6dd");
  const chevronup = await Image.findOne("623379ea44c602d05039e6da");
  const graph = await Image.findOne("6234acd37f1725f06b582774");
  const threeDots = await Image.findOne("6234ae65d2b92cbc4a9125dc");
  const x = await Image.findOne("6234ae71d2b92cbc4a9125dd");
  const videoGraph = await Image.findOne("646f77cd8498be5d99486c96");
  const peach = await Image.findOne("62337a1244c602d05039e6de");
  const apple = await Image.findOne("623b97878bb2cf14b752cabe");
  const pear = await Image.findOne("623b97938bb2cf14b752cabf");
  const almond = await Image.findOne("63ed0fa6e2b8df2390014aaf");
  const grape = await Image.findOne("63ed0f9de2b8df2390014aae");
  const avatar = await Image.findOne("6241d6cfa0418202e5a8a109");
  const nicole = await Image.findOne("623c8fa0e0f1ac401da6f50a");
  const pere = await Image.findOne("623c81566fcfd3b706b5f377");
  const fede = await Image.findOne("623c861a8a4fa9d4e6a5c72d");
  const txosse = await Image.findOne("623c864e8a4fa9d4e6a5c72e");
  const cragCentre = await Image.findOne("623d8b0af426535cb8fd6c5b");
  const exampleGraph = await Image.findOne("628f81233fe2d3e69cf20e3e");
  const severoOchoa = await Image.findOne("63eb66b3d28cc3154fa163f4");
  const ministerio = await Image.findOne("63eb6670d28cc3154fa163f2");
  const invite = await Image.findOne("63eb6697d28cc3154fa163f3");
  const freeClimb = await Image.findOne("63eb665ad28cc3154fa163f1");
  const exampleGraphApple = await Image.findOne("63ecef0c4e2f12bc0cefb6d5");
  const carles = await Image.findOne("641dbdfd34e84543d4ecdc09");
  const guide1 = await Image.findOne("646dffc7f74d9087f5813f37");
  const guide2 = await Image.findOne("646dffd6f74d9087f5813f38");
  const guide3 = await Image.findOne("646dffe1f74d9087f5813f39");
  const guide4 = await Image.findOne("657731acc1b75cd94182ddf9");
  const guide5 = await Image.findOne("657735e29015c49623f95eeb");
  const guide6 = await Image.findOne("657737ea029b17f478bc2cbd");
  const guide7 = await Image.findOne("65774a4acaa2b83c49b1109f");
  const guide7_1 = await Image.findOne("657746b217a1fcdd4df61e44");
  const guide8 = await Image.findOne("65773a1ad2a8a7ec629e32fd");
  const videoUserGuide = await Image.findOne("657761de17a1c630af53b83a");
  const csv = await Image.findOne("65525b27aef474bf959dfac6");
  const template_xlsx = await Image.findOne("657c1d03847f6a512e15b252");

  const imagesAll = {
    facebook,
    instagram,
    twitter: twitter,
    linkedin: linkedin,
    crag: crag,
    irta: irta,
    chevronup: chevronup,
    graph: graph,
    threeDots: threeDots,
    x: x,
    videoGraph: videoGraph,
    peach: peach,
    apple: apple,
    pear: pear,
    almond: almond,
    grape: grape,
    avatar: avatar,
    nicole: nicole,
    pere: pere,
    fede: fede,
    carles: carles,
    txosse: txosse,
    cragCentre: cragCentre,
    exampleGraph: exampleGraphApple,
    severoOchoa: severoOchoa,
    ministerio: ministerio,
    invite: invite,
    freeClimb: freeClimb,
    guide1: guide1,
    guide2: guide2,
    guide3: guide3,
    guide4: guide4,
    guide5: guide5,
    guide6: guide6,
    guide7: guide7,
    guide7_1: guide7_1,
    guide8: guide8,
    videoUserGuide: videoUserGuide,
    csv: csv,
    template_xlsx: template_xlsx,
  };
  return imagesAll;
}

//GET Route - Perseus
async function getPerseus(req, res, next) {
  const image = await images();
  try {
    res.render("../views/general/perseus", {
      facebook: image.facebook,
      instagram: image.instagram,
      twitter: image.twitter,
      linkedin: image.linkedin,
      crag: image.crag,
      irta: image.irta,
      chevronup: image.chevronup,
      graph: image.graph,
      threeDots: image.threeDots,
      x: image.x,
      videoGraph: image.videoGraph,
      peach: image.peach,
      apple: image.apple,
      pear: image.pear,
      almond: image.almond,
      grape: image.grape,
      severoOchoa: image.severoOchoa,
      ministerio: image.ministerio,
      invite: image.invite,
      freeClimb: image.freeClimb,
    });
  } catch (error) {
    next(error);
    return;
  }
}

//GET Route - Contact
async function getContact(get, res, next) {
  const image = await images();
  try {
    res.render("../views/general/contact", {
      facebook: image.facebook,
      instagram: image.instagram,
      twitter: image.twitter,
      linkedin: image.linkedin,
      crag: image.crag,
      irta: image.irta,
      chevronup: image.chevronup,
      graph: image.graph,
      threeDots: image.threeDots,
      x: image.x,
      videoGraph: image.videoGraph,
      peach: image.peach,
      apple: image.apple,
      pear: image.pear,
      almond: image.almond,
      grape: image.grape,
      nicole: image.nicole,
      pere: image.pere,
      fede: image.fede,
      txosse: image.txosse,
      carles: image.carles,
    });
  } catch (error) {
    next(error);
    return;
  }
}

//GET Route - Who we are
async function getAboutUs(req, res, next) {
  const image = await images();
  try {
    res.render("../views/general/group", {
      facebook: image.facebook,
      instagram: image.instagram,
      twitter: image.twitter,
      linkedin: image.linkedin,
      crag: image.crag,
      irta: image.irta,
      chevronup: image.chevronup,
      graph: image.graph,
      threeDots: image.threeDots,
      x: image.x,
      peach: image.peach,
      apple: image.apple,
      pear: image.pear,
      almond: image.almond,
      grape: image.grape,
      nicole: image.nicole,
      pere: image.pere,
      fede: image.fede,
      carles: image.carles,
      txosse: image.txosse,
      cragCentre: image.cragCentre,
      exampleGraph: image.exampleGraph,
    });
  } catch (error) {
    next(error);
    return;
  }
}

//GET Route - Project
async function getProject(req, res, next) {
  const image = await images();
  try {
    res.render("../views/general/project", {
      facebook: image.facebook,
      instagram: image.instagram,
      twitter: image.twitter,
      linkedin: image.linkedin,
      crag: image.crag,
      irta: image.irta,
      chevronup: image.chevronup,
      graph: image.graph,
      threeDots: image.threeDots,
      x: image.x,
      videoGraph: image.videoGraph,
      peach: image.peach,
      apple: image.apple,
      pear: image.pear,
      almond: image.almond,
      grape: image.grape,
      exampleGraph: image.exampleGraph,
      severoOchoa: image.severoOchoa,
      ministerio: image.ministerio,
      invite: image.invite,
      freeClimb: image.freeClimb,
      guide1: image.guide1,
      guide2: image.guide2,
      guide3: image.guide3,
      guide4: image.guide4,
      guide5: image.guide5,
      guide6: image.guide6,
      guide7: image.guide7,
      guide7_1: image.guide7_1,
      guide8: image.guide8,
      videoUserGuide: image.videoUserGuide,
    });
  } catch (error) {
    next(error);
    return;
  }
}

//GET Route - Choose species
async function getSpecies(req, res, next) {
  const image = await images();
  try {
    res.render("../views/general/species", {
      facebook: image.facebook,
      instagram: image.instagram,
      twitter: image.twitter,
      linkedin: image.linkedin,
      crag: image.crag,
      irta: image.irta,
      chevronup: image.chevronup,
      graph: image.graph,
      threeDots: image.threeDots,
      x: image.x,
      videoGraph: image.videoGraph,
      peach: image.peach,
      apple: image.apple,
      pear: image.pear,
      almond: image.almond,
      grape: image.grape,
      csv: image.csv,
    });
  } catch (error) {
    next(error);
    return;
  }
}

var spec = "";
//POST Route - Choose species
async function Species(req, res, next) {
  const image = await images();
  try {
    const newQuery = new Query(req.body.name, req.body.number);
    const species = req.body.species;
    spec = species;
    const pedigreeNames = graphNeo4j.session
      .run(`MATCH(n:${species}) RETURN n`)
      .then(function (result) {
        const pedigreeArrayNames = [];
        result.records.forEach(function (record) {
          pedigreeArrayNames.push(record._fields[0].properties.name);
        });

        res.render("../views/general/discover", {
          newQuery: newQuery,
          facebook: image.facebook,
          instagram: image.instagram,
          twitter: image.twitter,
          linkedin: image.linkedin,
          crag: image.crag,
          irta: image.irta,
          chevronup: image.chevronup,
          graph: image.graph,
          threeDots: image.threeDots,
          x: image.x,
          csv: image.csv,
          template_xlsx: image.template_xlsx,
          namesPedigree: pedigreeArrayNames,
          species: species,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
    // .then(() => graphNeo4j.session.close());
  } catch (error) {
    next(error);
    return;
  }
}

//GET Route - Discover Pedigrees
// async function getDiscover(req, res, next) {
//   const image = await images();
//   try {
//     const pedigreeNames = graphNeo4j.session
//       .run("MATCH(n) RETURN n")
//       .then(function (result) {
//         const pedigreeArrayNames = [];
//         result.records.forEach(function (record) {
//           pedigreeArrayNames.push(record._fields[0].properties.name);
//         });
//         res.render("../views/general/discover", {
//           facebook: image.facebook,
//           instagram: image.instagram,
//           twitter: image.twitter,
//           linkedin: image.linkedin,
//           crag: image.crag,
//           irta: image.irta,
//           chevronup: image.chevronup,
//           graph: image.graph,
//           threeDots: image.threeDots,
//           x: image.x,
//           videoGraph: image.videoGraph,
//           peach: image.peach,
//           apple: image.apple,
//           pear: image.pear,
//           almond: image.almond,
//           grape: image.grape,
//           namesPedigree: pedigreeArrayNames,
//         });
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//     // .then(() => graphNeo4j.session.close());
//   } catch (error) {
//     next(error);
//     return;
//   }
// }

//POST Route - Discover Pedigrees
async function Discover(req, res, next) {
  const species = spec;
  const image = await images();
  try {
    const newQuery = new Query(req.body.name, req.body.number);
    const pedigreeNames = graphNeo4j.session
      .run(`MATCH(n:${species}) RETURN n`)
      .then(function (result) {
        const pedigreeArrayNames = [];
        result.records.forEach(function (record) {
          pedigreeArrayNames.push(record._fields[0].properties.name);
        });
        const nameQuery = newQuery.name;
        if (pedigreeArrayNames.includes(nameQuery)) {
          res.render("../views/general/discovername", {
            newQuery: newQuery,
            species: species,
            facebook: image.facebook,
            instagram: image.instagram,
            twitter: image.twitter,
            linkedin: image.linkedin,
            crag: image.crag,
            irta: image.irta,
            chevronup: image.chevronup,
            graph: image.graph,
            threeDots: image.threeDots,
            x: image.x,
            csv: image.csv,
            template_xlsx: image.template_xlsx,
            namesPedigree: pedigreeArrayNames,
          });
        } else {
          res.render("../views/general/discovernotfound", {
            newQuery: newQuery,
            species: species,
            facebook: image.facebook,
            instagram: image.instagram,
            twitter: image.twitter,
            linkedin: image.linkedin,
            crag: image.crag,
            irta: image.irta,
            chevronup: image.chevronup,
            graph: image.graph,
            threeDots: image.threeDots,
            x: image.x,
            csv: image.csv,
            template_xlsx: image.template_xlsx,
            namesPedigree: pedigreeArrayNames,
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    // .then(() => graphNeo4j.session.close());
  } catch (error) {
    next(error);
    return;
  }
}

//Export
module.exports = {
  getPerseus: getPerseus,
  getContact: getContact,
  getAboutUs: getAboutUs,
  getProject: getProject,
  // getDiscover: getDiscover,
  Discover: Discover,
  getSpecies: getSpecies,
  Species: Species,
};
