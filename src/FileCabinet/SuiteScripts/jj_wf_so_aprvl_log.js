/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            let newrec = scriptContext.newRecord;            
            let soNumber = newrec.getValue({
                fieldId:'tranid'
            });
            let status = newrec.getText({
                fieldId:'orderstatus'
            });
            let aprvlRec = record.create({
                type:'customrecord_so_aprvl_log'
            });
            aprvlRec.setValue({
                fieldId:'name',
                value:'SO Approval Log'
            });
            aprvlRec.setValue({
                fieldId:'custrecord_so_number',
                value:soNumber
            });

            aprvlRec.setValue({
                fieldId:'custrecord_status',
                value:status
            });
            aprvlRec.save();
            log.debug({
                title:'success',
                details:soNumber + status 
            })

        }

        return {onAction};
    });