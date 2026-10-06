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
 * Description : Check whether a specific customer has overdue. If so, return the details. The details should include customer name, date, overdue balance. Otherwise return 'No overdue'.
 *
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
    (search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            log.debug('get trigger',JSON.stringify(requestParams));
            try{
                // let customerOverdue = search.lookupFields({
                // type:record.Type.CUSTOMER,
                // id:requestParams.customerid,
                // columns: ['overduebalance']
                // });
                
                    let customerData = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id:requestParams.customerid,
                    columns: ['entityid', 'overduebalance']
                    });
                    if(customerData.overduebalance > 0){

                        log.debug({
                            title:"success",
                            details:"customer : " + customerData.entityid + " ,overdue balance : " + customerData.overduebalance
                        });

                        return{
                            customer:customerData.entityid,
                            overdue_balance:customerData.overduebalance
                        }
                    }
                    else{
                        log.debug({
                            title:"success",
                            details:"customer have no overdue"
                        });
                        return "customer have no overdue"
                            
                        

                    }


            
            
            }
            catch(e){
                return {
                    name: e.name,
                    message: e.message
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