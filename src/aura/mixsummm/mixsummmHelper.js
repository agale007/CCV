({
	doInitHelper: function(component, event, helper) {
         var action = component.get("c.getPicklistValues");
      var recid=component.get("v.recordId");
        console.log('record id---->'+recid);
       
     
                
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS") {
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
    },
               
        
    loadData:function(component,event,helper){
        var pageSize=component.get("v.pageSize");
        var action=component.get("c.getSongsList");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var wrapperSongs = response.getReturnValue();
                console.log('wrapperSongs in load data'+wrapperSongs);
                component.set('v.wrapSongsList', wrapperSongs); 
                component.set("v.totalSize", component.get("v.wrapSongsList").length);
                component.set("v.start",0);
                component.set("v.end",component.get("v.pageSize")-1);
                var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                var paginationList = [];
                for(var i=0; i< component.get("v.pageSize"); i++){
                    paginationList.push(wrapperSongs[i]);    
                }
                component.set("v.paginationList", paginationList);
                //component.set("v.totalPages",totalPages);
            }
            else {
                alert('error');
            }
        });
        
        $A.enqueueAction(action);
        
    },
    
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
    
    cancelHelper:function(component,helper,event){
        var homeEvt = $A.get("e.force:navigateToObjectHome");
        homeEvt.setParams({
         "scope": "Mix__c"
       });
    homeEvt.fire();
        /*var getRecordId = component.get("v.recordId");
        if(getRecordId==null){
            window.location ='//ccvapp-dev-ed.lightning.force.com/lightning/r/Mix__c/list?filterName=Recent&0.source=alohaHeader';
        }
        else{
            window.location ='//ccvapp-dev-ed.lightning.force.com/lightning/r/Mix__c/'+getRecordId+'/view?0.source=alohaHeader';
        } */
    },
    
    updateMixSummaryHelper:function(component,event,helper){
        var action=component.get("c.selectedSongsList");
        var songsList=component.get("v.wrapSongsList");
        var selectedSongsList= JSON.stringify(songsList);
        //console.log('in update mix summary'+selectedSongsList);
        var selectedSongsArr = [];
        songsList.forEach(function(song){
            if(song.selected){
                 selectedSongsArr.push(song);
            }
            
        });
         component.set("v.selectedSongsForGenre",selectedSongsArr);
       //console.log('in update mix summary selected songs--->'+JSON.stringify(component.get("v.selectedSongsForGenre")));
        action.setParams({
            "songs" :selectedSongsList
        });
         
        var lengthOfSelSongs=0;
        var trackCnt=0;
        for(var i = 0; i < selectedSongsList.length;i++){
            var length = (selectedSongsList[i].Length_m__c);
            lengthOfSelSongs+=parseFloat(length);
            trackCnt=i+1;
        }
        var getEvent= component.getEvent("mixSummary");
        getEvent.setParams({
            "trackCount":trackCnt,
            "mixLength":lengthOfSelSongs,
            "songList":selectedSongsList
        });
        getEvent.fire(); 
        
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
                component.set("v.trackCountAtt",trackCnt);
                component.set("v.lengthOfSongAtt",lengthOfSelSongs);
                if(lengthOfSelSongs<90 && trackCnt<3){
                    var remTrack=20-parseInt(trackCnt);
                    var remMixLength=90.00-parseFloat(lengthOfSelSongs);
                    component.set("v.remTrackAtt",remTrack);
                    component.set("v.remMixLengthAtt",remMixLength);
                }
                else{
                    if(trackCnt>3){
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
        var getSongslst=component.get("v.selectedSongs");
        var getSongslength=component.get("v.lengthOfSongAtt");
        
        if(getName==''|| getCustomer==''){
            validField=false;
             component.set("v.recordError","Required fields are missing");
            alert("Please Enter Mix Name and Customer Name");
            return validField;
        }
           else if(getSongslst.length>20)
           {
             validField=false;
            component.set("v.recordError","Please select limited song upto 20");
            alert("Please select limmited song upto 20");
            return validField;
            
        }
        else if(getSongslength>90){
             validField=false;
            component.set("v.recordError","Please select limited song upto 90");
            alert("Please select limmited song  length upto 90");
            return validField;
            
        }
        else{
            return validField;
        }
    },
    
    onChangeHelper: function(component,event,helper){
        var getGenre=component.find("select").get("v.value");
        var action = component.get("c.updateGenre");
        var selectedSongsList=component.get("v.selectedSongsForGenre");
        console.log('selected songslist-----in onchange method-->'+JSON.stringify(selectedSongsList));
        action.setParams({
            "genre":getGenre,
            "selectedSongs":JSON.stringify(selectedSongsList)
        });
         var pageSize=component.get("v.pageSize");
        action.setCallback(this,function(response){
            var state=response.getState();
            if (state === "SUCCESS") {
                var wrapperSongs = response.getReturnValue();
                component.set('v.wrapSongsList', wrapperSongs);
                if(getGenre=='--Any Genre--'){
                    component.set("v.totalSize", component.get("v.wrapSongsList").length);
                    var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                    component.set("v.start",0);
                    component.set("v.end",component.get("v.pageSize")-1);
                    var paginationList = [];
                    for(var i=0; i< component.get("v.pageSize"); i++){
                        paginationList.push(wrapperSongs[i]);    
                    }
                    component.set("v.paginationList", paginationList);
                    //component.set("v.totalPages",totalPages);
                }
                else{
                    
                    
                    var genreList=component.get("v.wrapSongsList");
                    console.log('genreList--->'+JSON.stringify(genreList));
                    component.set("v.totalSize", component.get("v.wrapSongsList").length);
                     var totalPages = Math.floor(component.get("v.totalSize")/ pageSize);
                    component.set("v.start",0);
                    component.set("v.end",component.get("v.pageSize")-1);
                    var paginationList = [];
                     component.set("v.totalSize",genreList.length-1);
                    for(var i=0; i< component.get("v.pageSize"); i++){
                        if(i<genreList.length){
                        paginationList.push(wrapperSongs[i]);
                        }
                    }
                    component.set("v.paginationList", paginationList);
                    //component.set("v.totalPages",totalPages);
                }
                
                
            }
            else{
                alert("Failed to sort by genre"); 
            }
            
        });
        $A.enqueueAction(action);   
    },
    
    nextHelper: function(component, event, helper){
        var wrapSongList = component.get("v.wrapSongsList");
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0, totalPages;
        component.set("v.totalSize",wrapSongList.length-1);
        
        for(var i=end+1; i<end+pageSize+1; i++)
        {
            //if(wrapSongList.length > end)
            if(i<wrapSongList.length)
            {
                paginationList.push(wrapSongList[i]);
                counter ++ ;
            }
        }
        start = start + counter;
        end = end + counter;
        
        component.set("v.start",start);
        component.set("v.end",end);
        component.set('v.paginationList', paginationList);
        //component.set("v.pageNumber",(start/pageSize)+1);
    },
    
    previousHelper: function(component, event, helper){
        var wrapSongList = component.get("v.wrapSongsList");
        var end = component.get("v.end");
        var start = component.get("v.start");
        var pageSize = component.get("v.pageSize");
        var paginationList = [];
        var counter = 0;
        var totalPages = component.get("v.totalPages");
        for(var i= start-pageSize; i < start ; i++)
        {
            if(i > -1)
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
        //component.set("v.pageNumber",(start/pageSize)+1);
    },
    
    
})