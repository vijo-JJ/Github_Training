/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search','N/email'],
    /**
 * @param{search} search
 */
    (search,email) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let customerSearch= search.create({
                type:'customer',
                isPublic:true,
                filters:[
                    ['subsidiary', 'is', 2],'AND', 
                    ['entityid', 'startswith', 'nex']
                ],
                columns:[
                    search.createColumn({name:'internalid'})                  
                ]
            });
            customerSearch.run().each(function(result){
                let internalId = result.getValue('internalid');
                email.send({
                    author: -5,
                    recipients: internalId,
                    subject:'Daily Customer Notification',
                    body:'This is your daily email notification.'
                });
                return true;


            });
        }

        return {execute:execute}

    });