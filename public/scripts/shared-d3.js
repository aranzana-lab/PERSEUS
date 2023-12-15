//Session Open + Query Request + Functions
const start = new Date();
console.log(start);

/////Global variables
//Selection of species
var speciesSel = document.getElementById("species").innerHTML;

//Declare variables of HTML elements where the nodes' traits information must appear
var selectTraits = document.getElementById("select-traits");
var introSelect = document.getElementById("traits-info-intro");
var traits = document.getElementById("traits-info");
var selectByTrait = document.getElementById("properties-to-select");
var indPropertyPosition = document.getElementById("indProperties");
var lookedSearchCol = document.getElementById("colourSearch");
var getListSelIndiv = document.getElementById("searchInd");
var uploadDocForm = document.getElementById("formUpload");
var dataFileUploaded = document.getElementById("fileUploadUser");
var tableUser = document.getElementById("table-user");
var seeUploadData = document.getElementById("seeUploadData");
var selectedOptions = document.getElementById("alreadySelectedInd");
var indiv1 = "";
var customizeBar = document.getElementById(
  "customize-pedigree-search-discover"
);

//Info extracted from DB
var result;
const nodes = {}; //variable for nodes
let links; //variable for links(=edges)

//Self-fertilization relationships
const selfingRel = new Set();
let LinksSelfing = [];
var filtLinks;

//Variables created for storing the user data by files
var fileList = []; //List of files
var userDataAllFiles = []; //All files from user
var maxIdData;
var tooManyParents = []; //When having more than two parents

//Create nodeFill and nodeStroke colour
let initialColorsNodes = [45, 116, 177];
var nodeFill = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
var nodeStroke = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
var linkStroke = "rgb(79, 79, 81)";
var markerStroke = "rgb(79, 79, 81)";
var labelFill = "rgb(242, 243, 250)";
var strokeCol = "rgb(230, 235, 107)";
var markerColFilt = "rgb(119, 172, 218)";
var nodeSearchStroke = "rgb(229,68,97)";
let colorsRGBs = ["rgb(199, 51, 15)", "rgb(97, 191, 82)", "rgb(45, 116, 177)"];
let valueRGBoriginal = ["45", "116", "177"];
let colsGeneral = ["White", "Grey"];

///Create arrays with the names of buttons created for each function within the website
//Buttons for changing background colour
let buttonsBackgroundColInfo = [
  "Color",
  "backColDiv",
  "backDiv",
  "buttonBackCol",
  ["Dark", "Medium", "Light"],
];
//Buttons for changing node text colour
let buttonsNodesColInfo = [
  "Color Text",
  "textColDiv",
  "textDiv",
  "buttonTextCol",
  colsGeneral,
];

//Buttons for changing link colour
let buttonsLinksColInfo = [
  ["Color", "linkColDiv", "linkDiv", "buttonLinkCol", colsGeneral],
  ["Color Text", "linkColDiv", "linkDiv", "buttonLinkTextCol", colsGeneral],
];

//Buttons for changing the highlight colour of the selected nodes
let buttonsHighlightColInfo = [
  "Color",
  "highColDiv",
  "highDiv",
  "buttonHighCol",
  ["Yellow", "Red", "Purple", "Green"],
];

//Array containing a palette of RGB colours used for colouring by trait and searching specific individuals.
rgbsProp = [
  "rgb(237,191,51)",
  "rgb(233,30,99)",
  "rgb(14,180,55)",
  "rgb(179, 61, 198)",
  "rgb(250,131,52)",
  "rgb(237,184,139)",
  "rgb(135,188,69)",
  "rgb(234,85,69)",
  "rgb(67,170,139)",
  "rgb(255,102,237)",
  "rgb(189,207,50)",
  "rgb(159,196,144)",
  "rgb(255,192,190)",
  "rgb(239,155,32)",
  "rgb(111,29,27)",
  "rgb(160,155,231)",
  "rgb(183,153,156)",
  "rgb(234,180,100)",
  "rgb(218,65,103)",
  "rgb(238,232,44)",
  "rgb(249,86,79)",
  "rgb(176,121,120)",
  "rgb(184,211,209)",
  "rgb(228,136,168)",
  "rgb(145,203,62)",
  "rgb(165,1,4)",
  "rgb(255,210,63)",
  "rgb(59,206,172)",
  "rgb(237,221,212)",
  "rgb(148, 148, 148)",
];

//Names of colour sliders for nodes
let RGBs = ["RGB Red", "RGB Green", "RGB Blue"];

//Create initial coordinates of the nodes within the graph
let initialShapeCoordinates = ["cx", "cy"];
let finalShapeCoord = [0, 0];

//Variables for nodes and links
var nodeRadius = 6.5;
var width = 800;
var height = 900;
var backgroundCol = "rgb(35, 33, 35)";
var selDiv = "#graph-2d";

//Selection of nodes & links
var selectedNodes = new Set();
var selectedLinks = new Set();

///Construct the forces
const forceNode = d3.forceManyBody();

///Start graph simulation
function startSimulation(nodes, forceLink, forceNode, ticked, radius) {
  var simulation = d3
    .forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("x", d3.forceX().strength(0.1))
    .force("y", d3.forceY().strength(0.1))
    .force("collide", d3.forceCollide((d) => 10).radius(radius))
    .on("tick", ticked);
  return simulation;
}

////Create required visualization svgs
//Initialize svg (for graph-discover svg and graph-discover-specific)
var svg = d3
  .select("#graph-2d")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 6, width, height])
  .attr(
    "style",
    "max-width: 100%; height: auto; height: intrinsic; display: block"
  )
  .call(
    d3.zoom().on("zoom", function (event) {
      svg.attr("transform", event.transform);
    })
  )
  .append("g")
  .attr("id", "firstG");

//Create Marker arrows for all links
function createMarkerArrow(svg, links, id, markerStroke) {
  var markerArrow = svg
    .selectAll("marker")
    .data(links) // Different link/path types can be defined here
    .join("marker") // This section adds in the arrows
    .attr("id", id)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 30)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 100)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", markerStroke)
    .attr("d", "M0,-5L10,0L0,5");
  return markerArrow;
}

//Create all Link
function createLink(
  svg,
  linkStroke,
  linkStrokeOpacity,
  linkStrokeWidth,
  linkStrokeLinecap,
  links,
  url
) {
  var link = svg
    .append("g")
    .attr("stroke", linkStroke)
    .attr("stroke-opacity", linkStrokeOpacity)
    .attr(
      "stroke-width",
      typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
    )
    .attr("stroke-linecap", linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("marker-end", url);
  return link;
}

//Create the background of the link label
function createLabelLink1(svg, links, linkStroke) {
  var labelLink = svg
    .selectAll(null)
    .data(links)
    .enter()
    .append("text")
    .text((d) => d.relationship)
    .style("text-anchor", "middle")
    .attr("stroke", linkStroke)
    .attr("stroke-opacity", 1)
    .style("font-family", "Source Sans 3")
    .style("font-size", 3);
  return labelLink;
}

//Create the labels of the link relationships
function createLabelLink2(svg, links, labelFill) {
  var labelLink2 = svg
    .selectAll(null)
    .data(links)
    .enter()
    .append("text")
    .text((d) => d.relationship)
    .style("text-anchor", "middle")
    .attr("stroke", "none")
    .attr("fill", labelFill)
    .style("font-family", "Source Sans 3")
    .style("font-size", 3);
  return labelLink2;
}

//Create the nodes
function createNodes(
  svg,
  nodes,
  nodeRadius,
  nodeStrokeOpacity,
  nodeStrokeWidth,
  simulation
) {
  var node = svg //Variable for creating all nodes
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", nodeRadius)
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-width", nodeStrokeWidth)
    .call(drag(simulation));

  node //In case the user uploads data, the nodes from UserData are coloured in green in case they are not already found in the general dataset.
    .filter((node) => {
      if (maxIdData !== undefined && node.id > maxIdData) {
        return node;
      }
    })
    .attr("fill", "rgb(141, 157, 17)")
    .style("stroke", "rgb(141, 157, 17)");

  return node;
}

//Create labels for the nodes (names of the individuals)
function createLabelNodes(svg, nodes) {
  var labelNode = svg
    .selectAll(null)
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => d.name)
    .style("text-anchor", "middle")
    .style("fill", labelFill)
    .style("font-family", "Source Sans 3")
    .style("font-size", 3)
    .style("pointer-events", "none");
  return labelNode;
}

////Functions for all graphs
//Get the results from Neo4j
function obtainResultsNeo4j(result, createRel) {
  //Info extracted from DB
  links = result.records.map((r) => {
    //Links
    var source = r._fields[0];
    source.id = source.id.low;
    nodes[source.id] = source;
    var target = r._fields[1];
    target.id = target.id.low;
    nodes[target.id] = target;
    var relationship = r._fields[2];
    createRel(relationship);

    return {
      source: source.id,
      target: target.id,
      relationship: relationship.value,
    };
  });
  return links;
}

//Function to console the links' length and how long it takes to load.
function consoleLength(links, start) {
  console.log(
    links.length + " links loaded in " + (new Date() - start) + " ms."
  );
}

//Generate General (G) Dataset for pedigree.
function generateGData(nodes, links) {
  gData = {
    nodes: Object.values(nodes),
    links: links,
  };

  gData.links.forEach((link) => {
    //Get the information of the links to know the link source (parent) and link target(offspring)
    const a = gData.nodes.find((x) => x.id === link.source);
    const b = gData.nodes.find((x) => x.id === link.target);
    !a.links && (a.links = []);
    !b.links && (b.links = []);
    a.links.push(link);
    b.links.push(link);
  });
  return gData; //return the data to be used on the graph
}

//Function if nodeCaption (node name) is undefined
function nodeCap(nodeCaption, N) {
  if (nodeCaption === undefined) {
    nodeCaption = (_, i) => N[i];
  }
}

//Function to delete name of nodes in properties (and avoid repetitions).
function deleteNameProp(nodes) {
  nodes.forEach((node) => {
    delete node.properties.name;
  });
}

//Function to compute default domains
function defaultDomains(LB, nodeLabels) {
  if (LB && nodeLabels === undefined) {
    nodeLabels = d3.sort(LB);
  }
}

//Function to filter self-fertilization realtionships
function filterSelfing(links) {
  LinksSelfing = [];
  filtLinks = [];

  links.forEach((link) => {
    indexLink = link.indexRel; //In case the index of the link is already uploaded, this shows a self-fertilization. These links are kept separately for them to be coloured in blue.
    if (!LinksSelfing.includes(indexLink)) {
      LinksSelfing.push(indexLink);
    } else {
      filtLinks.push(indexLink);
      selfingRel.add(indexLink);
    }
  });
}

