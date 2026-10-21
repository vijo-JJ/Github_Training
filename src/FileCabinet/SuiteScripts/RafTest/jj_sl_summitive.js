// /**
//  * @NApiVersion 2.1
//  * @NScriptType Suitelet
//  */
// define(['N/email', 'N/https','N/record','N/ui/serverWidget','N/search','N/url'],
//     /**
//  * @param{email} email
//  * @param{https} https
//  */
//     (email, https,record,serverWidget,search,url) => {
//         /**
//          * Defines the Suitelet script trigger point.
//          * @param {Object} scriptContext
//          * @param {ServerRequest} scriptContext.request - Incoming request
//          * @param {ServerResponse} scriptContext.response - Suitelet response
//          * @since 2015.2
//          */
//         const onRequest = (scriptContext) => {
//             try{
//             let form = serverWidget.createForm({
//                     title:'Akshaya Institute'
//                 }); 
//                 //
//                 let languageDataField = form.addField({
//                     id: 'custpage_languagedata',
//                     type: serverWidget.FieldType.LONGTEXT,
//                     label: 'Language Data'
//                 });

//                 languageDataField.updateDisplayType({
//                     displayType: serverWidget.FieldDisplayType.HIDDEN
//                 });
//                 //

//                 form.clientScriptModulePath = './jj_cs_summitive.js';
//                 form.addField({
//                     id: 'custpage_name',
//                     type: serverWidget.FieldType.TEXT,
//                     label: 'Student Name'
//                 });
//                 form.addField({
//                     id: 'custpage_country',
//                     type: serverWidget.FieldType.TEXT,
//                     label: 'Country'
//                 });
//                 form.addField({
//                     id: 'custpage_age',
//                     type: serverWidget.FieldType.INTEGER,
//                     label: 'Age'
//                 });
//                 form.addField({
//                     id: 'custpage_phone',
//                     type: serverWidget.FieldType.PHONE,
//                     label: 'Phone Number'
//                 });
//                 form.addField({
//                     id: 'custpage_email',
//                     type: serverWidget.FieldType.EMAIL,
//                     label: 'Email'
//                 });
//                 form.addField({
//                     id: 'custpage_language',
//                     type: serverWidget.FieldType.SELECT,
//                     source:'customrecord_fee_details_rec',
//                     label: 'Language'
//                 });
//                 let currencyField = form.addField({
//                     id: 'custpage_basecurrency',
//                     type: serverWidget.FieldType.TEXT,
//                     label: 'Base Currency'
//                 }).defaultValue = "INR"
//                 // currencyField.isDisabled = true;

//                 form.addField({
//                     id: 'custpage_tran_currency',
//                     type: serverWidget.FieldType.SELECT,
//                     source:'customlist_tran_currency_list',
//                     label: 'Transaction Currency'
//                 });
//                 form.addField({
//                     id: 'custpage_fee_amt',
//                     type: serverWidget.FieldType.CURRENCY,
//                     label: 'Fee amount'
//                 });
//                 form.addField({
//                     id: 'custpage_exchange_rate',
//                     type: serverWidget.FieldType.FLOAT,
//                     label: 'Exchange Rate'
//                 });
//                 form.addSubmitButton({
//                     label: 'Submit'
//                 });

//                 //
//                 let languageMap = {};

//                 let languageSearch = search.create({
//                     type: 'customrecord_fee_details_rec',
//                     columns: [
//                         'custrecord_course_fee'
                        
//                     ]
//                 });

//                 languageSearch.run().each(function(result){

//                     languageMap[result.id] = {
//                         course_fee: result.getValue('custrecord_course_fee') || ''
                        
//                     };

//                     return true;
//                 });
//                 languageDataField.defaultValue = JSON.stringify(languageMap);
//                 //
//                 scriptContext.response.writePage(form);

//                 if(scriptContext.request.method === "POST"){
//                     let params = scriptContext.request.parameters;

//                     let studentRec = record.create({
//                         type: 'customrecord_akshaya_institute',
//                         isDynamic: true
//                     });

//                     studentRec.setValue({
//                         fieldId: 'name',
//                         value: params.custpage_name
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_country',
//                         value: params.custpage_country
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_age',
//                         value: params.custpage_age
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_email_address',
//                         value: params.custpage_email
//                     });

//                     studentRec.setValue({
//                         fieldId: 'custrecord_lang',
//                         value: params.custpage_language
//                     });

//                     studentRec.setValue({
//                         fieldId: 'custrecord_phone_no',
//                         value: params.custpage_phone
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_base_currency',
//                         value: params.custpage_basecurrency
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_tran_currency',
//                         value: params.custpage_tran_currency
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_fee_amount',
//                         value: params.custpage_fee_amt
//                     });
//                     studentRec.setValue({
//                         fieldId: 'custrecord_exchange_rate',
//                         value: params.custpage_exchange_rate
//                     });
//                     let studentId = studentRec.save();
//                     let studentUrl = url.resolveRecord({
//                         recordType: 'customrecord_akshaya_institute',
//                         recordId: studentId,
//                         isEditMode: false
//                     });

