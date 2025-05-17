console.log("Content Script loaded");

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

        chrome.storage.local.set({ policyUrlsList: [] }).then((result) => {
          console.log("Updated new value");
        });

        resolve([]);
      } else {
        // Return the items. This bit of code would run the most
        console.log(items.policyUrlsList);
        resolve(items.policyUrlsList);
      }
    });
  });
}

async function updatePolicyList(value) {
  // Adds new value to the local storage if it doesn't exist already
  let policyUrlsList = await getPolicyList()
  if (!policyUrlsList.includes(value)){

    policyUrlsList.push(value);
    chrome.storage.local.set({ policyUrlsList: policyUrlsList }).then(() => {
        console.log("Updated new value");
    });
  }
}

function getElementsByTextContain(text) {
  /**
   * Returns links that may lead to privacy policy pages
   */

  const allElements = document.querySelectorAll("a"); // Select all links
  const matchingElements = [];

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
  const matchingElementsPolicy = getElementsByTextContain("Policy");
  const matchingElementsTerms = getElementsByTextContain("Terms");

  const policyList = await getPolicyList();
  console.log(policyList);

  if (matchingElementsPolicy.length > 0 && !location.href.includes("policy")) {
    updatePolicyList(location.href)
    chrome.runtime.sendMessage({
      type: "termsFound",
      originUrl: location.href,
      matchingElements: [matchingElementsPolicy, matchingElementsTerms],
      matchingElementsPolicy: matchingElementsPolicy,
    });
  }
})();
