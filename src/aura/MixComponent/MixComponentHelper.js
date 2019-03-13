({
    saveHelper:function(component,event,helper){
        if(helper.validateForm(component,event,helper)){
            var getMix =component.get("v.mixRecord");
            var getSelectedSongs=component.get("v.songRecord");
            var selectedSongs=JSON.stringify(getSelectedSongs);
            console.log('selected songs in save method---->'+JSON.stringify(getSelectedSongs));
            var action=component.get("c.insertMix");
            action.setParams({
                "mix":getMix,
                "songs":selectedSongs
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if(state == "SUCCESS"){
                    var result = response.getReturnValue();
                     var saveEvt = $A.get("e.force:navigateToSObject");
                     saveEvt.setParams({
                    "recordId": result,
                    "slideDevName": "related"
                });
                saveEvt.fire();
                    if(result==null){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error Message",
                            "duration":"200",
                            "message": "Track Count Exceed to that of Track Length!!!",
                            "type":"error",
                            "mode":"pester"
                        });
                        toastEvent.fire(); 
                    }
                    else{
                        component.set("v.mixRecord",result);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "duration":"2000",
                            "message": "The record has been Saved successfully.",
                            "type":"success",
                            "mode":"pester"
                        });
                        toastEvent.fire();
                    }
                }
                else {
                    alert('error');
                }
            });
            
            $A.enqueueAction(action);
        }
        else{
            console.log('in save helper toast ');
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error Message",
                "duration":"200",
                "message": "Required fields are Missing!!!.",
                "type":"error",
                "mode":"pester"
            });
            toastEvent.fire(); 
        }
        
    },
    
    validateForm: function(component,event,helper) 
    {
        var validField = true;
        var  getName=component.find("nameId").get("v.value");
        var getCustomer=component.find("custId").get("v.value");
        if(getName==''|| getCustomer=='')
        {
            validField=false;
            component.set("v.recordError","Required fields are missing");
            return validField;
        }
        else
        {
            return validField;
        }
    },
    
    getSongListHelper:function(component,event,helper)
    {
        var getSongs=event.getParam("songList");
        var songs = JSON.parse(JSON.stringify(getSongs));
        var songsArr=new Array();
        component.set("v.songRecord",songs); 
    },
    
    cancelHelper:function(component,event,helper)
    {
        var getRecordId = component.get("v.recordId");
        console.log('id'+getRecordId);
        if(getRecordId==null){
            window.location ='//ccvapp-dev-ed.lightning.force.com/lightning/o/Mix__c/list?filterName=Recent';
        }
        else{
            window.location ='//ccvapp-dev-ed.lightning.force.com/lightning/r/Mix__c/'+getRecordId+'/view';
        } 

        
    },
    doinitHelper:function(component,event,helper)
    {var recId=component.get("v.recordId");
     console.log('id'+recId);
     var action = component.get("c.getMixRecord");
     action.setParams({
         "mixId": recId
         
     });
     action.setCallback(this, function(response) {
         var state = response.getState();
         if (state === "SUCCESS") {
             component.set("v.mixRecord",response.getReturnValue());
         }
         else {
             console.log("Failed with state: " + state);
         }
     });
     
     $A.enqueueAction(action);
     
     //helper.getMixDetails(component,event,helper);
    },
    /*    getMixDetails:function(component,event,helper){
        var recId=component.get("v.recordId");
        console.log('id'+recId);
        var action = component.get("c.getMixRecord");
        action.setParams({
            "mixId": recId
            
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.mixRecord",response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
    },
    */
})