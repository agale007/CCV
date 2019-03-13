({
 
    
    saveMixRecord: function(component,event,helper)
    {
        
          var getMix =component.get("v.mixRecord");
        console.log('get mix-->'+JSON.stringify(getMix));
        var getSongsArr=component.get("v.songRecord");
        console.log('in save-->'+JSON.stringify(getSongsArr));        
        var action=component.get("c.insertRecordToMix");
        
        
        
   action.setParams({
            "mixObj":getMix,
            "songsList":getSongsArr
            
            
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if (state === "SUCCESS") {
                component.set("v.mixRecord", response.getReturnValue());
                alert("Mix Inserted Successfully");
            }
            else{
                alert("Failed to insert");
            }
            
        });
        $A.enqueueAction(action);
        
        
    },
    
    
    
});