/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email', 'N/render', 'N/search', 'N/ui/serverWidget','N/record'],
    /**
 * @param{email} email
 * @param{render} render
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (email, render, search, serverWidget,record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if(scriptContext.request.method === "GET"){

            
                let form = serverWidget.createForm({
                        title:'sales order form'
                });
                //hidden to get the description and price 
                let itemDataField = form.addField({
                    id: 'custpage_itemdata',
                    type: serverWidget.FieldType.LONGTEXT,
                    label: 'Item Data'
                });

                itemDataField.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                //

                form.clientScriptModulePath = './jj_cs_raf4.js';
                    
                form.addField({
                    id: 'custpage_firstname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                }).isMandatory = true;
                form.addField({
                    id: 'custpage_lastname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                }).isMandatory = true;
                form.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                }).isMandatory = true;
                form.addField({
                    id: 'custpage_phno',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                }).isMandatory = true;
                form.addSubmitButton({
                    label: 'submit'
                });
                let itemSublist = form.addSublist({
                    id: 'custpage_items',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Items'
                });
                let itemField = itemSublist.addField({
                    id: 'custpage_item',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Item',
                    source: 'item'
                });
                let descField = itemSublist.addField({
                    id: 'custpage_description',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Description'
                });
                // descField.updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.INLINE
                // });
                itemSublist.addField({
                    id: 'custpage_quantity',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Quantity'
                });
                itemSublist.addField({
                    id: 'custpage_price',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Price'
                });
                let amtField = itemSublist.addField({
                    id: 'custpage_amount',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Amount'
                });
                // amtField.updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.INLINE
                // });

                // the descripton and price for cs
                let itemMap = {};

                let itemSearch = search.create({
                    type: 'item',
                    columns: [
                        'salesdescription',
                        'baseprice'
                    ]
                });

                itemSearch.run().each(function(result){

                    itemMap[result.id] = {
                        description: result.getValue('salesdescription') || '',
                        price: parseFloat(result.getValue('baseprice')) || 0
                    };

                    return true;
                });
                itemDataField.defaultValue = JSON.stringify(itemMap);
                log.debug({
    title: 'ITEM MAP',
    details: JSON.stringify(itemMap)
});

                ///

                scriptContext.response.writePage(form);
            }
            else{
                let params = scriptContext.request.parameters;
                let firstName = params.custpage_firstname;
                let lastName = params.custpage_lastname;
                let cust_email = params.custpage_email;
                let phone = params.custpage_phno;
                let customerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [
                        ['email', 'is', cust_email]
                    ],
                    columns: ['internalid']
                });

                let results = customerSearch.run().getRange({
                    start:0,
                    end:1
                });
                let customerId;
                //customer exist if search return records
                if (results.length > 0){
                    customerId=results[0].getValue({name:'internalid'});
                }
                else{
                    let customerRec = record.create({
                        type: record.Type.CUSTOMER,
                        isDynamic:true
                    });
                    

                    customerRec.setValue({
                        fieldId: 'companyname',
                        value: firstName +' '+ lastName
                    });

                    customerRec.setValue({
                        fieldId: 'subsidiary',
                        value: 2
                    });

                    customerRec.setValue({
                        fieldId: 'email',
                        value: cust_email
                    });

                    customerRec.setValue({
                        fieldId: 'phone',
                        value: phone
                    });
                    customerRec.setValue({
                        fieldId: 'salesrep',
                        value: 135 // internal id of a sales rep
                    });

                    customerId = customerRec.save();
                }
                let soRecord = record.create({
                    type: record.Type.SALES_ORDER,
                    isDynamic:true
                });
                soRecord.setValue({
                    fieldId:'entity',
                    value:customerId
                });
                soRecord.setValue({
                    fieldId:'orderstatus',
                    value:'B'
                });
                let lineCount = scriptContext.request.getLineCount({
                    group: 'custpage_items'
                    });
                for(let i = 0; i < lineCount; i++){

                    // Read Suitelet row

                    let itemId = scriptContext.request.getSublistValue({
                        group: 'custpage_items',
                        name: 'custpage_item',
                        line: i
                    });
                    if (!itemId) {
                        continue;
                    }
                    let quantity = scriptContext.request.getSublistValue({
                        group: 'custpage_items',
                        name: 'custpage_quantity',
                        line: i
                    });
                    let price = scriptContext.request.getSublistValue({
                        group: 'custpage_items',
                        name: 'custpage_price',
                        line: i
                    });
                    let amount = scriptContext.request.getSublistValue({
                        group: 'custpage_items',
                        name: 'custpage_amount',
                        line: i
                    });
                    

                    // Write SO row

                    soRecord.selectNewLine({
                        sublistId: 'item'
                    });

                    soRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: itemId
                    });

                    soRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: quantity
                    });

                    soRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        value: price
                    });
                    soRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        value: amount
                    });

                    soRecord.commitLine({
                        sublistId: 'item'
                    });
                }
                let soId = soRecord.save();
                let customerData = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: customerId,
                    columns: ['salesrep']
                });

                let salesRepId = customerData.salesrep[0].value;
                let employeeData = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: salesRepId,
                    columns: ['supervisor']
                });

                let supervisorId = employeeData.supervisor[0].value;
                let soData = search.lookupFields({
                    type: search.Type.SALES_ORDER,
                    id: soId,
                    columns: ['total']
                });

                let totalAmount = soData.total;
                if (Number(totalAmount) > 500) {

                    let pdfFile = render.transaction({
                        entityId: soId,
                        printMode: render.PrintMode.PDF
                    });

                    email.send({
                        author: salesRepId,
                        recipients: supervisorId,
                        subject: 'Sales Order Exceeds $500',
                        body: 'Please review the attached Sales Order.',
                        attachments: [pdfFile]
                    });
                }


                
            }
            
        }

        return {onRequest}

    });