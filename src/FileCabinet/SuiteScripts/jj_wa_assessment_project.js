/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */



define(['N/record'],
    
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


            let taskValue = getTaskValue(scriptContext);
            return createProject(taskValue);




            
            
            
        }
        function getTaskValue(scriptContext){
                let newRec = scriptContext.newRecord;
                let taskTitle = newRec.getValue({
                    fieldId:'title'
                });
                let empAssigned = newRec.getText({
                    fieldId:'assigned'
                });
                let estimatedHours = newRec.getValue({
                    fieldId:'custevent_estimated_hours'
                });
                let complexity_score = estimatedHours * 10;
                let project_Category = '';
                if (complexity_score > 100){
                    project_Category = 'Complex'
                }
                else if (complexity_score > 50){
                    project_Category = 'Moderate'
                }
                else{
                    project_Category = 'Simple'
                }
                return {taskTitle,empAssigned,complexity_score,project_Category}
            }
            

            function createProject(taskValue){
                let projectRec = record.create({
                    type:'customrecord_project_rec'
                });
                projectRec.setValue({
                    fieldId:'name',
                    value:taskValue.taskTitle
                });
                projectRec.setValue({
                    fieldId:'custrecord_project_owner',
                    value:taskValue.empAssigned
                });
                projectRec.setValue({
                    fieldId:'custrecord_pro_cmpscore',
                    value:taskValue.complexity_score
                });
                projectRec.setValue({
                    fieldId:'custrecord_pro_category',
                    value:taskValue.project_Category
                });
                let projectId = projectRec.save();
                return projectId
            }

        return {onAction};
    });