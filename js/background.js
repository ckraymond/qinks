// Go Links
// Background scripts
// Author: Colin Raymond (colin.k.raymond@gmail.com)

function updateSheet(text) {
  console.log("Access sheet: " + text);
};

chrome.omnibox.onInputEntered.addListener(
  function(text) {
    switch(text.substring(0,3)) {
      case 'st/':
        updateSheet(text.substring(3));
        break;
      default:
        console.log(text);
    }
  }
);
