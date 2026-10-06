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
            let invoiceSearch= search.create({
                type:'transaction',
                isPublic:true,
                filters:[
                    ['type', 'is', 'CustInvc'],'AND', 
                    ['status','is','CustInvc:A'],'AND',
                    ['mainline', 'is', 'T']
                ],
                columns:[
                    search.createColumn({name:'entity'}),
                    search.createColumn({name:'tranid'})               
                    
                ]
            });
            let body = '';
            invoiceSearch.run().each(function(result){
                body = body + ' Customer : ' + result.getText('entity') + '\n' ;
                body = body + ' Invoice Number : ' + result.getValue('tranid') + '\n' ;
                return true;
            });
            email.send({
                author: -5,
                recipients: -5,
                subject:'Open Invoice Report',
                body:body
            });
            log.debug({
                title:"succes",
                details:body
            });
            



        }

        return {execute:execute}

    });