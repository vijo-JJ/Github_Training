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
        }

        return {execute}

    });