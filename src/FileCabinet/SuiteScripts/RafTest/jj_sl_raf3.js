// /**
//  * @NApiVersion 2.1
//  * @NScriptType Suitelet
//  */
// define([
//     'N/ui/serverWidget',
//     'N/search',
//     'N/record',
//     'N/runtime',
//     'N/url',
//     'N/error'
// ], (
//     serverWidget,
//     search,
//     record,
//     runtime,
//     url,
//     error
// ) => {

//     const onRequest = (scriptContext) => {

//         let form = serverWidget.createForm({
//             title: 'Customer Report'
//         });

//         form.addField({
//             id: 'custpage_startdate',
//             type: serverWidget.FieldType.DATE,
//             label: 'Start Date'
//         }).isMandatory = true;

//         form.addField({
//             id: 'custpage_enddate',
//             type: serverWidget.FieldType.DATE,
//             label: 'End Date'
//         }).isMandatory = true;

//         form.addField({
//             id: 'custpage_active',
//             type: serverWidget.FieldType.CHECKBOX,
//             label: 'Active Customers'
//         });

//         form.addField({
//             id: 'custpage_inactive',
//             type: serverWidget.FieldType.CHECKBOX,
//             label: 'Inactive Customers'
//         });

//         form.addSubmitButton({
//             label: 'Search'
//         });

//         let sublist = form.addSublist({
//             id: 'custpage_sublistid',
//             type: serverWidget.SublistType.LIST,
//             label: 'Customers'
//         });

//         sublist.addField({
//             id: 'custpage_select',
//             type: serverWidget.FieldType.CHECKBOX,
//             label: 'Select'
//         });

//         sublist.addField({
//             id: 'custpage_internalid',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Internal ID'
//         });

//         sublist.addField({
//             id: 'custpage_customerurl',
//             type: serverWidget.FieldType.URL,
//             label: 'Customer'
//         }).linkText = 'Open Customer';

//         sublist.addField({
//             id: 'custpage_custname',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Customer Name'
//         });

//         sublist.addField({
//             id: 'custpage_email',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Email'
//         });

//         sublist.addField({
//             id: 'custpage_phone',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Phone'
//         });

//         if (scriptContext.request.method === 'POST') {

//             let params = scriptContext.request.parameters;

//             let startDate = params.custpage_startdate;
//             let endDate = params.custpage_enddate;
//             let active = params.custpage_active;
//             let inactive = params.custpage_inactive;

//             if (active === 'T' && inactive === 'T') {
//                 throw error.create({
//                     name: 'INVALID_SELECTION',
//                     message: 'Select either Active or Inactive customers'
//                 });
//             }

//             if (active !== 'T' && inactive !== 'T') {
//                 throw error.create({
//                     name: 'INVALID_SELECTION',
//                     message: 'Select one filter'
//                 });
//             }

//             let line = 0;

//             if (active === 'T') {

//                 search.create({
//                     type: search.Type.CUSTOMER,
//                     filters: [
//                         ['transaction.type', 'anyof', 'SalesOrd'],
//                         'AND',
//                         ['transaction.mainline', 'is', 'T'],
//                         'AND',
//                         ['transaction.trandate', 'within', startDate, endDate],
//                         'AND',
//                         ['isinactive', 'is', 'F']
//                     ],
//                     columns: [
//                         'internalid',
//                         'entityid',
//                         'email',
//                         'phone'
//                     ]
//                 }).run().each(function(result) {

//                     let customerId = result.getValue('internalid');

//                     let customerUrl = url.resolveRecord({
//                         recordType: record.Type.CUSTOMER,
//                         recordId: customerId,
//                         isEditMode: false
//                     });

//                     sublist.setSublistValue({
//                         id: 'custpage_internalid',
//                         line: line,
//                         value: customerId.toString()
//                     });

//                     sublist.setSublistValue({
//                         id: 'custpage_customerurl',
//                         line: line,
//                         value: customerUrl
//                     });

//                     sublist.setSublistValue({
//                         id: 'custpage_custname',
//                         line: line,
//                         value: result.getValue('entityid')
//                     });

//                     if (result.getValue('email')) {
//                         sublist.setSublistValue({
//                             id: 'custpage_email',
//                             line: line,
//                             value: result.getValue('email')
//                         });
//                     }

