/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
*/


define(['N/record'],function(record){

function execute(context){
    var rec=record.load({
        type:'vendorbill',
        id:138350
    });
    rec.setValue({
        fieldId:'memo',
        value:'memo updated through scripting'
    });
    
    var bill = rec.save()
    log.debug({
        title:"success",
        details:"vendor bill "+ bill
    });

}
        return{execute:execute}



    

})