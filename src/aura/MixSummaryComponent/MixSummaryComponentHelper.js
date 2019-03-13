({
	handleChangeChkboxValHelper: function(component,event,helper) {
		var getMixLength = event.getParam("mixLength");
        var gettrackCount=event.getParam("trackCount");
        component.set("v.lengthOfSongAtt",getMixLength);
        component.set("v.trackCountAtt",gettrackCount);
        var remTrack=20-parseInt(gettrackCount);
        var remMixLength=90.00-parseFloat(getMixLength);
        component.set("v.remTrackAtt",remTrack);
        component.set("v.remMixLengthAtt",remMixLength);
	}
})