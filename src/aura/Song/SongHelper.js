({
	   doinitHelper : function(component,event,helper) {
           var actionOne = component.get("c.getGenreList");
          console.log("pick"+actionOne);
        var songGenreList = [];
        actionOne.setCallback(this, function(response){
            var state = response.getState();
            if(state=="SUCCESS"){
                var picklistValues = response.getReturnValue();
                console.log("pick"+picklistValues);
                for(var i=0; i<picklistValues.length; i++){
                    songGenreList.push(JSON.parse(JSON.stringify(picklistValues[i].strValue)));
                    console.log("picklistValues :" + songGenreList);
                }
                component.set("v.picklistValues",songGenreList);
            }
        });
        $A.enqueueAction(actionOne);
        var columns = [
            {
                type: 'text',
                fieldName: 'songName',
                label: 'Song Name',
                initialWidth:300
            },
            
            {
                type: 'text',
                fieldName: 'genre',
                label: 'Genre'
                
            },
            
            {
                type: 'number',
                fieldName: 'length',
                label: 'Length (m)'
                
            }
        ];
        
        component.set("v.dataTableColumns", columns);
        
        var action=component.get("c.getSongs");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var resultData = response.getReturnValue();
                for (var i=0; i<resultData.length; i++ ) {
                    var songName = resultData[i]['Name'];
                    var genre=resultData[i]['Genre__c'];
                    var length=resultData[i]['Length_m__c'];
                    
                    resultData[i].songName = songName;
                    resultData[i].genre = genre;
                    resultData[i].length = length;
                    
                } 
                component.set("v.tableData", resultData);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
        
    },
    
    updateTrackCntHelper: function(component,event,helper){
        var selectedRows = event.getParam('selectedRows');
        var lengthOfSelSongs=0;
           var trackCnt=0;
        for (var i = 0; i < selectedRows.length;i++){
            var length = (selectedRows[i].Length_m__c);
                lengthOfSelSongs+=parseFloat(length);
            trackCnt=i+1;
        }
        console.log('selected songs list--'+lengthOfSelSongs);
        console.log('selected songs--'+trackCnt);
        var getEvent= component.getEvent("mixSummary");
        getEvent.setParams({
            "TrackCount":trackCnt,
            "TrackLength":lengthOfSelSongs
        });
        console.log('trackCnt'+trackCnt);
        getEvent.fire();
        console.log('after evet');
       
        
    },
     onChangeHelper: function(component,event,helper){

        var getGenre=component.find("select").get("v.value");
      
        var action = component.get("c.ChooseGenre");
        action.setParams({
            "genre":getGenre
        });
        
        action.setCallback(this,function(response){
            var state=response.getState();
            if (state === "SUCCESS") {
               var resultData = response.getReturnValue();
                for (var i=0; i<resultData.length; i++ ) {
                    var songName = resultData[i]['Name'];
                    var genre=resultData[i]['Genre__c'];
                    var length=resultData[i]['Length_m__c'];
                    resultData[i].songName = songName;
                    resultData[i].genre = genre;
                    resultData[i].length = length;   
                } 
                component.set("v.tableData", resultData);
                component.set("v.isLoading",false);
                
            }
            else{
                alert("Failed to sort by genre");
            }
            
        });
        $A.enqueueAction(action);    
 
    
        
    }
})