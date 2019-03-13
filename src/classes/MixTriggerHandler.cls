public class MixTriggerHandler //MixTriggerHandlerClass
{
    Public static void onInsertMixAutoUpdate(List<Mix__c> mixes)
    {
        if(mixes!=NULL)
        {	
            Map<String,Integer> SongGenreMap=new Map<String,Integer>();
            Map<String,Integer> sortedSongGenreMap=new Map<String,Integer>();
            List<Song__c> songList=[SELECT Genre__c FROM Song__c]; 
            Integer count;
            
            for(Song__c songs:songList)
            {
                if(SongGenreMap.containsKey(songs.Genre__c) )
                {
                    count = SongGenreMap.get(songs.Genre__c);
                    SongGenreMap.put(songs.Genre__c, count + 1);
                }
                
                else if(songs.Genre__c!=NULL )
                {
                    count=1;
                    SongGenreMap.put(songs.Genre__c,count);
                }
                
            }
            
            List<String> genreList=new List<String>() ;
            genreList.addAll( SongGenreMap.keySet());
            genreList.sort();                           //sorting genre list
            
            for(String sortedGenreList:genreList)
            {
                sortedSongGenreMap.put(sortedGenreList,SongGenreMap.get(sortedGenreList)) ;
            }
            
            String maxGenreKey =  sortedSongGenreMap.isEmpty()?null:new List<String>( sortedSongGenreMap.keyset())[0];  //Primary Genre key
            
            for(String primMaxKey: sortedSongGenreMap.keySet()) {
                maxGenreKey =  sortedSongGenreMap.get(primMaxKey)> sortedSongGenreMap.get(maxGenreKey)?primMaxKey:maxGenreKey;
                
            }
            
            sortedSongGenreMap.remove(maxGenreKey); 
            String SecMaxGenreKey =  sortedSongGenreMap.isEmpty()?null:new List<String>( sortedSongGenreMap.keyset())[0];  //secondary genre key
            for(String secMaxKey: sortedSongGenreMap.keySet()) {
                SecMaxGenreKey =  sortedSongGenreMap.get(secMaxKey)> sortedSongGenreMap.get(SecMaxGenreKey)?secMaxKey:SecMaxGenreKey;
                
            }
            
            for(Mix__c mix:mixes)
            {
                mix.Primary_Genre__c=maxGenreKey;
            }
            for(Mix__c mix:mixes)
            {
                mix.Secondary_Genre__c=SecMaxGenreKey;
            }
            
        }
    }
}