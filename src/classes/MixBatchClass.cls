global class MixBatchClass implements  Database.Batchable<sObject>, Database.Stateful {
      global Integer recordsProcessed = 0;
    global Integer count=0;
    global Database.QueryLocator start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
   return Database.getQueryLocator('SELECT ID,Name,	Customer__c,Primary_Genre__c,Secondary_Genre__c FROM Mix__c');
    }
    global void execute(Database.BatchableContext bc, List<Mix__c> scope)
    {
        // process each batch of records 
    List<Mix__c> mixList=new List<Mix__c>();
	for(Mix__c mix: scope)
    {
        mix.Name='mix'+String.valueOf(count);
        count++;
        mixList.add(mix);
         recordsProcessed= recordsProcessed+1;
    }
        update mixList;
    }    
    global void finish(Database.BatchableContext bc){
        // execute any post-processing operations
        System.debug(' recordsProcessed'+ recordsProcessed);
    }    
}