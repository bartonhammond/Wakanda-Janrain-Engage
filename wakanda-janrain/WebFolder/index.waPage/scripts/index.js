
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		if (typeof window.janrain !== 'object') window.janrain = {};
        if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
    
        janrain.settings.tokenUrl = 'http://www.trashers.org/janrainresponse.html';

        janrain.ready = true;

        var e = document.createElement('script');
        e.type = 'text/javascript';
        e.id = 'janrainAuthWidget';

        if (document.location.protocol === 'https:') {
          e.src = 'https://rpxnow.com/js/lib/trashers/engage.js';
        } else {
          e.src = 'http://widget-cdn.rpxnow.com/js/lib/trashers/engage.js';
        }

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(e, s);
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
