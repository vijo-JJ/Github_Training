/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */

/******************************************************************************
********
 * ABC Industries
 *
 * ${OTP-1111}: ${jj_pl_assessment_invoice.js}
 *
 *
 ******************************************************************************
********
 *
 * Author: Jobin and Jismi IT Services
 *
 * Date Created : 24-September-2026
 *
 * Description : Overdue Invoices Alert Portlet
 * REVISION HISTORY
 *
 * @version 2.1  ABC-5 : 24-September-2026 : Created the initial build by JJI0045
 *
 * 
 *
 *
 ******************************************************************************
*********/


define(['N/search'],
    /**
 * @param{search} search
 */
    function (search) {
        /**
         * Defines the Portlet script trigger point.
         * @param {Object} params - The params parameter is a JavaScript object. It is automatically passed to the script entry
         *     point by NetSuite. The values for params are read-only.
         * @param {Portlet} params.portlet - The portlet object used for rendering
         * @param {string} params.column - Column index forthe portlet on the dashboard; left column (1), center column (2) or
         *     right column (3)
         * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
         * @since 2015.2
         */
        const render = (params) => {
            const portlet = params.portlet;
            portlet.title = 'Overdue Invoices';
            portlet.addColumn({ 
            id: 'name', 
            type: 'text', 
            label: 'Customer Name',            
            });
            portlet.addColumn({ 
            id: 'inv_number', 
            type: 'text', 
            label: 'Invoice Number',            
            });
            portlet.addColumn({ 
            id: 'amt_remaining', 
            type: 'text', 
            label: 'Amount Remaining',            
            });
            portlet.addColumn({ 
            id: 'date_due', 
            type: 'text', 
            label: 'Date Overdue',            
            });
            let invoiceSearch = search.create({
                type:search.Type.INVOICE,
                filters:[
                    ['type', 'is', 'CustInvc'],'AND',
                    ['duedate','before','today'],'AND',
                    ['amountremaining','greaterthan','0']
                    
                ],
                columns:[
                    'entity',
                    'tranid',
                    'amountremaining',
                    search.createColumn({
                        name:'duedate',
                        sort:search.Sort.ASC
                    })
                ]
            });
            const today = new Date();
            invoiceSearch.run().each(function(result){
                let dueDate = new Date(result.getValue({name:'duedate'}))
                let daysOverdue = today - dueDate
                portlet.addRow({
                    row: {
                        name:result.getText({name:'entity'}),
                        inv_number:result.getValue({name:'tranid'}),
                        amt_remaining:result.getValue({name:'amountremaining'}),
                        date_due:daysOverdue
                                
                        }
                });
                return true
            })


        }

        return {render:render}

    });