/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */


/******************************************************************************
********
 * ABC Industries
 *
 * ${OTP-1111}: ${jj_sl_assessment_reg_form.js}
 *
 *
 ******************************************************************************
********
 *
 * Author: Jobin and Jismi IT Services
 *
 * Date Created : 24-September-2026
 *
 * Description : Build a registration form using Suitelet script. The form must contain the needed fields:
 * REVISION HISTORY
 *
 * @version 2.1  ABC-5 : 24-September-2026 : Created the initial build by JJI0045
 *
 * 
 *
 *
 ******************************************************************************
*********/


define(['N/record', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if (scriptContext.request.method === 'GET') {
                    let form = serverWidget.createForm({
                        title:'Registration Form'
                    });
                    form.addField({
                        id: 'custpage_name',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Name'
                    }).isMandatory = true;
                    form.addField({
                        id: 'custpage_age',
                        type: serverWidget.FieldType.INTEGER,
                        label: 'Age'
                    });
                    form.addField({
                        id: 'custpage_phno',
                        type: serverWidget.FieldType.PHONE,
                        label: 'Phone Number'
                    });
                    form.addField({
                        id: 'custpage_email',
                        type: serverWidget.FieldType.EMAIL,
                        label: 'Email'
                    });
                    form.addField({
                        id: 'custpage_fname',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Fathers Name'
                    })
                    form.addField({
                            id: 'custpage_address',
                            type: serverWidget.FieldType.TEXTAREA,
                            label: 'Address',
                            
                        });
                    
                    
                    form.addSubmitButton({
                        label: 'Submit Button'
                    });
                    scriptContext.response.writePage({
                        pageObject:form
                    });
                }
                else{
                    let params = scriptContext.request.parameters;
                    let regRec = record.create({
                        type: 'customrecordreg_form',
                        isDynamic: true
                    });
                    regRec.setValue({
                        fieldId: 'name',
                        value: params.custpage_name
                    });
                    regRec.setValue({
                        fieldId: 'custrecord_name',
                        value: params.custpage_name
                    });
                    regRec.setValue({
                        fieldId: 'custrecord_jj_age',
                        value: params.custpage_age
                    });                
                    regRec.setValue({
                        fieldId: 'custrecord_jj_ph_no',
                        value: params.custpage_phno
                    }); 
                    regRec.setValue({
                        fieldId: 'custrecord_jj_email',
                        value: params.custpage_email
                    }); 
                    regRec.setValue({
                        fieldId: 'custrecord_jj_fname',
                        value: params.custpage_fname
                    });                
                    regRec.setValue({
                        fieldId: 'custrecord_jj_address',
                        value: params.custpage_address
                    });
                    

                    let registerId = regRec.save();
                    scriptContext.response.write(`
                        <h2>Record Created Successfully</h2>
                        <p><b>Record ID:</b> ${registerId}</p>
                        <p><b>Name:</b> ${params.custpage_name}</p>
                        <p><b>Age:</b> ${params.custpage_age}</p>
                        <p><b>Phone Number:</b> ${params.custpage_phno}</p>
                        <p><b>Email:</b> ${params.custpage_email}</p>
                        <p><b>Fathers Name:</b> ${params.custpage_fname}</p>
                        <p><b>Address:</b> ${params.custpage_address}</p>
                    `);
                }
            }
            catch(e){
                log.debug({
                    title:'failed',
                    details:e.message
                });
            }
        }

        return {onRequest}

    });