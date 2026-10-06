/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search','N/email'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search,email) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */


        

        
        const execute = (scriptContext) => {
        try{
        let salesOrdersearch= search.create({
            type:'transaction',
            isPublic:true,
            filters:[
                ['type','anyof','SalesOrd'], 'AND', 
                ['trandate','within','lastmonth'],'AND',
                ['mainline', 'is', 'T']
            ],
            columns:[
                search.createColumn({name:'salesrep'}),
                search.createColumn({name:'tranid'}),                
                search.createColumn({name:'entity'}),
                search.createColumn({name:'amount'})
            ]
        });
        let salesrepData = {}
        salesOrdersearch.run().each(function(result){
            let repId = result.getValue({name:'salesrep'});
            if (!salesrepData[repId]) {
                salesrepData[repId] = [];
            }//here it checks if the repid alredy exist in the salesrepData if it 
            //doesnt we create a key value pair inside the salesrepData with key as the repid and [] as 
            // the value 
            salesrepData[repId].push({
                documentNo: result.getValue('tranid'),
                customer: result.getText('entity'),
                amount: result.getValue('amount')
            });
            return true;

        });
        
        for (let repId in salesrepData) {
            let empLookup = search.lookupFields({
            type: search.Type.EMPLOYEE,
            id: repId,
            columns: ['supervisor']
        });

        let managerId = empLookup.supervisor[0].value;
            
            email.send({
                author: Number(repId),
                recipients: managerId,
                subject:'Previous Month Sales Order Details',
                body: JSON.stringify(salesrepData[repId])
            });
            log.debug({
                title:"succes",
                details:JSON.stringify(salesrepData[repId])
            })
            
        }
        
        }
        catch(e){
            log.debug({
                title:"succes",
                details:e.message
            })
        }
    }
        
        return {execute:execute}

    });





  