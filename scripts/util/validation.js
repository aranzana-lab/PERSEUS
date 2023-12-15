
//for the query post
function queryIsValid(name, number) {
  return name && number && name.trim() !== "" && number.trim() !== "";
}

function capitalizeFirstLetterWords(name) {
  const str = name
    .toString()
    .replaceAll(/-/g, " ")
    .replaceAll(/_/g, " ")
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    .replaceAll(" ", "_");
  return str;
}

module.exports = {
  queryIsValid: queryIsValid,
  capitalizeFirstLetterWords: capitalizeFirstLetterWords,
};
