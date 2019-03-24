/*!
  * Qinks
  * Content - Popup dialog with list of bookmarks
  * Author: Colin Raymond (colin.k.raymond@gmail.com)
  */

console.log("Getting the list of bookmarks");

// Parent functions that retrieves bookmarks and displays them
function dispBookmarks() {
  chrome.storage.sync.get('bookmark_list', function(results) {
    var bookmarkList = results['bookmark_list'];

    // Check if there are any bookmarks and show them if there are
    if (bookmarkList == null) {
      var text = $('<h4>').append(
        $('<em>').text('No Qinks yet.'));
      $('#bktable').append(text);
    } else {
      makeTable(bookmarkList);
    }
  });
}

// Actually displays the bookmarks on the screen
function makeTable(bookmarks) {
  var table = $('<table>').addClass('table');
  var header = $('<thead>').append(
      $('<tr>').append($('<th>').text('Keyword'))
      .append($('<th>').text('URL'))
      .append($('<th>').text('Action')));
  table.append(header);

  var body = $('<tbody>');

  for(var key in bookmarks) {
    var link = $('<a>').attr('href',bookmarks[key])
        .attr('target','_blank').text(bookmarks[key]);
    var button = $('<button>').text('Delete')
        .addClass('btn').addClass('btn-default').click(deleteLink());
    var row = $('<tr>').append($('<td>').text(key))
        .append($('<td>').append(link))
        .append($('<td>').append(button));
    body.append(row);
  };

  table.append(body);
  $('#bktable').append(table);
};

function deleteLink() {
  alert('Link deleted!');
}

dispBookmarks();
