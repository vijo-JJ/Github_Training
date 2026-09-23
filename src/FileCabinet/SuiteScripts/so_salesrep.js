/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */




define(['N/record','N/log'],function(record,log){
    function beforeSubmit(context){
        var rec=context.newRecord;
        var custid=rec.getValue({fieldId:'entity'});
        var cust=record.load({
            type:'customer',
            id:custid
        });
        var salesrep=cust.getText({fieldId:'salesrep'});
        if(!salesrep){return;}
        rec.setValue({
            fieldId:'custbody2',
            value:salesrep
        })

        
    }
    return{beforeSubmit:beforeSubmit}
})