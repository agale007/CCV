({
	handleMixSummaryEvent: function(component,event,helper) {
		 var trackcnt = event.getParam("TrackCount");
      
        var tracklegth=event.getParam("TrackLength");
        var maxcount=20-trackcnt;
        var maxlegth=90-tracklegth;
      
        // set the handler attributes based on event data
        component.set("v.trackcount",trackcnt);
        component.set("v.remainigtrack",maxcount);
        component.set("v.dislength", tracklegth);
        component.set("v.disremaininglength", maxlegth);
     

	}
})