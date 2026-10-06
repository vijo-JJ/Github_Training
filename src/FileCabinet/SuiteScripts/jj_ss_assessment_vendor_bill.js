/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/search'],
    /**
 * @param{email} email
 * @param{search} search
 */
    (email, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let vendorBillSearch= search.create({
                type:'transaction',
                isPublic:true,
                filters:[
                    ['type', 'is', 'VendBill'],'AND',
                    ['duedate', 'within', 'nextoneweek'],'AND',                
                    ['mainline', 'is', 'T']
                ],
                columns:[
                    search.createColumn({name:'entity'}),
                    search.createColumn({name:'transactionnumber'}),
                    search.createColumn({name:'duedate'}),
                    search.createColumn({name:'total'}),           
                ]
            });
            let body = '';
            vendorBillSearch.run().each(function(result){
                body = body + ' vendor : ' + result.getText('entity') + '\n' ;
                body = body + ' Bill Number : ' + result.getValue('transactionnumber') + '\n' ;
                body = body + ' Due Date : ' + result.getValue('duedate') + '\n' ;
                body = body + ' Amount : ' + result.getValue('total') + '\n' ;
                return true;
            });
            email.send({
                    author: -5,
                    recipients:136,
                    subject:'vendor bills due within the next 7 days',
                    body:body,
                    
                });

        }

        return {execute:execute}

    });