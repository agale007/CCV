trigger TrackTrigger on Track__c (after insert,before update,after update,after delete,after undelete) 
{
    if(trigger.isInsert)
    {
        TracksTriggerHandler.onInsertTrack(Trigger.New);
    }
    else if(trigger.isBefore && trigger.isUpdate)
    {
       //TracksTriggerHandler.onBeforeUpdateTrack(Trigger.Old);
    }
    else if(trigger.isAfter && trigger.isUpdate)
    {
       // TracksTriggerHandler.onAfterUpdateTrack(Trigger.New);
    }
    else if(trigger.isAfter && trigger.isDelete)
    {
        TracksTriggerHandler.onDeleteTrack(Trigger.Old);
    }
    else if(trigger.isUndelete)
    { 
       
        TracksTriggerHandler.updateGenreOnUnDel(trigger.new);
    }
}