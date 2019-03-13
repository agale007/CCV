({
    doInit: function(component, event, helper) {
        helper.doInitHelper(component, event);
    },
      onChange: function(component, event, helper){
        helper.onChangeHelper(component, event, helper);
            
    },
    /* javaScript function for pagination */
    navigation: function(component, event, helper)
    { helper.navigation(component, event,helper);
    },
    /*{
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
    },*/
 
    selectAllCheckbox: function(component, event, helper) 
       { helper.selectAllCheckbox(component, event,helper);
    },
    /*{
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
       { helper.checkboxSelect(component, event,helper);
    },
        
    updateMixSummary: function(component, event, helper){
        helper.updateMixSummaryHelper(component, event, helper);
    },
    /*{
        // on each checkbox selection update the selected record count 
      var selected = component.find("selectId");
        var selectedRec = event.getSource().get("v.text"); 
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
        
        var allRecords = component.get("v.listOfAllSongs");
        var selectedRecords = [];
        for (var i = 0; i < allRecords.length; i++) {
            if (allRecords[i].isChecked) {
                selectedRecords.push(allRecords[i].objSong);
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
    },*/
    
   
 
    getSelectedRecords: function(component, event, helper) 
       { helper.getSelectedRecords(component, event,helper);
    },
    /*{
        var allRecords = component.get("v.listOfAllSongs");
        var selectedRecords = [];
        for (var i = 0; i < allRecords.length; i++) {
            if (allRecords[i].isChecked) {
                selectedRecords.push(allRecords[i].objSong);
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
    },*/
    


    

})