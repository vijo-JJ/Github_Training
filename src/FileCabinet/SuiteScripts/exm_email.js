/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/record','N/email'],function(record,email){

    function afterSubmit(context){
        var rec=context.newRecord;
        var custid=rec.getValue({
            fieldId:'entity'
        });
        var customer=record.load({
            type:'customer',
            id:custid,
            isDynamic:true
        });
        var overduebalance=customer.getValue({fieldId:'overduebalance'})
        if(overduebalance>0){
            var salesrep=customer.getValue({
                fieldId:'salesrep'
            });
            if(!salesrep){
                return;
            }
            var emp=record.load({
                type:'employee',
                id:salesrep
            });
            var superv = emp.getValue({fieldId:'supervisor'});
            if(!superv){return;}



            email.send({
            author: salesrep,
            recipients: superv,
            subject: 'Test Sample Email Module',
            body: 'a new sales order have been created for a customer with overdue: customer : '+custid+ " overduebalance : "+ overduebalance + ' sales order id : '+ rec.id
           
           
            });

        }
    }
    return{afterSubmit:afterSubmit}
})