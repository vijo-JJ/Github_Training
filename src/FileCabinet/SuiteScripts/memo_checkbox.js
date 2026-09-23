/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/log','N/record'],function(log,record){
    function beforeSubmit(context){

var transaction = context.newRecord;
if (transaction.type === record.Type.SALES_ORDER){
    var checkbox=transaction.getValue({
        
        fieldId:'custbody1'
        
    });
    if (checkbox===true){
        transaction.setValue({
            fieldId:'memo',
            value:'memo updated'
        })
    }
    log.debug({
    title:"success",
    details :" "
});
}




    }
        return {
         beforeSubmit:beforeSubmit};
});