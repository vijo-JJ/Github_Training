/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */




define(['N/record','N/log','N/email'],function(record,log,email){
    function afterSubmit(context){
        var rec=context.newRecord;
        var custid=rec.getValue({fieldId:'entity'});
        // var custname=rec.getText({fieldId:'entity'});
        var cust=record.load({
            type:'customer',
            id:custid
        });
        var overduebalance=cust.getValue({fieldId:'overduebalance'}) ;
        if(overduebalance>0){
            var salesrep=cust.getValue({fieldId:'salesrep'});
            if(!salesrep){return;}
            var sa_rep=record.load({
                type:'employee',
                id:salesrep
            });
            var superv=sa_rep.getValue({
                fieldId:'supervisor'
            });
            if(!superv){return;}
            email.send({
                author: salesrep,
                recipients: superv,
                subject: 'email alert',
                body: 'A sales order have been created for a customer who have Overdue' + ' customer : '+custid+' overdue balance : '+overduebalance +' sales order id : '+rec.id
                
            });

            log.debug({
                title:'email alert',
                details:'A sales order have been created for a customer who have Overdue' + ' customer : '+custid+' overdue balance : '+overduebalance +' sales order id : '+rec.id
            })






        }      


        
    }
    return{afterSubmit:afterSubmit}
})