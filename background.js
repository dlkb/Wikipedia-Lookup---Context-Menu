var MENU_ITEM_ID = "Wikipedia Lookup";
var DEFAULT_LANGUAGE = "en";
var DEFAULT_AUTOLANG = true;
var UPDATE_FROM_145 = "I removed a permission.";

function openUrl(url) {
  chrome.tabs.query({"active":true, "currentWindow":true}, function(tabArray) {
    var tab = tabArray[0]; // the active tab, we want our tab next to it
    chrome.tabs.create({"url":url, "index":tab.index+1, "openerTabId":tab.id});
  });
}

function formatUrl(language, text) {
  return url = "https://"+language+".wikipedia.org/wiki?search="+encodeURIComponent(text);
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == MENU_ITEM_ID && info.selectionText) {
    var language;
    chrome.storage.local.get(["autoLang","wikiLang"], function(items) {
      if (items.autoLang) { // We pick the language of the current page
        chrome.tabs.detectLanguage(null, function(lang) {
          if (lang=="und") { // undefined
            language = items.wikiLang;
          } else {
            language = lang.split("-")[0];
          }
          openUrl(formatUrl(language, info.selectionText));
        });
      } else { // We pick the default language
        openUrl(formatUrl(items.wikiLang, info.selectionText));
      }
    });
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason=="install") { // if first installation
  // Set default values for options
    chrome.storage.local.set({"autoLang":DEFAULT_AUTOLANG});
    chrome.storage.local.set({"wikiLang":DEFAULT_LANGUAGE});
  } else if (details.reason=="update") { // if update of the extension
  // Say something to the user
    if (details.previousVersion=="1.4.5") {
      var options = {
        type: "basic",
        title: "Update",
        message: UPDATE_FROM_145,
        contextMessage: "- Damien",
        iconUrl: "128.png"
      }
      chrome.notifications.create("update", options, function(){});
    }
  }
  // Create the context menu item
  var title = chrome.i18n.getMessage("textMenuItem");
  chrome.contextMenus.create({"title":title, "contexts":["selection"], "id":MENU_ITEM_ID});
});
