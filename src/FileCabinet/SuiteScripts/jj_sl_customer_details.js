/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
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
            if (scriptContext.request.method === 'GET') {
                let regForm = serverWidget.createForm({
                    title:'Customer Information Form'
                });
                regForm.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                }).isMandatory = true;
                regForm.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                regForm.addField({
                    id: 'custpage_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                regForm.addField({
                        id: 'custpage_salesrep',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Sales Rep',
                        source: 'employee'
                    });
                
                
                regForm.addField({
                        id: 'custpage_subsidiary',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Subsidiary',
                        source: 'subsidiary'
                    });
                
                regForm.addSubmitButton({
                    label: 'Submit Button'
                });
                scriptContext.response.writePage({
                    pageObject:regForm
                });
            }
            else{
                let params = scriptContext.request.parameters;

                let customerRec = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true
                });

                customerRec.setValue({
                    fieldId: 'companyname',
                    value: params.custpage_name
                });

                customerRec.setValue({
                    fieldId: 'email',
                    value: params.custpage_email
                });

                customerRec.setValue({
                    fieldId: 'phone',
                    value: params.custpage_phone
                });

                if (params.custpage_salesrep) {
                    customerRec.setValue({
                        fieldId: 'salesrep',
                        value: params.custpage_salesrep
                    });
                }

                if (params.custpage_subsidiary) {
                    customerRec.setValue({
                        fieldId: 'subsidiary',
                        value: params.custpage_subsidiary
                    });
                }

                let customerId = customerRec.save();
                scriptContext.response.write(`
                    <h2>Customer Created Successfully</h2>
                    <p><b>Customer ID:</b> ${customerId}</p>
                    <p><b>Name:</b> ${params.custpage_name}</p>
                    <p><b>Email:</b> ${params.custpage_email}</p>
                    <p><b>Phone:</b> ${params.custpage_phone}</p>
                    <p><b>Sales Rep:</b> ${params.custpage_salesrep}</p>
                    <p><b>Subsidiary:</b> ${params.custpage_subsidiary}</p>
                `);
            }
            
        }

        return {onRequest}

    });


// let salesRepName = '';
// if (params.custpage_salesrep) {
//     let salesRepData = search.lookupFields({
//         type: search.Type.EMPLOYEE,
//         id: params.custpage_salesrep,
//         columns: ['entityid']
//     });

//     salesRepName = salesRepData.entityid;
// }
