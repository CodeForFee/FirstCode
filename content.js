let currentPeerSubmissionId = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "peerSubmissionIdUpdated") {
    currentPeerSubmissionId = request.peerSubmissionId;
    checkAndRedirect();
  }
  sendResponse({received: true});
});

function checkAndRedirect() {
  if (currentPeerSubmissionId) {
    let currentUrl = window.location.href;
    if (currentUrl.includes("/submit")) {
      let newUrl = currentUrl.replace("/submit", "/review/" + currentPeerSubmissionId);
      window.location.href = newUrl;
    }
  }
}

function addReviewButton() {
  let submitButton = document.querySelector('button[data-test="submit-button"]');
  if (submitButton) {
    let reviewButton = document.createElement('button');
    reviewButton.textContent = 'Go to Review';
    reviewButton.style.marginLeft = '10px';
    reviewButton.addEventListener('click', function() {
      if (currentPeerSubmissionId) {
        let currentUrl = window.location.href;
        let newUrl = currentUrl.replace("/submit", "/review/" + currentPeerSubmissionId);
        window.location.href = newUrl;
      } else {
        chrome.runtime.sendMessage({action: "getSubmissionId"}, function(response) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
          }
          if (response && response.peerSubmissionId) {
            currentPeerSubmissionId = response.peerSubmissionId;
            checkAndRedirect();
          } else {
            alert('No submission ID found. Please try submitting first.');
          }
        });
      }
    });
    submitButton.parentNode.insertBefore(reviewButton, submitButton.nextSibling);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addReviewButton);
} else {
  addReviewButton();
}