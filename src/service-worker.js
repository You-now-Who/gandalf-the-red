chrome.storage.local.clear(function () {
  console.log("All local storage cleared");
});

const API_URL = "http://localhost:3000/";

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
          // console.log("Updated new value");
        });

        resolve([]);
      } else {
        // Return the items. This bit of code would run the most
        // console.log(items.policyUrlsList);
        resolve(items.policyUrlsList);
      }
    });
  });
}

async function initPolicyList(value) {
  // Adds new value to the local storage if it doesn't exist already
  let policyUrlsList = await getPolicyList();
  if (!Object.keys(policyUrlsList).includes(value)) {
    policyUrlsList[value] = {
      verdict: "undefined",
      lastTested: "undefined",
    };

    // console.log("Updated new value");
    // console.log(policyUrlsList);
  }
  updatePolicyList(policyUrlsList);

  return policyUrlsList;
}

async function updatePolicyList(policyUrlsList) {
  // Just a wrapper that updates the values on the local storage
  await chrome.storage.local.set({ policyUrlsList: policyUrlsList });
  policyUrlsList = await getPolicyList();

  return policyUrlsList;
}

async function ensureOffscreenDoc() {
  // Creates an offscreen document just for scraping
  const existing = await chrome.offscreen.hasDocument();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: "scraper.html",
      reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
      justification: "Parse HTML content and extract visible text",
    });
  }
}

async function scrapePolicyUrl(url) {
  // Scrapes policy from the html page
  await ensureOffscreenDoc();

  const response = await fetch(url);
  const html = await response.text();

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "parseHTML", html }, (response) =>
      resolve(response.text)
    );
  });
}

async function getVerdict(tosText, url) {
  // Fetches the verdict from OpenAI using backend server
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tosText: tosText, url: url }),
  });

  response
    .json()
    .then((data) => {
      console.log(data); // Logs the parsed JSON object
      return data;
    })
    .catch((error) => {
      console.error("Error parsing JSON:", error);
      return { error: "Error parsing JSON", details: error };
    });
}

async function processPolicyUrls(request) {
  const matchingElementsPolicy = request.matchingElementsPolicy;

  let policyUrlsList = await getPolicyList();

  // Initializes policy URLs in local storage if they don't exist
  for (const index in request.matchingElementsPolicy) {
    let url = matchingElementsPolicy[index];
    if (!Object.keys(policyUrlsList).includes(url)) {
      policyUrlsList = await initPolicyList(url);
    }
    // Process URL if not tested before
    if (policyUrlsList[url].lastTested === "undefined") {
      // Open in new tab
      policyUrlsList[url].lastTested = Date.now();
      policyUrlsList = await updatePolicyList(policyUrlsList);
      // console.log(policyUrlsList);

      // Scrape the URL
      let tosText = await scrapePolicyUrl(url);
      console.log(tosText);
      const verdictObj = getVerdict(tosText, url);
      console.log(verdictObj);
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.type == "termsFound") {
    processPolicyUrls(request);
  }
}); 
