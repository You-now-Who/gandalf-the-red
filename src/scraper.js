chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'parseHTML') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(message.html, "text/html");
  
      const mainContent = doc.querySelector("main") || doc.body;
      const textContent = mainContent.innerText.trim();

      sendResponse({ text: textContent });
      return true;
    }
  });
  