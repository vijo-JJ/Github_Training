/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */


/******************************************************************************
********
 * ABC Industries
 *
 * ${OTP-1111}: ${jj_rl_sales_order_get.js}
 *
 *
 ******************************************************************************
********
 *
 * Author: Jobin and Jismi IT Services
 *
 * Date Created : 24-September-2026
 *
 * Description : Return the details of a specified sales order. 
 * REVISION HISTORY
 *
 * @version 2.1  ABC-5 : 24-September-2026 : Created the initial build by JJI0045
 *
 * 
 *
 *
 ******************************************************************************
*********/


define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            log.debug("get triggre" + JSON.stringify(requestParams));
            try{
                let salesOrderData=record.load({
                    type:record.Type.SALES_ORDER,
                    id:requestParams.salesorderid
                });
                let transactionId = salesOrderData.getValue({fieldId:'tranid'});
                let customer = salesOrderData.getValue({fieldId:'entity'});
                let dateCreated = salesOrderData.getValue({fieldId:'trandate'});
                let memo = salesOrderData.getValue({fieldId:'memo'});
                let salesrep = salesOrderData.getValue({fieldId:'salesrep'});
                let subsidiary = salesOrderData.getValue({fieldId:'subsidiary'});
                let lineItemCount = salesOrderData.getLineCount({sublistId:'item'});
                let items = [];
                log.debug({
                    title:'success',
                    details:"transactionId : " + transactionId + ", customer : " + customer + " , dateCreated : "+ dateCreated + " , memo : " + memo + ", salesrep : " + salesrep + ", subsidiary : "+  subsidiary
                });
                for(let i = 0;i < lineItemCount;i++){


                    let item = salesOrderData.getSublistText({
                        sublistId:'item',
                        fieldId:'item',
                        line:i

                    });
                    let quantity = salesOrderData.getSublistValue({
                        sublistId:'item',
                        fieldId:'quantity',
                        line:i
                    });
                    let rate = salesOrderData.getSublistValue({
                        sublistId:'item',
                        fieldId:'rate',
                        line:i
                    });
                    let amount = salesOrderData.getSublistValue({
                        sublistId:'item',
                        fieldId:'rate',
                        line:i

                    });
                    items.push({
                        item:item,
                        quantity:quantity,
                        rate:rate,
                        amount:amount,
                        
                        


                    });
                    
                    log.debug({
                        title:"suceess",
                        details:"item : " + item + " ,quantity : " + quantity + " , rate : " + rate + " , amount : " + amount

                    });



                }
                let message=[]
                    if (lineItemCount > 1){
                        message.push("Sales order contains more than 2 items")
                    }
                    else{
                        message.push("")

                    }
                    log.debug({
                        title:"success",
                        details: message
                    })
                
                return{
                    transactionId:transactionId,
                    customer:customer,
                    dateCreated:dateCreated,
                    memo:memo,
                    salesrep:salesrep,
                    subsidiary:subsidiary,
                    items:items,
                    
                    
                };
                

            }
            catch(e){
                return{
                    name:e.name,
                    message:e.message
                };
            }

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });