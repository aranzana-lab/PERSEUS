//Open Navigator Function - colours background
function openNav() {
  document.body.style.backgroundColor = "rgba(253, 250, 250)";
  document.querySelector(".main-navs-links").style.transform = "translateX(0%)";
  document.getElementById("main1").style.opacity = "0.6";
  document.getElementById("index-video").style.opacity = "0.6";
}

//Close Navigator Function - colours background
function closeNav() {
  document.body.style.backgroundColor = "rgb(230, 231, 238)";
  document.querySelector(".main-navs-links").style.transform =
    "translateX(100%)";
  document.getElementById("main1").style.opacity = "1";
  document.getElementById("index-video").style.opacity = "1";
}

//Scrolling down the options inside the nav
function dropdown() {
  var dropdown = document.querySelector("dropdown-btn");
  var i;
  for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var dropdownContent = this.nexElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    });
  }
}

window.addEventListener("scroll", function () {
  var header = document.getElementById("main-header");
  var logo = document.getElementById("logo");
  header.classList.toggle("sticky", window.scrollY > 0);
  logo.classList.toggle("sticky", window.scrollY > 0);
});
