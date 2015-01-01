chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("Requesting:",details.url);
    if(/.*\/compilerflasher\.js/.test(details.url)){
      console.log("Redirecting compiler flasher");
      return {
        redirectUrl: "http://localhost:8080/bundles/chrome-client.js"
      };
    }
  },
  {urls: [
    "*://staging.codebender.cc/*",
  ]},
  ["blocking"]);