//                     if (result.getValue('phone')) {
//                         sublist.setSublistValue({
//                             id: 'custpage_phone',
//                             line: line,
//                             value: result.getValue('phone')
//                         });
//                     }

//                     let customRec = record.create({
//                         type: 'customrecord_customer_email_tracking'
//                     });
//                     customRec.setValue({
//                         fieldId: 'name',
//                         value: result.getValue('entityid')
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_created_employee',
//                         value: runtime.getCurrentUser().id
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_customer_flag',
//                         value: true
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_phone',
//                         value: result.getValue('phone')
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_email',
//                         value: result.getValue('email')
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_customer_id',
//                         value: customerId
//                     });
                    

//                     customRec.save();

//                     line++;
//                     return true;
//                 });

//             } else {

//                 let customerIds = [];

//                 search.create({
//                     type: search.Type.SALES_ORDER,
//                     filters: [
//                         ['mainline', 'is', 'T'],
//                         'AND',
//                         ['trandate', 'within', startDate, endDate]
//                     ],
//                     columns: [
//                         'entity'
//                     ]
//                 }).run().each(function(result) {

//                     customerIds.push(
//                         result.getValue({
//                             name: 'entity'
//                         })
//                     );

//                     return true;
//                 });

//                 search.create({
//                     type: search.Type.CUSTOMER,
//                     filters: [
//                         ['isinactive', 'is', 'F'],
//                         'AND',
//                         ['internalid', 'noneof', customerIds]
//                     ],
//                     columns: [
//                         'internalid',
//                         'entityid',
//                         'email',
//                         'phone'
//                     ]
//                 }).run().each(function(result) {

//                     let customerId = result.getValue('internalid');

//                     let customerUrl = url.resolveRecord({
//                         recordType: record.Type.CUSTOMER,
//                         recordId: customerId,
//                         isEditMode: false
//                     });

//                     sublist.setSublistValue({
//                         id: 'custpage_internalid',
//                         line: line,
//                         value: customerId.toString()
//                     });

//                     sublist.setSublistValue({
//                         id: 'custpage_customerurl',
//                         line: line,
//                         value: customerUrl
//                     });

//                     sublist.setSublistValue({
//                         id: 'custpage_custname',
//                         line: line,
//                         value: result.getValue('entityid')
//                     });

//                     if (result.getValue('email')) {
//                         sublist.setSublistValue({
//                             id: 'custpage_email',
//                             line: line,
//                             value: result.getValue('email')
//                         });
//                     }

//                     if (result.getValue('phone')) {
//                         sublist.setSublistValue({
//                             id: 'custpage_phone',
//                             line: line,
//                             value: result.getValue('phone')
//                         });
//                     }
                    

//                     let customRec = record.create({
//                         type: 'customrecord_customer_email_tracking'
//                     });
//                     customRec.setValue({
//                         fieldId: 'name',
//                         value: result.getValue('entityid')
//                     });
//                     customRec.setValue({
//                         fieldId: 'custrecord_created_employee',
//                         value: runtime.getCurrentUser().id
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_customer_flag',
//                         value: false
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_phone',
//                         value: result.getValue('phone')
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_email',
//                         value: result.getValue('email')
//                     });

//                     customRec.setValue({
//                         fieldId: 'custrecord_customer_id',
//                         value: customerId
//                     });

//                     customRec.save();

//                     line++;
//                     return true;
//                 });
//             }
//         }

//         scriptContext.response.writePage(form);
//     };

//     return {
//         onRequest
//     };

// });



// /**
//  * @NApiVersion 2.1
//  * @NScriptType Suitelet
//  */
// define([
//     'N/ui/serverWidget',
//     'N/search',
//     'N/record',
//     'N/runtime',
//     'N/url',
//     'N/error'
// ], (
//     serverWidget,
//     search,
//     record,
//     runtime,
//     url,
//     error
// ) => {
 
//     const onRequest = (scriptContext) => {
 
//         const isPost = scriptContext.request.method === 'POST';
//         let params = scriptContext.request.parameters;
//         let step = isPost ? params.custpage_step : 'search';
//         let showResults = isPost && step === 'search';
//         let message = '';
 
//         // ---------------- SUBMIT STEP: create custom records ----------------
//         if (isPost && step === 'submit') {
 
//             let isActive = params.custpage_active === 'T';
//             let count = scriptContext.request.getLineCount({ group: 'custpage_sublistid' });
//             let created = 0;
 
