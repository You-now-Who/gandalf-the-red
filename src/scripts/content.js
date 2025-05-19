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
      gifUrl: "https://gifdb.com/images/high/smiling-gandalf-saying-no-6050j9wlqorn7adp.gif",
    },
    B: {
      phrase: "Bonum", // Good
      gandalfPhrase: "Second Breakfast Approved",
      color: "#f4e4c1", // Slightly darker parchment
      borderColor: "#9c6644", // Richer brown border
      textColor: "#3e2723", // Dark brown text
      glow: "0 0 10px #ffd700", // Subtle gold glow for B
      backgroundGradient: "linear-gradient(135deg, #f4e4c1 0%, #ecd5a7 100%)",
      gifUrl: "https://media1.tenor.com/m/SRvxzGVowVEAAAAC/breakfast-secondbreakfast.gif",
    },
    C: {
      phrase: "Acceptabile", // Acceptable
      gandalfPhrase: "Proceed with Caution",
      color: "#efe0b9", // Warmer parchment tone
      borderColor: "#8d5524", // Darker brown border
      textColor: "#3e2723", // Dark brown text
      glow: "0 0 20px #ffa500", // Orange glow for C
      backgroundGradient: "linear-gradient(135deg, #efe0b9 0%, #f3c89a 100%)",
      gifUrl: "https://64.media.tumblr.com/0111540a582b7c6ed40616d070b6fc04/tumblr_mlxmd1Z7TL1qf5tr5o1_250.gifv",
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
      gifUrl: "https://media.tenor.com/EgvXcIbZLqgAAAAM/gandalf-the-grey-lord-of-the-rings.gif",
    },
  };

  console.log(verdictObj);

  const grade = verdictObj.overallGrade;
  const card = document.createElement("div");
  card.className = "profile-card";
  
  // Close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×"; // Using × character instead of X
  closeButton.className = "profile-close-button";
  closeButton.addEventListener("click", () => card.remove());
  card.appendChild(closeButton);

  // Content container (to separate from the scroll edges)
  const contentContainer = document.createElement("div");
  contentContainer.className = "profile-content";
  card.appendChild(contentContainer);

  // Add runic border container - add before content container
  const runicBorderContainer = document.createElement("div");
  runicBorderContainer.className = "runic-border-container";
  card.appendChild(runicBorderContainer);  // This adds the runic container behind the content

  // Add Elder Futhark runes around the border
  const runicText = "ᚲᚢᛊᛏᛟᛞᛟ ᛊᛖᚲᚱᛖᛏᛁ"; // The runes you provided
  const expandedRunicText = runicText.repeat(6).replace(/\s+/g, ''); // Repeat runes and remove spaces to have enough characters
  
  // Create runes around the border
  const numberOfRunes = 48; // Reduced number of runes for a more subtle effect
  const runeElements = [];
  
  for (let i = 0; i < numberOfRunes; i++) {
    const rune = document.createElement("span");
    rune.className = "runic-character";
    rune.textContent = expandedRunicText[i % expandedRunicText.length];
    
    // Calculate position around the border
    const angle = (i * (360 / numberOfRunes)) * (Math.PI / 180);
    const radius = 150; // Reduced radius to bring runes closer to content edge
    
    // Position rune
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    rune.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI/2}rad)`;
    runicBorderContainer.appendChild(rune);
    runeElements.push(rune);
  }

  // Logo circle with letter
  const logo = document.createElement("div");
  logo.className = "profile-logo";
  const letter = document.createElement("span");
  letter.className = "profile-letter";
  letter.textContent = grade;
  letter.style.textShadow = gradeData[grade].glow; // Apply glow effect to the grade letter
  logo.appendChild(letter);
  contentContainer.appendChild(logo);

  // Title
  const title = document.createElement("h2");
  title.className = "profile-title";
  title.textContent = gradeData[grade].phrase;
  contentContainer.appendChild(title);

  // Add Gandalf's message
  const disapprovalMessage = document.createElement("p");
  disapprovalMessage.className = "profile-message";
  disapprovalMessage.textContent = gradeData[grade].gandalfPhrase;
  contentContainer.appendChild(disapprovalMessage);

  // Add Gandalf GIF
  const gandalfGif = document.createElement("img");
  gandalfGif.className = "profile-gandalf-gif";
  gandalfGif.src = gradeData[grade].gifUrl;
  gandalfGif.alt = "Gandalf reaction";
  contentContainer.appendChild(gandalfGif);

  // Button
  const detailsButton = document.createElement("button");
  detailsButton.className = "profile-details-button";
  detailsButton.textContent = "See Details";
  contentContainer.appendChild(detailsButton);

  // Inject styles once
  if (!document.getElementById("profile-card-style")) {
    const style = document.createElement("style");
    style.id = "profile-card-style";
    style.textContent = `
      /* LOTR-Style Parchment Toast */
      .profile-card {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 350px;
        min-height: 450px;
        z-index: 10000;
        font-family: 'Cinzel Decorative', 'Luminari', 'Georgia', serif;
        text-align: center;
        color: ${gradeData[grade].textColor};
        
        /* Parchment-like background with gradient */
        background: ${gradeData[grade].backgroundGradient};
        
        /* Box styling */
        padding: 2rem 1.5rem;
        border: none;
        box-shadow: 
          0 5px 15px rgba(0, 0, 0, 0.3),
          inset 0 0 10px rgba(139, 94, 60, 0.2),
          ${gradeData[grade].glow === 'none' ? '' : gradeData[grade].glow}; /* Apply external glow based on grade */
        
        /* Decorative borders */
        border-top: 4px double ${gradeData[grade].borderColor};
        border-bottom: 4px double ${gradeData[grade].borderColor};
        
        /* Subtle texture */
        overflow: hidden;
      }
      
      /* Runic border styling */
      .runic-border-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        z-index: 3;
        pointer-events: none;
      }
      
      .runic-character {
        position: absolute;
        transform-origin: center;
        font-family: 'Noto Sans Runic', sans-serif;
        font-size: 1.2rem;
        color: ${gradeData[grade].borderColor};
        opacity: 0.85;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
      }
      
      /* Scroll-like edges */
      .profile-card:before,
      .profile-card:after {
        content: "";
        position: absolute;
        width: 20px;
        height: 100%;
        top: 0;
        background-color: #d9bf9b;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }
      
      .profile-card:before {
        left: -10px;
        border-radius: 10px 0 0 10px;
      }
      
      .profile-card:after {
        right: -10px;
        border-radius: 0 10px 10px 0;
      }
      
      /* Content positioning */
      .profile-content {
        position: relative;
        z-index: 2;
      }
      
      .profile-close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: ${gradeData[grade].textColor};
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 3;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .profile-close-button:hover {
        opacity: 1;
      }
      
      .profile-logo {
        width: 100px;
        height: 100px;
        border: 3px solid ${gradeData[grade].borderColor};
        border-radius: 50%;
        margin: 0 auto 1.5rem auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${gradeData[grade].color}; /* Solid background to hide runes */
        box-shadow: inset 0 0 10px rgba(139, 94, 60, 0.2);
        position: relative;
        z-index: 3; /* Make sure logo is above runes */
      }
      
      .profile-letter {
        font-family: 'UnifrakturCook', 'Copperplate', 'Luminari', cursive;
        font-size: 4rem;
        color: ${gradeData[grade].borderColor};
      }
      
      .profile-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: ${gradeData[grade].textColor};
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        letter-spacing: 1px;
        font-family: 'Cinzel Decorative', serif;
      }
      
      .profile-message {
        font-size: 1.2rem;
        margin: 1rem 0;
        color: ${gradeData[grade].textColor};
        line-height: 1.4;
        font-family: 'Cinzel Decorative', serif;
        font-variant: small-caps;
      }
      
      .profile-gandalf-gif {
        display: block;
        margin: 1rem auto;
        border: 2px solid ${gradeData[grade].borderColor};
        border-radius: 5px;
        max-width: 200px;
        max-height: 150px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
      }
      
      .profile-details-button {
        background: ${gradeData[grade].borderColor};
        border: 2px solid ${gradeData[grade].borderColor};
        color: ${gradeData[grade].color};
        padding: 0.6rem 1.2rem;
        margin-top: 1rem;
        font-size: 1.1rem;
        cursor: pointer;
        font-family: 'Cinzel Decorative', serif;
        letter-spacing: 0.5px;
        transition: all 0.3s;
        border-radius: 0;
      }
      
      .profile-details-button:hover {
        background-color: transparent;
        color: ${gradeData[grade].textColor};
      }
      
      /* Animation */
      @keyframes parchment-appear {
        0% {
          opacity: 0;
          transform: translate(-50%, -40%) rotateZ(-1deg);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) rotateZ(0deg);
        }
      }
      
      /* Runic animation - more subtle */
      @keyframes runic-glow {
        0% { opacity: 0.15; }
        50% { opacity: 0.25; }
        100% { opacity: 0.15; }
      }
      
      .runic-character {
        animation: runic-glow 5s infinite ease-in-out; /* Slower animation for subtlety */
      }
      
      /* Stagger the animation for each rune */
      .runic-character:nth-child(4n) {
        animation-delay: 0.3s;
      }
      
      .runic-character:nth-child(4n+1) {
        animation-delay: 0.6s;
      }
      
      .runic-character:nth-child(4n+2) {
        animation-delay: 0.9s;
      }
      
      .profile-card {
        animation: parchment-appear 0.7s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    // Load custom fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=UnifrakturCook:wght@700&family=Noto+Sans+Runic&display=swap";
    document.head.appendChild(link);
  }

  // Append to DOM
  document.body.appendChild(card);
}

