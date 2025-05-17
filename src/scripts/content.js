console.log("Content Script loaded");

function getElementsByText(text) {
  const allElements = document.querySelectorAll("a"); // Select all elements
  const matchingElements = [];

  for (const element of allElements) {
    if (element.textContent.toLowerCase() === text.toLowerCase()) {
      matchingElements.push(element);
    }
  }
  return matchingElements;
}

function getElementsByTextContain(text) {
  const allElements = document.querySelectorAll("a"); // Select all elements
  const matchingElements = [];

  for (const element of allElements) {
    if (element.textContent.toLowerCase().includes(text.toLowerCase())) {
      matchingElements.push(element);
    }
  }
  return matchingElements;
}

matchingElementsPrivacy = getElementsByTextContain("Privacy");
matchingElementsTerms = getElementsByTextContain("Terms");
console.log(matchingElementsTerms);
