// Q Links
// Content - Popup dialog with list of bookmarks
// Author: Colin Raymond (colin.k.raymond@gmail.com)

console.log("Getting the list of bookmarks");

function dispBookmarks() {
  chrome.storage.sync.get('bookmark_list', function(results) {
    var bookmark_list = results['bookmark_list'];
    var keywords = Object.keys(bookmark_list);

    for (var key in keywords) {
      document.write(
        "<div>" + key + "</div>"
      )
    };
  });
}
