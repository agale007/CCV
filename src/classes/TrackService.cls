public class TrackService {

   
    public static void doUpdatePrimSecGenre(List<Track__c> tracks)
    { Set<Id> mixIds = new Set<Id>();
        for (Track__c t: tracks)
            mixIds.add(t.Mix__c);
        List<AggregateResult> aggrResult = [SELECT  Mix__c mixId, Song__r.Genre__c genre,COUNT(Song__c) FROM Track__c
                                           WHERE Mix__c IN :mixIds GROUP BY Song__r.Genre__c  ,Mix__c
                                           ORDER BY Mix__c ASC, COUNT(Song__c) DESC, Song__r.Genre__c ASC ];
        List<Mix__c> mixesToChange = new List<Mix__c>();
        Map<Id,List<String>> mixToGenres = new Map<Id,List<String>>();
        for (Id mixId : mixIds)
            mixToGenres.put(mixId,new List<String>()); // Some mixes can have empty AggregationResult
        for (AggregateResult aggr: aggrResult)
            if (((String)aggr.get('genre')) != null && !((String)aggr.get('genre')).equals(''))
            mixToGenres.get((Id)aggr.get('mixId')).add((String)aggr.get('genre'));
        for (Id mixId : mixToGenres.keySet())
            mixesToChange.add(new Mix__c(Id = mixId,
                    Primary_Genre__c = mixToGenres.get(mixId).size() == 0 ? '' : mixToGenres.get(mixId).get(0),
                    Secondary_Genre__c = mixToGenres.get(mixId).size() > 1 ? mixToGenres.get(mixId).get(1) : ''));
        update mixesToChange;
    }
}