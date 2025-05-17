chrome.runtime.onMessage.addListener(function(request, sender){
    if (request.type == "termsFound"){
        console.log(request.originUrl);
        console.log(request.matchingElementsPolicy)
        // chrome.tabs.create({ url: request.matchingElementsPolicy[0]});
    }
})