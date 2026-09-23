/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
*/


define(['N/record'],function(record){

function execute(context){
    var rec=record.create({
        type:'invoice',
        isDynamic:true
    });
    rec.setValue({
        fieldId:'entity',
        value:7079
    });
    rec.setValue({
        fieldId:'location',
        value:16
    });
    rec.selectNewLine({
        sublistId:'item'
    })
    rec.setCurrentSublistValue({
        sublistId:'item',
        fieldId:'item',
        value:1025

    });
    rec.setCurrentSublistValue({
        sublistId:'item',
        fieldId:'amount',
        value:100

    });
    rec.commitLine({
        sublistId:'item',
    })
    var internal_id=rec.save()
    log.debug({
        title:"success",
        details:"internalid "+ internal_id
    })

}
        return{execute:execute}



    

})