function cdnUrl(rel) {
  // return "https://people.csail.mit.edu/cperivol/cdn/bundles/" + rel;
  return chrome.extension.getURL("bundles/" + rel);
}

// redirects that do not respond will not be marked as valid. The
// first `rx` to match a request will be redirected to `redirect`
var nullurl = "https://staging.codebender.cc/fakedrake.js",
    urlMap = [
      // Redirect direct chrome-client requests to /dev/null and
      // chrome-client.js to the most update version.
      // {
      //   rx: /.*codebender.*\embed\/chrome-client\.js.*/,
      //   redirect: nullurl,
      //   valid: true},
      {
        rx: /.*codebender.*\embed\/compilerflasher.*\.js.*/,
        redirect: cdnUrl('compilerflasher.js'),
        valid: true
      },

      {
        rx: /.*\/chrome-client.js.*/,
        redirectCb: function () {
          var ret = cdnUrl(
            "chrome-client.js");
          console.log("Redirecting to:", ret);
          return ret;
        },
        valid: true},

      {rx: /.*:\/\/localhost\/.*/,
       redirectCb: function (url) {
         return url.replace("http:", "https:")
           .replace("://localhost", "://staging.codebender.cc");
       },
       valid: true
      },

      {rx: /https?:\/\/tsiknas.codebender.cc.*/,
       redirectCb: function (url) {
         return url.replace("tsiknas", "staging");
       },
       valid: true
      }
    ],
    app = null;

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Requesting:",details.url);
    for (var i = 0; i < urlMap.length; i++)
      if (urlMap[i].valid && urlMap[i].rx.test(details.url)) {
        var redirect = urlMap[i].redirect || urlMap[i].redirectCb(details.url);
        console.log("Redirecting " + details.url + " -> " + redirect);
        return {
          redirectUrl: redirect
        };
      }
  },
  {urls: [
    "<all_urls>"
  ]},
  ["blocking"]);


// Inject the correct chrome app id
function mostRecentApp (apps) {
  var cbApps = apps.filter(function (a) {
    // The latest author by codebender.cc
    return a.name.indexOf("Codebender app") != -1 && a.isApp && a.enabled;
  })
        .sort(function(a,b) {
          var aver = a.version.split('.').map(parseFloat),
              bver = b.version.split('.').map(parseFloat);
          for (var i = 0; i < aver.length; i++) {
            if (aver[i] != bver[i]) {
              return aver[i] > bver[i];
            }
          }
          return false;
        });
  return cbApps[0];
}

function updateApp () {
  chrome.management.getAll(function (apps) {
    app = mostRecentApp(apps);
  });
}


updateApp();
setInterval(updateApp, 5000);

// Provide a list of apps
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    var send = sendResponse;
    if(message.messageName == 'mostRecentApp') {
      sendResponse(app);
    }
  }
);
