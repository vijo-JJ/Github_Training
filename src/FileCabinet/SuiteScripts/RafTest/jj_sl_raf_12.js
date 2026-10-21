/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
    'N/ui/serverWidget',
    'N/search',
    'N/log',
    'N/record',
    'N/runtime',
    'N/email',
    'N/file'
], (
    serverWidget,
    search,
    log,
    record,
    runtime,
    email,
    file
) => {
    const PAGE_SIZE = 100;
    const onRequest = (scriptContext) => {
        try {
            const request = scriptContext.request;
            const form = serverWidget.createForm({
                title: 'PO Delay Email Report'
            });
            const employeeField = form.addField({
                id: 'custpage_employee',
                type: serverWidget.FieldType.SELECT,
                source: 'employee',
                label: 'Created By'
            });
            const stepField = form.addField({
                id: 'custpage_step',
                type: serverWidget.FieldType.TEXT,
                label: 'Step'
            });
            stepField.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            if (request.method === 'GET') {
                 stepField.defaultValue = 'search';
                form.addSubmitButton({
                    label: 'Search'
                });
            } else {
                const params = request.parameters;
                const employeeId =
                    params.custpage_employee || '';
                employeeField.defaultValue = employeeId;
                if (params.custpage_step === 'create') {
                    handleCreate(scriptContext);
                    return;
                } else {
                    stepField.defaultValue = 'create';
                    form.addSubmitButton({
                        label: 'Create'
                    });
                    displayPurchaseOrders(
                        form,
                        employeeId
                    );
                }
            }
            scriptContext.response.writePage(form);
        } catch (e) {
            log.error({
                title: 'SUITELET_ERROR',
                details: e
            });
            scriptContext.response.write(
                'Error: ' + e.message
            );
        }
    };
    /*
     * SEARCH AND DISPLAY PURCHASE ORDERS
     */
    const displayPurchaseOrders = (
        form,
        employeeId
    ) => {

        const sublist = form.addSublist({
                id: 'custpage_pos',
            type: serverWidget.SublistType.LIST,
            label: 'Purchase Orders'
        });
        sublist.addField({
            id: 'custpage_select',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Select'
        });
        sublist.addField({
            id: 'custpage_poid',
            type: serverWidget.FieldType.TEXT,
            label: 'Internal ID'
        });
        sublist.addField({
            id: 'custpage_ponumber',
            type: serverWidget.FieldType.TEXT,
            label: 'Document Number'
        });
        sublist.addField({
            id: 'custpage_vendor',
            type: serverWidget.FieldType.TEXT,
            label: 'Vendor'
        });
        sublist.addField({
            id: 'custpage_total',
            type: serverWidget.FieldType.CURRENCY,
            label: 'Amount'
        });
        sublist.addField({
            id: 'custpage_reason',
            type: serverWidget.FieldType.TEXT,
            label: 'Delay Reason'
        });
        const filters = [
            ['type', 'anyof', 'PurchOrd'],
            'AND',
            ['mainline', 'is', 'T'],
            'AND',
            ['trandate', 'onorbefore', 'daysago30']
        ];
        if (employeeId) {
            filters.push('AND');
            filters.push([
                'createdby',
                'anyof',
                employeeId
            ]);
        }

        /*
  * IMPORTANT:
         * These are basic transaction/date filters.
         * Add the verified pending-billing condition
         * for your NetSuite account before deployment.
         */
        const poSearch = search.create({
            type: search.Type.PURCHASE_ORDER,
            filters: filters,
            columns: [
                search.createColumn({
                    name: 'trandate',
                    sort: search.Sort.ASC
                }),
                'tranid',
                'entity',
                'total',
                'createdby'
            ]
        });
        const results = poSearch.run().getRange({
            start: 0,
            end: PAGE_SIZE
        });
        results.forEach((result, line) => {
            sublist.setSublistValue({
                id: 'custpage_poid',
                line: line,
                value: result.id
            });
            const documentNumber =
                result.getValue('tranid');
            if (documentNumber) {
                sublist.setSublistValue({
                    id: 'custpage_ponumber',
                    line: line,
                    value: documentNumber
                });
            }
            const vendor = result.getText('entity');
            if (vendor) {
                sublist.setSublistValue({
                    id: 'custpage_vendor',
                    line: line,
                    value: vendor
                });
            }
            const total = result.getValue('total');
            if (total !== null && total !== '') {
                sublist.setSublistValue({
                       id: 'custpage_total',
                    line: line,
                    value: String(total)
                });
            }
        });
        log.audit({
            title: 'PO_SEARCH',
            details: 'Purchase Orders found: ' + results.length
        });
    };
    /*
     * CREATE CUSTOM RECORDS AND EMAIL PO CREATORS
     */
    const handleCreate = (scriptContext) => {
        const request = scriptContext.request;
        const lineCount = request.getLineCount({
            group: 'custpage_pos'
        });
        const selectedPOs = [];
        for (let i = 0; i < lineCount; i++) {
            const selected = request.getSublistValue({
                group: 'custpage_pos',
                name: 'custpage_select',
                line: i
            });
            if (selected === 'T') {
                selectedPOs.push({
                    poId: request.getSublistValue({
                        group: 'custpage_pos',
                        name: 'custpage_poid',
                        line: i
                    }),
                    reason: request.getSublistValue({
                        group: 'custpage_pos',
                        name: 'custpage_reason',
                        line: i
                    }) || ''
                });
            }
        }
        if (selectedPOs.length === 0) {
            scriptContext.response.write(
                'No Purchase Orders selected.'
            );

            return;
              }
        const employeePOMap = {};
        let successfulRecords = 0;
        let failedRecords = 0;
        selectedPOs.forEach((poData) => {
            try {
                /*
                 * Get the actual PO creator and details.
                 */
                const poLookup = search.lookupFields({
                    type: search.Type.PURCHASE_ORDER,
                    id: poData.poId,
                    columns: [
                        'tranid',
                        'entity',
                        'total',
                        'createdby'
                    ]
                });
                const creatorId =
                    poLookup.createdby &&
                    poLookup.createdby.length
                        ? poLookup.createdby[0].value
                        : null;
                if (!creatorId) {
                    failedRecords++;
                    log.error({
                        title: 'PO_CREATOR_NOT_FOUND',
                        details: poData.poId
                    });
                    return;
                }
                /*
                 * Create the delay reason record.
                 */
                const delayRecord = record.create({
                    type: 'customrecord_po_delay_reason',
                    isDynamic: true
                });
                delayRecord.setValue({
                    fieldId: 'custrecord_po_parent',
                    value: Number(poData.poId)
                });
                delayRecord.setValue({
                    fieldId: 'custrecord_delay_reason',
                    value: poData.reason
                      });
                delayRecord.setValue({
                    fieldId: 'custrecord_reported_by',
                    value: Number(runtime.getCurrentUser().id)
                });
                delayRecord.setValue({
                    fieldId: 'custrecord_reported_date',
                    value: new Date()
                });
                delayRecord.save();
                successfulRecords++;
                /*
                 * Group each PO under its actual creator.
                 */
                if (!employeePOMap[creatorId]) {
                    employeePOMap[creatorId] = [];
                }
                employeePOMap[creatorId].push({
                    documentNumber: poLookup.tranid || '',
                    vendor:
                        poLookup.entity &&
                        poLookup.entity.length
                            ? poLookup.entity[0].text
                            : '',
                    total: poLookup.total || 0,
                    reason: poData.reason
                });
            } catch (e) {
                failedRecords++;
                log.error({
                    title: 'PROCESS_PO_ERROR',
                    details: {
                        poId: poData.poId,
                        error: e
                    }
                });
            }
        });
        /*
         * SEND AN INDIVIDUAL REPORT TO EACH CREATOR
         */
        let emailsSent = 0;
        Object.keys(employeePOMap).forEach((employeeId) => {
            try {
                const employee = search.lookupFields({
                     type: search.Type.EMPLOYEE,
                    id: employeeId,
                    columns: ['email']
                });
                if (!employee.email) {
                    log.error({
                        title: 'MISSING_EMPLOYEE_EMAIL',
                        details: employeeId
                    });
                    return;
                }
                const rows = employeePOMap[employeeId];
                let xml = '<?xml version="1.0"?>';
                xml += '<?mso-application progid="Excel.Sheet"?>';
                xml += `
                <Workbook
                    xmlns="urn:schemas-microsoft-com:office:spreadsheet"
                    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
                    <Worksheet ss:Name="PO Report">
                        <Table>
                            <Row>
                                <Cell><Data ss:Type="String">Document Number</Data></Cell>
                                <Cell><Data ss:Type="String">Delay Reason</Data></Cell>
                                <Cell><Data ss:Type="String">Vendor</Data></Cell>
                                <Cell><Data ss:Type="String">Total Amount</Data></Cell>
                            </Row>
                `;
                rows.forEach((row) => {
                    xml += `
                    <Row>
                        <Cell><Data ss:Type="String">${escapeXml(row.documentNumber)}</Data></Cell>
                        <Cell><Data ss:Type="String">${escapeXml(row.reason)}</Data></Cell>
                        <Cell><Data ss:Type="String">${escapeXml(row.vendor)}</Data></Cell>
                        <Cell><Data ss:Type="Number">${Number(row.total) || 0}</Data></Cell>
                    </Row>
                    `;
                });
                xml += `
                        </Table>
                    </Worksheet>
                </Workbook>
                `;
                const excelFile = file.create({
                    name: 'PO_Delay_Report_' +
                        employeeId + '.xls',
                    fileType: file.Type.EXCEL,
                    contents: xml
                });

                email.send({
                    





















// /**
//  * @NApiVersion 2.1
//  * @NScriptType Suitelet
//  */

// define([
//     'N/ui/serverWidget',
//     'N/search',
//     'N/log','N/record','N/runtime'
// ], (
//     serverWidget,
//     search,
//     log,record,runtime
// ) => {

//     const PAGE_SIZE = 10;

//     const onRequest = (scriptContext) => {

//         try {

//             if (scriptContext.request.method === 'GET') {

//                 handleGet(scriptContext);

//             } else {

//                 handlePost(scriptContext);

//             }

//         } catch (e) {

//             log.error({
//                 title: 'SUITELET_ERROR',
//                 details: e
//             });

//             scriptContext.response.write(e.message);
//         }
//     };

//     const handleGet = (scriptContext) => {

//         const request = scriptContext.request;

//         const employeeId =
//             request.parameters.custpage_employee || '';

//         const page =
//             Number(request.parameters.custpage_page || 1);

//         const form = serverWidget.createForm({
//             title: 'PO Delay Email Report'
//         });

//         form.clientScriptModulePath =
//             './jj_cs_raf12.js';

//         /*
//         ======================
//         FILTERS
//         ======================
//         */

//         const employeeField = form.addField({
//             id: 'custpage_employee',
//             type: serverWidget.FieldType.SELECT,
//             source: 'employee',
//             label: 'Created By'
//         });

//         employeeField.defaultValue = employeeId;

//         /*
//         ======================
//         HIDDEN PAGE FIELD
//         ======================
//         */

//         const pageField = form.addField({
//             id: 'custpage_page',
//             label: 'Page',
//             type: serverWidget.FieldType.INTEGER
//         });

//         pageField.updateDisplayType({
//             displayType:
//                 serverWidget.FieldDisplayType.HIDDEN
//         });

//         pageField.defaultValue = page.toString();

//         /*
//         ======================
//         SUBLIST
//         ======================
//         */

//         const sublist = form.addSublist({
//             id: 'custpage_pos',
//             type: serverWidget.SublistType.LIST,
//             label: 'Purchase Orders'
//         });

//         sublist.addField({
//             id: 'custpage_select',
//             type: serverWidget.FieldType.CHECKBOX,
//             label: 'Select'
//         });

//         sublist.addField({
//             id: 'custpage_poid',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Internal Id'
//         });

//         sublist.addField({
//             id: 'custpage_ponumber',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Document Number'
//         });

//         sublist.addField({
//             id: 'custpage_vendor',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Vendor'
//         });

//         sublist.addField({
//             id: 'custpage_total',
//             type: serverWidget.FieldType.CURRENCY,
//             label: 'Amount'
//         });

//         sublist.addField({
//             id: 'custpage_reason',
//             type: serverWidget.FieldType.TEXT,
//             label: 'Delay Reason'
//         });

//         /*
//         ======================
//         SEARCH
//         ======================
//         */

//         let filters = [
//             ['type', 'anyof', 'PurchOrd'],
//             'AND',
//             ['mainline', 'is', 'T'],
//             'AND',
//             ['status', 'anyof', 'PurchOrd:E'],
//             'AND',
//             ['trandate', 'onorbefore', 'daysago30']
//         ];

//         if (employeeId) {

//             filters.push('AND');
//             filters.push([
//                 'createdby',
//                 'anyof',
//                 employeeId
//             ]);
//         }

//         const poSearch = search.create({
//             type: search.Type.PURCHASE_ORDER,
//             filters: filters,
//             columns: [
//                 'tranid',
//                 'entity',
//                 'total',
//                 'createdby'
//             ]
//         });

//         const results =
//             poSearch.run().getRange({
//                 start: (page - 1) * PAGE_SIZE,
//                 end: page * PAGE_SIZE
//             });

//         results.forEach((result, line) => {

//             sublist.setSublistValue({
//                 id: 'custpage_poid',
//                 line,
//                 value: result.id
//             });

//             sublist.setSublistValue({
//                 id: 'custpage_ponumber',
//                 line,
//                 value:
//                     result.getValue('tranid') || ' '
//             });

//             if (result.getText('entity')) {

//                 sublist.setSublistValue({
//                     id: 'custpage_vendor',
//                     line,
//                     value: result.getText('entity')
//                 });
//             }

//             if (result.getValue('total')) {

//                 sublist.setSublistValue({
//                     id: 'custpage_total',
//                     line,
//                     value:
//                         result.getValue('total').toString()
//                 });
//             }
//         });

//         form.addSubmitButton({
//             label: 'Send Report'
//         });

//         scriptContext.response.writePage(form);
//     };

//     const handlePost = (scriptContext) => {

//         const request = scriptContext.request;

//         const lineCount =
//             request.getLineCount({
//                 group: 'custpage_pos'
//             });

//         const selectedPOs = [];

//         for (let i = 0; i < lineCount; i++) {

//             const selected =
//                 request.getSublistValue({
//                     group: 'custpage_pos',
//                     name: 'custpage_select',
//                     line: i
//                 });

//             if (selected === 'T') {

//                 selectedPOs.push({

//                     poId:
//                         request.getSublistValue({
//                             group: 'custpage_pos',
//                             name: 'custpage_poid',
//                             line: i
//                         }),

//                     reason:
//                         request.getSublistValue({
//                             group: 'custpage_pos',
//                             name: 'custpage_reason',
//                             line: i
//                         })
//                 });
//             }
//         }
//         for (var i = 0; i < selectedPOs.length; i++) {

//             var delayRecord = record.create({
//                 type: 'customrecord_po_delay_reason',
//                 isDynamic: true
//             });

//             delayRecord.setValue({
//                 fieldId: 'custrecord_po_parent',
//                 value: selectedPOs[i].poId
//             });

//             delayRecord.setValue({
//                 fieldId: 'custrecord_delay_reason',
//                 value: selectedPOs[i].reason
//             });

//             delayRecord.setValue({
//                 fieldId: 'custrecord_reported_by',
//                 value: runtime.getCurrentUser().id
//             });

//             delayRecord.setValue({
//                 fieldId: 'custrecord_reported_date',
//                 value: new Date()
//             });

//             delayRecord.save();
//         }

//         log.audit({
//             title: 'SELECTED_POs',
//             details: JSON.stringify(selectedPOs)
//         });

//         /*
//             NEXT STEPS

//             1. Create custom sublist records
//             2. Find creator
//             3. Find supervisor
//             4. Create Excel
//             5. Email supervisor
//         */

//         scriptContext.response.write(
//             `${selectedPOs.length} PO(s) selected`
//         );
//     };

//     return {
//         onRequest
//     };
// });




// define([
//     'N/ui/serverWidget',
//     'N/search',
//     'N/log',
//     'N/record',
//     'N/runtime',
//     'N/email',
//     'N/file',
//     'N/render'
// ], (
//     serverWidget,
//     search,
//     log,
//     record,
//     runtime,
//     email,
//     file,
//     render
// ) => {

//     const PAGE_SIZE = 10;

//     const handlePost = (scriptContext) => {

//         const request = scriptContext.request;

//         const lineCount = request.getLineCount({
//             group: 'custpage_pos'
//         });

//         const selectedPOs = [];

//         for (let i = 0; i < lineCount; i++) {

//             const selected = request.getSublistValue({
//                 group: 'custpage_pos',
//                 name: 'custpage_select',
//                 line: i
//             });

//             if (selected === 'T') {

//                 selectedPOs.push({
//                     poId: request.getSublistValue({
//                         group: 'custpage_pos',
//                         name: 'custpage_poid',
//                         line: i
//                     }),
//                     reason: request.getSublistValue({
//                         group: 'custpage_pos',
//                         name: 'custpage_reason',
//                         line: i
//                     }) || ''
//                 });
//             }
//         }

//         if (!selectedPOs.length) {
//             scriptContext.response.write('No Purchase Orders selected.');
//             return;
//         }

//         const employeePOMap = {};

//         selectedPOs.forEach(poData => {

//             try {

//                 const poLookup = search.lookupFields({
//                     type: search.Type.PURCHASE_ORDER,
//                     id: poData.poId,
//                     columns: [
//                         'tranid',
//                         'entity',
//                         'total',
//                         'createdby',
//                         'memo'
//                     ]
//                 });

//                 const creatorId =
//                     poLookup.createdby &&
//                     poLookup.createdby.length
//                         ? poLookup.createdby[0].value
//                         : null;

//                 if (!creatorId) {
//                     return;
//                 }

//                 /*
//                  * Save delay reason record
//                  */

//                 const delayRecord = record.create({
//                     type: 'customrecord_po_delay_reason',
//                     isDynamic: true
//                 });

//                 delayRecord.setValue({
//                     fieldId: 'custrecord_po_parent',
//                     value: poData.poId
//                 });

//                 delayRecord.setValue({
//                     fieldId: 'custrecord_delay_reason',
//                     value: poData.reason
//                 });

//                 delayRecord.setValue({
//                     fieldId: 'custrecord_reported_by',
//                     value: runtime.getCurrentUser().id
//                 });

//                 delayRecord.setValue({
//                     fieldId: 'custrecord_reported_date',
//                     value: new Date()
//                 });

//                 delayRecord.save();

//                 if (!employeePOMap[creatorId]) {
//                     employeePOMap[creatorId] = [];
//                 }

//                 employeePOMap[creatorId].push({
//                     poId: poData.poId,
//                     documentNumber: poLookup.tranid || '',
//                     vendor:
//                         poLookup.entity &&
//                         poLookup.entity.length
//                             ? poLookup.entity[0].text
//                             : '',
//                     total: poLookup.total || '',
//                     memo: poData.reason
//                 });

//             } catch (ex) {

//                 log.error({
//                     title: 'PROCESS_PO_ERROR',
//                     details: ex
//                 });
//             }
//         });

//         Object.keys(employeePOMap).forEach(employeeId => {

//             try {

//                 const poRows = employeePOMap[employeeId];

//                 let xmlContent = '';

//                 xmlContent += '<?xml version="1.0"?>';
//                 xmlContent += '<?mso-application progid="Excel.Sheet"?>';

//                 xmlContent += `
//                 <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
//                           xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
//                     <Worksheet ss:Name="PO Report">
//                         <Table>

//                             <Row>
//                                 <Cell><Data ss:Type="String">Document Number</Data></Cell>
//                                 <Cell><Data ss:Type="String">Memo</Data></Cell>
//                                 <Cell><Data ss:Type="String">Customer/Vendor</Data></Cell>
//                                 <Cell><Data ss:Type="String">Total Amount</Data></Cell>
//                             </Row>
//                 `;

//                 poRows.forEach(row => {

//                     xmlContent += `
//                     <Row>
//                         <Cell>
//                             <Data ss:Type="String">
//                                 ${escapeXml(row.documentNumber)}
//                             </Data>
//                         </Cell>
//                         <Cell>
//                             <Data ss:Type="String">
//                                 ${escapeXml(row.memo)}
//                             </Data>
//                         </Cell>
//                         <Cell>
//                             <Data ss:Type="String">
//                                 ${escapeXml(row.vendor)}
//                             </Data>
//                         </Cell>
//                         <Cell>
//                             <Data ss:Type="Number">
//                                 ${row.total || 0}
//                             </Data>
//                         </Cell>
//                     </Row>
//                     `;
//                 });

//                 xmlContent += `
//                         </Table>
//                     </Worksheet>
//                 </Workbook>
//                 `;

//                 const excelFile = file.create({
//                     name:
//                         'PO_Delay_Report_' +
//                         employeeId +
//                         '.xls',
//                     fileType: file.Type.EXCEL,
//                     contents: xmlContent
//                 });

//                 const employeeLookup = search.lookupFields({
//                     type: search.Type.EMPLOYEE,
//                     id: employeeId,
//                     columns: [
//                         'email',
//                         'firstname',
//                         'lastname'
//                     ]
//                 });

//                 const emailAddress =
//                     employeeLookup.email || '';

//                 if (emailAddress) {

//                     email.send({
//                         author: runtime.getCurrentUser().id,
//                         recipients: emailAddress,
//                         subject:
//                             'Pending Billing Purchase Order Delay Report',
//                         body:
//                             'Please find attached the Purchase Order Delay Report.',
//                         attachments: [excelFile]
//                     });
//                 }

//                 log.audit({
//                     title: 'EMAIL_SENT',
//                     details:
//                         'Email sent to Employee ID ' +
//                         employeeId
//                 });

//             } catch (e) {

//                 log.error({
//                     title: 'EMAIL_ERROR',
//                     details: e
//                 });
//             }
//         });

//         scriptContext.response.write(
//             selectedPOs.length +
//             ' PO(s) processed and emails sent.'
//         );
//     };

//     function escapeXml(value) {

//         if (!value) {
//             return '';
//         }

//         return String(value)
//             .replace(/&/g, '&amp;')
//             .replace(/</g, '&lt;')
//             .replace(/>/g, '&gt;')
//             .replace(/"/g, '&quot;')
//             .replace(/'/g, '&apos;');
//     }

//     return {
//         onRequest
//     };

// });


