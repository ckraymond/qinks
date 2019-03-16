// Q Links
// Background script
// Author: Colin Raymond (colin.k.raymond@gmail.com)

// Get the bookmark list when first initialized
chrome.runtime.onInstalled.addListener(extInitialize());

// Check to see if user enters anything into the omnibox
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    switch(text.substring(0,2)) {
      case 's/':  // Save a new bookmark
        addBookmark(text.substring(2));
        break;
      case 'v/':  // View all saved bookmarks
        showBookmarks();
        break;
      default:  // Otherwise try and use the link
        navigateLink(text);
    }
  }
);

// Listen for request for bookmarks
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (reqeust.command == 'get_bookmarks') {
      console.log('Received bookmark list request');
      // Add sendResponse
    }
  }
)

// Show all bookmarks that are present
function showBookmarks() {
  chrome.tabs.create({
    url: chrome.extension.getURL('html/bk_list.html'),
    active: true
  }, function(tab) {
    chrome.windows.create({
      tabId: tab.id,
      type: 'popup',
      focused: true
    });
  });
};

// Gets the bookmark information
function extInitialize() {
  // Data structure to hold all bookmarks
  var bookmark_list = {
    'goog': 'https://www.google.com',
    'news': 'https://www.cnn.com',
    'test_three': 'test_three_url'
  };

  chrome.storage.sync.set({'bookmark_list': bookmark_list}, function() {
    console.log('Bookmark list saved.');
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
  console.log(keyword);
  var url = null;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs, url) {
    url = tabs[0].url;
    chrome.storage.sync.get('bookmark_list', function(results) {
      var bookmark_list = results['bookmark_list'];
      bookmark_list[keyword] = url;
      chrome.storage.sync.set({'bookmark_list': bookmark_list}, function() {
        console.log('Saved bookmark for ' + keyword);
      });
    })
  });
}
