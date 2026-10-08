/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            log.debug('Method', scriptContext.request.method);


   
            if (scriptContext.request.method === 'POST') {
                
                

                try {

                    let body = JSON.parse(scriptContext.request.body);

                    let patientRec = record.create({
                        type: 'customrecordcust_rec_patient'
                    });

                    patientRec.setValue({
                        fieldId: 'name',
                        value: body.name
                    });
                    patientRec.setValue({
                        fieldId: 'custrecord4',
                        value: body.name
                    });

                    patientRec.setValue({
                        fieldId: 'custrecord5',
                        value: body.age
                    });

                    patientRec.setValue({
                        fieldId: 'custrecord6',
                        value: body.sex
                    });

                    patientRec.setValue({
                        fieldId: 'custrecord7',
                        value: body.address
                    });

                    let patientId = patientRec.save();

                    scriptContext.response.write(JSON.stringify({
                        success: true,
                        internalId: patientId
                    }));

                } 
                catch (e) {

                    scriptContext.response.write(JSON.stringify({
                        success: false,
                        error: e.message
                    }));
                }
            }
        }

        return {onRequest}

    });





    //             if (scriptContext.request.method === 'POST') {
//     log.debug('POST Reached');
//     scriptContext.response.write('POST WORKING');
// }


//             if (scriptContext.request.method === 'GET') {

//     scriptContext.response.write('GET is working');

// }
 

// /**
//  * @NApiVersion 2.1
//  * @NScriptType Suitelet
//  */
// define(['N/record', 'N/search', 'N/ui/serverWidget'],

//     (record, search, serverWidget) => {

//         const onRequest = (scriptContext) => {

//             if (scriptContext.request.method === 'GET') {

//                 var form = serverWidget.createForm({
//                     title: 'Patient Registration Form'
//                 });

//                 var name = form.addField({
//                     id: 'custpage_jj_name',
//                     type: serverWidget.FieldType.TEXT,
//                     label: 'Name'
//                 });
//                 name.isMandatory = true;

//                 var age = form.addField({
//                     id: 'custpage_jj_age',
//                     type: serverWidget.FieldType.INTEGER,
//                     label: 'Age'
//                 });
//                 age.isMandatory = true;

//                 var sex = form.addField({
//                     id: 'custpage_jj_sex',
//                     type: serverWidget.FieldType.SELECT,
//                     label: 'Sex'
//                 });

//                 sex.addSelectOption({
//                     value: '',
//                     text: ''
//                 });

//                 sex.addSelectOption({
//                     value: 2,
//                     text: 'F'
//                 });

//                 sex.addSelectOption({
//                     value: 1,
//                     text: 'M'
//                 });



//                 sex.isMandatory = true;

//                 var Address = form.addField({
//                     id: 'custpage_jj_address',
//                     type: serverWidget.FieldType.TEXTAREA,
//                     label: 'Address'
//                 });

//                 Address.isMandatory = true;

//                 form.addSubmitButton({
//                     label: 'Submit'
//                 });

//                 scriptContext.response.writePage(form);

//             }

//             else if (scriptContext.request.method === 'POST') {

//                 var data = JSON.parse(scriptContext.request.body);
//                 log.debug('data', data);

//                 let name = data.custpage_jj_name;
//                 let age = data.custpage_jj_age;
//                 let addr = data.custpage_jj_address;
//                 let sex = data.custpage_jj_sex;

//                 log.debug('name', name);

//                 let customRecId = createCustomRecord(name, age, addr, sex);

//                 var detailsHtml = '<h2>Patient Registration Details</h2>';
//                 detailsHtml += '<p><b>Detailes successfully saved on record</b> ' + customRecId + '</p>';

//                 scriptContext.response.write(detailsHtml);
//             }

//             function createCustomRecord(name, age, addr, sex) {

//                 log.debug('name', name);

//                 var customRecord = record.create({
//                     type: 'customrecordcust_rec_patient',
//                     isDynamic: true
//                 });

//                 customRecord.setValue({
//                     fieldId: 'custrecord4',
//                     value: name
//                 });

//                 customRecord.setValue({
//                     fieldId: 'name',
//                     value: name
//                 });

//                 customRecord.setValue({
//                     fieldId: 'custrecord5',
//                     value: age
//                 });

//                 customRecord.setValue({
//                     fieldId: 'custrecord6',
//                     value: sex
//                 });

//                 customRecord.setValue({
//                     fieldId: 'custrecord7',
//                     value: addr
//                 });

//                 var recordId = customRecord.save({
//                     ignoreMandatoryFields: false,
//                     enableSourcing: true
//                 });

//                 log.debug("record id", recordId);

//                 return recordId;
//             }

//         }

//         return { onRequest };

//     });