//             for (let i = 0; i < count; i++) {
 
//                 let get = (name) => scriptContext.request.getSublistValue({
//                     group: 'custpage_sublistid',
//                     name: name,
//                     line: i
//                 });
 
//                 if (get('custpage_select') !== 'T') continue;
 
//                 let customerId = get('custpage_internalid');
 
//                 let customRec = record.create({
//                     type: 'customrecord_customer_email_tracking'
//                 });
 
//                 // native Name field (required)
//                 customRec.setValue({
//                     fieldId: 'name',
//                     value: get('custpage_custname') || ('Customer ' + customerId)
//                 });
 
//                 customRec.setValue({
//                     fieldId: 'custrecord_created_employee',
//                     value: runtime.getCurrentUser().id
//                 });
 
//                 customRec.setValue({
//                     fieldId: 'custrecord_customer_flag',
//                     value: isActive
//                 });
 
//                 customRec.setValue({
//                     fieldId: 'custrecord_customer_id',
//                     value: customerId
//                 });
 
//                 if (get('custpage_email')) {
//                     customRec.setValue({
//                         fieldId: 'custrecord_email',
//                         value: get('custpage_email')
//                     });
//                 }
 
//                 if (get('custpage_phone')) {
//                     customRec.setValue({
//                         fieldId: 'custrecord_phone',
//                         value: get('custpage_phone')
//                     });
//                 }
 
//                 customRec.save();
//                 created++;
//             }
 
//             message = created + ' record(s) created.';
//         }
 
//         // ---------------- FORM ----------------
//         let form = serverWidget.createForm({
//             title: 'Customer Report'
//         });
 
//         let startField = form.addField({
//             id: 'custpage_startdate',
//             type: serverWidget.FieldType.DATE,
//             label: 'Start Date'
//         });
//         startField.isMandatory = true;
 
//         let endField = form.addField({
//             id: 'custpage_enddate',
//             type: serverWidget.FieldType.DATE,
//             label: 'End Date'
//         });
//         endField.isMandatory = true;
 
//         let activeField = form.addField({
//             id: 'custpage_active',
//             type: serverWidget.FieldType.CHECKBOX,
//             label: 'Active Customers'
//         });
 
//         let inactiveField = form.addField({
//             id: 'custpage_inactive',
//             type: serverWidget.FieldType.CHECKBOX,
//             label: 'Inactive Customers'
//         });
 
//         // hidden field tells us which step the next POST belongs to
//         let stepField = form.addField({
//             id: 'custpage_step',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Step'
//         });
//         stepField.updateDisplayType({
//             displayType: serverWidget.FieldDisplayType.HIDDEN
//         });
//         stepField.defaultValue = showResults ? 'submit' : 'search';
 
//         // retain filter values
//         if (isPost) {
//             startField.defaultValue = params.custpage_startdate;
//             endField.defaultValue = params.custpage_enddate;
//             activeField.defaultValue = params.custpage_active;
//             inactiveField.defaultValue = params.custpage_inactive;
//         }
 
//         if (message) {
//             form.addField({
//                 id: 'custpage_msg',
//                 type: serverWidget.FieldType.INLINEHTML,
//                 label: 'Message'
//             }).defaultValue = '<div style="padding:8px;font-weight:bold;">' + message + '</div>';
//         }
 
//         form.addSubmitButton({
//             label: showResults ? 'Submit' : 'Search'
//         });
 
//         // ---------------- SEARCH STEP: show sublist ----------------
//         if (showResults) {
 
//             let sublist = form.addSublist({
//                 id: 'custpage_sublistid',
//                 type: serverWidget.SublistType.LIST,
//                 label: 'Customers'
//             });
 
//             sublist.addMarkAllButtons();
 
//             sublist.addField({
//                 id: 'custpage_select',
//                 type: serverWidget.FieldType.CHECKBOX,
//                 label: 'Select'
//             });
 
//             sublist.addField({
//                 id: 'custpage_internalid',
//                 type: serverWidget.FieldType.TEXT,
//                 label: 'Internal ID'
//             });
 
//             sublist.addField({
//                 id: 'custpage_customerurl',
//                 type: serverWidget.FieldType.URL,
//                 label: 'Customer'
//             }).linkText = 'Open Customer';
 
//             sublist.addField({
//                 id: 'custpage_custname',
//                 type: serverWidget.FieldType.TEXT,
//                 label: 'Customer Name'
//             });
 
