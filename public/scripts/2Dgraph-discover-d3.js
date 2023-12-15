////Pedigree search of a species
//Literature used
papers(speciesSel);

//Session Open + Query Request + Functions from axios
axios
  .post("/perseus/api/general", {
    species: `${speciesSel}`,
  })
  .then(function (response) {
    let result = response.data;
    console.log(result);
    //Info extracted from DB
    function createRel1(relationship) {
      relationship.value = relationship.value.type;
    }
    const links = obtainResultsNeo4j(result, createRel1); //Obtain links from Neo4j results
    //session.close(); //Close session
    consoleLength(links, start); //Console the number of links ambd how much time it needs to load.

    const gData = generateGData(nodes, links); //General Data

    console.log(gData);

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
      const NLB =
        nodeLabel == null ? null : d3.map(nodes, nodeLabel).map(intern);
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

      deleteNameProp(nodes); //Function to delete name of node inside properties

      links = d3.map(links, (_, i) => ({
        source: LS[i],
        target: LT[i],
        relationship: LR[i],
        indexRel: LS[i] + "_" + LT[i],
      }));

      //Compute default domains
      defaultDomains(NLB, nodeLabels); //sort by NLB if the nodeLabels are undefined

      //Filter self-fertilization relationships
      filterSelfing(links);

      //CSV downloadable file of all nodes
      const csvDataAll = downlowadObjectToCsvAll(nodes, links);

      //Function to download the csv of the entire pedigree relationships
      downloadAllInfo(csvDataAll, "Download CSV - All Nodes");

      ///Construct the forces
      forceNode //Force of the nodes
        .theta(0.5)
        .distanceMax(height / 2)
        .strength(-100);

      const forceLink = d3 //Force of the links
        .forceLink(links)
        .id(({ index: i }) => N[i])
        .distance(60);

      nodeLinkStrength(forceNode, nodeStrength, forceLink, linkStrength); //Catch if node and link strengths are defined

      //Graph simulation
      var radius = 10;
      var simulation = startSimulation(
        nodes,
        forceLink,
        forceNode,
        ticked,
        radius
      );

      //arrows for links
      var markerArrow = createMarkerArrow(
        svg,
        links,
        (d, i) => `${i}`,
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
        (d, i) => `url(${new URL(`#${i}`, location)})`
      );

      linkFiltSelfing(link);

      //Colour in red the links added by the user in case they give different information abou the parents compared to the info already available on the general Data
      linkExtraParents(link, markerArrow);

      //Background label links
      var labelLink = createLabelLink1(svg, links, linkStroke);

      //Label links
      var labelLink2 = createLabelLink2(svg, links, labelFill);

      //Nodes
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

      /////Colour - search individuals on the general pedigree
      colourSelectedInd(
        getListSelIndiv,
        selectedOptions,
        nodes,
        node,
        labelNode,
        indiv1
      );

      ////Personalize the pedigree
      customizeBar.width = "20rem";

      //Background colour
      createBakgroundPers(customizeBar);
      createCol(
        buttonsBackgroundColInfo[0],
        buttonsBackgroundColInfo[1],
        buttonsBackgroundColInfo[2],
        buttonsBackgroundColInfo[3],
        buttonsBackgroundColInfo[4],
        customizeBar
      );

      //Nodes Size
      createSliderSize(customizeBar, node, markerArrow);

      //Nodes colour
      createSliderColor(customizeBar, node);

      //TextColour of Nodes
      createCol(
        buttonsNodesColInfo[0],
        buttonsNodesColInfo[1],
        buttonsNodesColInfo[2],
        buttonsNodesColInfo[3],
        buttonsNodesColInfo[4],
        customizeBar
      );

      //Links colour and colour text
      createLinksPers(customizeBar); //Create a links sub-division in the personalize visualization button
      //Link width
      createSliderWidthLink(customizeBar, link, linkStrokeWidth);
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
          customizeBar
        );
      }

      //Hihglight colours
      createHighlightPers(customizeBar);
      createCol(
        buttonsHighlightColInfo[0],
        buttonsHighlightColInfo[1],
        buttonsHighlightColInfo[2],
        buttonsHighlightColInfo[3],
        buttonsHighlightColInfo[4],
        customizeBar
      );

      //Functions for each button (node text colour, link colour, and link text colour)
      var buttonTextCol0 = d3.select("#buttonTextCol0");
      var buttonTextCol1 = d3.select("#buttonTextCol1");
      var buttonLinkCol0 = d3.select("#buttonLinkCol0");
      var buttonLinkCol1 = d3.select("#buttonLinkCol1");
      var buttonLinkTextCol0 = d3.select("#buttonLinkTextCol0");
      var buttonLinkTextCol1 = d3.select("#buttonLinkTextCol1");
      var buttonBackgroundCol0 = d3.select("#buttonBackCol0");
      var buttonBackgroundCol1 = d3.select("#buttonBackCol1");
      var buttonBackgroundCol2 = d3.select("#buttonBackCol2");
      var graph = document.getElementById("graph-2d");
      var buttonHighlightCol0 = d3.select("#buttonHighCol0");
      var buttonHighlightCol1 = d3.select("#buttonHighCol1");
      var buttonHighlightCol2 = d3.select("#buttonHighCol2");
      var buttonHighlightCol3 = d3.select("#buttonHighCol3");

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
      propertiesToSelectTrait(
        selectByTrait,
        indPropertyPosition,
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

      //Select specific nodes
      onClickNode(node, labelNode, link, markerArrow);
      onClickLink(link, markerArrow);

      //Handle invalidation
      handleInvalidation(invalidation, simulation);

      //other functions
      function ticked() {
        //Graph simulation
        commonTicked(labelNode, labelLink, labelLink2, link, node);
      }
    }

    //Visualize the chart
    chart = ForceGraph(gData, {
      nodeId: (d) => d.id,
      nodeCaption: (d) => d.caption,
      nodeLabel: (d) => d.label,
    });

    ///Modify the chart when uploading User's data
    uploadUserPedigreeData(
      uploadDocForm,
      dataFileUploaded,
      gData,
      ForceGraph,
      chart
    );
  });
