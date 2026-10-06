/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search','N/record'],
    /**
 * @param{search} search
 */
    (search,record) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try{
                let salesOrderSearch= search.create({
                type:'transaction',
                isPublic:true,
                filters:[
                    ['type', 'is', 'SalesOrd'],'AND', 
                    ['item','anyof',38],'AND',
                    ['trandate','onorbefore','fourdaysago'],'AND',
                    ['status','noneof','SalesOrd:A'],'AND',
                    ['mainline', 'is', 'F']
                ],
                columns:[
                    search.createColumn({name:'item'}),
                    search.createColumn({name:'tranid'}),
                    search.createColumn({name:'internalid'}),
                    search.createColumn({name:'trandate'})
                                
                    
                ]
                });
                let salesOrderId = [];
                salesOrderSearch.run().each(function(result){
                    if (!salesOrderId.includes(result.getValue('internalid'))){
                        salesOrderId.push(result.getValue('internalid'))
                    }
                    return true;
                });
                // for(let soId of salesOrderId){
                //     record.submitFields({
                //         type: record.Type.SALES_ORDER,
                //         id: soId,
                //         values: {
                //             orderstatus: 'H'
                //         },
                //         options: {
                //             enableSourcing: false,
                //             ignoreMandatoryFields : true
                //         }
                //     });
                // }
                let soRec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: salesOrderId
                });

                let lineCount = soRec.getLineCount({
                    sublistId: 'item'
                });

                for (let i = 0; i < lineCount; i++) {
                    soRec.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'isclosed',
                        line: i,
                        value: true
                    });
                }

                soRec.save();
            }
            catch(e){
                log.debug({
                    title:'error',
                    details:e.message
                });
            }
            



        }

        return {execute}

    });