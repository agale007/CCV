({
   
     doInitHelper : function(component,event){ 
        var action = component.get("c.fetchSongWrapper");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){
                var oRes = response.getReturnValue();
                
                if(oRes.length > 0){
                    component.set('v.listOfAllSongs', oRes);
                    var pageSize = component.get("v.pageSize");
                    var totalRecordsList = oRes;
                    var totalLength = totalRecordsList.length ;
                    component.set("v.totalRecordsCount", totalLength);
                    component.set("v.startPage",0);
                    component.set("v.endPage",pageSize-1);
                    
                    var PaginationLst = [];
                    for(var i=0; i < pageSize; i++){
                        if(component.get("v.listOfAllSongs").length > i){
                            PaginationLst.push(oRes[i]);    
                        } 
                    }
                    component.set('v.PaginationList', PaginationLst);
                    component.set("v.selectedCount" , 0);
                    //use Math.ceil() to Round a number upward to its nearest integer
                    component.set("v.totalPagesCount", Math.ceil(totalLength / pageSize));    
                }else{
                    // if there is no records then display message
                    component.set("v.bNoRecordsFound" , true);
                } 
            }
            else{
                alert('Error...');
            }
        });
        $A.enqueueAction(action); 
        
        var action = component.get("c.getPicklistValues");
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
               
            }
            
        });
        $A.enqueueAction(action); 
    },
    onChangeHelper: function(component,event,helper){
       
        helper.checkboxSelect(component, event,helper);
        var getGenre=component.find("select").get("v.value");
                 console.log('songs'+getGenre);
        var action = component.get("c.updateGenre");
          
        action.setParams({
            "genre":getGenre
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
             var pageSize = component.get("v.pageSize");
             console.log('songs'+pageSize); 
             if (state === "SUCCESS"){
                  
                  var resultData = response.getReturnValue();
                 component.set('v.songsList', response.getReturnValue());
                
               // component.set("v.totalRecordsCount", component.get(response.getReturnValue()).length);
                component.set("v.startPage",0);
                component.set("v.endPage",pageSize-1);
                var paginationList = [];
                for(var i=0; i< pageSize; i++)
                {
                 paginationList.push(response.getReturnValue()[i]);    
    }
                    component.set('v.PaginationList', response.getReturnValue());
                   var allRecords = component.get("v.songsList");
        var selectedRecords = [];
        for (var i = 0; i < allRecords.length; i++) {
            if (allRecords[i].isChecked) {
                selectedRecords.push(allRecords[i].obj.Length_m__c);
            }
        }
        var lengthOfSelSongs=0;
        var trackCnt=0;
        for(var i = 0; i < selectedRecords.length;i++){
            var length = (selectedRecords[i].Length_m__c);
            lengthOfSelSongs+=parseFloat(length);
            trackCnt=i+1;
        }
        console.log('hfh'+lengthOfSelSongs);
        var getEvent= component.getEvent("mixSummary");
        getEvent.setParams({
            "trackCount":trackCnt,
            "mixLength":lengthOfSelSongs,
            "songList":selectedRecords
        });
        getEvent.fire(); 
 
           /* var lengthOfSelSongs=0;
        var trackCnt=0;
        for(var i = 0; i < resultData.length;i++){
            var length = (resultData[i].Length_m__c);
            lengthOfSelSongs+=parseFloat(length);
            trackCnt=i+1;
        }
        console.log('hfh'+lengthOfSelSongs);
        var getEvent= component.getEvent("mixSummary");
        getEvent.setParams({
            "trackCount":trackCnt,
            "mixLength":lengthOfSelSongs,
            "songList":resultData
        });
        getEvent.fire(); */
 
                
             }
               
        });
              $A.enqueueAction(action); 
              //helper.checkboxSelect(component, event, helper);
      },
    
 
    /* doInitHelper funcation to fetch all records, and set attributes value on component load */
   
    
    
    // navigate to next pagination record set   
    next : function(component,event,sObjectList,end,start,pageSize){
        var Paginationlist = [];
        var counter = 0;
        for(var i = end + 1; i < end + pageSize + 1; i++){
            if(sObjectList.length > i){ 
                if(component.find("selectAllId").get("v.value")){
                    Paginationlist.push(sObjectList[i]);
                }else{
                    Paginationlist.push(sObjectList[i]);  
                }
            }
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.PaginationList', Paginationlist);
    },
   // navigate to previous pagination record set   
    previous : function(component,event,sObjectList,end,start,pageSize){
        var Paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++){
            if(i > -1){
                if(component.find("selectAllId").get("v.value")){
                    Paginationlist.push(sObjectList[i]);
                }else{
                    Paginationlist.push(sObjectList[i]); 
                }
                counter ++;
            }else{
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.PaginationList', Paginationlist);
    },
     /* javaScript function for pagination */
    navigation: function(component, event, helper) 
    {
        var sObjectList = component.get("v.listOfAllSongs");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var whichBtn = event.getSource().get("v.name");
        // check if whichBtn value is 'next' then call 'next' helper method
        if (whichBtn == 'next') {
            component.set("v.currentPage", component.get("v.currentPage") + 1);
            helper.next(component, event, sObjectList, end, start, pageSize);
        }
        // check if whichBtn value is 'previous' then call 'previous' helper method
        else if (whichBtn == 'previous') {
            component.set("v.currentPage", component.get("v.currentPage") - 1);
            helper.previous(component, event, sObjectList, end, start, pageSize);
        }
    },
 
  /* selectAllCheckbox: function(component, event, helper) 
    {
        var selectedHeaderCheck = event.getSource().get("v.value");
        var updatedAllRecords = [];
        var updatedPaginationList = [];
        var listOfAllSongs = component.get("v.listOfAllSongs");
        
        var PaginationList = component.get("v.PaginationList");
        // play a for loop on all records list 
        for (var i = 0; i < listOfAllSongs.length; i++) {
            // check if header checkbox is 'true' then update all checkbox with true and update selected records count
            // else update all records with false and set selectedCount with 0  
            if (selectedHeaderCheck == true) {
                listOfAllSongs[i].isChecked = true;
               console.log('hfh'+ listOfAllSongs.length);
                component.set("v.selectedCount", listOfAllSongs.length);
            } else {
                listOfAllSongs[i].isChecked = false;
                component.set("v.selectedCount", 0);
            }
            updatedAllRecords.push(listOfAllSongs[i]);
        }
        // update the checkbox for 'PaginationList' based on header checbox 
        for (var i = 0; i < PaginationList.length; i++) {
            if (selectedHeaderCheck == true) {
                PaginationList[i].isChecked = true;
            } else {
                PaginationList[i].isChecked = false;
            }
            updatedPaginationList.push(PaginationList[i]);
        }
         console.log('hfh'+updatedAllRecords.Name);
        component.set("v.listOfAllSongs", updatedAllRecords);
        component.set("v.PaginationList", updatedPaginationList);
        
    },*/
 
    checkboxSelect: function(component, event, helper) 
    {        
        // on each checkbox selection update the selected record count 
      var selected = component.find("selectId");
       // selectAllId
        //var selectedRec = event.getSource();
           var selectedRec = event.getSource();
        console.log('hfh'+selectedRec);
        var getSelectedNumber = component.get("v.selectedCount");
        if (selectedRec == true) {
            getSelectedNumber++;
        } else {
            getSelectedNumber--;
            component.find("selectAllId").set("v.value", false);
        }
        component.set("v.selectedCount", getSelectedNumber);
        // if all checkboxes are checked then set header checkbox with true   
        if (getSelectedNumber == component.get("v.totalRecordsCount")) {
            component.find("selectAllId").set("v.value", true);
        }
               
        var allRecords = component.get("v.PaginationList");
          console.log('da'+JSON.stringify(allRecords));
        var selectedRecords = [];
        for (var i = 0; i < allRecords.length; i++) {
            if (allRecords[i].isChecked) {
                selectedRecords.push(allRecords[i].objSong);
            }
        }
        console.log('selected songs array-->'+JSON.stringify(selectedRecords));
        var lengthOfSelSongs=0;
        var trackCnt=0;
        for(var i = 0; i < selectedRecords.length; i++){
            var length = (selectedRecords[i].Length_m__c);
            lengthOfSelSongs+=parseFloat(length);
            trackCnt=i+1;
        }
        console.log('hfh'+lengthOfSelSongs);
        var getEvent= component.getEvent("mixSummary");
        getEvent.setParams({
            "trackCount":trackCnt,
            "mixLength":lengthOfSelSongs,
            "songList":selectedRecords
        });
        
        getEvent.fire(); 
       
    },
    
   
 
     updateMixSummaryHelper: function(component,event,helper){
        var selectedRows = component.get("v.songsList");
        console.log('selectedRows---->'+JSON.stringify(selectedRows));
        var lengthOfSelSongs=0;
        var trackCnt=0;
        for(var i = 0; i < selectedRows.length;i++){
            var length = (selectedRows[i].Length_m__c);
            lengthOfSelSongs+=parseFloat(length);
            trackCnt=i+1;
        }
        var getEvent= component.getEvent("mixSummary");
        getEvent.setParams({
            "trackCount":trackCnt,
            "mixLength":lengthOfSelSongs,
            "songList":selectedRows
        });
        getEvent.fire(); 
    },
    


    
      
    
  
    })