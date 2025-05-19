// Dummy data for the extension
let dummyData = {
  grade: "B",
  phrase: "Bonum",
  message: "Second Breakfast Approved",
  urls: [
    {
      id: 1,
      title: "The Fellowship Contract",
      domain: "council.rivendell.me",
      summary:
        "This contract outlines the terms of joining the Fellowship of the Ring, including mutual obligations, risk assessment, and compensation for heirs in case of untimely demise.",
      highlights: [
        {
          id: 101,
          type: "Pro",
          clause:
            "Party of the first part (Frodo Baggins) shall be entitled to one-fourteenth of total profits, if any, up to and not exceeding one fourteenth of total profits.",
          explanation:
            "This clause ensures fair profit sharing among all members of the Fellowship. The distribution is equal regardless of race or status, which is favorable for hobbits who are often overlooked in such ventures.",
        },
        {
          id: 102,
          type: "Con",
          clause:
            "Company shall not be liable for injuries inflicted by or sustained as a consequence thereof including but not limited to lacerations, evisceration, incineration.",
          explanation:
            "This clause removes any liability from the quest organizers for injuries sustained during the journey, leaving members without recourse for medical expenses or compensation for severe injuries.",
        },
        {
          id: 103,
          type: "Pro",
          clause:
            "Accommodations provided at the discretion of the Company, up to and including one (1) sleeping space per member.",
          explanation:
            "The contract guarantees at minimum a sleeping space for each member, ensuring basic comfort during the journey regardless of the locations visited.",
        },
      ],
    },
    {
      id: 2,
      title: "The Mines of Moria Terms of Entry",
      domain: "dwarven-halls.khazad-dum.org",
      summary:
        "Official terms and conditions for traversing the ancient Dwarven city of Khazad-dûm, including warnings about potential hazards and prohibited activities within the mines.",
      highlights: [
        {
          id: 201,
          type: "Con",
          clause:
            "Speak not the ancient words at the Doors of Durin unless properly authorized by Dwarven Authority.",
          explanation:
            "This clause restricts entry through use of the password, effectively controlling access and potentially leaving travelers stranded outside in hostile territory.",
        },
        {
          id: 202,
          type: "Con",
          clause:
            "The Company bears no responsibility for awakening ancient evils in the depths of the mines.",
          explanation:
            "This troubling clause allows the management to absolve themselves of responsibility for the Balrog or other ancient dangers that may be disturbed during transit.",
        },
        {
          id: 203,
          type: "Pro",
          clause:
            "Travelers may retain any mithril found during designated prospecting periods.",
          explanation:
            "This generous provision allows travelers to keep any mithril discovered, which is extremely valuable and rare in Middle-earth.",
        },
      ],
    },
    {
      id: 3,
      title: "The Prancing Pony Lodging Agreement",
      domain: "inns.bree-land.com",
      summary:
        "Standard lodging agreement for The Prancing Pony in Bree, detailing room rates, meal inclusions, and expectations regarding guest behavior and privacy.",
      highlights: [
        {
          id: 301,
          type: "Pro",
          clause:
            "Breakfast, both first and second, included in the standard room rate for Hobbit guests.",
          explanation:
            "This accommodating clause recognizes the unique dining habits of Hobbits and provides additional meal service at no extra charge.",
        },
        {
          id: 302,
          type: "Pro",
          clause:
            "Innkeeper will not reveal guest identities to Nazgûl or other servants of the Enemy.",
          explanation:
            "This privacy guarantee ensures that even in dangerous times, guest identities remain confidential, providing crucial protection for those avoiding detection.",
        },
        {
          id: 303,
          type: "Con",
          clause:
            "Management reserves the right to evict guests who engage in disappearing magic or other disruptive supernatural activities.",
          explanation:
            "This clause could be problematic for those with magic rings or other enchanted items, as it limits their ability to protect themselves if necessary.",
        },
      ],
    },
  ],
};

