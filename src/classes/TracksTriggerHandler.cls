public class TracksTriggerHandler
{   
    //after Insert Song in Track
    Public static void onInsertTrack(List<Track__c> trackList) 
    {   
        Set<Id> songIdSet = new Set<Id> ();
        Set<Id> mixIdSet = new Set<Id> ();
        
        if(trackList!=NULL)
        {
            for(Track__c track:trackList)
            {
                songIdSet.add(track.Song__c);
            }
            
            List<Song__c> songList=[SELECT Id,Name,Track_Count__c,Track_Licenses__c,Genre__c FROM Song__c WHERE Id IN:songIdSet];
            
            for(Song__c song:songList)
            {
                
              
                song.Track_Count__c++;
                
            }
            update songList;               
            
            
            if(trackList!=NULL)
            {
                for(Track__c track:trackList)
                {
                    mixIdSet.add(track.Mix__c);
                }
                List<Mix__c> mixList=[SELECT Id,Name,Primary_Genre__c,Secondary_Genre__c,Customer__c FROM Mix__c WHERE Id IN:mixIdSet];
                Integer count=0;
                String  maxKey;
                String SecMaxKey; 
                Map<String,Integer> genreMap=new Map<String,Integer>();
                Map<String,Integer> sortedSongGenreMap=new Map<String,Integer>();
          
                
                for(Song__c songs:songList)
                {
                    if(genreMap.containsKey(songs.Genre__c) )
                    {
                        count = genreMap.get(songs.Genre__c);
                        genreMap.put(songs.Genre__c, count + 1);
                    }
                    
                    else if(songs.Genre__c!=NULL )
                    {
                        count=1;
                        genreMap.put(songs.Genre__c,count);
                    }
                    
                }
                
                List<String> genreList=new List<String>() ;
                genreList.addAll( genreMap.keySet());
                genreList.sort();                           //sorting genre list
                
                for(String sortedGenreList:genreList)
                {
                    sortedSongGenreMap.put(sortedGenreList,genreMap.get(sortedGenreList)) ;
                }
                
                maxKey =  sortedSongGenreMap.isEmpty()?null:new List<String>(sortedSongGenreMap.keyset())[0];
                for(String s1: sortedSongGenreMap.keySet()) {
                    maxKey = sortedSongGenreMap.get(s1)> sortedSongGenreMap.get(maxKey)?s1:maxKey;
                }
                
                //remove primary genre from map for secondary genre
                sortedSongGenreMap.remove(maxKey); 
                //SecmaxKey as secondary genre
                SecMaxKey =  sortedSongGenreMap.isEmpty()?null:new List<String>(sortedSongGenreMap.keyset())[0];
                for(String s1: sortedSongGenreMap.keySet())
                {
                    SecMaxKey =sortedSongGenreMap.get(s1)> sortedSongGenreMap.get(SecMaxKey)?s1:SecMaxKey;
                }
                
                //=====update primary and secondary Genre===//
                for(Mix__c mix:mixList)
                {
                    mix.Primary_Genre__c=maxKey;
                    update mixList; 
                }
                
                for(Mix__c mix:mixList)
                {
                    
                    mix.Secondary_Genre__c=SecMaxKey;
                    update mixList;
                }
                
            }
        }
        
      
    }
    
    //==========================================Before Update Operation===========================================//
    
    Public static void onBeforeUpdateTrack(List<Track__c> trackList)  
    {
        
        Set<Id> songIdSet = new Set<Id> ();
        Set<Id> mixIdSet = new Set<Id> ();
        if(trackList!=NULL)
        {
            for(Track__c track:trackList)
            {
                songIdSet.add(track.Song__c); 
                
            }
            
            List<Song__c> songList=[SELECT Id,Name,Track_Count__c FROM Song__c WHERE Id IN:songIdSet];
            
           for(Song__c song:songList)
            {
                
                song.Track_Count__c--;
            }
            update songList; 
            
            
            
            if(trackList!=NULL)
            {
                for(Track__c track:trackList)
                {
                    mixIdSet.add(track.Mix__c);
                }
                List<Mix__c> mixList=[SELECT Id,Name,Primary_Genre__c,Secondary_Genre__c,Customer__c FROM Mix__c WHERE Id IN:mixIdSet];
                Integer count=0;
                String  maxKey;
                String SecMaxKey; 
                Map<String,Integer> genreMap=new Map<String,Integer>();
                Map<String,Integer> sortedSongGenreMap=new Map<String,Integer>();
                
                
                for(Song__c songs:songList)
                {
                    if(genreMap.containsKey(songs.Genre__c) )
                    {
                        count = genreMap.get(songs.Genre__c);
                        genreMap.put(songs.Genre__c, count + 1);
                    }
                    
                    else if(songs.Genre__c!=NULL )
                    {
                        count=1;
                        genreMap.put(songs.Genre__c,count);
                    }
                    
                }
                
                List<String> genreList=new List<String>() ;
                genreList.addAll( genreMap.keySet());
                genreList.sort();                           //sorting genre list
                
                for(String sortedGenreList:genreList)
                {
                    sortedSongGenreMap.put(sortedGenreList,genreMap.get(sortedGenreList)) ;
                }
                
                maxKey =  sortedSongGenreMap.isEmpty()?null:new List<String>(sortedSongGenreMap.keyset())[0];
                for(String s1: sortedSongGenreMap.keySet()) 
                {
                    maxKey = sortedSongGenreMap.get(s1)> sortedSongGenreMap.get(maxKey)?s1:maxKey;
                }
                
                //remove primary genre from map for secondary genre
                sortedSongGenreMap.remove(maxKey); 
                //SecmaxKey as secondary genre
                SecMaxKey =  sortedSongGenreMap.isEmpty()?null:new List<String>(sortedSongGenreMap.keyset())[0];
                for(String s1: sortedSongGenreMap.keySet()) {
                    SecMaxKey =sortedSongGenreMap.get(s1)> sortedSongGenreMap.get(SecMaxKey)?s1:SecMaxKey;
                    
                }
                
                //=====update primary and secondary Genre===//
                for(Mix__c mix:mixList)
                {
                    mix.Primary_Genre__c=maxKey;
                    update mixList; 
                }
                
                for(Mix__c mix:mixList)
                {
                    
                    mix.Secondary_Genre__c=SecMaxKey;
                    update mixList;
                }
            }
        }
        
        
        
    }
        
    //==================================================After Update Operation=========================================//
                //After Update Song in Track
    Public static void onAfterUpdateTrack(List<Track__c> trackList)     
    {
        Set<Id> songIdSet = new Set<Id> ();
        Set<Id> mixIdSet = new Set<Id> ();
        if(trackList!=NULL)
        {
            for(Track__c track:trackList)
            {
                songIdSet.add(track.Song__c);
                
            }
            List<Song__c> songList=[SELECT Id,Name,Track_Count__c FROM Song__c WHERE Id IN:songIdSet];
            for(Song__c song:songList)
            {  
             song.Track_Count__c++;
            }
            update songList; 
          if(trackList!=NULL)
            {
                for(Track__c track:trackList)
                {
                    mixIdSet.add(track.Mix__c);
                }
                List<Mix__c> mixList=[SELECT Id,Name,Primary_Genre__c,Secondary_Genre__c,Customer__c FROM Mix__c WHERE Id IN:mixIdSet];
                Integer count=0;
                String  maxKey;
                String SecMaxKey; 
                Map<String,Integer> genreMap=new Map<String,Integer>();
                Map<String,Integer> sortedSongGenreMap=new Map<String,Integer>();
                
                
                for(Song__c songs:songList)
                {
                    if(genreMap.containsKey(songs.Genre__c) )
                    {
                        count = genreMap.get(songs.Genre__c);
                        genreMap.put(songs.Genre__c, count + 1);
                    }
                    
                    else if(songs.Genre__c!=NULL )
                    {
                        count=1;
                        genreMap.put(songs.Genre__c,count);
                    }
                    
                }
                
                List<String> genreList=new List<String>() ;
                genreList.addAll( genreMap.keySet());
                genreList.sort();                           //sorting genre list
                
                for(String sortedGenreList:genreList)
                {
                    sortedSongGenreMap.put(sortedGenreList,genreMap.get(sortedGenreList)) ;
                }
                
                maxKey =  sortedSongGenreMap.isEmpty()?null:new List<String>(sortedSongGenreMap.keyset())[0];
                for(String s1: sortedSongGenreMap.keySet()) 
                {
                    maxKey = sortedSongGenreMap.get(s1)> sortedSongGenreMap.get(maxKey)?s1:maxKey;
                }
                
                //remove primary genre from map for secondary genre
                sortedSongGenreMap.remove(maxKey); 
                //SecmaxKey as secondary genre
                SecMaxKey =  sortedSongGenreMap.isEmpty()?null:new List<String>(sortedSongGenreMap.keyset())[0];
                for(String s1: sortedSongGenreMap.keySet()) {
                    SecMaxKey =sortedSongGenreMap.get(s1)> sortedSongGenreMap.get(SecMaxKey)?s1:SecMaxKey;
                    
                }
                
                //=====update primary and secondary Genre===//
                for(Mix__c mix:mixList)
                {
                    mix.Primary_Genre__c=maxKey;
                    update mixList; 
                    
                }
                
                for(Mix__c mix:mixList)
                {
                    
                    mix.Secondary_Genre__c=SecMaxKey;
                    update mixList;
                }
            }
        }
        
        
        
    }
        
//=====================================================After Delete Operation==========================================//
               
                 //After Delete Track   
    Public static void onDeleteTrack(List<Track__c> trackList)    
    {
        Set<Id> songIdSet = new Set<Id> ();
        if(trackList!=null)
        {
            Integer cnt;
            
            Map<String,Integer>genreMap=new Map<String,Integer>();
            
            Id mixId;
            for(Track__c track:trackList)
            {
                mixId=track.Mix__c;
         
                songIdSet.add(track.Song__c);
         
            }
            List<Song__c> songList=[SELECT Id,Name,Track_Count__c FROM Song__c WHERE Id IN:songIdSet];
            for(Song__c song:songList)
            {  
             song.Track_Count__c--;
            }
            update songList; 
            
            
            Mix__c mixList=[SELECT Id,Name,Primary_Genre__c,Secondary_Genre__c
                            FROM Mix__c 
                            WHERE Id=:mixId];
            
            List<Track__c>tempTrackList=[SELECT Id,Song__c
                                         FROM Track__c
                                         WHERE Mix__c =:mixId];
            
            Set<Id>songId=new Set<Id>();
            for(Track__c trackObj:trackList)
            {
                songId.add(trackObj.Song__c);
            }
            List<Track__c>tempTrackList2=new List<track__c>();
            for(Track__c track:tempTrackList){
                if(!songId.contains(track.Song__c)){
                    tempTrackList2.add(track);
                }
            }
            
            
            Set<Id>songIds=new Set<Id>();
            for(Track__c song: tempTrackList2){
                songIds.add(song.Song__c);
            }
            List<Song__c>songGenreList=[SELECT Id,Genre__c
                                        FROM Song__c
                                        WHERE Id IN:songIds];
            
            for(Song__c songObj:songGenreList){
                if(genreMap.containsKey(songObj.Genre__c))
                {
                    cnt=genreMap.get(songObj.Genre__c);
                    cnt++;
                    genreMap.put(songObj.Genre__c,cnt);
                }
                else{
                    cnt=1;
                    genreMap.put(songObj.Genre__c,cnt);
                }
            }
            
            List<String>songsGenList=new List<String>();
            songsGenList.addAll(genreMap.keySet());
            songsGenList.sort();   
            
            Map<String,Integer>sortedGenreMap=new Map<String,Integer>();
            for(String genre:songsGenList)
            {
                sortedGenreMap.put(genre,genreMap.get(genre));
            }
            
            String primaryGenre=sortedGenreMap.isEmpty()?null:new List<String>(sortedGenreMap.keySet())[0];
            for(String str:sortedGenreMap.keySet())
            {
                primaryGenre=sortedGenreMap.get(str)>sortedGenreMap.get(primaryGenre)?str:primaryGenre;
            }
            sortedGenreMap.remove(primaryGenre);
            String secondaryGenre=sortedGenreMap.isEmpty()?null:new List<String>(sortedGenreMap.keySet())[0];
            for(String str:sortedGenreMap.keySet())
            {
                secondaryGenre=sortedGenreMap.get(str)>sortedGenreMap.get(primaryGenre)?str:secondaryGenre;
            }
            mixList.Primary_Genre__c=primaryGenre;
            mixList.Secondary_Genre__c=secondaryGenre; 
            update mixList;
        }
    }
    
   
    
     public static void updateGenreOnUnDel(List<Track__c>trackList){
         Set<Id> songIdSet = new Set<Id> ();
        if(trackList!=null){
            Integer cnt;
        Map<String,Integer>genreMap=new Map<String,Integer>();
            Id mixId;
            for(Track__c track:trackList){
                mixId=track.Mix__c;
            songIdSet.add(track.Song__c);
         
            }
            List<Song__c> songList=[SELECT Id,Name,Track_Count__c FROM Song__c WHERE Id IN:songIdSet];
            for(Song__c song:songList)
            {  
             song.Track_Count__c++;
            }
            update songList; 
            
            Mix__c mixList=[SELECT Id,Name,Primary_Genre__c,Secondary_Genre__c
                                FROM Mix__c 
                                WHERE Id=:mixId];
            System.debug('mixList--->'+mixList);
            
            Set<Id>songId=new Set<Id>();
            for(Track__c trackObj:trackList){
                songId.add(trackObj.Song__c);
            }
            system.debug('songIds-->'+songId);
            List<Track__c>tempTrackList=[SELECT Id,Mix__c
                                    FROM Track__c
                                    WHERE Song__c IN:songId
                                        AND Mix__c=:mixId];
            system.debug('tempTrackList-->'+tempTrackList);
            
            List<Track__c>temp2trackList=[SELECT Id,Song__c,Mix__c
                                         FROM Track__c
                                         WHERE Mix__c=:mixId];
            system.debug('temp2trackLIst--->'+temp2trackList);
            
            Set<Id>songIds=new Set<Id>();
        for(Track__c song: temp2trackList){
            songIds.add(song.Song__c);
        }
        List<Song__c>songGenreList=[SELECT Id,Genre__c
                                    FROM Song__c
                                    WHERE Id IN:songIds];
        
        for(Song__c songObj:songGenreList){
            if(genreMap.containsKey(songObj.Genre__c)){
                cnt=genreMap.get(songObj.Genre__c);
                cnt++;
                genreMap.put(songObj.Genre__c,cnt);
            }
            else{
                cnt=1;
                genreMap.put(songObj.Genre__c,cnt);
            }
        }
        
        List<String>songsGenList=new List<String>();
        songsGenList.addAll(genreMap.keySet());
        songsGenList.sort();   /* sorting of List Alphabatically--*/
        
        Map<String,Integer>sortedGenreMap=new Map<String,Integer>();
        for(String genre:songsGenList){
            sortedGenreMap.put(genre,genreMap.get(genre));
        }
        
        String primaryGenre=sortedGenreMap.isEmpty()?null:new List<String>(sortedGenreMap.keySet())[0];
        for(String str:sortedGenreMap.keySet()){
            primaryGenre=sortedGenreMap.get(str)>sortedGenreMap.get(primaryGenre)?str:primaryGenre;
        }
        sortedGenreMap.remove(primaryGenre);
        String secondaryGenre=sortedGenreMap.isEmpty()?null:new List<String>(sortedGenreMap.keySet())[0];
        for(String str:sortedGenreMap.keySet()){
            secondaryGenre=sortedGenreMap.get(str)>sortedGenreMap.get(primaryGenre)?str:secondaryGenre;
        }
        mixList.Primary_Genre__c=primaryGenre;
        mixList.Secondary_Genre__c=secondaryGenre; 
        update mixList;
    }
            
            
            
        }
        
    
        
    

    
}