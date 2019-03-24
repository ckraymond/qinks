// Qinks
// Content - Popup dialog with list of bookmarks
// Author: Colin Raymond (colin.k.raymond@gmail.com)

console.log("Getting the list of bookmarks");

// Parent functions that retrieves bookmarks and displays them
function dispBookmarks() {
  chrome.storage.sync.get('bookmark_list', function(results) {
    var bookmarkList = results['bookmark_list'];
    var keywords = Object.keys(bookmarkList);

    makeTable(bookmarkList);
  });
}

// Actually displays the bookmarks on the screen
function makeTable(bookmarks) {
  var table = $('<table>').addClass('table');
  var header = $('<thead>').append(
      $('<tr>').append($('<th>').text('Keyword'))
      .append($('<th>').text('URL')));
  table.append(header);

  var body = $('<tbody>');

  for(var key in bookmarks) {
    var link = $('<a>').attr('href',bookmarks[key])
        .attr('target','_blank').text(bookmarks[key]);
    var row = $('<tr>').append($('<td>').text(key))
        .append($('<td>').append(link))
    body.append(row);
  };

  table.append(body);
  $('#bktable').append(table);
};

dispBookmarks();
