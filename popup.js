chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  let currentTab = tabs[0];
  if (currentTab.url.includes('coursera.org') && currentTab.url.includes('/submit')) {
    chrome.storage.local.get(['currentPeerSubmissionId'], function(result) {
      if (result.currentPeerSubmissionId) {
        let reviewLink = currentTab.url.replace("/submit", "/review/" + result.currentPeerSubmissionId);
        document.getElementById('content').innerHTML = `
          <div class="link-container">
            <span id="reviewLink">${reviewLink}</span>
            <button id="copyButton"><i class="fa-solid fa-copy"></i> Copy</button>
          </div>
        `;
        document.getElementById('copyButton').addEventListener('click', function() {
          navigator.clipboard.writeText(reviewLink).then(function() {
            this.innerHTML = '<i class="fa-solid fa-copy"></i> Copied!';
            setTimeout(() => { this.innerHTML = '<i class="fa-solid fa-copy"></i> Copy'; }, 2000);
          }.bind(this));
        });
      } else {
        document.getElementById('content').innerHTML = '<p>No submission ID found. Please try submitting first.</p>';
      }
    });
  }
});
