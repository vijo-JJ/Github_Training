/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/search','N/runtime','N/record','N/file','N/email'],
    /**
 * @param{search} search
 */
    (search,runtime,record,file,email) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            const salesorderSearchObj = search.create({
                type: "salesorder",
                settings:[{"name":"consolidationtype","value":"ACCTTYPE"},{"name":"includeperiodendtransactions","value":"F"}],
                filters:
                [
                    ["type","anyof","SalesOrd"], 
                    "AND", 
                    ["status","anyof","SalesOrd:B"], 
                    "AND", 
                    ["trandate","onorbefore","thirtydaysago"], 
                    "AND",
                    ["mainline","is","T"]
                ],
                columns:
                [
                    search.createColumn({name: "tranid", label: "Document Number"}),
                    search.createColumn({name: "internalid", label: "Internal ID"}),
                    search.createColumn({name: "amount", label: "Amount"}),
                    search.createColumn({name: "entity", label: "Name"})
                ]
                });
                let csvContent = 'Customer Name,Sales Order Number,Internal Id ,Total Amount\n';
                let closedCount = 0;
                salesorderSearchObj.run().each(function(result){
                    let docNo = result.getValue({name:'tranid'});
                    let internalId = result.getValue({name:'internalid'});
                    let amount = result.getValue({name:'amount'});
                    let customerName = result.getText({name:'entity'});
                    //
                    let soRec = record.load({
                        type: record.Type.SALES_ORDER,
                        id: internalId
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
                    closedCount++

                    soRec.save();
                    ////
                    csvContent +=
                            customerName + ',' +
                            docNo + ',' +
                            internalId + ',' +
                            amount + '\n';
                    ;

                    
                    return true;
                });
                log.debug({
                    title:'yoyo',
                    details:closedCount
                });
                let csvFile = file.create({
                    name: 'salesorderclose.csv',
                    fileType: file.Type.CSV,
                    contents: csvContent
                });
                
                if(closedCount > 0){
                    
                    email.send({
                        author: -5,
                        recipients: 135,
                        subject:'sales order closed',
                        body:'sales order closed successfully',
                        attachments:[csvFile]
                    });
                }

        }

        return {execute}

    });

    