({
	doInit: function(component, event, helper) {
		helper.doInitHelper(component, event, helper);
	},
    save : function(component, event, helper) {
        helper.saveHelper(component, event, helper);
		
	},
     cancel:function(component, event, helper){
        helper.cancelHelper(component, event, helper);
    },
    updateMixSummary:function(component,event,helper){
         helper.updateMixSummaryHelper(component, event, helper);
    },
    
    onChange: function(component, event, helper){
        helper.onChangeHelper(component, event, helper);
    },
    
    next : function(component, event, helper){
        helper.nextHelper(component, event, helper);
    },
    
    previous : function(component, event, helper){
        helper.previousHelper(component, event, helper);
    },
})