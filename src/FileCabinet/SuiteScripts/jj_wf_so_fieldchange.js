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

            setReturnVlaue()

            function setReturnVlaue(){
                let newRec = scriptContext.newRecord;
                let number = newRec.getValue({
                    fieldId:'custbody_so_number'
                });
                // log.debug('NUMBER', number);
                if(number >= 100){
                    // log.debug('RESULT', 'PASSED');
                    newRec.setValue({
                        fieldId:'custbody_so_result',
                        value:"passed"
                    });
                }
                else{
                    // log.debug('RESULT', 'failed');
                    newRec.setValue({
                        
                        fieldId:'custbody_so_result',
                        value:"failed"
                    });
                }
            }

            
        }

        return {onAction};
    });