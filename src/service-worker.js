chrome.storage.local.clear(function () {
  console.log("All local storage cleared");
});

const API_URL = "https://gandalf-the-red.onrender.com/";

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

async function getDomainsList() {
  /**
   * Gets the list of Domains with existing verdicts.
   */

  return new Promise((resolve, reject) => {
    chrome.storage.local.get("domainsList", function (items) {
      if (chrome.runtime.lastError) {
        // Return errors
        reject(chrome.runtime.lastError);
      } else if (items.domainsList === undefined) {
        // Initialise the local storage key if it doesn't exist.
        console.log("Initializing Domain List");

        chrome.storage.local.set({ domainsList: {} }).then((result) => {
          console.log("Updated new value");
        });

        resolve({});
      } else {
        // Return the items. This bit of code would run the most
        // console.log(items.domainsList);
        resolve(items.domainsList);
      }
    });
  });
}

async function initPolicyUrlInList(value) {
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

async function initDomainInList(value) {
  // Adds new value to the local storage if it doesn't exist already
  let domainsList = await getDomainsList();
  if (!Object.keys(domainsList).includes(value)) {
    domainsList[value] = {
      scrapedPages: {},
      overallGrade: "",
    };

    // console.log("Updated new value");
    // console.log(policyUrlsList);
  }
  updateDomainsList(domainsList);

  return domainsList;
}

async function updatePolicyList(policyUrlsList) {
  // Just a wrapper that updates the values on the local storage
  await chrome.storage.local.set({ policyUrlsList: policyUrlsList });
  policyUrlsList = await getPolicyList();

  return policyUrlsList;
}

async function updateDomainsList(domainsList) {
  // Just a wrapper that updates the domains values on the local storage
  await chrome.storage.local.set({ domainsList: domainsList });
  domainsList = await getDomainsList();

  return domainsList;
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
  // Fetches verdict of the text from the api
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tosText: tosText, url: url }),
    });

    if (!response.ok) {
      console.error(
        "Server returned an error:",
        response.status,
        response.statusText
      );
      return { error: "Server error", status: response.status };
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return { error: "Error parsing JSON", details: error };
  }
}

function extractDomain(url) {
  // Extracts domain from the URL
  const regex = /(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function updateDomainOverallRating(currDomain) {
  // Function that processes the domain itself to provide an Overall rating

  let domainsList = await getDomainsList();
  const gradeToValue = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  const valueToGrade = ["A", "B", "C", "D", "E"];

  const scrapedPages = domainsList[currDomain].scrapedPages;

  let total = 0;
  let count = 0;

  for (const url in scrapedPages) {
    const grade = scrapedPages[url].grade;
    // console.log(grade);
    if (gradeToValue.hasOwnProperty(grade)) {
      total += gradeToValue[grade];
      count++;
    }
  }

  const averageValue = Math.round(total / count);
  const averageGrade = valueToGrade[averageValue];

  console.log(`Average grade: ${averageGrade}`);
  domainsList[currDomain].overallGrade = averageGrade;
  updateDomainsList(domainsList);
  return(domainsList)
}

async function processPolicyUrls(request) {
  let showPrivacyToast = false;
  const matchingElementsPolicy = request.matchingElementsPolicy;

  let policyUrlsList = await getPolicyList();
  const currDomain = extractDomain(request.originUrl);

  // Initializes policy URLs in local storage if they don't exist
  for (const index in matchingElementsPolicy) {
    let url = matchingElementsPolicy[index];
    if (!Object.keys(policyUrlsList).includes(url)) {
      policyUrlsList = await initPolicyUrlInList(url);
    }
    // Process URL if not tested before
    if (policyUrlsList[url].lastTested === "undefined") {
      // Open in new tab
      policyUrlsList[url].lastTested = Date.now();
      showPrivacyToast = true;

      // Scrape the URL
      let tosText = await scrapePolicyUrl(url);
      // console.log(tosText);
      const verdictObj = await getVerdict(tosText, url);
      // console.log(verdictObj);
      policyUrlsList[url].verdict = verdictObj;

      // Update the local storage
      policyUrlsList = await updatePolicyList(policyUrlsList);

      // Add the url to the domain
      await initDomainInList(currDomain);
      let domainsList = await getDomainsList();
      console.log(domainsList);
      domainsList[currDomain].scrapedPages[url] = verdictObj;
      await updateDomainsList(domainsList);
    }
  }

  // NOTES FOR TOMMOROW:

  await updateDomainOverallRating(currDomain);

  // Trigger a new chrome message that will go on the active tab and check the domain.
  // If on the same domain, insert a popup to let know verdict is ready

  const domainsList = await getDomainsList()

  return {
    isVerdictAvailable: showPrivacyToast,
    verdict: domainsList[currDomain]
  }

  // Create popup.html + popup.js to show the verdict

  // Start working on the docs + integration with LOTR themes as per idea
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  (async () => {
    if (request.type == "termsFound") {
      const verdict = await processPolicyUrls(request);
      // console.log(verdict)
      await sendResponse(verdict)
    }
    else if (request.type == "openPopup"){
      // chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
      chrome.action.openPopup();
    }
  })();

  return true;
});