//Colour in red the links added by the user in case they give different information about the parents, compared to the info already available on the general Data
function linkExtraParents(link, markerArrow) {
  var linksChangeAll = [];
  tooManyParents.forEach((node) => {
    //Selected only the nodes that have more than two edges of entrance (parents)
    var linksChange = node.links.filter((link) => {
      return link.source > maxIdData;
    });
    linksChange.forEach((linkMustChange) => {
      //Make sure the links are not duplicated
      if (!linksChangeAll.includes(linkMustChange)) {
        linksChangeAll.push(linkMustChange);
      }
    });
  });
  linksChangeAll.forEach((linkChange) => {
    //For each one of the selected links that act as extra parents, we select them and change its colour to red (so that the user knows about the inconsistency).
    link
      .filter((linkOg) => {
        if (
          linkOg.source.id === linkChange.source &&
          linkOg.target.id === linkChange.target
        ) {
          markerArrow //change also the markerArrow colour
            .filter((arrow) => {
              return arrow.index === linkOg.index;
            })
            .attr("fill", "rgb(199, 51, 15)");
        }

        return (
          //return the link in case both the links' source and links' target coincide
          linkOg.source.id === linkChange.source &&
          linkOg.target.id === linkChange.target
        );
      })
      .attr("stroke", "rgb(199, 51, 15)");
  });
}

