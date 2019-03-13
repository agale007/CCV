public class songController {
    @AuraEnabled
    public String strValue {get;set;}
    @AuraEnabled
    public String strLabel {get;set;}
    
    public songController(String strValue, String strLabel){
        this.strValue = strValue;
        this.strLabel = strLabel;
    }
    
    //-----------------------------------------For PickList Values Using Describe call--------------------------------//
    
    @AuraEnabled
    public static List<songController> getPicklistValues() {
        List<songController> lstPWrapper = new List<songController>();
        Schema.DescribeFieldResult fieldResult = Song__c.Genre__c.getDescribe();
        lstPWrapper.add(new songController('--Any Genre--','--Any Genre--'));
        for(Schema.PicklistEntry field : fieldResult.getPicklistValues()) {
            lstPWrapper.add(new songController(field.getValue(), field.getLabel()));
        }
        return lstPWrapper;
    }
    
    //---------------------------------------------------------Fetching Songs List On the basis of genre change----------------------------------//
    
    @AuraEnabled
    public static List<wrapSongs>updateGenre(String genre,String selectedSongs){
        List<wrapSongs> wrapperSongs=new List<wrapSongs>();
        List<wrapSongs>selectedSongsList=(List<wrapSongs>)System.JSON.deserialize(selectedSongs,List<wrapSongs>.class);        
        Set<Id>songIds=new Set<Id>();
        for(wrapSongs wrapSongVar:selectedSongsList){
            songIds.add(wrapSongVar.song.Id);            
        }
        If(genre!='--Any Genre--'){
            List<Song__c>songs= [SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c
                                 FROM Song__c
                                 WHERE Genre__c=:genre
                                ];
            for(Song__c song: songs){
                if(songIds.contains(song.Id)){
                    wrapperSongs.add(new  wrapSongs(song,true));
                }
                else{
                    wrapperSongs.add(new  wrapSongs(song,false));
                }
            }
            return wrapperSongs;
        }
        
        else{
            List<Song__c>songs=[SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c 
                                FROM Song__c
                               ];
            for(Song__c song: songs){
                
                if(songIds.contains(song.Id)){
                    wrapperSongs.add(new  wrapSongs(song,true));
                }
                else{
                    wrapperSongs.add(new  wrapSongs(song,false));
                }
            }
            return wrapperSongs;
        }
    }
    
    
    @AuraEnabled
    public static Mix__c insertMix(Mix__c mix,String songs){
        
        List<Song__c>songsList=(List<Song__c>)System.JSON.deserialize(songs,List<Song__c>.class);
        List<Track__c>trackList=new List<Track__c>();
        Set<Id> presentSongIdSet = new Set<Id>();
        Set<Id> selectSongIdSet = new Set<Id>();
        List<Track__c> presentTracks = [SELECT Id, Mix__c, Song__c
                                        FROM Track__c
                                        WHERE Mix__c =: mix.Id];
        for(Song__c song:songsList){
            if(song.Track_Count__c==song.Track_Licenses__c){
                return null;
            }
        }
        for(Song__c song: songsList){
            selectSongIdSet.add(song.Id);
        }
        
        try {
            mix.Customer__r=null;
            upsert mix;
        } 
        catch(DmlException exp) {
            System.debug(exp.getMessage());
        }
        for(Id selectSongId: selectSongIdSet){
            if(! presentSongIdSet.contains(selectSongId)){
                trackList.add(new Track__c(Song__c=selectSongId,Mix__c=mix.Id));
            }
        } 
        if(! presentTracks.isEmpty()){
            trackList = new List<Track__c>();
            
            
            for(Track__c track: presentTracks){
                presentSongIdSet.add(track.Song__c);
            }
            
            presentTracks =new List<Track__c>();
            
            for(Id presentSongId: presentSongIdSet){
                if(! selectSongIdSet.contains(presentSongId)){
                    List<Track__c> trcks = [SELECT Id, Song__c, Mix__c FROM Track__c WHERE Song__c =:presentSongId AND Mix__c =: mix.Id];
                    presentTracks.addAll(trcks); 
                }
            }
            
            for(Id selectSongId: selectSongIdSet){
                if(! presentSongIdSet.contains(selectSongId)){
                    trackList.add(new Track__c(Song__c=selectSongId, Mix__c=mix.Id));
                }
            }  
        }
        
        
        try{
            delete presentTracks;
            insert trackList;
            
        }
        catch(DmlException e){
            System.debug(e.getMessage());
        }  
        
        return mix;
    }
    
    
    
    @AuraEnabled
    public static List<wrapSongs> getSongsList(Id mixId) {
        Set<Id>songIds=new Set<Id>();
        if(mixId!=null){
            Mix__c mix=[SELECT Id,Name,Customer__c,Customer__r.Name FROM Mix__c WHERE Id=:mixId LIMIT 1];
            List<Track__c>trackList=[SELECT Id,Song__c,Mix__c FROM Track__c WHERE Mix__c=:mix.Id];
            for(Track__c track:trackList){
                songIds.add(track.Song__c);
            }
            system.debug('song id set-->'+songIds);
        }
        List<wrapSongs> wrapperSongs=new List<wrapSongs>();
        List<Song__c> songs = [SELECT Id, Name, Genre__c, Length_m__c,Track_Count__c,Track_Licenses__c
                               FROM Song__c
                              ];	
        for(Song__c song: songs){
            if(songIds.contains(song.Id)){
                wrapperSongs.add(new  wrapSongs(song,true));
            }
            else{
                wrapperSongs.add(new  wrapSongs(song,false));
            }
            
            
        }
        return wrapperSongs;
    }
    
    
    @AuraEnabled
    public static List<Song__c>selectedSongsList(String songs){
        List<Song__c>selectedSongsList=new List<Song__c>();
        if(!string.isBlank(songs)){
            List<wrapSongs>wrapperSongs=(List<wrapSongs>)System.JSON.deserialize(songs,List<wrapSongs>.class);
            for(wrapSongs wrapsongVar:wrapperSongs){
                if(wrapsongVar.selected){
                    selectedSongsList.add(wrapsongVar.song);
                }
            }
        }
        return selectedSongsList;  
    }
    
    public class wrapSongs{
        @AuraEnabled public Song__c song {get; set;}
        @AuraEnabled public Boolean selected {get; set;}
        public wrapSongs(Song__c song,Boolean selected){
            this.song = song;
            this.selected = selected;
        }
    }
    
    //---------------------------------------------getting mix record for edit page part----------------------------------//
    
    @AuraEnabled
    public static Mix__c getMixRecord(Id mixId){ 
        return  [select Id,Name,Customer__c,Customer__r.Name FROM Mix__c where Id=:mixId LIMIT 1];        
    }
    
    
    
}