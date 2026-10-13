/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define([],
    
    () => {
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
            let newRec = scriptContext.newRecord;
            let totalAmount = Number(newRec.getValue({
                fieldId:'total'
            }));
            if(totalAmount > 5000){
                newRec.setValue({
                    fieldId:'custbody_credit_status',
                    value:'Credit Review Required'
                });
                log.debug({
                    title:'success',
                    details:'Credit Review Required'
                });
            }
            else{
                newRec.setValue({
                    fieldId:'custbody_credit_status',
                    value:'Approved'
                });
                log.debug({
                    title:'success',
                    details:'Approved'
                });
            }
        }

        return {onAction};
    });