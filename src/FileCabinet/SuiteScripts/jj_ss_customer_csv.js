/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search','N/file','N/email'],
    /**
 * @param{search} search
 */
    (search,file,email) => {

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
                    ['datecreated', 'within', 'thismonth']
                ],
                columns:[
                    search.createColumn({name:'datecreated'}),
                    search.createColumn({name:'entityid'}),
                    search.createColumn({name:'terms'}),
                    search.createColumn({name:'salesrep'})               
                    
                ]
            });
            let csvContent = 'Name,Date Created,Sales Rep,Terms\n';
            customerSearch.run().each(function(result){
                csvContent +=
                    '"' + result.getValue('entityid') + '",' +
                    '"' + result.getValue('datecreated') + '",' +
                    '"' + result.getText('salesrep') + '",' +
                    '"' + result.getText('terms') + '"\n';

                return true;
            });
            let csvFile = file.create({
                name: 'Customer_Report.csv',
                fileType: file.Type.CSV,
                contents: csvContent
            });
            email.send({
                    author: -5,
                    recipients: -5,
                    subject:'Monthly Customer Report',
                    body:'Please find attached the monthly customer report.',
                    attachments:[csvFile]
                });


        }

        return {execute:execute}

    });