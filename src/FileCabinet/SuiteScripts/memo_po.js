/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */




define(['N/record','N/log'],function(record,log){
    function beforeSubmit(context){
        var rec=context.newRecord;
        var memo=rec.getValue({
            fieldId:'custbody1'
        });
        if(memo){
            rec.setValue({
                fieldId:'memo',
                value:'memo updated'
            })
        }
    }
    return{beforeSubmit:beforeSubmit}
})