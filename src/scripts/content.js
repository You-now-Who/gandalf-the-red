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

function injectToast() {
  // Injects a notification into the DOM saying the verdict is ready
  const toast = document.createElement("div");
  toast.textContent = "Verdict is ready!";
  toast.className = "minimal-toast";

  // Create a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "✖";
  closeButton.className = "toast-close-button";
  closeButton.addEventListener("click", () => {
    toast.remove();
  });

  // Append the close button to the toast
  toast.appendChild(closeButton);

  // Inject styles once
  if (!document.getElementById("minimal-toast-style")) {
    const style = document.createElement("style");
    style.id = "minimal-toast-style";
    style.textContent = `
       .minimal-toast {
         position: fixed;
         top: 20px;
         right: 20px;
         background-color: #333;
         color: #fff;
         padding: 16px 32px;
         border-radius: 10px;
         font-size: 18px;
         font-family: sans-serif;
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
         z-index: 10000;
         display: flex;
         align-items: center;
         justify-content: space-between;
         gap: 10px;
       }

       .toast-close-button {
         background: none;
         border: none;
         color: #fff;
         font-size: 16px;
         cursor: pointer;
       }

       .toast-close-button:hover {
         color: #ccc;
       }
     `;
    document.head.appendChild(style);
  }

  // Append toast
  document.body.appendChild(toast);
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

    const isVerdictAvailable = await chrome.runtime.sendMessage({
      type: "termsFound",
      originUrl: currentUrl,
      matchingElements: [matchingElementsPolicy],
      matchingElementsPolicy: matchingElementsPolicy,
    });

    if (isVerdictAvailable) {
      injectToast();
    }
  }
})();
