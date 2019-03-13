trigger MixTrigger on Mix__c (before insert) // Mix Trigger
{
    if(trigger.isInsert && trigger.isBefore)
    {
        MixTriggerHandler.onInsertMixAutoUpdate(Trigger.New);  // called TriggerHandler method
    }
}