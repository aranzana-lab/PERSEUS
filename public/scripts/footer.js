//Element on FrontEnd
const myButton = document.getElementById("scrollBtn");

//Scroll down
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myButton.style.display = "block";
  } else {
    myButton.style.display = "none";
  }
}

//Top Scroll
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}