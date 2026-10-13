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
            try{
                let form = serverWidget.createForm({
                    title:'Sales Order Form'
                });
                form.clientScriptModulePath = './jj_sl_assessment_cs.js';
                form.addField({
                    id: 'custpage_customer',
                    type: serverWidget.FieldType.SELECT,
                    source:'customer',
                    label: 'Customer'
                });
                form.addSubmitButton({
                    label: 'Submit Button'
                });
                let sublist = form.addSublist({
                    id:'custpage_sublistid',
                    type: serverWidget.SublistType.LIST,
                    label:'Sales Order Form'
                });

                sublist.addField({
                    id: 'custpage_tranid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sales OPrder Id'
                });
                sublist.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                });
                sublist.addField({
                    id: 'custpage_amount',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Sales Order Amount'
                });                
                
                


                let customer = scriptContext.request.parameters.custpage_customer;
                let filters = [
                    ['type','anyof','SalesOrd'],'AND',
                    ['amount','greaterthan',25],'AND',
                    ['mainline','is','T']
                ]
                if(customer){
                    filters.push('AND');
                    filters.push(['entity','anyof',customer]);
                }
                let soSearch= search.create({
                    type:'transaction',
                    isPublic:true,
                    filters:filters,
                    
                    columns:[
                        search.createColumn({name:'tranid'}),
                        search.createColumn({name:'entity'}),
                        search.createColumn({name:'total'}),
                    ]
                });
                let line = 0;
                soSearch.run().each(function(result){
                    let tranid = result.getValue('tranid');
                    let entity = result.getText('entity');
                    let amount = result.getValue('total');
                    log.debug({
                        title:'values',
                        details:tranid + " " + entity + " " + amount
                    });
                    sublist.setSublistValue({
                        id: 'custpage_tranid',
                        line: line,
                        value: tranid 
                    });
                    sublist.setSublistValue({
                        id: 'custpage_name',
                        line: line,
                        value: entity 
                    });
                    sublist.setSublistValue({
                        id: 'custpage_amount',
                        line: line,
                        value: amount 
                    });
                    line++
                    return true;
                });



                scriptContext.response.writePage({
                    pageObject:form
                });

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