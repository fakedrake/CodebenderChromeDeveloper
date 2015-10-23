
function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}

// Inject the correct chrome app id
function mostRecentApp (cb) {
  chrome.runtime.sendMessage({messageName: 'mostRecentApp'}, {}, function(app) {
    cb(app);
  });
}


function injectAppId (id) {
  var sp = document.getElementById('babelfish-app-id');
  if (!sp) {
    sp = document.createElement('span');
    sp.setAttribute('style', 'display: none');
    sp.setAttribute('id', 'babelfish-app-id');
    document.body.appendChild(sp);
  }

  sp.innerHTML = id;
  console.log("CBDev: Enabling app:", id);
}

console.log("CBDev: Changing dom");
mostRecentApp(function (app) {
  // Look for the official of none is found.
  injectAppId(app ? app.id : "magknjdfniglanojbpadmpjlglepnlko");
});
// injectScript( chrome.extension.getURL("bundles/compilerflasher.js"), 'body');
// injectScript("https://staging.codebender.cc/dummy/chrome-client.js", 'head');
