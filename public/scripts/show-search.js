// Show and Hide Function for Search Button
//Different show and hides for each one
function block(x) {
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function showAndHide(clicked) {
  let allBtn = document.getElementsByClassName("btn-search");
  let allBtnSpecies = document.getElementsByClassName("species");
  let allBtns;
  let allSect = [];
  if (allBtn.length !== 0) {
    var v = document.getElementById("sectionSearch");
    var w = document.getElementById("sectionSearch3");
    var x = document.getElementById("sectionSearch4");
    var y = document.getElementById("sectionSearch5");
    var z = document.getElementById("table-user");
    allBtns = allBtn;
    allSect.push(v, w, x, y, z);
  } else if (allBtnSpecies.length !== 0) {
    var a = document.getElementById("expl-peach");
    var b = document.getElementById("expl-apple");
    var c = document.getElementById("expl-pear");
    var d = document.getElementById("expl-almond");
    var e = document.getElementById("expl-grape");
    allBtns = allBtnSpecies;
    allSect.push(a, b, c, d, e);
  }

  for (var i = 0; i < allBtns.length; i++) {
    if (allBtns[i].id === clicked) {
      block(allSect[i]);
    } else {
      if (allSect[i].style.display === "block") {
        block(allSect[i]);
      }
    }
  }
}

function showAndHide2() {
  var x = document.getElementById("graph-2d");
  var y = document.getElementById("graph-hierarchical");
  var z = document.getElementById("hier");
  var customBar2d = document.getElementById("custom-2d");
  var customBarHier = document.getElementById("custom-hier");
  var selectTraits2d = document.getElementById("select-by-desired-traits");
  var selectTraitsHier = document.getElementById("select-by-desired-traits-2");
  var getListSelIndiv = document.getElementById("searchInd");
  var selectedOptions = document.getElementById("alreadySelectedInd");
  var getListSelIndiv2 = document.getElementById("searchInd-hier");
  var selectedOptions2 = document.getElementById("alreadySelectedInd-hier");
  if (x.style.display === "block") {
    x.style.display = "none";
    y.style.display = "block";
    customBar2d.style.display = "none";
    customBarHier.style.display = "block";
    selectTraits2d.style.display = "none";
    selectTraitsHier.style.display = "flex";
    getListSelIndiv.style.display = "none";
    getListSelIndiv2.style.display = "flex";
    selectedOptions.style.display = "none";
    selectedOptions2.style.display = "flex";
    z.innerHTML = "Change to network view";
  } else {
    x.style.display = "block";
    y.style.display = "none";
    customBar2d.style.display = "block";
    customBarHier.style.display = "none";
    selectTraits2d.style.display = "flex";
    selectTraitsHier.style.display = "none";
    getListSelIndiv.style.display = "flex";
    getListSelIndiv2.style.display = "none";
    selectedOptions.style.display = "flex";
    selectedOptions2.style.display = "none";
    z.innerHTML = "Change to hierarchical view";
  }
}

//On the project.ejs page, increase the speed of the video
function setPlaySpeed() {
  let videoUserGuide = document.getElementById("index-video");
  videoUserGuide.playbackRate = 10;
}
