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
 * Description : Create a customer record.
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
            log.debug('get trigger',JSON.stringify(requestBody));
            
            try{
                
                let customerData=record.create({
                    type:record.Type.CUSTOMER,
                    isDynamic:true
                });
                customerData.setValue({
                    fieldId:'companyname',
                    value:requestBody.customerid
                });
                customerData.setValue({
                    fieldId:'email',
                    value:requestBody.email
                });
                customerData.setValue({
                    fieldId:'subsidiary',
                    value:requestBody.subsidiary
                });


                let customerDataId=customerData.save();
                log.debug({
                    title:"success",
                    details:"customer id : " + customerDataId
                });
                return{
                    success:true,
                    customerDataId:customerDataId
                };



            }
            catch(e){
                return{
                    requestBody:requestBody,
                    success:false,
                    error:e.message
                }

            }

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