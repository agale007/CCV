public class Mix_Ltng_Ctrl
{
     // Variable and Constant
    public Mix__c mix {get;set; }
    public string genreToSelect {get; set; }
    public String songQuery = 'SELECT Id,Name,Genre__c,Length_m__c FROM Song__c'; 
    public Integer trackCount {get; set;}
    public Double  trackLength {get; set;}
    public List<SongWrapper> wrappersList;            
    public Map <Id, Song__c> selectedSongsMap;
    public ApexPages.StandardSetController setController;
    public static final Integer RECORDS_PER_PAGE =2;
    
      //Constructor
    public  Mix_Ltng_Ctrl()
    {
        selectedSongsMap = new Map <id,Song__c>();
        trackCount=0;
        trackLength=0; 
        setController = new ApexPages.StandardSetController(Database.query(String.escapeSingleQuotes(songQuery)));
        setController.setpagesize(RECORDS_PER_PAGE);
        getSelectedSong();
    }
    
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
    
   public PageReference cancel() {
      PageReference pageRef = new PageReference('/a01/o');     //return to record page
            return pageRef;
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
    
    public List<SelectOption> getGenres()       //by using described call method get Genres List
    {
        List<SelectOption> options = new List<SelectOption>();           
        Schema.DescribeFieldResult field = Song__c.Genre__c.getDescribe();
        options.add(new SelectOption('--Any Genre--', '--Any Genre--'));
        for (Schema.PicklistEntry entries : field.getPicklistValues())
            options.add(new SelectOption(entries.getLabel(), entries.getLabel()));
        return options;   
    }
    
    
    public void filterSongByGenre()       // filter song on selected genre
    {
        if ( !genreToSelect.equals('--Any Genre--') )
            songQuery='SELECT Name,Genre__c,Length_m__c FROM Song__c WHERE Genre__c = :genreToSelect';
        else
            songQuery='SELECT Name,Genre__c,Length_m__c FROM Song__c';
         setController = new ApexPages.StandardSetController(Database.query(String.escapeSingleQuotes(songQuery)));
         setController.setpagesize(RECORDS_PER_PAGE);
        
    }
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
    
     public void getSelectedSong()  
    {
        if (wrappersList != null)
            for (SongWrapper songwrap: wrappersList)
                if (songwrap.bool == true)
                    selectedSongsMap.put(songwrap.song.id, songwrap.song); // Add the selected song id in to the selectedSongsMap.
                else
                    selectedSongsMap.remove(songwrap.song.id);
    }
    
    
    
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
    
    public void recalculateSummary()    //To calculate track count and track length of selected songs
    {
        Song__c checkSongs = wrappersList.get(Integer.valueOf(System.currentPagereference().getParameters().get('wrapperId'))).song;
        if ( !selectedSongsMap.containsKey(checkSongs.Id) )
        {
            selectedSongsMap.put(checkSongs.Id, checkSongs);
            trackLength += checkSongs.Length_m__c;
            trackCount++;
        }
        else 
        {
            trackLength -= checkSongs.Length_m__c;
            trackCount--;
            selectedSongsMap.remove(checkSongs.Id);
        }
    }
    
  

}