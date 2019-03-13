public with sharing class MixCtrlExt
{
     // Variable and Constant
    public Mix__c mix {get;set;}
    public string genreToSelect {get; set; }
    public Integer trackCount {get; set;}
    public Integer remainigTrack {get; set;}
    public Double  trackLength {get; set;}
    public Double remainingLength {get; set;}
    public String mode{get;set;}
    public Boolean isDisable{get;set;}
    public  Integer maximumTrack=20;
    public  Double maximumMixLength=90.0;
    public ApexPages.StandardSetController setController;
    public String songQuery = 'SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c FROM Song__c'; 
    public List<SongWrapper> wrappersList;
    public List<Song__c> selectedSongs{get;set;}
    public Map <Id, Song__c> selectedSongsMap;
    public static final Integer RECORDS_PER_PAGE =2;
    Id id1;
    Id id;
   
    public MixCtrlExt(){
        
    }
    
          //Constructor
    public  MixCtrlExt(ApexPages.StandardController controller)
    {
        selectedSongsMap = new Map <id,Song__c>();
        trackCount=0;
        remainigTrack=20;
        trackLength=0; 
        remainingLength=90;
        
        
     
        
        setController = new ApexPages.StandardSetController(Database.query(String.escapeSingleQuotes(songQuery)));
        setController.setpagesize(RECORDS_PER_PAGE);
         id1 = userinfo.getUserId();
         id = ApexPages.currentPage().getParameters().get('id');
        /* if (id != null)
         {
           for (Song__c songs : [SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c FROM Song__c WHERE Id IN
                                  (SELECT Song__c FROM Track__c WHERE Mix__c = :mix.Id)] )
            {
                selectedSongsMap.put(songs.Id,songs);
                 getSelectedSong();
             
            }
        }
        else
        {
            mix = new Mix__c();
        }*/
        
        
       /* system.debug('id'+id1);
        List <UserRecordAccess> recordaccessList= [SELECT RecordId, HasEditAccess FROM UserRecordAccess WHERE UserId = : id1 AND RecordId =: ID];
                for(UserRecordAccess rec:recordaccessList)
                {
                    system.debug('HasEditAccess'+rec.HasEditAccess);
                     system.debug('HasEditAccess'+rec.RecordId);
                }*/
      // List<User>users=[SELECT Id, Name,Profile.Name FROM User  WHERE Id = :Id1];
       
           
             
       
       
        mix = (Id == null) ? new Mix__c() : [SELECT Name, Customer__c FROM Mix__c WHERE Id = :Id];
       
        
            if (Id != null)
        {
            
            for (Song__c songs : [SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c FROM Song__c WHERE Id IN
                                  (SELECT Song__c FROM Track__c WHERE Mix__c = :mix.Id)] )
            {
                selectedSongsMap.put(songs.Id,songs);
                 getSelectedSong();
             
            }
        }
             else
        {
            mix = new Mix__c();
        }
        

    }
//=========================================================================Set Edit Mode Regarding Edit Access============================================//
     public void getMode()
     {
        id = ApexPages.currentPage().getParameters().get('id'); 
        id1 = userinfo.getUserId();
        if(id != null)
        {
            //mix = [SELECT Name, Customer__c, OwnerId FROM Mix__c WHERE Id = :id];
            List <UserRecordAccess> recordaccessList= [SELECT RecordId, HasEditAccess FROM UserRecordAccess WHERE UserId = : id1 AND RecordId =: id];
            for(UserRecordAccess rec:recordaccessList)
            {
                if(rec.HasEditAccess)
                {
                    mode='edit';
                }
                else
                {
                    mode='readOnly';
                    isDisable = true;
                }
            }
        } 
        else
        {
            mode='edit';
    }
     }
    
    
//==================================================Save and Cancel========================================================//
    //Save Track and Mix Record
    public PageReference  save()
    {
       List<Track__c> tracks = new List<Track__c>();
      
       /* try
        {
            upsert(mix);
        }
        catch (System.DMLException e)
        {
            ApexPages.addMessages(e);
            return null;
        }*/

        for (Song__c s: selectedSongsMap.values()){
             if (s.Track_Count__c > s.Track_Licenses__c)
           {
               ApexPages.addMessage(new ApexPages.message(ApexPages.severity.WARNING,'Tracks Count Exceed the track Licicenses'));
               //delete(mix);
               return null;
           }
         else if(selectedSongsMap.values().size()>maximumTrack){
                   ApexPages.addMessage(new ApexPages.message(ApexPages.severity.WARNING,'Tracks must exceed must be less than 20'));
                
               return null;
                
               }
           else if(trackLength>maximumMixLength)
           {
                   ApexPages.addMessage(new ApexPages.message(ApexPages.severity.WARNING,'Tracks length must be less than 90'));
                                return null;
                
               }
            
            else{
                //upsert mix;
                tracks.add(new Track__c(Song__c = s.Id));
            }
        }
        if(tracks!=null)
        {
            upsert mix;
            
                for(Track__c trackListValues : tracks)
                {
                    trackListValues.Mix__c = mix.Id;
                }
           
         /*  else{   
               upsert mix;
               tracks.add(new Track__c(Mix__c = mix.Id, Song__c = s.Id));
               
           }  */         
       }
       try
       {
           delete([SELECT id from Track__c
                  WHERE Mix__c =:mix.Id]);
           insert tracks;
           selectedSongs = null;

       }
       catch (DmlException e)
       {
           ApexPages.addMessages(e);
           //return null;
       }
       
       PageReference redirectSuccess = new ApexPages.StandardController(Mix).view();
       return (redirectSuccess);
    }
    
     // Go to Record Page
    public PageReference cancel() {
        Id id = ApexPages.currentPage().getParameters().get('id');
        if(id!=null)
        {
             PageReference pageRefToMix = new PageReference('https://ccvapp-dev-ed.my.salesforce.com/'+id);
              return pageRefToMix;
        }
        else
        {
             PageReference pageRefToMix = new PageReference('https://ccvapp-dev-ed.my.salesforce.com/a01/o');
             return pageRefToMix;
        }
    }
    
    
 //=============================Pagination===============================================================================//   
    
    
    public integer getCurrentPageNumber   //Find Current page value
    {
        get
        {
            return setController.getPageNumber();
        }
    }
    
    public Integer getTotalPages    //Find total page count
    {
        get
        {
            return (Integer)(setController.getResultSize() / ((Decimal)RECORDS_PER_PAGE)).round(System.RoundingMode.CEILING);
        }
    }
    
    public void firstPage()
    {
        setController.first();
    }
    
    public void previousPage()
    {
        setController.previous();
    }
    
    public void nextPage()
    {
        setController.next();
    }
    
    public void lastPage()
    {
        setController.last();
    }
    
 //==================================To get Total Genre List From Song==================================================//   
    
    public List<SelectOption> getGenres()       //by using described call method get Genres List
    {
        List<SelectOption> options = new List<SelectOption>();           
        Schema.DescribeFieldResult field = Song__c.Genre__c.getDescribe();
        options.add(new SelectOption('--Any Genre--', '--Any Genre--'));
        for (Schema.PicklistEntry entries : field.getPicklistValues())
            options.add(new SelectOption(entries.getLabel(), entries.getLabel()));
        return options;   
    }
    
//=====================================Filter Songs with selected Genre on UI page===========================================//    
    // filter song on selected genre
    public void filterSongByGenre()       
    {
        if ( !genreToSelect.equals('--Any Genre--') )
            songQuery='SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c FROM Song__c WHERE Genre__c = :genreToSelect';
        else
            songQuery='SELECT Id,Name,Genre__c,Length_m__c,Track_Count__c,Track_Licenses__c FROM Song__c';
        setController = new ApexPages.StandardSetController(Database.query(String.escapeSingleQuotes(songQuery)));
        setController.setpagesize(RECORDS_PER_PAGE);
        
    }
    
//=======================================selected song added in wrapper class with bool value==========================//    
    public List<SongWrapper> getSong()   
    {
        getSelectedSong();
        wrappersList = new List <SongWrapper>();
        for (Song__c song : (List<Song__c>)setController.getRecords())
            if (selectedSongsMap.ContainsKey(song.id))
            wrappersList.add (new SongWrapper(song,true));
        else
            wrappersList.add(new SongWrapper(song,false));
        
        return wrappersList;
    }
    
    //=======================Get selected song List from UI depend on Calculate Track count and length============//    
    public void getSelectedSong()  
    {
        if (wrappersList != null)
        {
            for (SongWrapper songwrap: wrappersList)
            {
                if (songwrap.bool)
                {
                    selectedSongsMap.put(songwrap.song.id, songwrap.song);  // Add the selected song id in to the selectedSongsMap.
                }
                else
                {
                    selectedSongsMap.remove(songwrap.song.id);
                  
                }
            }
          
        }
        
        
       
        
        // Calculate Mix Summary
        if(selectedSongsMap.size()<maximumTrack+1 )
        {
            
            trackCount=selectedSongsMap.size();
            remainigTrack=maximumTrack-trackCount;   
            Set<Id>songIds=new Set<Id>();
            for(Id id:selectedSongsMap.keySet())
            {
                songIds.add(id);
            }
            
            List<AggregateResult>sumOfTrackLen=[SELECT SUM(Length_m__c)
                                                FROM Song__c
                                                WHERE Id IN:songIds];
            trackLength =(Decimal)sumOfTrackLen[0].get('expr0');
            if(trackLength!=null)
            {
                if(trackLength<maximumMixLength)
                {
                    remainingLength=maximumMixLength-trackLength;
                    
                }
               
               
            }
            else
            {
                remainingLength=maximumMixLength;
                trackLength=0;
            }
        }
        
    }
    
    
//====================================Wrapper Class Initialisation===================================================//    
    
    public class SongWrapper  //wrapperclass define
    {
        public Song__c song{get;set;}
        public boolean bool{get;set;}
        public SongWrapper(Song__c songs,boolean bool)
        {
            this.song = songs;
            this.bool = bool;
        }
    }
    
}