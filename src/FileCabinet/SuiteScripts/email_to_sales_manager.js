/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/log','N/record','N/email'],function(log,record,email){
    function afterSubmit(context){
        if(context.type !== context.UserEventType.CREATE){
            return;
        }
        var salesorder = context.newRecord;
        var customerid=salesorder.getValue({
            fieldId:'entity'
        });
        var customerrec=record.load({
            type:'customer',
            id:customerid
        });
        var overduebalance= customerrec.getValue({
            fieldId:'overduebalance'
        });
        if (overduebalance > 0) {
            var salesrep=customerrec.getValue({
                fieldId:'salesrep'
            });
            if (!salesrep) {

                return;

            }
            var emprec=record.load({
                type:'employee',
                id:salesrep
            });
            var sales_manager=emprec.getValue({
                fieldId:'supervisor'
            });
            if (!sales_manager) {

                return;

            }
            email.send({
                author: salesrep,
                recipients: sales_manager,
                subject: 'Sales Order Created For Overdue Customer',
                body:'A Sales Order has been created for a customer with an overdue balance.\n\n' + 'Customer ID: ' + customerid + '\nOverdue Balance: ' + overduebalance +'\nSales Order ID: ' + salesorder.id
            });
            log.debug({
                title:'email sent ',
                details:'email sent to manager : '+ sales_manager
            })

        }




    }
        return {
         afterSubmit:afterSubmit};
});