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

function injectToast(verdictObj) {
  // Injects a notification into the DOM saying the verdict is ready

  const gradePhrases = {
    A: "Valde Bonum", // Very Good
    B: "Bonum", // Good
    C: "Acceptabile", // Acceptable
    D: "Submediocre", // Below Average
    E: "Male Factum", // Poorly Done
  };

  console.log(verdictObj);

  const card = document.createElement("div");
  card.className = "profile-card";

  // Close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.className = "profile-close-button";
  closeButton.addEventListener("click", () => card.remove());
  card.appendChild(closeButton);

  // Logo circle with letter
  const logo = document.createElement("div");
  logo.className = "profile-logo";
  const letter = document.createElement("span");
  letter.className = "profile-letter";
  letter.textContent = verdictObj.overallGrade;
  logo.appendChild(letter);
  card.appendChild(logo);

  // Title
  const title = document.createElement("h2");
  title.className = "profile-title";
  title.textContent = gradePhrases[verdictObj.overallGrade];
  // title.style.color = "white";
  card.appendChild(title);

  // Add Gandalf's disapproval message
  const disapprovalMessage = document.createElement("p");
  disapprovalMessage.className = "profile-disapproval-message";
  disapprovalMessage.textContent = "Gandalf does not approve.";
  card.appendChild(disapprovalMessage);

  // Add Gandalf GIF
  const gandalfGif = document.createElement("img");
  gandalfGif.className = "profile-gandalf-gif";
  gandalfGif.src = "https://media.giphy.com/media/14tvbepZ8vhU40/giphy.gif"; // Example Gandalf GIF
  gandalfGif.alt = "Gandalf does not approve";
  gandalfGif.style.width = "100px"; // Adjust size as needed
  gandalfGif.style.marginTop = "1rem";
  // card.appendChild(gandalfGif);

  // Button
  const detailsButton = document.createElement("button");
  detailsButton.className = "profile-details-button";
  detailsButton.textContent = "See Details";
  card.appendChild(detailsButton);

  // Inject styles once
  if (!document.getElementById("profile-card-style")) {
    const style = document.createElement("style");
    style.id = "profile-card-style";
    style.textContent = `
                .profile-card {
                  position: fixed;
                  top: 1rem;
                  right: 1rem;
                  background-color: #f4e4c1; /* Parchment-like color */
                  color: #3e2723; /* Dark brown text for a medieval feel */
                  padding: 3rem 2rem;
                  border-radius: 1rem; /* Slightly rounded corners */
                  width: 350px; /* Reduced width for a narrower card */
                  min-height: 400px; /* Increased height for a longer card */
                  text-align: center;
                  font-family: 'Cinzel Decorative', serif; /* Medieval-style font */
                  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* Stronger shadow for depth */
                  border: 5px solid #8b5e3c; /* Decorative border */
                  z-index: 10000;
                  background-image: url('https://www.transparenttextures.com/patterns/old-wall.png'); /* Subtle texture for parchment effect */
                }
                
                .profile-close-button {
                  position: absolute;
                  top: 1rem;
                  right: 1rem;
                  background: none;
                  border: none;
                  color: #3e2723;
                  font-size: 1.5rem;
                  cursor: pointer;
                  font-family: 'Cinzel Decorative', serif;
                }
                
                .profile-logo {
                  width: 100px;
                  height: 100px;
                  border: 3px solid #8b5e3c; /* Decorative border */
                  border-radius: 50%;
                  margin: 0 auto 1.5rem auto;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: #f4e4c1; /* Match parchment color */
                  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3); /* Inner shadow for depth */
                }
                
                .profile-letter {
                  font-family: 'UnifrakturCook', cursive; /* Gothic-style font */
                  font-size: 4rem;
                  color: #8b5e3c; /* Dark brown */
                }
                
                .profile-title {
                  font-size: 2rem;
                  margin-bottom: 2rem;
                  font-family: 'Cinzel Decorative', serif;
                  color: #3e2723;
                  text-shadow: 1px 1px 2px #8b5e3c; /* Subtle shadow for depth */
                }

                .profile-disapproval-message {
                  font-family: 'Cinzel Decorative', serif;
                  color: #3e2723;
                  font-size: 1.2rem;
                  margin-top: 1rem;
                }

                .profile-gandalf-gif {
                  display: block;
                  margin: 0 auto;
                  border: 2px solid #8b5e3c;
                  border-radius: 0.5rem;
                }
                
                .profile-details-button {
                  background: #8b5e3c; /* Dark brown button */
                  border: 2px solid #3e2723;
                  color: #f4e4c1; /* Parchment-like text */
                  padding: 0.5rem 1rem;
                  border-radius: 0.5rem;
                  font-size: 1.2rem;
                  cursor: pointer;
                  font-family: 'Cinzel Decorative', serif;
                }
                
                .profile-details-button:hover {
                  background-color: #3e2723; /* Darker hover effect */
                  color: #f4e4c1;
                }
                `;
    document.head.appendChild(style);

    // Load custom fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=UnifrakturCook:wght@700&display=swap";
    link.onload = () => console.log("Font stylesheet loaded successfully");
    link.onerror = () => console.error("Failed to load font stylesheet");
    document.head.appendChild(link);
  }

  // Append to DOM
  document.body.appendChild(card);
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

    const verdictObj = await chrome.runtime.sendMessage({
      type: "termsFound",
      originUrl: currentUrl,
      matchingElements: [matchingElementsPolicy],
      matchingElementsPolicy: matchingElementsPolicy,
    });

    console.log(verdictObj);

    if (verdictObj.isVerdictAvailable) {
      injectToast(verdictObj.verdict);
    }
  }
})();
