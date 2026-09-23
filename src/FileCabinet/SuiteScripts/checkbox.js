/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/log','N/record'],function(log,record){
    function afterSubmit(context){

var transaction = context.newRecord;
if (transaction.type === record.Type.SALES_ORDER){
    var customerId = transaction.getValue({
        fieldId: 'entity'
    });
    record.submitFields({
        type:record.Type.CUSTOMER,
        id:customerId,
        values:{custentity1:true}
    });
    log.debug({
    title:"success",
    details :"customer id : "+ customerId
});
}
        if(context.type !== context.UserEventType.CREATE){
    return;
}

if (transaction.type === record.Type.PURCHASE_ORDER){
    var vendorId = transaction.getValue({
        fieldId: 'entity'
    });
    record.submitFields({
        type:record.Type.VENDOR,
        id:vendorId,
        values:{custentity2:true}
    });
        log.debug({
    title:"success",
    details :"vendor id : "+ vendorId
});
}


    }
        return {
         afterSubmit:afterSubmit};
});