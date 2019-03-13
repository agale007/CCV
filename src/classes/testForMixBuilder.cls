@isTest 
private class testForMixBuilder {

   
   @ isTest static void editMixTest(){
       Mix__c mix=new Mix__c();
       mix.Name='mdmd';
       mix.Customer__c='0036F00002ol07LQAQ';
       insert mix;
       
       List<Song__c> songList=new List<Song__c>();
       songList.add(new Song__c(Name='song2356987',Genre__c='Jazz',Length_m__c=3.5,Track_Licenses__c=10));
       songList.add(new Song__c(Name='song445552',Genre__c='Hip Hop / Rap',Length_m__c=2.8,Track_Licenses__c=15));
       insert songList;
       List<Track__c> trackList=new List<Track__c>();
       for(Song__c song:songList){
           Track__c track=new Track__c();
           track.Mix__c=mix.Id;
           track.Song__c=song.Id;
           trackList.add(track);  
       }
       insert trackList;
       Test.StartTest();
       ApexPages.currentPage().getParameters().put('id', String.valueOf(mix.Id));
       ApexPages.StandardController sc=new ApexPages.StandardController(mix);
       MixCtrlExt obj=new MixCtrlExt(sc);
       obj.getMode();
       obj.save();
       obj.cancel();
       obj.getGenres();
       obj.genreToSelect='--Any Genre--';
       obj.filterSongByGenre();
       obj.firstPage();
       obj.lastPage();
       obj.previousPage();
       obj.nextPage();
       obj.getSong();
       obj.getSelectedSong();
       obj.getSong();
       Integer currPageNum=obj.getCurrentPageNumber;
       Integer totalPages=obj.getTotalPages;
       try{
      undelete trackList;
       }catch(Exception e){System.debug('e '+e.getMessage());
                          }
       Test.stopTest();
       
   }
   
   // for  New Mix Insert Part    
  /* @isTest static void saveMixTest(){
       Test.startTest();
       Mix__c mixObj=new Mix__c();
       ApexPages.CurrentPage().getparameters().put('id',mixObj.id);
       ApexPages.StandardController sc=new ApexPages.StandardController(mixObj);
       mixCtrlExt obj=new mixCtrlExt(sc);
       obj.isDisable=false;
        obj.getMode();
        obj.save();
       obj.cancel();
       obj.getGenres();
       obj.genreToSelect='Blues';
       obj.filterSongByGenre();
       obj.firstPage();
       obj.lastPage();
       obj.previousPage();
       obj.nextPage();
       obj.getSong();
       obj.getSelectedSong();
       obj.getSong();
       Integer currPageNum=obj.getCurrentPageNumber;
       Integer totalPages=obj.getTotalPages;
       Test.stopTest();          
   }
      @isTest static void MixTest(){
       Test.startTest();
       Mix__c mixObj=new Mix__c();
       ApexPages.CurrentPage().getparameters().put('id',mixObj.id);
       ApexPages.StandardController sc=new ApexPages.StandardController(mixObj);
       mixCtrlExt obj=new mixCtrlExt(sc);
      obj.save();
       obj.cancel();
       obj.getGenres();
       obj.genreToSelect='Classical Music';
       obj.filterSongByGenre();
       obj.firstPage();
       obj.lastPage();
       obj.previousPage();
       obj.nextPage();
       obj.getSong();
       obj.getSelectedSong();
       obj.getSong();
       Integer currPageNum=obj.getCurrentPageNumber;
       Integer totalPages=obj.getTotalPages;
       Test.stopTest();          
   }
   */
   
}