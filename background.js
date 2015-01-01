// redirects that do not respond will not be marked as valid. The
// first `rx` to match a request will be redirected to `redirect`
var urlMap = [
  {rx: /.*\/compilerflasher\.js/,
   redirect: "http://localhost:8080/bundles/chrome-client.js"}
];

// Mark url map entries that respond as valid.
// XXX: maybe make this blocking.
urlMap.forEach(function (ue) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 &&
        xhr.status == 200 &&
        xhr.responseText.length > 0) {
      ue.valid = true;
    }
  };
  xhr.open("GET", ue.redirect, true);
  xhr.send();
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Requesting:",details.url);
    for (var i=0; i<urlMap.length; i++)
      if(urlMap[i].valid && urlMap[i].rx.test(details.url)){
        console.log("Redirecting compiler flasher");
        return {
          redirectUrl: urlMap[i].redirect
        };
      }
  },
  {urls: [
    "*://staging.codebender.cc/*",
  ]},
  ["blocking"]);
