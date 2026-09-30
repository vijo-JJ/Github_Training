/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/record', 'N/runtime'],
    /**
 * @param{email} email
 * @param{record} record
 */
    (email, record, runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            if(scriptContext.type === scriptContext.UserEventType.EDIT){
                const oldRec = scriptContext.oldRecord;
                const newRec = scriptContext.newRecord;
                const changes = [];
                const lineCount = newRec.getLineCount({sublistId:'item'});
                for(let i = 0;i < lineCount; i++){
                    const oldQuantity = oldRec.getSublistValue({sublistId:'item',fieldId:'quantity',line:i});
                    const newQuantity = newRec.getSublistValue({sublistId:'item',fieldId:'quantity',line:i});
                    if(oldQuantity !== newQuantity ){
                        const itemName = newRec.getSublistText({sublistId:'item',fieldId:'item',line:i});
                        changes.push({
                            itemName:itemName,
                            oldQuantity:oldQuantity,
                            newQuantity:newQuantity
                        });
                    }
                }
                if (changes.length > 0){
                    const transactionId = newRec.getValue({fieldId:'tranid'});
                    const vendorId = newRec.getValue({fieldId: 'entity'});
                     let body = '';
                        changes.forEach(function(change){
                            body = body + 'Item: ' + change.itemName +
                                    ', Old Quantity: ' + change.oldQuantity +
                                    ', Updated Quantity: ' + change.newQuantity + '\n';
                    });                           
                    email.send({
                        author: -5,
                        recipients: vendorId,
                        subject : 'The quantity updated in the PO, Purchase Order Id : ' + transactionId ,
                        body:body
                    });
                }
            }
        }

        return {afterSubmit:afterSubmit}

    });

    

    

    