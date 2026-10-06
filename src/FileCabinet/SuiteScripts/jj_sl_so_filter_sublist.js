/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget'],
    /**
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            let regForm = serverWidget.createForm({
                title:'Sales Order'
            });

            regForm.addField({
                id: 'custpage_subsidiaries',
                type: serverWidget.FieldType.SELECT,
                label: 'Subsidiary',
                source: 'subsidiary'
            });
            regForm.addField({
                id: 'custpage_customer',
                type: serverWidget.FieldType.SELECT,
                label: 'Customer',
                source: 'customer'
            });
            regForm.addSubmitButton({
                label: 'Submit Button'
            });
            let sublist = regForm.addSublist({
                id: 'custpage_sublistid',
                type: serverWidget.SublistType.LIST,
                label: 'Sales Order'
            });
            sublist.addField({
                id: 'custpage_internalid',
                type: serverWidget.FieldType.TEXT,
                label: 'internal Id'
            });
            sublist.addField({
                id: 'custpage_tranid',
                type: serverWidget.FieldType.TEXT,
                label: 'Sales Order Id'
            });
            sublist.addField({
                id: 'custpage_trandate',
                type: serverWidget.FieldType.TEXT,
                label: 'transaction date'
            });
            sublist.addField({
                id: 'custpage_entity',
                type: serverWidget.FieldType.TEXT,
                label: 'Customer Name'
            });
            sublist.addField({
                id: 'custpage_subsidiary',
                type: serverWidget.FieldType.TEXT,
                label: 'Subsidiary'
            });
            sublist.addField({
                id: 'custpage_status',
                type: serverWidget.FieldType.TEXT,
                label: 'Status'
            });
            // sublist.addField({
            //     id: 'custpage_department',
            //     type: serverWidget.FieldType.TEXT,
            //     label: 'department'
            // });
            // sublist.addField({
            //     id: 'custpage_classs',
            //     type: serverWidget.FieldType.TEXT,
            //     label: 'class'
            // });
            sublist.addField({
                id: 'custpage_total',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Total Amount'
            });
            let subsidiary = scriptContext.request.parameters.custpage_subsidiaries;
            let customer = scriptContext.request.parameters.custpage_customer;
            let filters = [
                ['type','anyof','SalesOrd'],
                'AND',
                ['mainline','is','T'],
                'AND',
                ['status','anyof',
                    'SalesOrd:A',
                    'SalesOrd:B',
                    'SalesOrd:D',
                    'SalesOrd:E'
                ]
            ];
            if (subsidiary) {
                    filters.push('AND');
                    filters.push(['subsidiary','anyof',subsidiary]);
                }

                if (customer) {
                    filters.push('AND');
                    filters.push(['entity','anyof',customer]);
                }
            let soSearch= search.create({
                type:'transaction',
                isPublic:true,
                filters:filters,
                
                columns:[
                    search.createColumn({name:'internalid'}),
                    search.createColumn({name:'tranid'}),
                    search.createColumn({name:'trandate'}),
                    search.createColumn({name:'entity'}),
                    search.createColumn({name:'subsidiary'}),
                    search.createColumn({name:'status'}),
                    // search.createColumn({name:'department'}),
                    // search.createColumn({name:'class'}),
                    search.createColumn({name:'total'})

                ]
            });
                
        let line = 0;
        soSearch.run().each(function(result){
            let internalid = result.getValue('internalid'|| '');
            let status = result.getValue('status'|| '');
            // let department = result.getText('department'|| '');
            // let classs = result.getText('class'|| '');
            let tranid = result.getValue('tranid'|| '');
            let trandate = result.getValue('trandate'|| '');
            let entity = result.getText('entity'|| '');
            let subsidiary = result.getText('subsidiary'|| '');
            let total = result.getValue('total'|| '');

            sublist.setSublistValue({
                id: 'custpage_tranid',
                line: line,
                value: tranid
            });
            sublist.setSublistValue({
                id: 'custpage_internalid',
                line: line,
                value: internalid
            });
            sublist.setSublistValue({
                id: 'custpage_status',
                line: line,
                value: status || ''
            });
            // sublist.setSublistValue({
            //     id: 'custpage_department',
            //     line: line,
            //     value: department || ''
            // });
            // sublist.setSublistValue({
            //     id: 'custpage_classs',
            //     line: line,
            //     value: classs || ''
            // });
            sublist.setSublistValue({
                id: 'custpage_trandate',
                line: line,
                value: trandate
            });
            sublist.setSublistValue({
                id: 'custpage_entity',
                line: line,
                value: entity
            });
            sublist.setSublistValue({
                id: 'custpage_subsidiary',
                line: line,
                value: subsidiary || ''
            });
            sublist.setSublistValue({
                id: 'custpage_total',
                line: line,
                value: total || ''
            });
            line++;
            return true
        });
            scriptContext.response.writePage({
            pageObject:regForm
        });
        }

        return {onRequest}

    });