// Consolidated grade data
const gradeData = {
  A: {
    phrase: "Valde Bonum", // Very Good
    gandalfPhrase: "Gandalf Smiles Upon You",
    color: "#f8f0d8", // Light parchment for A
    borderColor: "#a87e58", // Rich brown border
    textColor: "#3e2723", // Dark brown text
    glow: "none", // No glow for A grade
    backgroundGradient: "linear-gradient(135deg, #f8f0d8 0%, #ede1c9 100%)",
    gifUrl:
      "https://gifdb.com/images/high/smiling-gandalf-saying-no-6050j9wlqorn7adp.gif",
  },
  B: {
    phrase: "Bonum", // Good
    gandalfPhrase: "Second Breakfast Approved",
    color: "#f4e4c1", // Slightly darker parchment
    borderColor: "#9c6644", // Richer brown border
    textColor: "#3e2723", // Dark brown text
    glow: "0 0 10px #ffd700", // Subtle gold glow for B
    backgroundGradient: "linear-gradient(135deg, #f4e4c1 0%, #ecd5a7 100%)",
    gifUrl:
      "https://media1.tenor.com/m/SRvxzGVowVEAAAAC/breakfast-secondbreakfast.gif",
  },
  C: {
    phrase: "Acceptabile", // Acceptable
    gandalfPhrase: "Proceed with Caution",
    color: "#efe0b9", // Warmer parchment tone
    borderColor: "#8d5524", // Darker brown border
    textColor: "#3e2723", // Dark brown text
    glow: "0 0 20px #ffa500", // Orange glow for C
    backgroundGradient: "linear-gradient(135deg, #efe0b9 0%, #f3c89a 100%)",
    gifUrl:
      "https://64.media.tumblr.com/0111540a582b7c6ed40616d070b6fc04/tumblr_mlxmd1Z7TL1qf5tr5o1_250.gifv",
  },
  D: {
    phrase: "Submediocre", // Below Average
    gandalfPhrase: "The Eye of Sauron Watches",
    color: "#e8d8a9", // Aged parchment tone
    borderColor: "#704214", // Dark border
    textColor: "#33261d", // Darker text
    glow: "0 0 30px #ff4500", // Red-orange glow for D
    backgroundGradient: "linear-gradient(135deg, #e8d8a9 0%, #eab085 100%)",
    gifUrl: "https://media1.tenor.com/m/k0cPQlr82ycAAAAC/sauron-lotr.gif",
  },
  E: {
    phrase: "Male Factum", // Poorly Done
    gandalfPhrase: "YOU SHALL NOT PASS",
    color: "#e5cfa0", // Yellowed parchment
    borderColor: "#5d3511", // Very dark border
    textColor: "#2d1e12", // Very dark text
    glow: "0 0 40px #ff0000", // Intense red glow for E
    backgroundGradient: "linear-gradient(135deg, #e5cfa0 0%, #d98f6c 100%)",
    gifUrl:
      "https://media.tenor.com/EgvXcIbZLqgAAAAM/gandalf-the-grey-lord-of-the-rings.gif",
  },
};

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
        console.log(items.domainsList);
        resolve(items.domainsList);
      }
    });
  });
}

// Create runic border
function createRunicBorder() {
  const runicText = "ᚲᚢᛊᛏᛟᛞᛟᛊᛖᚲᚱᛖᛏᛁ"; // Elder Futhark runes
  const expandedRunicText = runicText.repeat(6).replace(/\s+/g, "");
  const container = document.querySelector(".runic-border-container");

  // Create runes around the border
  const numberOfRunes = 48;

  for (let i = 0; i < numberOfRunes; i++) {
    const rune = document.createElement("span");
    rune.className = "runic-character";
    rune.textContent = expandedRunicText[i % expandedRunicText.length];

    // Calculate position around the border
    const angle = i * (360 / numberOfRunes) * (Math.PI / 180);
    const radius = 145; // Adjust based on container size

    // Position rune
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    rune.style.transform = `translate(${x}px, ${y}px) rotate(${
      angle + Math.PI / 2
    }rad)`;
    container.appendChild(rune);
  }
}

// Populate URL list in main view
function populateUrlList() {
  const urlListElement = document.querySelector(".url-list");
  urlListElement.innerHTML = "";

  dummyData.urls.forEach((url) => {
    const urlItem = document.createElement("div");
    urlItem.className = "url-item";
    urlItem.dataset.id = url.id;

    urlItem.innerHTML = `
            <div class="url-item-title">${url.title}</div>
            <div class="url-item-domain">${url.domain}</div>
        `;

    urlItem.addEventListener("click", function () {
      showDetailsView(url.id);
    });

    urlListElement.appendChild(urlItem);
  });
}

// Show URL details view
function showDetailsView(urlId) {
  // Find the URL data
  const urlData = dummyData.urls.find((url) => url.id === urlId);
  if (!urlData) return;

  // Set URL details
  document.getElementById("url-title").textContent = urlData.title;
  document.getElementById("url-summary").textContent = urlData.summary;

  // Clear and populate highlights
  const highlightsList = document.getElementById("highlights-list");
  highlightsList.innerHTML = "";

  urlData.highlights.forEach((highlight) => {
    const highlightItem = document.createElement("div");
    highlightItem.className = `highlight-item ${highlight.type.toLowerCase()}-highlight`;
    highlightItem.dataset.id = highlight.id;
    highlightItem.dataset.urlId = urlId;

    highlightItem.innerHTML = `
            <div class="highlight-item-type">
                ${
                  highlight.type === "Pro"
                    ? '<i class="fas fa-check-circle"></i>'
                    : '<i class="fas fa-times-circle"></i>'
                }
            </div>
            <div class="highlight-item-content">${highlight.explanation}</div>
        `;

    highlightItem.addEventListener("click", function () {
      showHighlightView(urlId, highlight.id);
    });

    highlightsList.appendChild(highlightItem);
  });

  // Show details view, hide others
  document.getElementById("main-view").classList.add("hidden");
  document.getElementById("details-view").classList.remove("hidden");
  document.getElementById("highlight-view").classList.add("hidden");

  // Store URL ID in the view for back navigation
  document.getElementById("details-view").dataset.urlId = urlId;
}

