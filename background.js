/*-------------------------------------------------------------------------------------------------------------------------------------------
 * DedicatedWindowForGoogleDocs - Chrome Extension
 * Open your Google Docs, Sheets and Slides documents in separated and dedicated windows, without an address bar or browser buttons.
 * V1 - 10/10/2021
 * By Julien MEUGNIER
 * https://github.com/jul-m/DedicatedWindowForGoogleDocs
\*-------------------------------------------------------------------------------------------------------------------------------------------*/


// Contain list of created Dedicated Windows ID with this Extension to not reopen a new window from the already created window
gDocWindowsIDs = [];

//Lists of IDs of the "sources" tabs that triggered the opening of the new window thanks to this extension, so as not to repeat the opening of a new window several times while waiting for it to be closed
gDocTabsClodedsIDs = []; 

// At each change of a tab (opening, change of url)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){

	// We check that it's a URL of a Google document, and that we have not already processed this event
    if (tab.url.startsWith("https://docs.google.com/") && !gDocWindowsIDs.includes(tab.windowId) && !gDocTabsClodedsIDs.includes(tab.id))
    {
		// The "source" tab is an unprocessed Google document...
		
		// The "onUpdated" function can be called several times before closing "source" tab. We put the ID of the source tab in memory so as not to open several times before closing the source tab. 
        gDocTabsClodedsIDs.push(tab.id);
		
        chrome.tabs.remove(tabId); // Close "source" tab

		// Create pop-up with same url of the "source" tab
        chrome.windows.create({url: tab.url, type: "popup", top: 0, left: 0, width: 1200, height: 1000}, function (windowCreated) {
			
			/* Put created window ID in the list of created windows for ignore this to next "onUpdated" event, because the url of the new window also starting the same address,
				the function would be executed again and is Chrome would create the window again in an infinite way.
			*/
            gDocWindowsIDs.push(windowCreated.id);
        });
    }
})