//             sublist.addField({
//                 id: 'custpage_email',
//                 type: serverWidget.FieldType.TEXT,
//                 label: 'Email'
//             });
 
//             sublist.addField({
//                 id: 'custpage_phone',
//                 type: serverWidget.FieldType.TEXT,
//                 label: 'Phone'
//             });
 
//             let startDate = params.custpage_startdate;
//             let endDate = params.custpage_enddate;
//             let active = params.custpage_active;
//             let inactive = params.custpage_inactive;
 
//             if (active === 'T' && inactive === 'T') {
//                 throw error.create({
//                     name: 'INVALID_SELECTION',
//                     message: 'Select either Active or Inactive customers'
//                 });
//             }
 
//             if (active !== 'T' && inactive !== 'T') {
//                 throw error.create({
//                     name: 'INVALID_SELECTION',
//                     message: 'Select one filter'
//                 });
//             }
 
//             let line = 0;
 
//             // shared row writer
//             const addRow = (result) => {
 
//                 let customerId = result.getValue('internalid');
 
//                 let customerUrl = url.resolveRecord({
//                     recordType: record.Type.CUSTOMER,
//                     recordId: customerId,
//                     isEditMode: false
//                 });
 
//                 sublist.setSublistValue({
//                     id: 'custpage_internalid',
//                     line: line,
//                     value: customerId.toString()
//                 });
 
//                 sublist.setSublistValue({
//                     id: 'custpage_customerurl',
//                     line: line,
//                     value: customerUrl
//                 });
 
//                 sublist.setSublistValue({
//                     id: 'custpage_custname',
//                     line: line,
//                     value: result.getValue('entityid')
//                 });
 
//                 if (result.getValue('email')) {
//                     sublist.setSublistValue({
//                         id: 'custpage_email',
//                         line: line,
//                         value: result.getValue('email')
//                     });
//                 }
 
//                 if (result.getValue('phone')) {
//                     sublist.setSublistValue({
//                         id: 'custpage_phone',
//                         line: line,
//                         value: result.getValue('phone')
//                     });
//                 }
 
//                 line++;
//             };
 
//             if (active === 'T') {
 
//                 let seen = new Set();
 
//                 search.create({
//                     type: search.Type.CUSTOMER,
//                     filters: [
//                         ['transaction.type', 'anyof', 'SalesOrd'],
//                         'AND',
//                         ['transaction.mainline', 'is', 'T'],
//                         'AND',
//                         ['transaction.trandate', 'within', startDate, endDate],
//                         'AND',
//                         ['isinactive', 'is', 'F']
//                     ],
//                     columns: [
//                         'internalid',
//                         'entityid',
//                         'email',
//                         'phone'
//                     ]
//                 }).run().each(function (result) {
 
//                     let customerId = result.getValue('internalid');
 
//                     // skip duplicates caused by the transaction join
//                     if (seen.has(customerId)) return true;
//                     seen.add(customerId);
 
//                     addRow(result);
//                     return true;
//                 });
 
//             } else {
 
//                 let customerIds = [];
 
//                 search.create({
//                     type: search.Type.SALES_ORDER,
//                     filters: [
//                         ['mainline', 'is', 'T'],
//                         'AND',
//                         ['trandate', 'within', startDate, endDate]
//                     ],
//                     columns: [
//                         'entity'
//                     ]
//                 }).run().each(function (result) {
 
//                     let id = result.getValue({ name: 'entity' });
//                     if (customerIds.indexOf(id) === -1) {
//                         customerIds.push(id);
//                     }
 
//                     return true;
//                 });
 
//                 let custFilters = [['isinactive', 'is', 'F']];
//                 if (customerIds.length) {
//                     custFilters.push('AND', ['internalid', 'noneof', customerIds]);
//                 }
 
//                 search.create({
//                     type: search.Type.CUSTOMER,
//                     filters: custFilters,
//                     columns: [
//                         'internalid',
//                         'entityid',
//                         'email',
//                         'phone'
//                     ]
//                 }).run().each(function (result) {
 
//                     addRow(result);
//                     return true;
//                 });
//             }
//         }
 
//         scriptContext.response.writePage(form);
//     };
 
//     return {
//         onRequest
//     };
 
// });
 


