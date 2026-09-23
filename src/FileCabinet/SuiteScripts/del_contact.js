/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */

define (['N/record','N/log'],function(record,log){
    function execute(context){
        var rec = record.delete({type: "contact",
         id:7094

        });

        

        log.debug({
            title:"success",
            details:"contact id" + rec  
        });



    }
    return {
         execute:execute};
})