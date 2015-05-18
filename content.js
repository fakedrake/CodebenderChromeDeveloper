
function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}

// Inject the correct chrome app id
function mostRecentApp (cb) {
  chrome.runtime.sendMessage({messageName: 'getAllApps'}, {}, function(apps) {
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
    cb(cbApps[0]);
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
  injectAppId(app.id);
});
// injectScript( chrome.extension.getURL("bundles/compilerflasher.js"), 'body');
injectScript( chrome.extension.getURL("bundles/chrome-client.js"), 'head');
