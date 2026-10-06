/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search','N/email','N/render'],
    /**
 * @param{search} search
 */
    (search,email,render) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let salesOrderSearch= search.create({
                type:'transaction',
                isPublic:true,
                filters:[
                    ['type', 'is', 'SalesOrd'],'AND', 
                    ['trandate','on','today'],'AND',
                    ['mainline', 'is', 'T']
                ],
                columns:[
                    search.createColumn({name:'internalid'}),
                    search.createColumn({name:'entity'}),
                    search.createColumn({name:'tranid'})               
                    
                ]
            });
            salesOrderSearch.run().each(function(result){
                let tranId = result.getValue('tranid');
                let internalId = result.getValue('internalid');
                let entity = result.getValue('entity');
                let pdfFile = render.transaction({
                    entityId: parseFloat(internalId),
                    printMode: render.PrintMode.PDF
                });
                email.send({
                    author: -5,
                    recipients: entity,
                    subject:'Sales Order' + tranId,
                    body:'Please find attached Sales Order PDF.',
                    attachments:[pdfFile]
                });
                return true;


            });
        }

        return {execute:execute}

    });