({
    doInitHelper : function(component, event, helper) {
        var mixId = component.get("v.recordId");
        if(mixId != null){
            helper.getMix(component, event, helper);
        }
        else{
            helper.getSongs(component, event, helper);
        }
    },
    
    saveHelper: function(component, event, helper){
        if(helper.validateMixRecord(component, event, helper)){
            var action = component.get("c.saveMix");
            action.setParams({
                "mix":component.get("v.mixRecord"),
                "songs":JSON.stringify(component.get("v.selectedSongs"))
            });
            
            action.setCallback(this, function(response){
                var state = response.getState();
                if(state == "SUCCESS"){
                    var recordId = response.getReturnValue().Id;
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "duration":"200",
                        "type": "success",
                        "message": "Record Saved Successfully!!!"
                    });
                    toastEvent.fire();   
                    window.location ='//pariharanil-dev-ed.lightning.force.com/lightning/r/Mix__c/'+recordId+'/view?0.source=alohaHeader';
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    cancelHelper:function(component,helper,event){
        var recordId = component.get("v.recordId");
        if(recordId==null){
            window.location ='//pariharanil-dev-ed.lightning.force.com/lightning/o/Mix__c/list?filterName=Recent&0.source=alohaHeader';
        }
        else{
            window.location ='//pariharanil-dev-ed.lightning.force.com/lightning/r/Mix__c/'+recordId+'/view?0.source=alohaHeader';
        } 
    },
    
      getSongs: function(component, event, helper){
        helper.getGenreList(component, event, helper);   
        var mixId = component.get("v.recordId");
        var pageSize = component.get("v.pageSize");
        
        var action = component.get("c.getSongs");  
        action.setParams({
            "mixId": mixId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var wrapperSongs = response.getReturnValue();
                component.set('v.wrapperSongsList', wrapperSongs); 
                component.set("v.totalSize", component.get("v.wrapperSongsList").length);
                var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                component.set("v.start",0);
                component.set("v.end",pageSize-1);
                var paginationList = [];
                for(var i=0; i< component.get("v.pageSize"); i++){
                    paginationList.push(wrapperSongs[i]);    
                }
                component.set("v.paginationList", paginationList);
                component.set("v.totalPages", totalPages);
                helper.songTableHelper(component, event, helper);
            }
            else{
                alert('error in getSongs method');              
            }
        }); 
        $A.enqueueAction(action);
        
    },
    
    nextHelper: function(component, event, helper){
        var wrapSongList = component.get("v.wrapperSongsList");
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0, totalPages;
        component.set("v.totalSize",wrapSongList.length-1);
        
        for(var i=end+1; i<end+pageSize+1; i++)
        {
            if(i<wrapSongList.length)
            {
                paginationList.push(wrapSongList[i]);
               
            }
             counter++;
        }
        var presentSongsMap = new Map(paginationList.map(obj => [obj.songObj.Id, obj]));
        start = start + counter;
        end = end + counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set('v.paginationList', Array.from(presentSongsMap.values()));
    },
    
     previousHelper: function(component, event, helper){
        var wrapSongList = component.get("v.wrapperSongsList");
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        var totalPages = component.get("v.totalPages");
        for(var i= start-pageSize; i < start ; i++)
        {
            if(i >-1)
            {
                paginationList.push(wrapSongList[i]);
                counter ++;
            }
            else
            {
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set('v.paginationList', paginationList);
        
    },

    getMix: function(component, event, helper){
        var mixId = component.get("v.recordId");
        var action = component.get("c.getMixData"); 
        action.setParams({
            "mixId": mixId
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                component.set("v.mixRecord", response.getReturnValue());
                helper.getSongs(component, event, helper);
            }
            else{
                alert('Error in get mix  method');
            }
        });
        $A.enqueueAction(action);
    },

    getGenreList: function(component, event, helper){
        var action = component.get("c.getPicklistValues");   
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var result = response.getReturnValue();
                var plValues = [];
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        strValue: result[i].strValue,
                        strLabel: result[i].strLabel
                    });
                }
                component.set("v.genreList", plValues);
            }
            else{
                alert('error in getGenreList Method');
            }
        });
        
        $A.enqueueAction(action);
    },
    
    onChangeHelper: function(component, event, helper){  
        var genre = component.find("select").get("v.value");
        var pageSize = component.get("v.pageSize");
        var mixId = component.get("v.recordId");
        var action = component.get("c.onGenreChanges");
        action.setParams({
            "genre": genre,
            "selectSngs": JSON.stringify(component.get("v.selectedSongs")),
            "mixId": mixId
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var wrapperSongs = response.getReturnValue();
                component.set("v.wrapperSongsList", wrapperSongs); 
                component.set("v.totalSize", component.get("v.wrapperSongsList").length);
                var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                component.set("v.start",0);
                component.set("v.end",component.get("v.pageSize")-1);
                var paginationList = [];
                for(var i=0; i<component.get("v.pageSize"); i++){
                    if(i < component.get("v.totalSize")){
                        paginationList.push(wrapperSongs[i]);  
                    }  
                }
                component.set("v.paginationList", paginationList);
            }
            else{
                alert('error in onChangeHelper method');
            }
        })
        $A.enqueueAction(action);
    },
    
    songTableHelper: function(component, event, helper){
        var mixId = component.get("v.recordId");
        var trCount = 0, mixLength = 0.0;
        var songs = component.get("v.wrapperSongsList");
        var selectedSongs = [];
        var presentSongs = component.get("v.selectedSongs");
        var presentSongsMap = new Map(presentSongs.map(obj => [obj.songObj.Id, obj]));
        
        songs.forEach(function(song){
                presentSongsMap.set(song.songObj.Id, song);
        });
         var presentSongsMapValues = Array.from(presentSongsMap.values());
        var array = [];  
        presentSongsMapValues.forEach(function(song){
            if(song.isSelected){
                array.push(song) ;
            }
        }); 
        
        var unique = new Map(array.map(obj => [obj.songObj.Name, obj]));   
        var uniques = Array.from(unique.values());
        if(uniques != null){
        uniques.forEach(function(song){
            if(song.isSelected){
                selectedSongs.push(song);
                if(song.songObj.Track_Count__c < song.songObj.Track_Licenses__c){
                    trCount++; 
                    mixLength = mixLength + song.songObj.Length_m__c;   
                }
                else{ 
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Warning!",
                        "duration":"200",
                        "type": "warning",
                        "message": "track count exceeded for song: "+ song.songObj.Name
                    });
                    toastEvent.fire();
                }
            }
        });
        }
        if(trCount>20){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Warning!",
                "duration":"200",
                "type": "warning",
                "message": "track count cannot exceeded more than 20!!!"
            });
            toastEvent.fire();
            component.set("v.trackCount", trCount);
            component.set("v.mixLength", mixLength);
            component.set("v.remTrackCount", 0);
            component.set("v.remMixLength",0);
            component.set("v.selectedSongs", selectedSongs);
        }
        else if( mixLength > 90){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Warning!",
                "duration":"200",
                "type": "warning",
                "message": "Mix length cannot exceeded more than 90!! "
            });
            toastEvent.fire();
            component.set("v.trackCount", trCount);
            component.set("v.mixLength", mixLength);
            component.set("v.remTrackCount", 0);
            component.set("v.remMixLength",0);
            component.set("v.selectedSongs", selectedSongs);
        }
        
        else{
            component.set("v.trackCount", trCount);
            component.set("v.mixLength", mixLength);
            component.set("v.remTrackCount", 20 - trCount);
            component.set("v.remMixLength", 90 - mixLength);
            component.set("v.selectedSongs", selectedSongs);
        } 
        
    },
    
    validateMixRecord: function(component, event, helper){
        var name = component.find("nameId").get("v.value"); 
        var cust = component.find("custId").get("v.value");
        var valid = true;
        var trCount = 0, mixLength = 0.0;
        var selectedSongs = component.get("v.selectedSongs");
        if(name !="" && cust !=""){ 
            if(selectedSongs != null){
                selectedSongs.forEach(function(song){
                    if(song.songObj.Track_Count__c == song.songObj.Track_Licenses__c){
                        valid = false;
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "ERROR!",
                            "duration":"200",
                            "type": "error",
                            "message": "track count exceed to track licence for song: "+ song.songObj.Name
                        });
                        toastEvent.fire();
                    }  
                });
                selectedSongs.forEach(function(song){
                    trCount++; 
                    mixLength = mixLength + song.songObj.Length_m__c;      		
                });
                
                if(trCount >=20){
                    valid = false;
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "duration":"200",
                        "type": "error",
                        "message": "track count cannot exceeded more than 20!!!"
                    });
                    toastEvent.fire();
                }
                
                else if(mixLength >= 90){
                     valid = false;
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "duration":"200",
                        "type": "error",
                        "message": "Mix length cannot exceeded more than 90!!"
                    });
                    toastEvent.fire();
                }
            }
            return valid;
        }
        else{
            valid = false;
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error!",
                "duration":"200",
                "type": "error",
                "message": "Required fields are Missing!!!! "
            });
            toastEvent.fire();
            return valid;
        }
    },    
})