/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
    'N/ui/serverWidget',
    'N/search',
    'N/record',
    'N/runtime',
    'N/url',
    'N/error'
], function (
    serverWidget,
    search,
    record,
    runtime,
    url,
    error
) {

    function onRequest(scriptContext) {

        let form = serverWidget.createForm({
            title: 'Customer Report'
        });

        let startField = form.addField({
            id: 'custpage_startdate',
            type: serverWidget.FieldType.DATE,
            label: 'Start Date'
        });
        startField.isMandatory = true;

        let endField = form.addField({
            id: 'custpage_enddate',
            type: serverWidget.FieldType.DATE,
            label: 'End Date'
        });
        endField.isMandatory = true;

        let activeField = form.addField({
            id: 'custpage_active',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Active Customers'
        });

        let inactiveField = form.addField({
            id: 'custpage_inactive',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Inactive Customers'
        });

let stepField = form.addField({
            id: 'custpage_step',
            type: serverWidget.FieldType.TEXT,
            label: 'Step'
        });

        stepField.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });        

        if (scriptContext.request.method === 'POST') {

            let params = scriptContext.request.parameters;

            startField.defaultValue = params.custpage_startdate;
            endField.defaultValue = params.custpage_enddate;
            activeField.defaultValue = params.custpage_active;
            inactiveField.defaultValue = params.custpage_inactive;

            if (params.custpage_step === 'submit') {

                let count = scriptContext.request.getLineCount({
                    group: 'custpage_sublistid'
                });

                let created = 0;

                for (let i = 0; i < count; i++) {

                    let selected = scriptContext.request.getSublistValue({
                        group: 'custpage_sublistid',
                        name: 'custpage_select',
                        line: i
                    });

                    if (selected !== 'T') {
                        continue;
                    }

                    let customerId = scriptContext.request.getSublistValue({
                        group: 'custpage_sublistid',
                        name: 'custpage_internalid',
                        line: i
                    });

                    let customerName = scriptContext.request.getSublistValue({
                        group: 'custpage_sublistid',
                        name: 'custpage_custname',
                        line: i
                    });

                    let email = scriptContext.request.getSublistValue({
                        group: 'custpage_sublistid',
                        name: 'custpage_email',
                        line: i
                    });

                    let phone = scriptContext.request.getSublistValue({
                        group: 'custpage_sublistid',
                        name: 'custpage_phone',
                        line: i
                    });

                    let customRec = record.create({
                        type: 'customrecord_customer_email_tracking'
                    });

                    customRec.setValue({
                        fieldId: 'name',
                        value: customerName
                    });

                    customRec.setValue({
                        fieldId: 'custrecord_created_employee',
                        value: runtime.getCurrentUser().id
                    });

                    customRec.setValue({
                        fieldId: 'custrecord_customer_flag',
                        value: params.custpage_active === 'T'
                    });

                    customRec.setValue({
                        fieldId: 'custrecord_customer_id',
                        value: customerId
                    });

                    if (email) {
                        customRec.setValue({
                            fieldId: 'custrecord_email',
                            value: email
                        });
                    }

                    if (phone) {
                        customRec.setValue({
                            fieldId: 'custrecord_phone',
                            value: phone
                        });
                    }

                    customRec.save();

                    created++;
                }

                form.addField({
                    id: 'custpage_msg',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Message'
                }).defaultValue =
                    '<div style="padding:10px;color:green;font-weight:bold;">' +
                    created +
                    ' record(s) created.</div>';

                stepField.defaultValue = 'search';

                form.addSubmitButton({
                    label: 'Search'
                });
            }
            else {

                stepField.defaultValue = 'submit';

                form.addSubmitButton({
                    label: 'Submit'
                });

                let sublist = form.addSublist({
                    id: 'custpage_sublistid',
                    type: serverWidget.SublistType.LIST,
                    label: 'Customers'
                });

                sublist.addMarkAllButtons();

                sublist.addField({
                    id: 'custpage_select',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Select'
                });

                sublist.addField({
                    id: 'custpage_internalid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Internal ID'
                });

                sublist.addField({
                    id: 'custpage_customerurl',
                    type: serverWidget.FieldType.URL,
                    label: 'Customer'
                }).linkText = 'Open Customer';

                sublist.addField({
                    id: 'custpage_custname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                });

                sublist.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Email'
                });

                sublist.addField({
                    id: 'custpage_phone',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Phone'
                });

                let startDate = params.custpage_startdate;
                let endDate = params.custpage_enddate;
                let active = params.custpage_active;
                let inactive = params.custpage_inactive;

                if (active === 'T' && inactive === 'T') {
                    throw error.create({
                        name: 'INVALID_SELECTION',
                        message: 'Select either Active or Inactive customers'
                    });
                }

                if (active !== 'T' && inactive !== 'T') {
                    throw error.create({
                        name: 'INVALID_SELECTION',
                        message: 'Select one filter'
                    });
                }

                let line = 0;

                if (active === 'T') {

                    let seen = [];

                    search.create({
                        type: search.Type.CUSTOMER,
                        filters: [
                            ['transaction.type', 'anyof', 'SalesOrd'],
                            'AND',
                            ['transaction.mainline', 'is', 'T'],
                            'AND',
                            ['transaction.trandate', 'within', startDate, endDate],
                            'AND',
                            ['isinactive', 'is', 'F']
                        ],
                        columns: [
                            'internalid',
                            'entityid',
                            'email',
                            'phone'
                        ]
                    }).run().each(function (result) {

                        let customerId = result.getValue('internalid');

                        if (seen.indexOf(customerId) !== -1) {
                            return true;
                        }

                        seen.push(customerId);

                        let customerUrl = url.resolveRecord({
                            recordType: record.Type.CUSTOMER,
                            recordId: customerId,
                            isEditMode: false
                        });

                        sublist.setSublistValue({
                            id: 'custpage_internalid',
                            line: line,
                            value: customerId.toString()
                        });

                        sublist.setSublistValue({
                            id: 'custpage_customerurl',
                            line: line,
                            value: customerUrl
                        });

                        sublist.setSublistValue({
                            id: 'custpage_custname',
                            line: line,
                            value: result.getValue('entityid')
                        });

                        if (result.getValue('email')) {
                            sublist.setSublistValue({
                                id: 'custpage_email',
                                line: line,
                                value: result.getValue('email')
                            });
                        }

                        if (result.getValue('phone')) {
                            sublist.setSublistValue({
                                id: 'custpage_phone',
                                line: line,
                                value: result.getValue('phone')
                            });
                        }

                        line++;

                        return true;
                    });

                } else {

                    let customerIds = [];

                    search.create({
                        type: search.Type.SALES_ORDER,
                        filters: [
                            ['mainline', 'is', 'T'],
                            'AND',
                            ['trandate', 'within', startDate, endDate]
                        ],
                        columns: [
                            'entity'
                        ]
                    }).run().each(function (result) {

                        let customerId = result.getValue({
                            name: 'entity'
                        });

                        if (customerIds.indexOf(customerId) === -1) {
                            customerIds.push(customerId);
                        }

                        return true;
                    });

                    let filters = [
                        ['isinactive', 'is', 'F']
                    ];

                    if (customerIds.length > 0) {
                        filters.push(
                            'AND',
                            ['internalid', 'noneof', customerIds]
                        );
                    }

                    search.create({
                        type: search.Type.CUSTOMER,
                        filters: filters,
                        columns: [
                            'internalid',
                            'entityid',
                            'email',
                            'phone'
                        ]
                    }).run().each(function (result) {

                        let customerId = result.getValue('internalid');

                        let customerUrl = url.resolveRecord({
                            recordType: record.Type.CUSTOMER,
                            recordId: customerId,
                            isEditMode: false
                        });

                        sublist.setSublistValue({
                            id: 'custpage_internalid',
                            line: line,
                            value: customerId.toString()
                        });

                        sublist.setSublistValue({
                            id: 'custpage_customerurl',
                            line: line,
                            value: customerUrl
                        });

                        sublist.setSublistValue({
                            id: 'custpage_custname',
                            line: line,
                            value: result.getValue('entityid')
                        });

                        if (result.getValue('email')) {
                            sublist.setSublistValue({
                                id: 'custpage_email',
                                line: line,
                                value: result.getValue('email')
                            });
                        }

                        if (result.getValue('phone')) {
                            sublist.setSublistValue({
                                id: 'custpage_phone',
                                line: line,
                                value: result.getValue('phone')
                            });
                        }

                        line++;

                        return true;
                    });
                }
            }
        }
        else {

            stepField.defaultValue = 'search';

            form.addSubmitButton({
                label: 'Search'
            });
        }

        scriptContext.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };

});