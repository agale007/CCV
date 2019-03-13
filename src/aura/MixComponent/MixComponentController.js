({
    doinit : function(component, event, helper) {
        helper.doinitHelper(component, event, helper);
		
	},
    save : function(component, event, helper) {
        helper.saveHelper(component, event, helper);
		
	},
    
    getSongList: function(component, event, helper){
        helper.getSongListHelper(component, event, helper);
    },
    
    cancel : function(component,event,helper){
    	helper.cancelHelper(component,event,helper);
	},
})