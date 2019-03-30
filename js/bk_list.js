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
        .addClass('btn').addClass('btn-default').addClass(key);
    var row = $('<tr>').append($('<td>').text(key))
        .append($('<td>').append(link))
        .append($('<td>').append(button));
    body.append(row);
  };

  table.append(body);
  $('#bktable').append(table);

  // Add the event handlers to call the deletion of the link
  for(var key in bookmarks) {
      console.log(key);
      if (key != null && key != '') {
        $('.' + key).click({param: key}, deleteLink);
      }
  }
};

// Sends message to the background to delete the link
function deleteLink(event) {
  console.log('Deleting ' + event.data.param);
  // delBookmark(event.data.param);
  chrome.runtime.sendMessage({command: "delete", key: event.data.param});
  // console.log(event.data.param);
};

// Deletes an existing bookmark
function delBookmark(keyword) {
  chrome.storage.sync.get('bookmark_list', function(results) {
    var bookmarkList = results['bookmark_list'];
    if (bookmarkList[keyword] != null) {
      var proceed =
          confirm('Are you sure you want to delete "' + keyword + '"?');
      if (proceed == true) {
        delete bookmarkList[keyword];
        chrome.storage.sync.set({'bookmark_list': bookmarkList}, function() {
          alert('Keyword "' + keyword + '" removed!');
        });
      };
    } else {
      alert('Keyword "' + keyword + '" not found!');
    }
  });
}

dispBookmarks();
