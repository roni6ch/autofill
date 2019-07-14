chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request.dom);
    chrome.runtime.sendMessage({'answer':'from tab'});
    
});
