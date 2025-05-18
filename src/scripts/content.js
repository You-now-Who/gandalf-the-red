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
      let linkUrl = element.href.split(/[?#]/)[0];
      matchingElements.push(linkUrl);
    }
  }

  // Remove duplicate elements
  matchingElements = [...new Set(matchingElements)];
  return matchingElements;
}

async function getPolicyList() {
  /**
   * Gets the list of URLs tested for policies already. Useful so that theres not a loop
   */

  // Weirdly, implicit Promise didn't seem to run. Needed to wrap in explicit promise
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("policyUrlsList", function (items) {
      if (chrome.runtime.lastError) {
        // Return errors
        reject(chrome.runtime.lastError);
      } else if (items.policyUrlsList === undefined) {
        // Initialise the local storage key if it doesn't exist.
        console.log("Initializing Policy URL List");

        chrome.storage.local.set({ policyUrlsList: {} }).then((result) => {
          console.log("Updated new value");
        });

        resolve({});
      } else {
        // Return the items. This bit of code would run the most
        console.log(items.policyUrlsList);
        resolve(items.policyUrlsList);
      }
    });
  });
}

(async () => {
  let policyUrlsList = await getPolicyList();

  let currentUrl = location.href;
  currentUrl = currentUrl.split(/[?#]/)[0];

  if (
    Object.keys(policyUrlsList).includes(currentUrl) ||
    currentUrl.includes("policy") ||
    currentUrl.includes("policies")
  ) {
    console.log("Preventive recursive calls");
  } else {
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
      originUrl: currentUrl,
      matchingElements: [matchingElementsPolicy],
      matchingElementsPolicy: matchingElementsPolicy,
    });
  }
})();
