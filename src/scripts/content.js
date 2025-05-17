console.log("Content Script loaded");

function getElementsByTextContain(text, matchingElements) {
  /**
   * Returns links that may lead to privacy policy pages
   */

  const allElements = document.querySelectorAll("a"); // Select all links
  //   const matchingElements = [];

  for (const element of allElements) {
    if (
      element.textContent.toLowerCase().includes(text.toLowerCase()) ||
      element.href.toLowerCase().includes(text.toLowerCase())
    ) {
      matchingElements.push(element.href);
    }
  }
  return matchingElements;
}

(async () => {
  // Main bit of code. Calls all the functions
  let matchingElementsPolicy = [];
  matchingElementsPolicy = getElementsByTextContain(
    "Policy",
    matchingElementsPolicy
  );
  matchingElementsPolicy = getElementsByTextContain(
    "Terms",
    matchingElementsPolicy
  );

  chrome.runtime.sendMessage({
    type: "termsFound",
    originUrl: location.href,
    matchingElements: [matchingElementsPolicy],
    matchingElementsPolicy: matchingElementsPolicy,
  });
})();
