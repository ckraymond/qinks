/*!
  * Qinks
  * Background script
  * Author: Colin Raymond (colin.k.raymond@gmail.com)
  */

// Get the bookmark list when first initialized
// chrome.runtime.onInstalled.addListener(extInitialize());

// Check to see if user enters anything into the omnibox
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    var command = text.substring(0,2).toLowerCase();

    switch(command) {
      case 's/':  // Save a new bookmark
        var keyword = text.substring(2).toLowerCase();
        addBookmark(keyword);
        break;
      case 'v/':  // View all saved bookmarks
        showBookmarks();
        break;
      case 'd/':  // Delete an existing bookmark
        var keyword = text.substring(2).toLowerCase();
        delBookmark(keyword);
        break;
      default:  // Otherwise try and use the link
        var keyword = text.toLowerCase();
        navigateLink(keyword);
    }
  }
);

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

// Show all bookmarks that are present
function showBookmarks() {
  chrome.tabs.create({
    url: chrome.extension.getURL('html/bk_list.html'),
    active: true
  });
};

// Takes the keyword finds the associated url
function navigateLink(keyword) {
  chrome.storage.sync.get('bookmark_list', function(results) {
    var bookmark_list = results['bookmark_list'];
    var url = bookmark_list[keyword];
    setUrl(url);
  });
};

// Changes the url to the one associated with the bookmarks
function setUrl(new_url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: new_url});
  });
};

// Adds a new bookmark into storage
function addBookmark(keyword) {
  if (keyword == null || keyword == '') {
    alert('No keyword provided');
    return;
  };

  var url = null;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs, url) {
    url = tabs[0].url;
    chrome.storage.sync.get('bookmark_list', function(results) {
      if (results['bookmark_list'] != null) {
        var bookmarkList = results['bookmark_list'];
      } else {
        var bookmarkList = {};
      };
      bookmarkList[keyword] = url;
      chrome.storage.sync.set({'bookmark_list': bookmarkList}, function() {
        console.log('Saved bookmark for ' + keyword);
      });
    })
  });
  alert('New keyword "' + keyword + '" stored.');
}
