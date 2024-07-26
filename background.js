let currentPeerSubmissionId = null;

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("onDemandPeerComments.v1")) {
      let match = details.url.match(/peerSubmissionId=([^&]+)/);
      if (match) {
        let fullId = match[1];
        currentPeerSubmissionId = fullId.split("~").pop();
        chrome.storage.local.set({currentPeerSubmissionId: currentPeerSubmissionId});
      }
    }
  },
  {urls: ["*://www.coursera.org/api/onDemandPeerComments.v1/*"]}
);