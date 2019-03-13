public class MixComponentCtrl {
    
    //===================Save Mix Record==================================//
    @AuraEnabled
    public static ID saveMix(Mix__c mixObj,List<Song__c> songsList){
        List<Track__c>trackList=new List<Track__c>();
       
        try {
            mixObj.Customer__r=null;
            upsert mixObj;
            
        } catch(DmlException exp) {
            System.debug(exp.getMessage());
        }
        
        for(Song__c song:songsList){
            Track__c track=new Track__c();
            track.Song__c = song.Id;
            track.Mix__c = mixObj.Id;
            trackList.add(track);
        }
        try{
            insert trackList;
            //updateGenre(mixObj,trackList);
        }
        catch(DmlException exp) {
            System.debug(exp.getMessage());
        }
        
        return mixObj.Id;
    }
    
    
    @AuraEnabled
    public static ID insertMix(Mix__c mix,String songs){
        List<Song__c>songsList=(List<Song__c>)System.JSON.deserialize(songs,List<Song__c>.class);
        List<Track__c>trackList=new List<Track__c>();
        for(Song__c song:songsList){
            if(song.Track_Count__c==song.Track_Licenses__c){
                return null;
            }
        }
        
        try {
            mix.Customer__r=null;
            upsert mix;
            
        } 
        catch(DmlException exp) {
            System.debug(exp.getMessage());
        }
        for(Song__c song:songsList){
            Track__c track=new Track__c();
            track.Song__c = song.Id;
            track.Mix__c = mix.Id;
            trackList.add(track);
        }
        try{
            insert trackList;
        }
        catch(DmlException exp) {
            System.debug(exp.getMessage());
        }
        return mix.Id;
    }
    //=========================Get Mix Deatails By using  Mix Id===========================//    
    @AuraEnabled
     public static Mix__c getMixDetails(Id mixId){
        return[SELECT Id,Name,Customer__r.Name,Primary_Genre__c,Secondary_Genre__c
              FROM Mix__c
              WHERE Id=:mixId];
    }   
       
    
}