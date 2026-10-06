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
                title:'Sales Order List'
            });

            let sublist = regForm.addSublist({
                id: 'custpage_sublistid',
                type: serverWidget.SublistType.LIST,
                label: 'Sales Order'
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
                id: 'custpage_total',
                type: serverWidget.FieldType.CURRENCY,
                label: 'Total Amount'
            });
            let soSearch= search.create({
            type:'transaction',
            isPublic:true,
            filters:[
                ['type','anyof','SalesOrd'],'AND',
                ['mainline','is','T']
            ],
            columns:[
                search.createColumn({name:'tranid'}),
                search.createColumn({name:'trandate'}),
                search.createColumn({name:'entity'}),
                search.createColumn({name:'subsidiary'}),
                search.createColumn({name:'total'})

            ]
        });
        let line = 0;
        soSearch.run().each(function(result){
            let tranid = result.getValue('tranid');
            let trandate = result.getValue('trandate');
            let entity = result.getText('entity');
            let subsidiary = result.getText('subsidiary');
            let total = result.getValue('total');

            sublist.setSublistValue({
                id: 'custpage_tranid',
                line: line,
                value: tranid
            });
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