function injectScrollNotification(verdictObj) {
  // Create the scroll notification
  const scrollNotification = document.createElement("div");
  scrollNotification.className = "scroll-notification";
  
  // Create message element (to keep text content separate from close button)
  const messageEl = document.createElement("div");
  messageEl.className = "scroll-notification-message";
  messageEl.textContent = "Privacy Verdict ready. Click here to see...";
  scrollNotification.appendChild(messageEl);

  // Add title (optional but enhances LOTR feel)
  const titleEl = document.createElement("div");
  titleEl.className = "scroll-notification-title";
  titleEl.textContent = "Message from the Council";
  scrollNotification.insertBefore(titleEl, messageEl);

  // Close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×"; // Using the × character instead of X
  closeButton.className = "scroll-close-button";
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the notification click event
    scrollNotification.remove();
  });
  scrollNotification.appendChild(closeButton);

  // Add click event to show the full toast
  scrollNotification.addEventListener("click", () => {
    scrollNotification.remove();
    injectToast(verdictObj);
  });

  // Inject styles once
  if (!document.getElementById("scroll-notification-style")) {
    const style = document.createElement("style");
    style.id = "scroll-notification-style";
    style.textContent = `
    /* LOTR-Style Parchment Notification */
    .scroll-notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      transform: none;
      
      /* Parchment-like background */
      background-color: #f8f0d8;  
      background-image: 
        linear-gradient(to right, rgba(255,210,0,0.1) 0%, transparent 20%, transparent 80%, rgba(255,210,0,0.1) 100%),
        linear-gradient(to bottom, rgba(255,210,0,0.1) 0%, transparent 20%, transparent 80%, rgba(255,210,0,0.1) 100%);
      
      /* Text styling */
      color: #5d4037;
      font-family: 'Cinzel Decorative', 'Luminari', 'Georgia', serif;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
      line-height: 1.4;
      
      /* Box styling */
      width: 300px;
      padding: 1.5rem;
      border-radius: 0;
      border: none;
      box-shadow: 
        0 5px 15px rgba(0, 0, 0, 0.3),
        inset 0 0 10px rgba(139, 94, 60, 0.2);
      
      /* Decorative borders */
      border-top: 4px double #a87e58;
      border-bottom: 4px double #a87e58;
      
      /* Other */
      z-index: 10001;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      /* Subtle texture */
      overflow: hidden;
    }

    /* Scroll-like edges - Fixed version without nesting */
    .scroll-notification:before,
    .scroll-notification:after {
      content: "";
      position: absolute;
      width: 20px;
      height: 100%;
      top: 0;
      background-color: #d9bf9b;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
    
    .scroll-notification:before {
      left: -10px;
      border-radius: 10px 0 0 10px;
    }
    
    .scroll-notification:after {
      right: -10px;
      border-radius: 0 10px 10px 0;
    }

    /* Title styling */
    .scroll-notification-title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      font-variant: small-caps;
      text-align: center;
      width: 100%;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
      position: relative;
      z-index: 2;
    }
    
    /* Message styling */
    .scroll-notification-message {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    /* Close button */
    .scroll-close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 1.2rem;
      color: #8b5e3c;
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 3;
    }
    
    .scroll-close-button:hover {
      opacity: 1;
    }
    
    /* Animation */
    @keyframes parchment-appear {
      0% {
        opacity: 0;
        transform: translateY(-20px) rotateZ(-1deg);
      }
      100% {
        opacity: 1;
        transform: translateY(0) rotateZ(0deg);
      }
    }
    
    .scroll-notification {
      animation: parchment-appear 0.7s ease-out forwards;
    }
    `;
    document.head.appendChild(style);
  }

  // Append to DOM
  document.body.appendChild(scrollNotification);

  // Auto-remove after 5 seconds
  // setTimeout(() => {
  //   if (scrollNotification.parentElement) {
  //     scrollNotification.remove();
  //   }
  // }, 5000);
}

// Modify the main function to use the scroll notification
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
      injectScrollNotification(verdictObj.verdict); // Show the scroll notification
    }
  }
})();
