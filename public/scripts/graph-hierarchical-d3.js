//Function to generate the hierarchic view of the specific pedigree searches
function hierarchical() {
  ///Function that creates and renders the graph visualization. This function contains plenty of common functions shared between 2D-graph-discover, 2D-graph-discover-specific-d3, and graph-hierarchical-d3
  function ForceGraph(
    { nodes, links },
    {
      invalidation,
      linkRel = ({ relationship }) => relationship,
      linkSource = ({ source }) => source,
      linkStrokeWidth = 0.8,
      linkStrokeOpacity = 0.8,
      linkStrokeLinecap = "round",
      linkStrength,
      linkTarget = ({ target }) => target,
      nodeCaption,
      nodeId = (d) => d.id,
      nodeLabel,
      nodeLabels,
      nodeLinks = ({ links }) => links,
      nodeNeighbors = ({ neighbors }) => neighbors,
      nodeProperties = ({ properties }) => properties,
      nodeRadius = 6.5,
      nodeStrength,
      nodeStrokeWidth = 0.7,
      nodeStrokeOpacity = 1,
    }
  ) {
    //compute general values
    const N = d3.map(nodes, nodeId);
    const NB = d3.map(nodes, nodeNeighbors);
    const NC = nodeCaption == null ? null : d3.map(nodes, nodeCaption);
    const NL = d3.map(nodes, nodeLinks);
    const NP = d3.map(nodes, nodeProperties);
    const NLB = nodeLabel == null ? null : d3.map(nodes, nodeLabel).map(intern);
    const LR = d3.map(links, linkRel).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);

    nodeCap(nodeCaption, N); //Function if nodeCaption is undefined

    //Replace input nodes and links with mutable objects
    nodes = d3.map(nodes, (_, i) => ({
      id: N[i],
      name: NC[i],
      label: NLB[i],
      properties: NP[i],
      neighbors: NB[i],
      links: NL[i],
    }));

    deleteNameProp(nodes); //Function to delete name of node inside properties.

    links = d3.map(links, (_, i) => ({
      source: LS[i],
      target: LT[i],
      relationship: LR[i],
      indexRel: LS[i] + "_" + LT[i],
    }));

    //Compute default domains
    defaultDomains(NLB, nodeLabels); //sort by NLB if the nodeLabels are undefined

    //FiltSelfingLinks are not defined here because they are already defined in 2Dgraph-discover-specific-d3.js
    //Download CSV of all nodes is not here because it is already defined in 2Dgraph-discover-specific-d3.js

    //construct the forces
    forceNode.strength(-1000); //Force of the nodes

    const forceLink = d3 //Force of the links
      .forceLink(links)
      .id(({ index: i }) => N[i])
      .distance(5);

    nodeLinkStrength(forceNode, nodeStrength, forceLink, linkStrength); //Catch if node and link strengths are defined

    //Graph simulation
    var radius = 2;
    var simulation = startSimulation(
      nodes,
      forceLink,
      forceNode,
      ticked,
      radius
    )
      .force("x", d3.forceX(0).strength(0.1))
      .force("y", d3.forceY(0).strength(0.1));

    //initilize svg or grab svg
    var svg = d3
      .select("#graph-hierarchical")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 6, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; height: intrinsic; display: none"
      )
      .style("background", backgroundCol)
      .call(
        d3.zoom().on("zoom", function (event) {
          svg.attr("transform", event.transform);
        })
      )
      .append("g")
      .attr("id", "secondG");

    //arrows for links
    var markerArrow = createMarkerArrow(
      svg,
      links,
      (d, i) => `${i}_2`,
      markerStroke
    );
    markerArrowFiltSelfing(markerArrow);

    //links
    var link = createLink(
      svg,
      linkStroke,
      linkStrokeOpacity,
      linkStrokeWidth,
      linkStrokeLinecap,
      links,
      (d, i) => `url(${new URL(`#${i}_2`, location)})`
    );
    linkFiltSelfing(link);

    //Colour in red the links added by the user in case they give different information abou the parents compared to the info already available on the general Data
    linkExtraParents(link, markerArrow);

    //Background label links
    var labelLink = createLabelLink1(svg, links, linkStroke);

    //Label links
    var labelLink2 = createLabelLink2(svg, links, labelFill);

    //nodes
    var node = createNodes(
      svg,
      nodes,
      nodeRadius,
      nodeStrokeOpacity,
      nodeStrokeWidth,
      simulation
    );

    //Nodes' labels
    var labelNode = createLabelNodes(svg, nodes);
    appendTitle(NC, node);

    /////Colour the individual searched for the specific pedigree. Leave it with a different colour always.
    searchedIndiv(indiv1, node, labelNode);

    ///Colour - search individuals on the general pedigree
    var getListSelIndiv2 = document.getElementById("searchInd-hier");
    var selectedOptions2 = document.getElementById("alreadySelectedInd-hier");
    getListSelIndiv2.style.display = "none";
    selectedOptions2.style.display = "none";

    colourSelectedInd(
      getListSelIndiv2,
      selectedOptions2,
      nodes,
      node,
      labelNode,
      indiv1
    );

    // Personalize the pedigree
    //Personalize the colours pedigree
    var customizeBar2 = document.getElementById(
      "customize-pedigree-search-hier"
    );
    customizeBar2.width = "20rem";

    //Put first the custom bars for the hierarchical graph as display = none
    var customHier = document.getElementById("custom-hier");
    customHier.style.display = "none";

    //Background colour
    buttonsBackgroundColInfo[3] = "buttonBackCol1_";

    createBakgroundPers(customizeBar2);
    createCol(
      buttonsBackgroundColInfo[0],
      buttonsBackgroundColInfo[1],
      buttonsBackgroundColInfo[2],
      buttonsBackgroundColInfo[3],
      buttonsBackgroundColInfo[4],
      customizeBar2
    );

    //Nodes Size
    createSliderSize(customizeBar2, node, markerArrow);

    //Nodes colour
    ///create a for loop for creating three different colour bars
    ////Object that contains the variables and names of the variables
    createSliderColor(customizeBar2, node);

    //TextColour
    var buttonsNodesColInfo4 = "buttonTextCol1_";

    let buttonsLinksColInfo = [
      ["Color", "linkColDiv", "linkDiv", "buttonLinkCol1_", colsGeneral],
      [
        "Color Text",
        "linkColDiv",
        "linkDiv",
        "buttonLinkTextCol1_",
        colsGeneral,
      ],
    ];

    createCol(
      buttonsNodesColInfo[0],
      buttonsNodesColInfo[1],
      buttonsNodesColInfo[2],
      buttonsNodesColInfo4,
      buttonsNodesColInfo[4],
      customizeBar2
    );

    //Links colour and colour text
    createLinksPers(customizeBar2); //Create a links sub-division in the personalize visualization button
    //Link width
    createSliderWidthLink(customizeBar2, link, linkStrokeWidth);

    for (div of buttonsLinksColInfo) {
      var personalizedText1 = div[0];
      var personalizedText2 = div[1];
      var personalizedText3 = div[2];
      var personalizedText4 = div[3];
      var personalizedText5 = div[4];
      createCol(
        personalizedText1,
        personalizedText2,
        personalizedText3,
        personalizedText4,
        personalizedText5,
        customizeBar2
      );
    }

    //Hihglight colours
    buttonsHighlightColInfo[3] = "buttonHighCol1_";
    createHighlightPers(customizeBar2);
    createCol(
      buttonsHighlightColInfo[0],
      buttonsHighlightColInfo[1],
      buttonsHighlightColInfo[2],
      buttonsHighlightColInfo[3],
      buttonsHighlightColInfo[4],
      customizeBar2
    );

    //Functions for each button (node text colour, link colour, and link text colour)
    var buttonTextCol0 = d3.select("#buttonTextCol1_0");
    var buttonTextCol1 = d3.select("#buttonTextCol1_1");
    var buttonLinkCol0 = d3.select("#buttonLinkCol1_0");
    var buttonLinkCol1 = d3.select("#buttonLinkCol1_1");
    var buttonLinkTextCol0 = d3.select("#buttonLinkTextCol1_0");
    var buttonLinkTextCol1 = d3.select("#buttonLinkTextCol1_1");
    var buttonBackgroundCol0 = d3.select("#buttonBackCol1_0");
    var buttonBackgroundCol1 = d3.select("#buttonBackCol1_1");
    var buttonBackgroundCol2 = d3.select("#buttonBackCol1_2");
    var graph = document.getElementById("graph-hierarchical");
    var buttonHighlightCol0 = d3.select("#buttonHighCol1_0");
    var buttonHighlightCol1 = d3.select("#buttonHighCol1_1");
    var buttonHighlightCol2 = d3.select("#buttonHighCol1_2");
    var buttonHighlightCol3 = d3.select("#buttonHighCol1_3");

    colourButtons(
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
    );

    //Colour the nodes by a selected trait
    var selectByTrait2 = document.getElementById("properties-to-select-2");
    var indPropertyPosition2 = document.getElementById("indProperties-2");
    var selectTraitsHier = document.getElementById(
      "select-by-desired-traits-2"
    );
    selectTraitsHier.style.display = "none";

    propertiesToSelectTrait(
      selectByTrait2,
      indPropertyPosition2,
      nodes,
      node,
      labelNode,
      speciesSel,
      link,
      markerArrow,
      labelLink,
      labelLink2
    );

    //Add highlight functionality when hovering to links and nodes
    onMouseOver(node, link, labelNode);

    //Add functionalities when clicked
    onClickNode(node, labelNode, link, markerArrow, indiv1);
    onClickLink(link, markerArrow);

    //Handle invalidation
    handleInvalidation(invalidation, simulation);

    //other functions
    function ticked() {
      var k = 2 * simulation.alpha();
      link.each(function (d, i) {
        (d.source.y -= k * 2), (d.target.y += k * 55);
      });
      commonTicked(labelNode, labelLink, labelLink2, link, node);
    }
  }

  //Visualize the chart
  chart = ForceGraph(gData, {
    nodeId: (d) => d.id,
    nodeCaption: (d) => d.caption,
    nodeLabel: (d) => d.label,
  });
}
