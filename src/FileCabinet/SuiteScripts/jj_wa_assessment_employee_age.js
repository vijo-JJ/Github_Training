// /**
//  * @NApiVersion 2.1
//  * @NScriptType WorkflowActionScript
//  */

// /******************************************************************************
// ********
//  * ABC Industries
//  *
//  * ${OTP-1111}: ${jj_mr_assessment_employee_age.js}
//  *
//  *
//  ******************************************************************************
// ********
//  *
//  * Author: Jobin and Jismi IT Services
//  *
//  * Date Created : 12-October-2026
//  *
//  * Description :  Develop a Workflow Action Script that calculates an employee's age using their Date of Birth.
//  * REVISION HISTORY
//  *
//  * @version 2.1  ABC-5 : 12-October-2026 : Created the initial build by JJI0045
//  *
//  * 
//  *
//  *
//  ******************************************************************************
// *********/


// define(['N/record'],
//     /**
//  * @param{record} record
//  */
//     (record) => {
//         /**
//          * Defines the WorkflowAction script trigger point.
//          * @param {Object} scriptContext
//          * @param {Record} scriptContext.newRecord - New record
//          * @param {Record} scriptContext.oldRecord - Old record
//          * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
//          * @param {string} scriptContext.type - Event type
//          * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
//          * @since 2016.1
//          */
//         const onAction = (scriptContext) => {

//             birthDate()

//             function birthDate(){
//                 let newRec = scriptContext.newRecord;
//                 let birthdate = newRec.getValue({
//                     fieldId:'birthdate'
//                 });
//                 let today = new Date().getFullYear();
//                 let empAge =  today - new Date(birthdate).getFullYear();
//                 // log.debug({
//                 //     title:'success',
//                 //     details:empAge + " " + today + " " + new Date(birthdate).getFullYear()
//                 // });
//                 if (empAge > 50 ){
//                     newRec.setValue({
//                         fieldId:'custentity_emp_status',
//                         value:'Senior Employee'
//                     });
//                 }
//                 else{
//                     newRec.setValue({
//                         fieldId:'custentity_emp_status',
//                         value:'Regular Employee'
//                     });
//                 }
//             }
            

//         }

//         return {onAction};
//     });




/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */

/******************************************************************************
********
 * ABC Industries
 *
 * ${OTP-1111}: ${jj_mr_assessment_employee_age.js}
 *
 *
 ******************************************************************************
********
 *
 * Author: Jobin and Jismi IT Services
 *
 * Date Created : 12-October-2026
 *
 * Description :  Develop a Workflow Action Script that calculates an employee's age using their Date of Birth.
 * REVISION HISTORY
 *
 * @version 2.1  ABC-5 : 12-October-2026 : Created the initial build by JJI0045
 *
 * 
 *
 *
 ******************************************************************************
*********/


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

            return birthDate(scriptContext)

            
            

        }
        function birthDate(scriptContext){
                let newRec = scriptContext.newRecord;
                let birthdate = newRec.getValue({
                    fieldId:'birthdate'
                });
                let today = new Date().getFullYear();
                let empAge =  today - new Date(birthdate).getFullYear();
                return empAge;
            }

        return {onAction};
    });