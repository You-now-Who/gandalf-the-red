chrome.storage.local.clear(function () {
  console.log("All local storage cleared");
});
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
  let policyUrlsList = await getPolicyList();
  if (!Object.keys(policyUrlsList).includes(value)) {
    policyUrlsList[value] = {
      verdict: "undefined",
      last_tested: "undefined",
    };

    console.log("Updated new value");
    console.log(policyUrlsList);
  }
  let confirmed = await chrome.storage.local.set({ policyUrlsList: policyUrlsList });
  console.log(confirmed)
  return policyUrlsList
}

async function scrapeTermsFromUrl(request) {
  const matchingElementsPolicy = request.matchingElementsPolicy
//   console.log(request.originUrl);
//   console.log(matchingElementsPolicy);

  let policyUrlsList = await getPolicyList()

  for (const index in request.matchingElementsPolicy){
    let url = matchingElementsPolicy[index]
    if (!Object.keys(policyUrlsList).includes(url)){
        policyUrlsList = await updatePolicyList(url)
    }
  } 
  console.log(policyUrlsList)

}

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.type == "termsFound") {
    scrapeTermsFromUrl(request);
  }
});
