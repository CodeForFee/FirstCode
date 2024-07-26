chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let currentTab = tabs[0];
    if (currentTab.url.includes('coursera.org') && currentTab.url.includes('/submit')) {
      chrome.storage.local.get(['currentPeerSubmissionId'], function(result) {
        if (result.currentPeerSubmissionId) {
          let reviewLink = currentTab.url.replace("/submit", "/review/" + result.currentPeerSubmissionId);
          document.getElementById('content').innerHTML = `
            <p>Review Link:</p>
            <p id="reviewLink">${reviewLink}</p>
            <button id="copyButton">Copy Link</button>
          `;
          document.getElementById('copyButton').addEventListener('click', function() {
            navigator.clipboard.writeText(reviewLink).then(function() {
              alert('Link copied to clipboard!');
            });
          });
        } else {
          document.getElementById('content').innerHTML = '<p>No submission ID found. Please try submitting first.</p>';
        }
      });
    }
  });