// Show highlight details view
function showHighlightView(urlId, highlightId) {
  // Find the URL and highlight data
  const urlData = dummyData.urls.find((url) => url.id === urlId);
  if (!urlData) return;

  const highlightData = urlData.highlights.find(
    (highlight) => highlight.id === highlightId
  );
  if (!highlightData) return;

  // Set highlight details
  document.getElementById("highlight-title").textContent = urlData.title;

  const highlightTypeElement = document.getElementById("highlight-type");
  highlightTypeElement.className = `highlight-type ${highlightData.type.toLowerCase()}`;
  highlightTypeElement.innerHTML = `
        ${
          highlightData.type === "Pro"
            ? '<i class="fas fa-check-circle"></i>'
            : '<i class="fas fa-times-circle"></i>'
        }
        ${highlightData.type}
    `;

  document.getElementById("highlight-clause").textContent =
    highlightData.clause;
  document.getElementById("highlight-explanation").textContent =
    highlightData.explanation;

  // Show highlight view, hide others
  document.getElementById("main-view").classList.add("hidden");
  document.getElementById("details-view").classList.add("hidden");
  document.getElementById("highlight-view").classList.remove("hidden");

  // Store URL ID in the view for back navigation
  document.getElementById("highlight-view").dataset.urlId = urlId;
  document.getElementById("highlight-view").dataset.highlightId = highlightId;
}

// Show main view
function showMainView() {
  document.getElementById("main-view").classList.remove("hidden");
  document.getElementById("details-view").classList.add("hidden");
  document.getElementById("highlight-view").classList.add("hidden");
}

function transformScrapedData(scrapedData) {
  // Extract overall grade from scraped data
  const grade = scrapedData.overallGrade;

  // Get grade-specific styling and phrases from gradeData
  const gradeInfo = gradeData[grade];

  // Initialize the base structure of dummyData
  const transformedData = {
    grade: grade,
    phrase: gradeInfo.gandalfPhrase,
    message: gradeInfo.phrase,
    urls: [],
  };

  // Counter for URL IDs
  let urlId = 1;
  // Counter for highlight IDs
  let highlightId = 101;

  // Process each scraped page and convert to the expected URL format
  Object.entries(scrapedData.scrapedPages).forEach(([url, pageData]) => {
    // Extract domain from URL
    const domain = new URL(url).hostname;

    // Create a title from the URL
    // This extracts the last part of the path, removes hyphens and capitalizes words
    const pathParts = new URL(url).pathname.split("/");
    const lastPathPart =
      pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || "";
    const title = lastPathPart
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/\b(Of|The|And|In|On|At|For|To|With|By)\b/g, (match) =>
        match.toLowerCase()
      );

    // Create URL object in the format expected by dummyData
    const urlObj = {
      id: urlId++,
      title: title || "Untitled Document",
      domain: domain,
      summary: pageData.summary,
      highlights: [],
    };

    // Process highlights
    pageData.highlights.forEach((highlight) => {
      urlObj.highlights.push({
        id: highlightId++,
        type: highlight.type,
        clause: highlight.clause,
        explanation: highlight.explanation,
      });
    });

    // Add to URLs array
    transformedData.urls.push(urlObj);
  });

  return transformedData;
}

function extractDomain(url) {
  // Extracts domain from the URL
  const regex = /(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getCurrentDomain() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    const currDomain = extractDomain(tab.url);
    return (currDomain);
}

(async () => {
  let domainsList = await getDomainsList();
//   const currentUrl = window.location.href;
  const currentDomain = await getCurrentDomain();

//   console.log(currentDomain)

  const transformedData = transformScrapedData(domainsList[currentDomain]);
  console.log(transformedData)
//   dummyData = transformedData
  // Initialize the extension when the document is loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Add runic border
    createRunicBorder();

    // Set main grade and message
    document.querySelector(".grade-letter").textContent = dummyData.grade;
    document.querySelector(".parchment-title").textContent = dummyData.phrase;
    document.querySelector(".lotr-message").textContent = dummyData.message;

    // Populate URL list
    populateUrlList();

    // Add event listeners for navigation
    document
      .getElementById("back-button")
      .addEventListener("click", showMainView);
    document
      .getElementById("highlight-back-button")
      .addEventListener("click", function () {
        // Get the current URL ID from the highlight view
        const urlId = parseInt(
          document.getElementById("highlight-view").dataset.urlId
        );
        showDetailsView(urlId);
      });
  });
})();
