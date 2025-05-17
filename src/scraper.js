chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'parseHTML') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(message.html, "text/html");
  
      // Prefer the main content node
      let contentRoot =
        doc.querySelector("main") ||
        doc.querySelector("article") ||
        doc.body;
  
      // Remove UI/boilerplate elements that clutter the content
    contentRoot.querySelectorAll("nav, header, footer, aside, script, style, noscript").forEach(el => el.remove());  
      // Extract only visible text
      const textContent = contentRoot.innerText.trim();
  
      sendResponse({ text: textContent });
      return true; // Keep the message channel open for async response
    }
  });