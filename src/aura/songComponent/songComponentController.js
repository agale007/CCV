({
	doinit : function(component, event, helper) {
		helper.doinitHelper(component, event, helper);
      //  helper.doFetchSong(component);
	},
    
    updateMixSummary: function(component, event, helper){
        helper.updateMixSummaryHelper(component, event, helper);
    },
    
    onChange: function(component, event, helper){
        helper.onChangeHelper(component, event, helper);
    },
    
    handleHeaderAction: function(component, event, helper){
         helper.handleHeaderActionHelper(component, event, helper);
    },
    
    next: function (component, event, helper) {
    helper.next(component, event);
	},
    
    previous: function (component, event, helper) {
    helper.previous(component, event);
	},
})