//                     email.send({
//                         author: -5,
//                         recipients: -5,
//                         subject: 'Tuition Fee Query Received for Training',
//                         body: 'Please review the new query recieved'  + '<td><a href="' +
//                         studentUrl +
//                         '">' +
//                         "student"+
//                         '</a></td>'
                        
//                     })

//                 }
//             }
//         catch(e){
//             log.debug({
//                 tile:'success',
//                 details:e.message
//             });
//         }    
//         }
        

//         return {onRequest}

//     });







/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */


define(['N/email', 'N/https','N/record','N/ui/serverWidget','N/search','N/url'],
    /**
 * @param{email} email
 * @param{https} https
 */
    (email, https,record,serverWidget,search,url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                let getFormData = getForm(scriptContext)
                ////
                let params = scriptContext.request.parameters;

if (params.action === 'getrate') {

    let currency = params.currency;

    let apiResponse = https.get({
        url: 'https://api.freecurrencyapi.com/v1/latest'
            + '?apikey=YOUR_API_KEY'
            + '&base_currency=INR'
            + '&currencies=' + currency
    });

    let data = JSON.parse(apiResponse.body);

    let rate = data.data[currency];

    scriptContext.response.write(
        JSON.stringify({
            rate: rate
        })
    );

    return;
}
                // /////
                if(scriptContext.request.method === "POST"){
                    let studentId = postForm(scriptContext)
                    emailSend(studentId)
                }
            }
            catch(e){
                log.debug({
                    tile:'success',
                    details:e.message
                });
            }    
        }
        function getForm(scriptContext){
            let form = serverWidget.createForm({
                    title:'Akshaya Institute'
                }); 
                //
                let languageDataField = form.addField({
                    id: 'custpage_languagedata',
                    type: serverWidget.FieldType.LONGTEXT,
                    label: 'Language Data'
                });

                languageDataField.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                //

                form.clientScriptModulePath = './jj_cs_summitive.js';
                form.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Student Name'
                });
                form.addField({
                    id: 'custpage_country',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Country'
                });
                form.addField({
                    id: 'custpage_age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age'
                });
                form.addField({
                    id: 'custpage_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });
                form.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                form.addField({
                    id: 'custpage_language',
                    type: serverWidget.FieldType.SELECT,
                    source:'customrecord_fee_details_rec',
                    label: 'Language'
                });
                let currencyField = form.addField({
                    id: 'custpage_basecurrency',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Base Currency'
                }).defaultValue = "INR"
                // currencyField.isDisabled = true;

                form.addField({
                    id: 'custpage_tran_currency',
                    type: serverWidget.FieldType.SELECT,
                    source:'customlist_tran_currency_list',
                    label: 'Transaction Currency'
                });
                form.addField({
                    id: 'custpage_fee_amt',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Fee amount'
                });
                form.addField({
                    id: 'custpage_exchange_rate',
                    type: serverWidget.FieldType.FLOAT,
                    label: 'Exchange Rate'
                });
                form.addSubmitButton({
                    label: 'Submit'
                });

                //
                let languageMap = {};

                let languageSearch = search.create({
                    type: 'customrecord_fee_details_rec',
                    columns: [
                        'custrecord_course_fee'
                        
                    ]
                });

                languageSearch.run().each(function(result){

                    languageMap[result.id] = {
                        course_fee: result.getValue('custrecord_course_fee') || ''
                        
                    };

                    return true;
                });
                languageDataField.defaultValue = JSON.stringify(languageMap);
                //
                scriptContext.response.writePage(form);
        }



        function postForm(scriptContext){

                    
                    let params = scriptContext.request.parameters;

                    let studentRec = record.create({
                        type: 'customrecord_akshaya_institute',
                        isDynamic: true
                    });

                    studentRec.setValue({
                        fieldId: 'name',
                        value: params.custpage_name
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_country',
                        value: params.custpage_country
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_age',
                        value: params.custpage_age
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_email_address',
                        value: params.custpage_email
                    });

                    studentRec.setValue({
                        fieldId: 'custrecord_lang',
                        value: params.custpage_language
                    });

                    studentRec.setValue({
                        fieldId: 'custrecord_phone_no',
                        value: params.custpage_phone
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_base_currency',
                        value: params.custpage_basecurrency
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_tran_currency',
                        value: params.custpage_tran_currency
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_fee_amount',
                        value: params.custpage_fee_amt
                    });
                    studentRec.setValue({
                        fieldId: 'custrecord_exchange_rate',
                        value: params.custpage_exchange_rate
                    });
                    let studentId = studentRec.save();
                    return studentId

                    
                }
                function emailSend(studentId){
                    let studentUrl = url.resolveRecord({
                        recordType: 'customrecord_akshaya_institute',
                        recordId: studentId,
                        isEditMode: false
                    });

                    email.send({
                        author: -5,
                        recipients: -5,
                        subject: 'Tuition Fee Query Received for Training',
                        body: 'Please review the new query recieved'  + '<td><a href="' +
                        studentUrl +
                        '">' +
                        "student"+
                        '</a></td>'
                        
                    })
                    }
        

        return {onRequest}

    });