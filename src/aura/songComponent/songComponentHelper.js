({
    doinitHelper: function(component, event, helper) {
        var action = component.get("c.getPicklistValues");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                var plValues = [];
                for (var i = 0; i < result.length; i++) {
                    plValues.push({
                        strLabel: result[i].strLabel,
                        strValue: result[i].strValue
                    });
                }
                component.set("v.options",JSON.parse(JSON.stringify(plValues)));
                helper.loadData(component,event,helper);
            }
        })
        $A.enqueueAction(action);
     //   helper.getMixDetails(component,event,helper);
    },
    
    loadData:function(component,event,helper){
        var pageSize=component.get("v.pageSize");
        var action=component.get("c.getSongsList");
        var recId=component.get("v.songId");
        console.log('songcompid'+recId);
        action.setParams({
            "mixId": recId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var wrapperSongs = response.getReturnValue();
                console.log('wrapperSongs in load data'+wrapperSongs);
                component.set('v.wrapSongsList', wrapperSongs); 
                var c =component.get("v.wrapSongsList");   
                component.set("v.totalSize",c);
                component.set("v.start",0);
                component.set("v.end",component.get("v.pageSize")-1);
                var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                var paginationList = [];
                for(var i=0; i< component.get("v.pageSize"); i++){
                    paginationList.push(wrapperSongs[i]);    
                }
                component.set("v.paginationList", paginationList);
                //component.set("v.totalPages",totalPages);
                if(recId!=null){
                    helper.updateMixSummaryHelper(component,event,helper);
                }
                
            }
            else {
                alert('error');
            }
        });
        
        $A.enqueueAction(action);
        
    },
  /*  
    saveHelper:function(component,event,helper){
        if(helper.validateForm(component,event,helper)){
            var getMix =component.get("v.mixRecord");
            var getSelectedSongs=component.get("v.selectedSongs");
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
    
    cancelHelper:function(component,helper,event){
        var getRecordId = component.get("v.recordId");
        if(getRecordId==null){
            window.location ='//ccv-dev-ed.lightning.force.com/lightning/o/Mix__c/list?filterName=Recent&0.source=alohaHeader';
        }
        else{
            window.location ='//ccv-dev-ed.lightning.force.com/lightning/r/Mix__c/'+getRecordId+'/view?0.source=alohaHeader';
        } 
    },
 */   
    updateMixSummaryHelper:function(component,event,helper){
        var action=component.get("c.selectedSongsList");
        var songsList=component.get("v.wrapSongsList");
        var selectedSongsList= JSON.stringify(songsList);
        var alreadySelectedSongs=component.get("v.selectedSongsForGenre");
        console.log('alreadySelectedSongs-->'+JSON.stringify(alreadySelectedSongs));
        var selectedSongsArr =[];
        if(alreadySelectedSongs==''){
            console.log('in update summary if part');
            songsList.forEach(function(song){
                if(song.selected){
                    selectedSongsArr.push(song);
                }
                
            });
        }
        else{
            console.log('in update summary else part');
            //selectedSongsArr =alreadySelectedSongs;
            songsList.forEach(function(song){
                if(song.selected){
                    selectedSongsArr.push(song);
                }
               
            });
        }
        
       //var uniqueItems = Array.from(new Set(selectedSongsArr));
       var data=new Set(selectedSongsArr);
        var uniqueItems=[];
        data.forEach(function(song){
                     uniqueItems.push(song);
                     });
        
        console.log('unique values----->'+JSON.stringify(uniqueItems));
        component.set("v.selectedSongsForGenre",uniqueItems);
        console.log('in update mix summary selected songs--->'+JSON.stringify(component.get("v.selectedSongsForGenre")));
        action.setParams({
            "songs" :JSON.stringify(component.get("v.selectedSongsForGenre"))
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var result = response.getReturnValue();
                component.set("v.selectedSongs",result);
                var lengthOfSelSongs=0;
                var trackCnt=0;
                for(var i = 0; i< result.length;i++){
                    var length = (result[i].Length_m__c);
                    lengthOfSelSongs+=parseFloat(length);
                    trackCnt=i+1;
                }
                //-------------------------
                 var getEvent= component.getEvent("mixSummary");
     			 getEvent.setParams({
            "trackCount":trackCnt,
            "mixLength":lengthOfSelSongs,
            "songList":result
        });
        getEvent.fire(); 
                
                
                //--------------------------
                component.set("v.trackCountAtt",trackCnt);
                component.set("v.lengthOfSongAtt",lengthOfSelSongs);
                console.log("tcc"+trackCnt);
                console.log("lengthOfSelSongs"+lengthOfSelSongs);
                if(lengthOfSelSongs<90 && trackCnt<20){
                    var remTrack=20-parseInt(trackCnt);
                    var remMixLength=90.00-parseFloat(lengthOfSelSongs);
                    component.set("v.remTrackAtt",remTrack);
                    component.set("v.remMixLengthAtt",remMixLength);
                }
                //--------------------------
                else{
                    if(trackCnt>20){
                        component.set("v.lengthOfSongAtt",0);
                        component.set("v.trackCountAtt",0);
                        component.set("v.remTrackAtt",0);
                        component.set("v.remMixLengthAtt",0.0);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error Message",
                            "duration":"200",
                            "message": "You cannot select more than 20 songs!!!.",
                            "type":"error",
                            "mode":"pester"
                        });
                        toastEvent.fire(); 
                    }
                    else if(lengthOfSelSongs>90){
                        component.set("v.lengthOfSongAtt",0);
                        component.set("v.trackCountAtt",0);
                        component.set("v.remTrackAtt",0);
                        component.set("v.remMixLengthAtt",0.0);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error Message",
                            "duration":"200",
                            "message": "Mix Length Exceed 90!!!.",
                            "type":"error",
                            "mode":"pester"
                        });
                        toastEvent.fire();                         
                    }
                }
            }
            else {
                alert('error');
            }
        });
        $A.enqueueAction(action); 
    },
    
    validateForm: function(component,event,helper) {
        var validField = true;
        var  getName=component.find("nameId").get("v.value");
        var getCustomer=component.find("custId").get("v.value");
        if(getName==''|| getCustomer==''){
            validField=false;
            return validField;
        }
        else{
            return validField;
        }
    },
    
    onChangeHelper: function(component,event,helper){
        var getGenre=component.find("select").get("v.value");
        var action = component.get("c.updateGenre");
        /*var selectedSongsList=component.get("v.selectedSongsForGenre");
        if(getGenre!='--Any Genre--'){
        console.log('before genre change-->'+JSON.stringify(selectedSongsList));
            console.log('song set--->'+wrapSongSet);
         var selectedSongsArr =selectedSongsList;
        selectedSongsList.forEach(function(song){
            if(song.selected){
                selectedSongsArr.push(song);
            }
            
        });
        component.set("v.selectedSongsForGenre",selectedSongsArr);
        }*/
        var allSelectedSongs=component.get("v.selectedSongsForGenre");
        console.log('selected songslist-----in onchange method-->'+JSON.stringify(allSelectedSongs));
        action.setParams({
            "genre":getGenre,
            "selectedSongs":JSON.stringify(allSelectedSongs)
        });
        var pageSize=component.get("v.pageSize");
        action.setCallback(this,function(response){
            var state=response.getState();
            if (state === "SUCCESS") {
                var wrapperSongs = response.getReturnValue();
                component.set('v.wrapSongsList', wrapperSongs);
                component.set("v.totalSize", component.get("v.wrapSongsList").length);
                var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                component.set("v.start",0);
                component.set("v.end",component.get("v.pageSize")-1);
                var paginationList = [];
                for(var i=0; i< component.get("v.pageSize"); i++){
                    if(i< component.get("v.totalSize")){
                        paginationList.push(wrapperSongs[i]);
                    }
                }
                component.set("v.paginationList", paginationList);
            }
            else{
                alert("Failed to sort by genre"); 
            }
            
        });
      //   helper.updateMixSummaryHelper(component,event,helper);
        $A.enqueueAction(action);   
    },
    
    next: function(component, event, helper){
        var wrapSongList = component.get("v.wrapSongsList");
        console.log('in next method--->'+JSON.stringify(wrapSongList));
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
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.start",start);
        component.set("v.end",end);
        component.set('v.paginationList', paginationList);
    },
    
    previous: function(component, event, helper){
        var wrapSongList = component.get("v.wrapSongsList");
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
    
    getMixDetails:function(component,event,helper){
        var recId=component.get("v.recordId");
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
    
})