//Function to download all nodes info in CSV altogether
///Create a CSV downloadable file of all nodes
function objectToCsv(nodesPresentInfo) {
  //get csv rows already prepared
  const csvRows = [];
  //get the headers for csv
  const headers = Object.keys(nodesPresentInfo[0]);
  headers.pop();
  const propHeaders = Object.keys(nodesPresentInfo[0].Properties);
  const headersFinal = headers.concat(propHeaders);
  //Push all headers altogether on the same string
  csvRows.push(headersFinal.join(","));

  //loop over the rows for getting the values
  nodesPresentInfo.forEach((eachnode) => {
    const values = headers.map((header) => {
      //Obtain the header values
      const escaped = ("" + eachnode[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    const valuesProperties = propHeaders.map((header) => {
      //Obtain the value for each property
      const escaped2 = ("" + eachnode.Properties[header]).replace(/"/g, '\\"');
      return `"${escaped2}"`;
    });

    //Concat all values
    const allValues = values.concat(valuesProperties);
    //Join all values by comma
    csvRows.push(allValues.join(","));
  });

  return csvRows.join("\n");
}

//Function to start converting all information to .csv
function downlowadObjectToCsvAll(nodes, links) {
  let nodesAllPresentInfo = [];

  nodes.forEach((node) => {
    var name = node.name;
    var idNode = node.id;
    var properties = node.properties;
    let Offsprings = [];
    let Parents = [];

    for (var link of links) {
      if (link.source === idNode) {
        let nameTarget = nodes.find(({ id }) => id === link.target);
        if (nameTarget === undefined) {
          console.log(idNode);
        }
        Offsprings.push(nameTarget.name);
        Offsprings = [...new Set(Offsprings)];
      }
      if (link.target === idNode) {
        let nameSource = nodes.find(({ id }) => id === link.source);
        Parents.push(nameSource.name);
        Parents = [...new Set(Parents)];
      }
    }

    var eachNodesInfo = {
      Name: name,
      Parents: Parents,
      Offsprings: Offsprings,
      Properties: properties,
    };
    nodesAllPresentInfo.push(eachNodesInfo);
  });
  const csvData = objectToCsv(nodesAllPresentInfo); //Push all the info of the nodes to a variable csvData.
  return csvData;
}

//Function to download the .csv of the pedigree relationships
function downloadAllInfo(csvData, nameButton) {
  if (introSelect.children.length > 1) {
    introSelect.children[introSelect.children.length - 1].remove(); //Remove the previous .csv document any time the user uploads more data
  }
  const blob = new Blob([csvData], {
    type: "text/csv",
  });
  const url = window.URL.createObjectURL(blob); //Generate a new url and article to download the .csv.
  const a = document.createElement("a");
  a.innerHTML = nameButton;
  a.id = "buttonDownloadAll";
  a.setAttribute("href", url);
  a.setAttribute("download", "download_cvs_info.csv");
  introSelect.appendChild(a);
}

//Function to know if nodeStrength and linkStrength is defined
function nodeLinkStrength(forceNode, nodeStrength, forceLink, linkStrength) {
  if (nodeStrength !== undefined) {
    forceNode.strength(nodeStrength);
  }
  if (linkStrength !== undefined) {
    forceLink.strength(linkStrength);
  }
}

//Function to filter marker arrows representing self-fertilization and change its colour
function markerArrowFiltSelfing(markerArrow) {
  markerArrow
    .filter(function (link) {
      for (linkFiltered of filtLinks) {
        if (link.indexRel === linkFiltered) {
          return link;
        }
      }
    })
    .classed("selfingLink", true)
    .attr("fill", markerColFilt);
}

//Function to filter links representing self-fertilization and change its colour && filter if a node has more than 2 parents and change its link colour
function linkFiltSelfing(link) {
  link
    .filter(function (link) {
      for (linkFiltered of filtLinks) {
        if (link.indexRel === linkFiltered) {
          return link;
        }
      }
    })
    .classed("selfingLink", true)
    .attr("stroke-width", 0.95)
    .attr("stroke", markerColFilt);
}

//Function to append node title
function appendTitle(T, node) {
  if (T) {
    node.append("title").text(({ index: i }) => T[i]);
  }
}

//Tooltip node on mouseover
var tooltipMouseOver = d3
  .select("#graph-2d")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//In 2Dgrpah-discover-specific and graph-hierarchical: Colour the searched individual for the specific pedigree
function searchedIndiv(indiv1, node, labelNode) {
  node
    .filter((node) => {
      if (node.name === indiv1) {
        fillingLabel = "rgb(46, 46, 49)"; //change the colour of the filling
        labelNode
          .filter((node) => {
            if (node.name === indiv1) {
              return labelNode;
            }
          })
          .style("fill", labelFill)
          .style("font-weight", "bold"); //style the labelnode accordingly
        return node;
      }
    })
    .attr("fill", nodeSearchStroke)
    .attr("stroke", nodeSearchStroke); //Change colour of the searched node (to dark pink)

  lookedSearchCol.id = "circleColourProp";
  lookedSearchCol.innerHTML = "&#9673;";
  lookedSearchCol.style.color = nodeSearchStroke;
}

//Colour the selected individuals in the general graph (Function: "Search an individual")
function colourSelectedInd(
  getListSelIndiv,
  selectedOptions,
  nodes,
  node,
  labelNode,
  indiv1
) {
  //Get the HTMl element accordingly depending if we are on 2Dgraph-discover and 2Dgraph-discover-specific ("searchInd") or in graph-hierarchical ("searchInd-hier")
  if (getListSelIndiv.name === "searchInd") {
    getListSelIndiv = document.getElementById("searchInd");
  } else if (getListSelIndiv.name === "searchInd-hier") {
    getListSelIndiv = document.getElementById("searchInd-hier");
  }

  var firstOptionList = getListSelIndiv.options[0]; //Keep the default option ("Individual")
  var cloneList = getListSelIndiv.cloneNode(false); //Clone the list of individuals

  getListSelIndiv.parentNode.replaceChild(cloneList, getListSelIndiv); //Replace any previous list of individuals that would have been created before thsi function is run. This would happen when the user uploads data and the graph must be rendered again.
  getListSelIndiv = cloneList;

  getListSelIndiv.appendChild(firstOptionList);

  nodes.forEach((node) => {
    //Generate the list of node names
    var nameInd = node.name;
    var optionName = document.createElement("option");
    optionName.value = nameInd;
    optionName.innerHTML = nameInd;
    getListSelIndiv.appendChild(optionName);
  });

  var selectedInd = [];
  var i = 0;

  //When hearing the addEventListener (the user clicked a name to be searched, colour the specific node)
  getListSelIndiv.addEventListener("change", function (y) {
    var nameInd = this.value; //Obtain the innerHTML of the clicked name.

    if (nameInd === "" || selectedInd.includes(nameInd)) {
      //If the name is undefined or has been already selected, return the function
      return;
    } else {
      var randCol = rgbsProp[i++ % rgbsProp.length]; //Get a random colour from the colour palette

      selectedInd.push(nameInd); //Push on the list 'selectedInd' the clicked name

      //Create HTML division for each individual clicked
      var divOption = document.createElement("div");
      divOption.id = "divSearch";
      var showOption = document.createElement("div");
      showOption.innerHTML = nameInd;
      showOption.id = "nameSearch";
      divOption.appendChild(showOption);
      selectedOptions.appendChild(divOption);

      //Create circle colour to show the colour of the clicked node
      var divButtons = document.createElement("div");
      divButtons.id = "divButtons";
      divOption.appendChild(divButtons);
      var circleColourCanvas = document.createElement("p");
      circleColourCanvas.id = "circleColourProp";
      circleColourCanvas.innerHTML = "&#9673;";
      circleColourCanvas.style.color = randCol;
      divButtons.appendChild(circleColourCanvas);

      //Generate a remove button on HTML
      var removeButton = document.createElement("button");
      removeButton.innerHTML = "X";
      divButtons.appendChild(removeButton);

      node
        .filter((node) => {
          if (node.name === nameInd) {
            fillingLabel = "rgb(46, 46, 49)";
            labelNode
              .filter((node) => {
                if (node.name === nameInd) {
                  return labelNode;
                }
              })
              .style("fill", fillingLabel)
              .style("font-weight", "bold");
            return node;
          }
        })
        .attr("fill", randCol)
        .style("stroke", randCol); //Change colour of the selected node.
    }

    //When clicked the removed button, get the addEventListener and return the node to its original colour
    removeButton.addEventListener("click", function (d) {
      divOption.remove(); //Remove the HTML option
      node
        .filter((node) => {
          if (node.name === nameInd && node.name !== indiv1) {
            labelNode
              .filter((node) => {
                if (node.name === nameInd) {
                  console.log(labelNode);
                  return labelNode;
                }
              })
              .style("fill", labelFill)
              .style("font-weight", "inherit");
            return node;
          }
        })
        .attr("fill", nodeFill)
        .style("stroke", nodeStroke); //Colour the node in blue if it is from the general data.

      node
        .filter((node) => {
          if (node.name === nameInd && node.name !== indiv1) {
            if (maxIdData !== undefined && node.id > maxIdData) {
              return node;
            }
          }
        })
        .attr("fill", "rgb(141, 157, 17)")
        .style("stroke", "rgb(141, 157, 17)"); //Colour the node in green if it is from the user data.

      node
        .filter((node) => {
          if (node.name === indiv1) {
            labelNode
              .filter((node) => {
                if (node.name === nameInd) {
                  return labelNode;
                }
              })
              .style("fill", labelFill)
              .style("font-weight", "bold");
            return node;
          }
        })
        .attr("fill", nodeSearchStroke)
        .style("stroke", nodeSearchStroke); //Colour the labelnode and node
      selectedInd = selectedInd.filter((e) => e !== nameInd); //filter the removed individual from the selectedInd array.
    });
  });
}

//Personalize the pedigree
///Colour the background of the visualization
//Links title
function createBakgroundPers(customizeBar) {
  var customizeBackName = document.createElement("div");
  customizeBackName.innerHTML = "Background";
  customizeBackName.id = "sliderBackground";
  customizeBar.appendChild(customizeBackName);
}

// Personalize the colours pedigree
///Customized sliders bar
var sliderSize;
///Slider size for nodes
function createSliderSize(customizeBar, node, markerArrow) {
  //Create the HTML elements to show the node slider size.
  var sliderSizeArea = document.createElement("div");
  sliderSizeArea.id = "viz-sliderSize";
  sliderSizeArea.width = "17rem";
  var sliderName = document.createElement("p");
  sliderName.innerHTML = "Size";
  var sliderSizePosition = document.createElement("div");
  sliderSizePosition.id = "sliderSizeDiv";
  var customizeNodeName = document.createElement("div");
  customizeNodeName.innerHTML = "Nodes";
  customizeNodeName.id = "sliderNodes";

  var sliderSizes = document.createElement("div");
  sliderSizes.id = "sliderSize";

  //Create the d3.js slider size.
  sliderSize = d3
    .sliderBottom()
    .min(3)
    .max(10)
    .width(120)
    .value(nodeRadius)
    .ticks(1)
    .step(0.5)
    .fill(nodeFill)
    .handle(d3.symbol().type(d3.symbolCircle).size(150)())
    .on("onchange", (d) => {
      nodeRadius = d;
      node.attr("r", nodeRadius);
      markerArrow.attr("markerWidth", 40);
    }); //When changed the node radius skip the marker arrow a bit.

  //transform the range slider area depending on the size selected.
  var gRangeSlider = d3
    .select(sliderSizeArea)
    .append("svg")
    .attr("width", 180)
    .attr("height", 50)
    .append("g")
    .attr("transform", "translate(20,10)");

  gRangeSlider.call(sliderSize);

  ///Append all divisions to the customize pedigree bar
  customizeBar.appendChild(customizeNodeName);
  sliderSizePosition.appendChild(sliderName);
  sliderSizePosition.appendChild(sliderSizeArea);
  customizeBar.appendChild(sliderSizePosition);

  var customizeColorNodesName = document.createElement("div");
  customizeColorNodesName.id = "sliderSizeDiv";
  var customizeColorNodesNameP = document.createElement("p");
  customizeColorNodesNameP.innerHTML = "Color RGB";

  customizeColorNodesName.appendChild(customizeColorNodesNameP);
  customizeBar.appendChild(customizeColorNodesName);
}

///create a for loop for creating three different colour bars on the customize bar (Function: "Personalize the visualization")
////Object that contains the variables and names of the variables

///Sliders Colours for nodes
function createSliderColor(customizeBar, node) {
  RGBs.forEach((color, i) => {
    //Append HTML elements to the customize bar for the node RGB sliders
    var sliderColorArea = document.createElement("svg");
    sliderColorArea.id = "viz-sliderColor";
    sliderColorArea.width = "30rem";
    var sliderColor1Name = document.createElement("p");
    sliderColor1Name.innerHTML = color;
    var sliderColor1Position = document.createElement("div");
    sliderColor1Position.id = "sliderSizeDiv";
    sliderColor1Position.className = "RGB";
    sliderColor1Position.appendChild(sliderColor1Name);
    sliderColor1Position.appendChild(sliderColorArea);
    customizeBar.appendChild(sliderColor1Position);

    //Create the d3 slider for each colour of RGB
    var sliderColors = d3
      .sliderBottom()
      .min(0)
      .max(255)
      .width(120)
      .value(valueRGBoriginal[i])
      .ticks(1)
      .step(1)
      .fill(colorsRGBs[i])
      .handle(d3.symbol().type(d3.symbolCircle).size(150)())
      .on("onchange", (d) => {
        if (i === 0) {
          //When changed the slider number, change the first colour of the RGB
          initialColorsNodes[0] = d;
          nodeFill = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
          nodeStroke = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
          node.attr("fill", nodeFill);
          node.attr("stroke", nodeStroke);
        }
        if (i === 1) {
          //When changed the slider number, change the second colour of the RGB
          initialColorsNodes[1] = d;
          nodeFill = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
          nodeStroke = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
          node.attr("fill", nodeFill);
          node.attr("stroke", nodeStroke);
        }
        if (i === 2) {
          //When changed the slider number, change the third colour of the RGB
          initialColorsNodes[2] = d;
          nodeFill = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
          nodeStroke = `rgb(${initialColorsNodes[0]},${initialColorsNodes[1]},${initialColorsNodes[2]})`;
          node.attr("fill", nodeFill);
          node.attr("stroke", nodeStroke);
        }
      });

    //transform the range slider area depending on the size selected.
    var gRangeSliderColor = d3
      .select(sliderColorArea)
      .append("svg")
      .attr("id", "svgSlider" + i)
      .attr("width", 180)
      .attr("height", 50)
      .append("g")
      .attr("transform", "translate(20,10)");

    gRangeSliderColor.call(sliderColors);
  });
}

//Text change colour for nodes text and links colour and text
function createCol(
  personalizedText1,
  personalizedText2,
  personalizedText3,
  personalizedText4,
  colsGeneral,
  customizeBar
) {
  //Append HTML elements to the customize bar for the node text colours
  var textColName = document.createElement("p");
  textColName.innerHTML = personalizedText1;
  var textPosition = document.createElement("div");
  textPosition.id = personalizedText2;
  var textPosition2 = document.createElement("div");
  textPosition2.id = personalizedText3;
  textPosition.appendChild(textColName);
  textPosition.appendChild(textPosition2);
  customizeBar.appendChild(textPosition);

  colsGeneral.forEach((color, i) => {
    var buttonsCol = document.createElement("div");
    buttonsCol.id = "viz-button";
    textPosition2.appendChild(buttonsCol);

    //symbol Square for buttons
    var button = document.createElement("button");
    button.type = "button";
    button.className = "buttonCol";
    button.id = personalizedText4 + i;
    button.width = "8rem";
    button.height = "2rem";
    button.innerHTML = color;
    buttonsCol.appendChild(button);
  });
}

//Function to colour the text nodes, text links, background colour, and hihglight colour (when selecting a node) buttons.
function colourButtons(
  buttonTextCol0,
  buttonTextCol1,
  buttonLinkCol0,
  buttonLinkCol1,
  buttonLinkTextCol0,
  buttonLinkTextCol1,
  buttonBackgroundCol0,
  buttonBackgroundCol1,
  buttonBackgroundCol2,
  buttonHighlightCol0,
  buttonHighlightCol1,
  buttonHighlightCol2,
  buttonHighlightCol3,
  graph,
  labelNode,
  link,
  markerArrow,
  labelLink,
  labelLink2
) {
  //Background colours
  //Dark background
  buttonBackgroundCol0.on("click", (d) => {
    backgroundCol = "rgb(35, 33, 35)";
    graph.style.backgroundColor = backgroundCol;
    linkStroke = "rgb(79, 79, 81)";
    markerStroke = "rgb(79, 79, 81)";
    link.attr("stroke", linkStroke);
    markerArrow.attr("fill", markerStroke);
    labelFill = "rgb(242, 243, 250)";
    labelNode.style("fill", labelFill);
    strokeCol = "rgb(230, 235, 107)";
    markerColFilt = "rgb(119, 172, 218)";
    linkExtraParents(link, markerArrow);
    linkFiltSelfing(link);
    markerArrowFiltSelfing(markerArrow);
  });
  //Medium colour background (dark grey)
  buttonBackgroundCol1.on("click", (d) => {
    backgroundCol = "rgb(148, 148, 148)";
    graph.style.backgroundColor = backgroundCol;
    labelFill = "rgb(46, 46, 49)";
    labelNode.style("fill", labelFill).style("font-weight", "bold");
    linkStroke = "rgba(79, 79, 81, 0.5)";
    strokeCol = "rgb(250, 255, 17)";
    markerColFilt = "rgb(45, 116, 177)";
    linkExtraParents(link, markerArrow);
    linkFiltSelfing(link);
    markerArrowFiltSelfing(markerArrow);
  });
  //Light background (light grey background)
  buttonBackgroundCol2.on("click", (d) => {
    backgroundCol = "rgb(230, 231, 238)";
    graph.style.backgroundColor = backgroundCol;
    labelFill = "rgb(46, 46, 49)";
    labelNode.style("fill", labelFill).style("font-weight", "bold");
    linkStroke = "rgba(79, 79, 81, 0.5)";
    markerStroke = "rgb(79, 79, 81)";
    link.attr("stroke", linkStroke);
    markerArrow.attr("fill", markerStroke);
    strokeCol = "rgb(153,0,213)";
    markerColFilt = "rgb(45, 116, 177)";
    linkExtraParents(link, markerArrow);
    linkFiltSelfing(link);
    markerArrowFiltSelfing(markerArrow);
  });

  //Node text colour
  //White colour
  buttonTextCol0.on("click", (d) => {
    labelFill = "rgb(242, 243, 250)";
    labelNode.style("fill", labelFill);
  });
  //Grey colour
  buttonTextCol1.on("click", (d) => {
    labelFill = "rgb(46, 46, 49)";
    labelNode.style("fill", labelFill).style("font-weight", "bold");
  });

  //Link colour
  //White colour
  buttonLinkCol0.on("click", (d) => {
    linkStroke = "rgb(166, 166, 167)";
    markerStroke = "rgb(166, 166, 167)";
    link.attr("stroke", linkStroke);
    markerArrow.attr("fill", markerStroke);
    markerArrowFiltSelfing(markerArrow);
    linkFiltSelfing(link);
  });
  //Grey colour
  buttonLinkCol1.on("click", (d) => {
    linkStroke = "rgb(91, 91, 91)";
    markerStroke = "rgb(91, 91, 91)";
    markerArrow.attr("fill", markerStroke);
    link.attr("stroke", linkStroke);
    markerArrowFiltSelfing(markerArrow);
    linkFiltSelfing(link);
  });

  //Link Text Colour
  //White colour
  buttonLinkTextCol0.on("click", (d) => {
    labelLink.attr("stroke", "rgb(211, 211, 211)");
    labelLink2.attr("fill", "rgb(46, 46, 49)");
  });
  //Grey colour
  buttonLinkTextCol1.on("click", (d) => {
    labelFill = "rgb(242, 243, 250)";
    labelLink.attr("stroke", "rgb(91, 91, 91)");
    labelLink2.attr("fill", labelFill);
  });

  //Highlight the selected nodes
  //Yellow highlight
  buttonHighlightCol0.on("click", (d) => {
    strokeCol = "rgb(230, 235, 107)";
  });
  //Red highlight
  buttonHighlightCol1.on("click", (d) => {
    strokeCol = "rgb(215,40,60)";
  });
  //Purple highlight
  buttonHighlightCol2.on("click", (d) => {
    strokeCol = "rgb(153,0,213)";
  });
  //Green highlight
  buttonHighlightCol3.on("click", (d) => {
    strokeCol = "rgb(25, 172, 27)";
  });
}

//Function to create a slider for changing the width of links
function createSliderWidthLink(customizeBar, link, linkStrokeWidth) {
  //Append HTML elements to customize bar
  var sliderSizeArea = document.createElement("div");
  sliderSizeArea.id = "viz-sliderSize";
  sliderSizeArea.width = "17rem";
  var sliderName = document.createElement("p");
  sliderName.innerHTML = "Width";
  var sliderSizePosition = document.createElement("div");
  sliderSizePosition.id = "sliderSizeDiv";
  var customizeLink = document.createElement("div");

  var sliderWidthLink = document.createElement("div");
  sliderWidthLink.id = "sliderSize";

  //Create the d3 slider for width of links
  sliderSize = d3
    .sliderBottom()
    .min(0.3)
    .max(2.0)
    .width(120)
    .value(linkStrokeWidth)
    .ticks(0.2)
    .step(0.1)
    .fill("rgb(211, 211, 211)")
    .handle(d3.symbol().type(d3.symbolCircle).size(150)())
    .on("onchange", (d) => {
      linkStrokeWidth = d;
      link.attr(
        "stroke-width",
        typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
      );
    });

  //transform the range slider area depending on the width selected.
  var gRangeSlider = d3
    .select(sliderSizeArea)
    .append("svg")
    .attr("width", 180)
    .attr("height", 50)
    .append("g")
    .attr("transform", "translate(20,10)");

  gRangeSlider.call(sliderSize);

  ///append all divisions to the customize pedigree bar
  customizeBar.appendChild(customizeLink); //LinkColour
  sliderSizePosition.appendChild(sliderName); //Slider Width
  sliderSizePosition.appendChild(sliderSizeArea); //Slider size Area within the customize bar
  customizeBar.appendChild(sliderSizePosition); //Slider size position

  var customizeLinkWidth = document.createElement("div");
  customizeLinkWidth.id = "sliderSizeDiv";

  customizeBar.appendChild(customizeLinkWidth); //Width link slider
}

///Colours and text for links
//Links title
function createLinksPers(customizeBar) {
  var customizeLinksName = document.createElement("div");
  customizeLinksName.innerHTML = "Links";
  customizeLinksName.id = "sliderLinks";
  customizeBar.appendChild(customizeLinksName);
}

//Highlight title
function createHighlightPers(customizeBar) {
  var customizeHighlightName = document.createElement("div");
  customizeHighlightName.innerHTML = "Highlight Selection";
  customizeHighlightName.id = "sliderHighlight";
  customizeBar.appendChild(customizeHighlightName);
}

////Colour the nodes by specific trait (Function: "Colour by trait")
function propertiesToSelectTrait(
  selectByTrait,
  indPropertyPosition,
  nodes,
  node,
  labelNode,
  species,
  link,
  markerArrow,
  labelLink,
  labelLink2
) {
  //Store the default value of the selection "Trait"
  var firstTrait = selectByTrait.options[0];
  selectByTrait.innerHTML = ""; //Remove any list previously created inside this HTML (this works when uploading the user data, to remove the default traits list)

  selectByTrait.appendChild(firstTrait);

  //Selection of the properties used for colouring by trait. The ones on "namesToSplit" are discarded because each individual has a specific value for those traits, not few-common values.
  var propertiesToSelect = Object.keys(nodes[0].properties);

  //Peach array
  namesToSplitPeach = [
    "Code",
    "Discovered",
    "Ripening_original",
    "Blush_percentage_original",
    "Reference_properties",
    "Reference_pedigree",
    "Link",
    "Synonym",
  ];

  //Apple array
  namesToSplitApple = [
    "MUNQ",
    "Accession_no",
    "Discovered_raised",
    "Country",
    "Harvest_time_original",
    "Flavour_original",
    "Reference_properties",
    "Reference_pedigree",
    "Link",
    "Synonym",
  ];

  //Pear array
  namesToSplitPear = [
    "Introduced",
    "Accession_number",
    "Reference_properties",
    "Flavour_original",
    "Harvest_original",
    "Synonym",
    "Link",
  ];

  //Almond array
  namesToSplitAlmond = [
    "Introduced",
    "Shelling_percentage_original",
    "Record_pedigree",
    "Link",
    "Reference_properties",
  ];

  //Grapevine array
  namesToSplitGrapevine = [
    "Reference_pedigree",
    "Reference_properties",
    "Country",
    "Synonym",
    "Accession_number",
    "Link",
  ];

  //Split the names of the properties (traits)
  function splitNames(name) {
    var indexSplit = propertiesToSelect.indexOf(name);
    if (indexSplit !== -1) {
      propertiesToSelect.splice(indexSplit, 1);
    }
  }

  //Remove the previous properties, specific by species.
  function splitBySpecies(
    species,
    namesToSplitAlmond,
    namesToSplitApple,
    namesToSplitGrapevine,
    namesToSplitPeach,
    namesToSplitPear
  ) {
    if (species === "Apple_variant") {
      namesToSplitApple.forEach((name) => {
        splitNames(name);
      });
    } else if (species === "Peach_variant") {
      namesToSplitPeach.forEach((name) => {
        splitNames(name);
      });
    } else if (species === "Pear_variant") {
      namesToSplitPear.forEach((name) => {
        splitNames(name);
      });
    } else if (species === "Almond_variant") {
      namesToSplitAlmond.forEach((name) => {
        splitNames(name);
      });
    } else if (species === "Grapevine_variant") {
      namesToSplitGrapevine.forEach((name) => {
        splitNames(name);
      });
    }
  }

  splitBySpecies(
    species,
    namesToSplitAlmond,
    namesToSplitApple,
    namesToSplitGrapevine,
    namesToSplitPeach,
    namesToSplitPear
  );

  //Sort the properties alphabetically.
  propertiesToSelect.sort();

  const propertiesNumber = propertiesToSelect.length;
  let valuesByProperty = [];
  for (i = 0; i < propertiesNumber; i++) {
    const propertyValues = [];
    //Sort the values by trait for each node and store the values
    nodes.forEach((node) => {
      var valuesPropNode = [];
      propertiesToSelect.map((propertyName) => {
        var valueProp = node.properties[propertyName];
        valuesPropNode.push(valueProp);
      });
      var propertyValue = valuesPropNode[i];
      propertyValues.push(propertyValue);
    });
    let uniquePropertyValues = [...new Set(propertyValues)];
    valuesByProperty.push(uniquePropertyValues);
  }

  //Select a property to display and create the HTML element to visualize it.
  propertiesToSelect.forEach((property, i) => {
    var propertyNames = document.createElement("option");
    propertyNames.innerHTML = `${property}`;
    propertyNames.value = `${property}`;
    selectByTrait.appendChild(propertyNames);
  });

  //When clicking a specific trait, run the addEventListener
  selectByTrait.addEventListener("change", function () {
    //Append the possible values of the trait to the HTML as buttons.
    indPropertyPosition.innerHTML = "";
    var indexPropertySelected = propertiesToSelect.indexOf(this.value);
    var propSelected = propertiesToSelect[indexPropertySelected];
    var propertyValues = valuesByProperty[indexPropertySelected];

    //Sort the value salphabetically
    propertyValues.sort();
    var buttonsByProperty = document.createElement("div");
    buttonsByProperty.id = "viz-buttonByProperty";
    indPropertyPosition.appendChild(buttonsByProperty);

    //Create an object to know which property has been selected.
    var propNodesColoured = new Set();
    //Create an object to know which nodes are coloured.
    var NodesColoured = new Set();
    // Show the avilable values per property.
    propertyValues.forEach((propertyValue, y) => {
      //Go back to initial settings
      node.attr("fill", nodeFill).style("stroke", nodeStroke);
      labelNode.style("fill", labelFill);
      link.attr("stroke", linkStroke);
      markerArrow.attr("fill", markerStroke);
      labelLink.attr("stroke", linkStroke);
      labelLink2.attr("fill", labelFill);

      //Create the buttons for each property value
      var buttonPropCol = document.createElement("div");
      buttonPropCol.id = "indButtonProp";
      var buttonPropertySelected = document.createElement("button");
      buttonPropertySelected.type = "button";
      buttonPropertySelected.className = "propertySelected";
      buttonPropertySelected.id = "buttonProperty" + i + "_" + y;
      buttonPropertySelected.width = "8rem";
      buttonPropertySelected.height = "2rem";
      buttonPropertySelected.innerHTML = propertyValue;

      //Give a colour to each property value and show it on the HTML with a circle canvas
      var circleColourCanvas = document.createElement("p");
      circleColourCanvas.id = "circleColourProp";
      circleColourCanvas.innerHTML = "&#9673;";

      //If the value is undefined or Unknown, give a grey colour specifically.
      if (propertyValue === "Undefined") {
        circleColourCanvas.style.color = `${rgbsProp[rgbsProp.length - 1]}`;
      } else if (propertyValue === "Unknown") {
        circleColourCanvas.style.color = `${rgbsProp[rgbsProp.length - 2]}`;
      } else {
        circleColourCanvas.style.color = `${rgbsProp[y]}`;
      }
      buttonPropCol.appendChild(buttonPropertySelected);
      buttonPropCol.appendChild(circleColourCanvas);
      buttonsByProperty.appendChild(buttonPropCol);
      indPropertyPosition.appendChild(buttonsByProperty);

      //Listen to the value selected per property to colour the nodes that have that value.
      buttonPropertySelected.addEventListener("click", (d) => {
        if (propNodesColoured.has(propertyValue)) {
          propNodesColoured.delete(propertyValue);
        } else if (!propNodesColoured.has(propertyValue)) {
          propNodesColoured.add(propertyValue);
        }
        var fill = "";
        node //Fill the selected nodes with the colour of the selected value
          .filter(function (node) {
            var properties = node.properties;
            var property = properties[propSelected];
            //Colour the node depending if the associated value to that trait is Undefined, Unknown, or if it has the selected value.
            if (propertyValue === property && propertyValue === "Undefined") {
              fill = `${rgbsProp[rgbsProp.length - 1]}`;
              NodesColoured.add(node);
              return node, fill;
            } else if (
              propertyValue === property &&
              propertyValue === "Unknown"
            ) {
              fill = `${rgbsProp[rgbsProp.length - 2]}`;
              NodesColoured.add(node);
              return node, fill;
            } else if (
              propNodesColoured.has(propertyValue) &&
              propertyValue === property &&
              propertyValue !== "Undefined"
            ) {
              fill = `${rgbsProp[y]}`;
              NodesColoured.add(node);
              return node, fill;
            }
          })
          .attr("fill", fill)
          .style("stroke", fill);

        node //The nodes that are not coloured, make them almost transparent so that they are not seen.
          .filter(function (node) {
            if (!NodesColoured.has(node)) {
              fill = "rgba(63, 63, 66, 0.2)";
              return node, fill;
            } else if (
              !propNodesColoured.has(propertyValue) &&
              NodesColoured.has(node) &&
              node.properties[propSelected] === propertyValue
            ) {
              NodesColoured.delete(node);
              fill = "rgba(63, 63, 66, 0.2)";
              return node, fill;
            }
          })
          .attr("fill", fill)
          .style("stroke", fill);

        labelNode //Colour the labels of the selected nodes
          .filter(function (node) {
            if (NodesColoured.has(node)) {
              fillingLabel = labelFill;
              return node, fillingLabel;
            }
          })
          .style("fill", fillingLabel)
          .style("font-weight", "bold");

        labelNode //The nodes that are not coloured, make their label almost transparent so that they are not seen.
          .filter(function (node) {
            if (!NodesColoured.has(node)) {
              fillingLabel = "rgba(63, 63, 66, 0.1)";
              return node, fillingLabel;
            }
          })
          .style("fill", fillingLabel)
          .style("font-weight", "bold");

        link //Make the links of the nodes that are not selected almost transparent. Same fot the marker arrows and the labels of these links.
          .filter(function (link) {
            function transpCol(link, markerArrow, labelLink) {
              markerArrow.each(function (d) {
                if (link.index === d.index) {
                  d3.select(this).attr("fill", "rgba(63, 63, 66, 0.1)");
                }
              });
              labelLink.each(function (label) {
                if (link.index === label.index) {
                  d3.select(this).attr("stroke", "rgba(63, 63, 66, 0.1)");
                }
              });
              labelLink2.each(function (label) {
                if (link.index === label.index) {
                  d3.select(this).attr("fill", "rgb(63, 63, 66)");
                }
              });
              return link;
            }
            if (NodesColoured.size === 0) {
              var link = transpCol(link, markerArrow, labelLink);
              return link;
            } else {
              for (nodeCol of NodesColoured) {
                var nameNode = nodeCol.name;
                if (
                  link.source.name !== nameNode ||
                  link.target.name !== nameNode
                ) {
                  var link = transpCol(link, markerArrow, labelLink);
                  return link;
                }
              }
            }
          })
          .attr("stroke", "rgba(63, 63, 66, 0.1)");

        link //Display the links that are associated with the selected nodes only. Same fot the marker arrows and the labels of these links.
          .filter(function (link) {
            for (nodeCol of NodesColoured) {
              var nameNode = nodeCol.name;
              if (
                link.source.name === nameNode ||
                link.target.name === nameNode
              ) {
                markerArrow.each(function (markerAr) {
                  if (link.index === markerAr.index) {
                    d3.select(this).attr("fill", "rgb(91, 91, 91)");
                  }
                });
                labelLink.each(function (label) {
                  if (link.index === label.index) {
                    d3.select(this).attr("stroke", "rgb(91, 91, 91)");
                  }
                });
                labelLink2.each(function (label) {
                  if (link.index === label.index) {
                    d3.select(this).attr("fill", labelFill);
                  }
                });
                return link;
              }
            }
          })
          .attr("stroke", "rgb(91, 91, 91)");
      });
    });
  });
}

//Function to add highlight name functionality when hovering links and nodes
function onMouseOver(node, link, labelNode) {
  node
    .on("mouseover", function (event, d) {
      d3.select(this).style("cursor", "pointer");
      var name = d.name;

      let Offsprings = [];
      let Parents = [];

      link.each(function (link) {
        if (link.source.name === name) {
          Offsprings.push(link.target.name);
          Offsprings = [...new Set(Offsprings)];
        }
        if (link.target.name === name) {
          Parents.push(link.source.name);
          Parents = [...new Set(Parents)];
        }
      });
      var parentsLine = Parents.join(", ");

      //Add info when mouseover
      tooltipMouseOver.transition().duration(200).style("opacity", 1);
      tooltipMouseOver
        .html(
          "<strong>" +
            name +
            "</strong>" +
            "<br>" +
            "Parents: " +
            parentsLine +
            "<br>"
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      node.style("cursor", "default");
      //info mouseover
      tooltipMouseOver.transition().duration(500).style("opacity", 0);
    });

  //Style the cursor when hovering the link and labelNode
  link
    .on("mouseover", function (event, d) {
      d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function (event, d) {
      link.style("cursor", "default");
    });

  labelNode
    .on("mouseover", function (event, d) {
      d3.select(this).style("cursor", "pointer");
    })
    .on("mouseout", function (event, d) {
      labelNode.style("cursor", "default");
    });
}

//Function when selecting specific nodes OR links
function onClickNode(node, labelNode, link, markerArrow, indiv1) {
  //On Node Click
  node.on("click", function (event, d) {
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      selectedNodes.has(d) ? selectedNodes.delete(d) : selectedNodes.add(d); // multi-selection
    } else {
      const untoggle = selectedNodes.has(d) && selectedNodes.size === 1; // single-selection
      selectedNodes.clear();
      !untoggle && selectedNodes.add(d);
    }

    node
      .filter(function (node) {
        if (node.name !== indiv1) {
          return !selectedNodes.has(node);
        }
      })
      .classed("selected", false)
      .attr("r", nodeRadius)
      .attr("fill", nodeFill)
      .attr("stroke", nodeStroke); //Colour the unselected nodes with its default colour (blue)

    node
      .filter((node) => {
        if (
          node.name !== indiv1 &&
          maxIdData !== undefined &&
          node.id > maxIdData
        ) {
          return !selectedNodes.has(node);
        }
      })
      .classed("selected", false)
      .attr("r", nodeRadius)
      .attr("fill", "rgba(141, 157, 17, 0.7)")
      .attr("stroke", "rgba(141, 157, 17, 0.7)"); //If the unselected nodes are from the user Data, colour in green

    node
      .filter(function (node) {
        if (node.name === indiv1) {
          return !selectedNodes.has(node);
        }
      })
      .classed("selected", false)
      .attr("r", nodeRadius)
      .attr("fill", nodeSearchStroke)
      .attr("stroke", nodeSearchStroke); //Colour the nodeSearch of the unselected nodes

    node
      .filter(function (node) {
        return selectedNodes.has(node);
      })
      .classed("selected", true)
      .attr("r", 1.1 * nodeRadius)
      .attr("fill", strokeCol)
      .attr("stroke", strokeCol); //Colour the selected nodes in yellow by default, but the strokeCol can change depending on the colour chosen on "Personalize the visualization" for the highlight of nodes

    labelNode
      .filter(function (node) {
        if (node.name !== indiv1) {
          return !selectedNodes.has(node);
        }
      })
      .style("fill", labelFill)
      .style("font-weight", "inherit"); //Colour the labelNode as default for unselected nodes

    labelNode
      .filter(function (node) {
        if (node.name === indiv1) {
          return !selectedNodes.has(node);
        }
      })
      .style("fill", labelFill)
      .style("font-weight", "bold");

    labelNode
      .filter(function (node) {
        return selectedNodes.has(node);
      })
      .style("fill", "rgb(63, 63, 66)")
      .style("font-weight", "bold"); //Colour the labelNode in grey and bold for the selected nodes

    link
      .filter(function (link) {
        for (selNode of selectedNodes) {
          var nameNode = selNode.name;
          if (link.source.name !== nameNode || link.target.name !== nameNode) {
            markerArrow.each(function (d) {
              if (link.index === d.index) {
                d3.select(this).attr("fill", linkStroke);
              }
            });
            return link;
          }
        }
      })
      .attr("stroke", linkStroke); //Colour the links associated to the unselected nodes in dark grey

    link
      .filter(function (link) {
        for (linkFiltered of filtLinks) {
          if (link.indexRel === linkFiltered) {
            for (selNode of selectedNodes) {
              var nameNode = selNode.name;
              if (
                link.source.name !== nameNode ||
                link.target.name !== nameNode
              ) {
                markerArrow
                  .filter(function (link) {
                    for (linkFiltered of filtLinks) {
                      if (link.indexRel === linkFiltered) {
                        return link;
                      }
                    }
                  })
                  .attr("fill", markerColFilt);
                return link;
              }
            }
          }
        }
      })
      .attr("stroke", markerColFilt);

    linkExtraParents(link, markerArrow); //If the userData contains inconsistent source links (parents), highlight these in red

    link
      .filter(function (link) {
        for (selNode of selectedNodes) {
          var nameNode = selNode.name;
          if (link.source.name === nameNode || link.target.name === nameNode) {
            markerArrow.each(function (markerAr) {
              if (link.index === markerAr.index) {
                d3.select(this).attr("fill", strokeCol);
              }
            });

            return link;
          }
        }
      })
      .attr("stroke", strokeCol); //Colour the links associated to the selected nodes in the highlighted colour.

    //Take the information of the selected nodes only to show them at the bottom of the HTML
    let namesSelectedNodes = [];
    selectedNodes.forEach((selectedNode) => {
      var name = selectedNode.name;
      let properties = selectedNode.properties;
      let Offsprings = [];
      let Parents = [];

      //Add info of the Parents and Offsprings
      link.each(function (link) {
        if (link.target.name === name) {
          Parents.push(link.source.name);
          Parents = [...new Set(Parents)];
        }

        if (link.source.name === name) {
          Offsprings.push(link.target.name);
          Offsprings = [...new Set(Offsprings)];
        }
      });

      if (Parents.length === 0) {
        Parents[0] = "Undefined";
      } else if (Offsprings.length === 0) {
        Offsprings[0] = "Undefined";
      }

      //Add all the information of each node in an object
      var selNodesInfo = {
        Name: name,
        Parents: Parents,
        Offsprings: Offsprings,
        Properties: properties,
      };
      namesSelectedNodes.push(selNodesInfo);
    });

    //Create the HTML elements for looking at the info of the selected nodes on HTML.
    var newElement = document.createElement("div");
    var newSelect = document.createElement("a");
    newSelect.innerHTML = "Check the selected cultivars - Passport data";
    newSelect.href = "#traits-info-intro";
    newSelect.id = "traits";
    var newIntroSelect = document.createElement("p");
    newIntroSelect.innerHTML = "Selected cultivars:";
    selectTraits.style.padding = "1rem 2rem";
    traits.style.padding = "1rem 2rem";

    namesSelectedNodes.forEach((SelectedNode) => {
      //For each selected node, create first a division for its name
      var infoSelNode = document.createElement("div");
      var name = document.createElement("p");
      infoSelNode.id = "info-sel-node";
      name.id = "name";
      name.append(SelectedNode.Name);
      infoSelNode.appendChild(name);

      //Obtain the information altogether of the selected nodes.
      let namesIntro = Object.keys(SelectedNode);
      let namesInfo = Object.values(SelectedNode);
      //Remove the name, so that it doesn't repeat again
      namesIntro.shift();
      namesInfo.shift();

      //Create a function to introduce the traits separated by divs on HTML.
      function introduceInfoInProperties(infoPropertyJoint, nameProperty) {
        var property = document.createElement("div");
        var propertyIntro = document.createElement("label");
        var propertyInfo = document.createElement("p");
        propertyIntro.innerHTML = `${nameProperty}:`;
        property.id = "property";
        propertyInfo.append(infoPropertyJoint);
        property.append(propertyIntro);
        property.append(propertyInfo);
        infoSelNode.appendChild(property);
      }

      //Create a function to introduce the references of the properties linked to the website
      function introduceReferenceProperties(
        refPedigree,
        nameRefPed,
        nameRefProp,
        referenceProp,
        linkRef
      ) {
        //Reference of the Pedigrees and the Properties
        var propertyPed = document.createElement("div");
        var propertyProp = document.createElement("div");
        var InfoPedigrees = document.createElement("div");
        var infoProperties = document.createElement("div");
        var propertyIntroPed = document.createElement("label");
        var propertyIntroProp = document.createElement("label");
        propertyPed.id = "property";
        propertyProp.id = "property";

        ///Papers of the species uploaded on PERSEUS
        let paperApple = document.getElementById("paperApple").children;
        let paperAlmond = document.getElementById("paperAlmond").children;
        let paperPear = document.getElementById("paperPear").children;
        let paperGrapevine = document.getElementById("paperGrapevine").children;
        let paperPeach = document.getElementById("paperPeach").children;

        let papers = [
          paperApple,
          paperPear,
          paperPeach,
          paperAlmond,
          paperGrapevine,
        ];

        //If the Reference Pedigree is not undefined, append the reference to the HTML
        if (refPedigree !== undefined) {
          propertyIntroPed.innerHTML = `${nameRefPed}:`;
          propertyPed.append(propertyIntroPed);
          propertyPed.append(InfoPedigrees);
          InfoPedigrees.style.display = "grid";
          papers.forEach((paper) => {
            for (i = 0; i < paper.length; i++) {
              var hrefPaperLink = paper[i].href;
              var paperName = paper[i].innerHTML;
              if (hrefPaperLink !== undefined && paperName !== null) {
                paperName = paperName.replace(/(<em>)|(<br>)|(<\/em>)|;/g, ""); //Remove specific HTML tags from the name
                paperName = paperName
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, ""); //Remove accents from the name
                const references = refPedigree.split("; ");
                references.forEach((ref) => {
                  if (ref === paperName) {
                    //References of the pedigrees
                    var propertyInfoPed = document.createElement("a");
                    propertyInfoPed.append(ref);
                    propertyInfoPed.href = `${hrefPaperLink}`;
                    propertyInfoPed.target = "_blank";
                    InfoPedigrees.append(propertyInfoPed);
                  } else if (ref === undefined) {
                    var propertyInfoPed = document.createElement("p");
                    propertyInfoPed.append("Undefined");
                    InfoPedigrees.append(propertyInfoPed);
                  }
                });
              }
            }
          });
          //Add the information if the pedigree reference is undefined
          if (refPedigree === "Undefined") {
            var propertyInfoPed = document.createElement("p");
            propertyInfoPed.append(refPedigree);
            InfoPedigrees.append(propertyInfoPed);
            InfoPedigrees.style.display = "grid";
          } else if (refPedigree === "Inferred") {
            //Add the information if the pedigree reference is inferred
            var propertyInfoPed = document.createElement("p");
            propertyInfoPed.append(refPedigree);
            InfoPedigrees.append(propertyInfoPed);
          } else if (refPedigree === "Inferred Open Pollinator") {
            //Add the information if the pedigree reference is an Inferred Open Pollinator
            var propertyInfoPed = document.createElement("p");
            propertyInfoPed.append(refPedigree);
            InfoPedigrees.append(propertyInfoPed);
          } else if (refPedigree === "User Data") {
            //Add the information if the pedigree reference is from the user Data
            var propertyInfoPed = document.createElement("p");
            propertyInfoPed.append(refPedigree);
            InfoPedigrees.append(propertyInfoPed);
          }
        } else {
          console.log(refPedigree);
        }

        //Reference of properties
        //Append HTML information on the properties of each selection
        propertyIntroProp.innerHTML = `${nameRefProp}:`;
        propertyProp.append(propertyIntroProp);
        propertyProp.append(infoProperties);
        infoProperties.style.display = "grid";

        const refProperties = referenceProp.split("; ");
        const linkProperties = linkRef.split("; ");
        refProperties.forEach((ref) => {
          console.log(ref);
          var indexRef = refProperties.indexOf(ref);
          var link = linkProperties[indexRef];
          if (link === "Undefined") {
            var propertyInfoProp = document.createElement("p");
            propertyInfoProp.append(ref);
          } else {
            var propertyInfoProp = document.createElement("a");
            propertyInfoProp.append(ref);
            propertyInfoProp.href = `${link}`;
            propertyInfoProp.target = "_blank";
          }
          infoProperties.append(propertyInfoProp);
        });

        var blank = document.createElement("div");
        blank.innerHTML = "&nbsp;";
        infoSelNode.appendChild(blank);
        infoSelNode.appendChild(propertyPed);
        infoSelNode.appendChild(propertyProp);
      }

      //For each trait, append the name of the trait (nameProperty) and the information (infoPropertyJoint)
      //The "properties (i === 2)" are separated from the rest because they are already an object and the information must be separated individually.
      namesIntro.forEach((introSelectedNode, i) => {
        var linkRef;
        var referenceProp;
        var nameRefProp;
        var refPedigree;
        var nameRefPed;

        //All info that is not properties (traits)
        if (i < 2) {
          var infoProperty = namesInfo[i];
          var infoPropertyJoint = infoProperty.join(", ");
          var nameProperty = introSelectedNode;
          linkRef = null;
          referenceProp = null;
          nameRefProp = null;
          refPedigree = null;
          nameRefPed = null;
          introduceInfoInProperties(infoPropertyJoint, nameProperty);
          if (introSelectedNode === "Offsprings") {
            var blank = document.createElement("div");
            blank.innerHTML = "&nbsp;";
            infoSelNode.appendChild(blank);
          }
        }
        //Properties
        if (i === 2) {
          let namesProperties = Object.keys(SelectedNode.Properties);
          namesProperties.sort();
          namesProperties.forEach((nameProperty, i) => {
            var infoPropertyJoint = SelectedNode.Properties[nameProperty];
            if (nameProperty !== "Discovered_Raised") {
              nameProperty = nameProperty.replace(/_/g, " ");
            } else {
              nameProperty = nameProperty.replace(/_/g, "/");
            }
            if (
              nameProperty !== "Reference properties" &&
              nameProperty !== "Link" &&
              nameProperty !== "Reference pedigree" &&
              nameProperty !== "Record pedigree"
            ) {
              introduceInfoInProperties(infoPropertyJoint, nameProperty);
            } else if (
              //Reference pedigree
              nameProperty === "Reference pedigree" ||
              nameProperty === "Record pedigree"
            ) {
              refPedigree = infoPropertyJoint;
              nameRefPed = nameProperty;
            } else {
              //Reference properties
              if (nameProperty === "Reference properties") {
                referenceProp = infoPropertyJoint;
                nameRefProp = nameProperty;
              } else {
                linkRef = infoPropertyJoint;
              }
            }
          });
        }
        if (
          nameRefProp !== null &&
          linkRef !== null &&
          referenceProp !== null &&
          refPedigree !== null &&
          nameRefPed !== null
        ) {
          //Function to correctly introduce the references of the properties
          introduceReferenceProperties(
            refPedigree,
            nameRefPed,
            nameRefProp,
            referenceProp,
            linkRef
          );
        }
      });
      newElement.appendChild(infoSelNode);
    });
    traits.innerHTML = newElement.innerHTML;

    if (traits.textContent === "") {
      selectTraits.innerHTML = "";
      selectTraits.style.padding = "0rem";
      introSelect.innerHTML = "";
      traits.style.padding = "0rem";
    } else if (
      document.getElementById("select-traits").children.length >= 1 ||
      document.getElementById("traits-info-intro").children.length >= 1
    ) {
      selectTraits.innerHTML = "";
      introSelect.innerHTML = "";
      selectTraits.appendChild(newSelect);
      introSelect.appendChild(newIntroSelect);
    } else {
      selectTraits.appendChild(newSelect);
      introSelect.appendChild(newIntroSelect);
    }

    //Function to download the csv data of the selected nodes
    const csvData = objectToCsv(namesSelectedNodes);
    downloadAllInfo(csvData, "Download CSV - Selected Nodes");
  });
}

//Click single or multiple selection of links (when clicked, coloured in yellow).
function onClickLink(link, markerArrow) {
  link.on("click", function (event, d) {
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      selectedLinks.has(d) ? selectedLinks.delete(d) : selectedLinks.add(d); // multi-selection
    } else {
      const untoggle = selectedLinks.has(d) && selectedLinks.size === 1; // single-selection
      selectedLinks.clear();
      !untoggle && selectedLinks.add(d);
    }

    if (d3.select(this).classed("selected")) {
      d3.select(this).classed("selected", false).attr("stroke", linkStroke);
      markerArrow.attr("fill", markerStroke);
      markerArrow
        .filter(function (link) {
          for (linkFiltered of filtLinks) {
            if (link.indexRel === linkFiltered) {
              return link;
            }
          }
        })
        .attr("fill", markerColFilt); //Colour if the link is selected
      link
        .filter(function (link) {
          for (linkFiltered of filtLinks) {
            if (link.indexRel === linkFiltered) {
              return link;
            }
          }
        })
        .attr("stroke", markerColFilt); //Colour always the links filtered in blue
    } else {
      link.filter((link) => {
        if (selectedLinks.has(link)) {
          d3.select(this).classed("selected", true).attr("stroke", strokeCol);
          markerArrow
            .filter((marker) => {
              if (marker.index === link.index) {
                console.log(marker.index, link.index);
                return marker;
              }
            })
            .attr("fill", strokeCol); //Colour the link as default if unselected
        }
      });
    }
  });
}

//Handle invalidation
function handleInvalidation(invalidation, simulation) {
  if (invalidation != null) {
    invalidation.then(() => simulation.stop());
  }
}

//Function to obtain the intern values
function intern(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

//Function for positioning and ticking nodes and links
function commonTicked(labelNode, labelLink, labelLink2, link, node) {
  labelNode.attr("x", (d) => d.x).attr("y", (d) => d.y + 0.5);
  labelLink
    .attr("x", function (d) {
      if (d.target.x > d.source.x) {
        return d.source.x + (d.target.x - d.source.x) / 2;
      } else {
        return d.target.x + (d.source.x - d.target.x) / 2;
      }
    })
    .attr("y", function (d) {
      if (d.target.y > d.source.y) {
        return d.source.y + (d.target.y - d.source.y) / 1.8;
      } else {
        return d.target.y + (d.source.y - d.target.y) / 1.8;
      }
    });
  labelLink2
    .attr("x", function (d) {
      if (d.target.x > d.source.x) {
        return d.source.x + (d.target.x - d.source.x) / 2;
      } else {
        return d.target.x + (d.source.x - d.target.x) / 2;
      }
    })
    .attr("y", function (d) {
      if (d.target.y > d.source.y) {
        return d.source.y + (d.target.y - d.source.y) / 1.8;
      } else {
        return d.target.y + (d.source.y - d.target.y) / 1.8;
      }
    });
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node
    .attr(initialShapeCoordinates[0], (d) => d.x - finalShapeCoord[0])
    .attr(initialShapeCoordinates[1], (d) => d.y - finalShapeCoord[1]);
}

//Function for moving the nodes when dragged
function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

/////For specific pedigrees + hierarchical only
//Global Variables
var relationships2 = [];
const uniqueRel = new Set();
let links2 = [];

//Update links with unique specific relationships
function specificLinks(links) {
  links.forEach((elements) => {
    var relElement = elements.relationship;
    relElement.forEach((relElem) => {
      relationships2.push(relElem);
    });
  });

  var filteredRel = relationships2.filter((el) => {
    const duplicate = uniqueRel.has(el.identity.low);
    uniqueRel.add(el.identity.low);
    return !duplicate;
  });

  filteredRel.forEach((rel) => {
    var startRel = rel.start.low;
    var endRel = rel.end.low;
    var relationship = rel.type;

    var linksNew = {
      source: startRel,
      target: endRel,
      relationship: relationship,
    };
    links2.push(linksNew);
  });
}

//Write the literature of the graph
function papers(speciesSel) {
  var paperApple = document.getElementById("paperApple");
  var paperAlmond = document.getElementById("paperAlmond");
  var paperPear = document.getElementById("paperPear");
  var paperGrapevine = document.getElementById("paperGrapevine");
  var paperPeach = document.getElementById("paperPeach");

  //Papers for each species added to PERSEUS
  let papers = [paperApple, paperPear, paperPeach, paperAlmond, paperGrapevine];
  var speciesName = [
    "name-apple-latin",
    "name-pear-latin",
    "name-peach-latin",
    "name-almond-latin",
    "name-grapevine-latin",
  ];
  var speciesLatin = ["Apple", "Pear", "Peach", "Almond", "Grapevine"];
  var speciesVariant = [
    "Apple_variant",
    "Pear_variant",
    "Peach_variant",
    "Almond_variant",
    "Grapevine_variant",
  ];

  function spliceOtherPapers(indexPaper) {
    papers.splice(indexPaper, 1);
    papers.forEach((paper) => {
      paper.style.display = "none";
    });
  }

  speciesVariant.forEach((species1) => {
    if (species1 === speciesSel) {
      var indexSpecies = speciesVariant.indexOf(species1);
      var idSpecies = document.getElementById("species");
      idSpecies.innerHTML = speciesLatin[indexSpecies];
      var idSpeciesLatin = document.getElementById(speciesName[indexSpecies]);
      idSpeciesLatin.style.display = "block";
      spliceOtherPapers(indexSpecies);
    }
  });
}

//////Only used when the user uploads pedigree data
///Upload users pedigree data
function uploadUserPedigreeData(
  uploadDocForm,
  dataFileUploaded,
  gData,
  ForceGraph,
  chart
) {
  //AddEventListener for the update form of the .csv documents
  uploadDocForm.addEventListener("submit", function (e) {
    //Create a new variable and copy the original general data (gData)
    var gData2;
    gData2 = gData;

    userDataAllFiles = [];
    tableUser.innerHTML = "";
    e.preventDefault();
    fileList = [];

    //Push on the same array all the uploaded files (multiple files can be uploaded at the same time)
    for (var i = 0; i < dataFileUploaded.files.length; i++) {
      fileList.push(dataFileUploaded.files[i]);
    }
    //In case no document has been uploaded, the submit will give an alert.
    if (fileList.length === 0) {
      alert("File list is empty");
      return;
    } else {
      //If a document has been uploaded, the function can continue
      //Store and use the data from each file
      fileList.forEach((file) => {
        //Check if the document is not empty and has a name, if not, return the function
        if (file && file.name) {
          //Obtain the file type
          var fileType = file.name.slice(
            ((file.name.lastIndexOf(".") - 1) >>> 0) + 2
          );

          console.log(fileType);
          //Make sure the uploaded document is on the preferred .csv format
          if (fileType.toLowerCase() !== "csv") {
            alert("Please upload a valid CSV file.");
          } else {
            const reader = new FileReader(); //Read the file

            reader.onload = function (e) {
              const fileReaderResult = e.target.result;

              Papa.parse(fileReaderResult, {
                complete: function (result) {
                  const csvData = result.data;
                  userDataAllFiles.push(csvData);

                  //Obtain the data headers
                  let dataHeadersName = Object.keys(csvData[0]);
                  let fileName = document.createElement("p");
                  fileName.innerHTML = "File name: " + file.name;
                  fileName.style.fontWeight = "bold";

                  //Create an HTML table to render the uploaded user data
                  let tableDiv = document.createElement("div");
                  tableDiv.id = "table-user-div";
                  let tableDataUser = document.createElement("table");
                  let headerRowUser = document.createElement("tr");
                  dataHeadersName.forEach((header) => {
                    let headerName = document.createElement("th");
                    headerName.id = "headerTable";
                    let textNode = document.createTextNode(header);
                    headerName.appendChild(textNode);
                    headerRowUser.appendChild(headerName);
                  });

                  headerRowUser.firstChild.className = "firstHeader";
                  tableDataUser.appendChild(headerRowUser);

                  //Create a variable for the user data
                  var gDataUser = {
                    nodes: [],
                    links: [],
                  };

                  var resultObjectProp;

                  //For each csv, get the information from each individual (node)
                  csvData.forEach((indiv, i) => {
                    let dataUserEachIndiv = Object.values(indiv);

                    //Upload on the table the information by individuals (each now)
                    let rowTrait = document.createElement("tr");
                    dataUserEachIndiv.forEach((trait) => {
                      let cellTrait = document.createElement("th");
                      let textNode = document.createTextNode(trait);
                      cellTrait.appendChild(textNode);
                      rowTrait.appendChild(cellTrait);
                    });
                    tableDataUser.appendChild(rowTrait);

                    //Divide the properties from the rest of the information
                    const { Name, Offsprings, Parents, ...gDataUserProp } =
                      indiv;

                    //Store the parents of the node
                    var gDataUserParents = indiv.Parents;
                    //Store the offsprings of the node
                    var gDataUserOffsprings = indiv.Offsprings;

                    //Create an object of properties
                    const propertiesUser = Object.keys(gDataUserProp);
                    const initialObjectProp = {};
                    resultObjectProp = propertiesUser.reduce((obj, key) => {
                      obj[key] = "Undefined";
                      return obj;
                    }, initialObjectProp);

                    //Create an object for the node, following the same structure as in gData.
                    nodeInd = {
                      caption: indiv.Name,
                      id: `U${i}`,
                      label: `${Object.values(gData2)[0][0]["label"]}`,
                      links: [],
                      properties: gDataUserProp,
                      offsprings: gDataUserOffsprings,
                      parents: gDataUserParents,
                    };

                    Object.values(gDataUser)[0].push(nodeInd); //push the node on gDataUser
                  });

                  //Variables array useful for correctly storing and using the user data
                  var otherOffsprings = []; //new offsprings data (not in gData)
                  var otherParents = []; //new parents data (not in gData)
                  var sameNodesData = []; //repeated nodes between gData and gDataUser
                  var otherNodesData = []; //new nodes on gDataUser
                  var idData = []; //nodes' id from gData
                  var idDataUser = []; //nodes' id from gDataUser
                  var gDataUserNodesOff = []; //offsprings of gDataUser nodes
                  var gDataUserNodesParents = []; //parents of gDataUser nodes
                  var newNodesUnique = []; //new nodes
                  var newNodesUniqueId = []; //new nodes' ids

                  //Keep on an array the id values for the general data (idData)
                  gData2.nodes.forEach((node) => {
                    if (!idData.includes(node.id)) {
                      idData.push(node.id);
                    }
                  });
                  //Look for the highest id on the general data (idData).
                  maxIdData = Math.max(...idData);

                  //Keep on an array the id values for the user data (idDataUser)
                  gDataUser.nodes.forEach((nodeUser, i) => {
                    if (!idDataUser.includes(nodeUser.id)) {
                      var newIdUser = maxIdData + i + 1;
                      nodeUser.id = newIdUser;
                      idDataUser.push(nodeUser.id);
                    }

                    //Search if within the general gData already exist the nodes uploaded by the user
                    gData2.nodes.find((node) => {
                      //If they have the same caption (name), we consider it is the same individual
                      if (node.caption === nodeUser.caption) {
                        nodeUser.id = node.id; //To merge both data, we change the id of the user node to the general (gData) id of the node.
                      }
                    });

                    // Array of its offsprings, add to the node
                    var offspringsUser = nodeUser.offsprings.split(",");
                    nodeUser.offsprings = offspringsUser;
                    // Array of its parents, add to the node
                    var parentsUser = nodeUser.parents.split(",");
                    nodeUser.parents = parentsUser;
                  });

                  //Look for the highest id on the user data (idDataUser).
                  var maxIdDataUser = Math.max(...idDataUser);

                  //Do a search through the user dataset node by node to keep all the relevant information.
                  gDataUser.nodes.forEach((nodeUser, i) => {
                    gData2.nodes.find((node) => {
                      //Map through the offsprings of the node to see if any node is already on the general data.
                      nodeUser.offsprings.map((off, y) => {
                        if (off === node.caption) {
                          nodeUser.offsprings[y] = node.id;
                        } else if (off === "") {
                          nodeUser.offsprings[y] = undefined;
                        }
                      });
                      //Map through the parents of the node to see if any node is already on the general data.
                      nodeUser.parents.map((parent, y) => {
                        if (parent === node.caption) {
                          nodeUser.parents[y] = node.id;
                        } else if (parent === "") {
                          nodeUser.parents[y] = undefined;
                        }
                      });
                    });
                    //We separate the offpsrings to which we changed the id and are on general data from the new offpsrings.
                    nodeUser.offsprings.forEach((off) => {
                      if (typeof off !== "number" && off !== undefined) {
                        if (!otherOffsprings.includes(off)) {
                          otherOffsprings.push(off);
                        }
                      }
                    });

                    //We create an id for the new offsprings, consecutive to the highest gDataUser id.
                    for (z = 0; z < otherOffsprings.length; z++) {
                      var offspringNew = maxIdDataUser + z + 1;
                      nodeUser.offsprings.map((off, y) => {
                        if (nodeUser.offsprings[y] === otherOffsprings[z]) {
                          var offspringNewNode = {
                            caption: nodeUser.offsprings[y],
                            id: offspringNew,
                            label: `${Object.values(gData2)[0][0]["label"]}`,
                            links: [],
                            properties: resultObjectProp,
                            offsprings: [],
                            parents: [],
                          };
                          nodeUser.offsprings[y] = offspringNew;
                          gDataUserNodesOff.push(offspringNewNode); //Create an array with the new offsprings
                        }
                      });
                      if (!idDataUser.includes(offspringNew)) {
                        idDataUser.push(offspringNew); //keep the new offsprings ids
                      }
                    }

                    //We separate the parents to which we changed the id and are on general data from the new parents.
                    nodeUser.parents.forEach((parent) => {
                      if (typeof parent !== "number" && parent !== undefined) {
                        if (!otherParents.includes(parent)) {
                          otherParents.push(parent);
                        }
                      }
                    });
                  });

                  //Look for the highest id on the gDataUser (idDataUser), with the updated values.
                  var maxIdDataUser2 = Math.max(...idDataUser);

                  //We create an id for the new parents, consecutive to the highest gDataUser.
                  gDataUser.nodes.forEach((nodeUser, i) => {
                    for (z = 0; z < otherParents.length; z++) {
                      var parentNew = maxIdDataUser2 + z + 1;
                      nodeUser.parents.map((parent, y) => {
                        if (
                          nodeUser.parents[y] === otherParents[z] &&
                          !gDataUserNodesOff //Avoid duplications between new offsprings and parents
                            .map((newNode) => newNode.caption)
                            .includes(nodeUser.parents[y])
                        ) {
                          var parentNewNode = {
                            //create the new parent node
                            caption: nodeUser.parents[y],
                            id: parentNew,
                            label: `${Object.values(gData2)[0][0]["label"]}`,
                            links: [],
                            properties: resultObjectProp,
                            offsprings: [],
                            parents: [],
                          };
                          nodeUser.parents[y] = parentNew;
                          gDataUserNodesParents.push(parentNewNode); //Create array for new parents
                        }
                      });
                      if (!idDataUser.includes(parentNew)) {
                        idDataUser.push(parentNew); //Add the new ids to the data user IDs list
                      }
                    }

                    //concatenate the new parents and offsprings nodes
                    var gDataUserNodesOffAndParents = gDataUserNodesOff.concat(
                      gDataUserNodesParents
                    );

                    //keep hte new parents and offsprings ids and nodes
                    gDataUserNodesOffAndParents.forEach((newNode) => {
                      if (!newNodesUniqueId.includes(newNode.id)) {
                        newNodesUniqueId.push(newNode.id);
                        newNodesUnique.push(newNode);
                      }
                    });
                  });

                  //Again, we check if with the new data are there any know ids on the parents and offsprings.
                  gDataUser.nodes.forEach((nodeUser) => {
                    newNodesUnique.find((newNode, y) => {
                      //In offsprings
                      nodeUser.offsprings.map((off, z) => {
                        if (off === newNode.caption) {
                          nodeUser.offspring[z] = newNode.id;
                        } else if (off === "") {
                          nodeUser.offspring[z] = undefined;
                        }
                      });

                      //In parents
                      nodeUser.parents.map((parent, z) => {
                        if (parent === newNode.caption) {
                          nodeUser.parents[z] = newNode.id;
                        } else if (parent === "") {
                          nodeUser.offspring[z] = undefined;
                        }
                      });
                    });

                    //Create the links for the offsprings and store them on the nodes and the links array
                    nodeUser.offsprings.map((off, y) => {
                      if (off !== undefined) {
                        var linksInd = {
                          target: nodeUser.offsprings[y],
                          source: nodeUser.id,
                          relationship: "U",
                        };
                        nodeUser.links.push(linksInd);
                        Object.values(gDataUser)[1].push(linksInd);
                      }
                    });

                    //Create the links for the parents and store them on the nodes and the links array
                    nodeUser.parents.map((parent, y) => {
                      if (parent !== undefined) {
                        linksInd = {
                          target: nodeUser.id,
                          source: nodeUser.parents[y],
                          relationship: "U",
                        };
                        nodeUser.links.push(linksInd);
                        Object.values(gDataUser)[1].push(linksInd);
                      }
                    });

                    //find the unique nodes that have not appeared in the aprents and offsprings
                    newNodesUnique.find((newNode) => {
                      nodeUser.links.forEach((link) => {
                        if (
                          link.source === newNode.id &&
                          !newNode.links.includes(link)
                        ) {
                          newNode.links.push(link);
                        } else if (
                          link.target === newNode.id &&
                          !newNode.links.includes(link)
                        ) {
                          newNode.links.push(link);
                        }
                      });
                    });
                  });

                  //Append the new nodes to gDataUser
                  gDataUser.nodes = gDataUser.nodes.concat(newNodesUnique);

                  //For each node
                  gDataUser.nodes.find((nodeUser) => {
                    delete nodeUser.offsprings; //Delete offsprings array (we already added this information on the links)
                    delete nodeUser.parents; //Delete parents array (we already added this information on the links)
                    gData2.nodes.forEach((node) => {
                      //compare the gDataUser to the gData2 (general data)
                      if (node.caption === nodeUser.caption) {
                        // Create a set of existing source and target IDs
                        const existingSourceIds = new Set(
                          node.links.map((link) => link.source)
                        );
                        const existingTargetIds = new Set(
                          node.links.map((link) => link.target)
                        );

                        // Filter out links that already exist in node.links (from the general data)
                        const newLinksUser = nodeUser.links.filter(
                          (linkUser) => {
                            return (
                              !existingSourceIds.has(linkUser.source) ||
                              !existingTargetIds.has(linkUser.target)
                            );
                          }
                        );

                        // Add new links to the node
                        node.links = node.links.concat(newLinksUser);

                        // Add new links to gData2.links if they don't exist
                        newLinksUser.forEach((linkUser) => {
                          if (!gData2.links.includes(linkUser)) {
                            Object.values(gData2)[1].push(linkUser);
                          }
                        });
                        if (!sameNodesData.includes(node)) {
                          sameNodesData.push(nodeUser);
                        }
                      }
                    });
                  });

                  //Append the links that were from new user data nodes.
                  otherNodesData = gDataUser.nodes.filter((nodeUser) => {
                    if (!sameNodesData.includes(nodeUser)) {
                      var newLinksUser = nodeUser.links.filter((linkUser) => {
                        return linkUser;
                      });
                      newLinksUser.forEach((linkUser) => {
                        if (!gData2.links.includes(linkUser)) {
                          Object.values(gData2)[1].push(linkUser);
                        }
                      });
                    }
                    return !sameNodesData.includes(nodeUser);
                  });

                  //Append new nodes on the general data
                  gData2.nodes = gData2.nodes.concat(otherNodesData);

                  ///Know if the nodes have more than two parents (when adding the user data) and store these values
                  gData2.nodes.find((node) => {
                    var linksTarget = [];
                    node.links.find((link) => {
                      if (link.target === node.id) {
                        linksTarget.push(link);
                      }
                    });
                    if (linksTarget.length > 2) {
                      var tooManyTargetNode = {
                        node: node.id,
                        links: linksTarget,
                      };
                      tooManyParents.push(tooManyTargetNode);
                    }
                  });

                  //Add new properties of the userdata to the general data and viceversa
                  var propertiesDataGeneral = Object.keys(
                    gData2.nodes[0].properties
                  );
                  var propertiesDataUser = Object.keys(
                    gDataUser.nodes[0].properties
                  );
                  var allProperties =
                    propertiesDataGeneral.concat(propertiesDataUser);
                  gData2.nodes.forEach((node) => {
                    allProperties.forEach((property) => {
                      if (!(property in node.properties)) {
                        node.properties[property] = "Undefined";
                      } else if (property in propertiesDataUser) {
                        gDataUser.nodes.forEach((nodeUser) => {
                          if (node.id === nodeUser.id) {
                            node.properties[property] =
                              nodeUser.properties[property];
                            (node.properties["Reference_properties"] =
                              node.properties["Reference_properties"]),
                              "User Data"; //Store the reference of user data
                          }
                        });
                      }
                    });
                    if (node.id > maxIdData) {
                      node.properties["Record_pedigree"] = "User Data";
                      if (
                        (node.properties["Reference_properties"] = "Undefined")
                      ) {
                        node.properties["Reference_properties"] = "User Data"; //Store the reference of user data
                      }
                    }
                  });

                  console.log(gData2.nodes);

                  //Append the table of new data to HTML
                  tableUser.appendChild(fileName);
                  tableDiv.appendChild(tableDataUser);
                  tableUser.appendChild(tableDiv);
                  tableUser.style.display = "none";

                  // Create a copy of the child nodes from the CustomizeBar selection (Personalize the visualization)
                  console.log(customizeBar);
                  const childNodesCopy = Array.from(customizeBar.childNodes);
                  // Remove all child nodes
                  customizeBar.innerHTML = "";
                  // Add back the <span> elements
                  childNodesCopy.forEach((childNode) => {
                    if (
                      childNode.tagName &&
                      childNode.tagName.toLowerCase() === "span"
                    ) {
                      customizeBar.appendChild(childNode.cloneNode(true));
                    }
                  });

                  d3.select("#firstG").selectAll("*").remove(); //remove previous graph from 2Dgraph-discover and 2Dgraph-discover-specific
                  d3.select("#secondG").selectAll("*").remove(); //remove previous graph from graph-hierarchical

                  delete chart;

                  //In case we don't render a hierarchic graph, remove this variable
                  var secondG = document.getElementById("secondG");
                  if (secondG !== null) {
                    secondG.remove();
                  }

                  //Render the graph with gData + gDataUser (gData2)
                  chart2 = ForceGraph(gData2, {
                    nodeId: (d) => d.id,
                    nodeCaption: (d) => d.caption,
                    nodeLabel: (d) => d.label,
                  });

                  //In case the hierarchical graph is needed, render it. If not, avoid.
                  if (secondG !== null) {
                    hierarchical();
                  }

                  //Change the innerHTML Name of the Download Csv Button with only general data. Automatically, the function adds a second button with the gData + UserData that can be downloaded altogether.
                  var nameButtonDownloadCsv =
                    document.getElementById("buttonDownloadAll");

                  nameButtonDownloadCsv.innerHTML =
                    "Download CSV - Nodes (Without User Data)";
                },
                header: true,
                skipEmptyLines: "greedy",
              });
              return userDataAllFiles;
            };
            reader.readAsText(file);
            return userDataAllFiles;
          }
        } else {
          alert("File or file name is undefined");
          return;
        }
      });
      seeUploadData.style.display = "block";
    }
  });
}
