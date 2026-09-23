/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/log','N/record'],function(log,record){
    function beforeSubmit(context){
        var rec = context.newRecord;
        var name=rec.getValue({fieldId:'entityid'});
        var today = new Date();
        var firttwo=name.substring(0,2);
        var month=today.getMonth()+1;
        if(month<10){
            month='0' + month;
        }
        var shortname=firttwo+month;
        rec.setValue({
            fieldId:'custentity3',
            value:shortname
        })





    }
        return {
         beforeSubmit:beforeSubmit};
});