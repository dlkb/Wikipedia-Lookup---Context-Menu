function onLoad() {
  document.getElementById("whichLang").innerHTML = chrome.i18n.getMessage("whichLang");
  document.getElementById("autoLangOnSpan").innerHTML = chrome.i18n.getMessage("autoLangOn");
  document.getElementById("autoLangOffSpan").innerHTML = chrome.i18n.getMessage("autoLangOff");
  document.getElementById("save").innerHTML = chrome.i18n.getMessage("save");

  chrome.storage.local.get(["autoLang", "wikiLang"], function(items) {
    document.getElementById("autoLangOnRad").checked = items.autoLang;
    document.getElementById("autoLangOffRad").checked = !items.autoLang;
    document.getElementById("wikiLangTxt").value = items.wikiLang;
  });

  document.getElementById("save").addEventListener("click", function() {
    var auto = document.getElementById("autoLangOnRad").checked;
    var lang = document.getElementById("wikiLangTxt").value;
    chrome.storage.local.set({"autoLang":auto});
    if (lang!="") {
      chrome.storage.local.set({"wikiLang":lang});
    }
    window.close();
  });
}

document.addEventListener("DOMContentLoaded", onLoad);
