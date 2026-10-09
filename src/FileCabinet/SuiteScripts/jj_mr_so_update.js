// /**
//  * @NApiVersion 2.1
//  * @NScriptType MapReduceScript
//  */
// define(['N/email', 'N/search',"N/record"],
//     /**
//  * @param{email} email
//  * @param{search} search
//  */
//     (email, search,record) => {
//         /**
//          * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
//          * @param {Object} inputContext
//          * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
//          *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
//          * @param {Object} inputContext.ObjectRef - Object that references the input data
//          * @typedef {Object} ObjectRef
//          * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
//          * @property {string} ObjectRef.type - Type of the record instance that contains the input data
//          * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
//          * @since 2015.2
//          */

//         const getInputData = (inputContext) => {
//             let soSearch= search.create({
//                     type:'transaction',
//                     isPublic:true,
//                     filters:[
//                         ['type','anyof','SalesOrd'],'AND',
//                         ['trandate','within','thismonth'],'AND',
//                         ['status','is','SalesOrd:A'],'AND',
//                         ['mainline','is','T']
//                     ],
                    
//                     columns:[                        
//                         search.createColumn({name:'salesrep'}),
//                         search.createColumn({name:'internalid'})
//                     ]
//             });
//             return soSearch;
//         }

//         /**
//          * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
//          * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
//          * context.
//          * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
//          *     is provided automatically based on the results of the getInputData stage.
//          * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
//          *     function on the current key-value pair
//          * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
//          *     pair
//          * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
//          *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
//          * @param {string} mapContext.key - Key to be processed during the map stage
//          * @param {string} mapContext.value - Value to be processed during the map stage
//          * @since 2015.2
//          */

//         const map = (mapContext) => {
//             let result = JSON.parse(mapContext.value);
//             let salesRepId = result.values.salesrep.value || 'ADMIN';
//             let soNumber = result.values.internalid.value;
//             mapContext.write({
//                 key: salesRepId,
//                 value: JSON.stringify({
//                     soNumber: soNumber
//                 })
//             });
//         }

//         /**
//          * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
//          * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
//          * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
//          *     provided automatically based on the results of the map stage.
//          * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
//          *     reduce function on the current group
//          * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
//          * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
//          *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
//          * @param {string} reduceContext.key - Key to be processed during the reduce stage
//          * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
//          *     for processing
//          * @since 2015.2
//          */
//         const reduce = (reduceContext) => {
//             reduceContext.values.forEach(function(value) {

//                 let data = JSON.parse(value);
//                 let internalId = data.soNumber;
//                 log.debug({
//                 title:'success',details:internalId})
            
//             log.debug({
//                 title:"success",
//                 details:reduceContext.key
//             }) 
//                 record.submitFields({
//                     type: record.Type.SALES_ORDER,
//                     id: internalId,
//                     values: {
//                         orderstatus: 'B'
//                     }
//                 });
//             });
            

//             if (reduceContext.key === 'ADMIN') {
//                 try{
//                     email.send({
//                     author: -5,
//                     recipients: -5, // 
//                     subject: 'Sales Orders Updated to Pending Fulfillment',
//                     body: 'The Sales Orders created this month that were in Pending Approval status have been updated to Pending Fulfillment.'
//                 });
//                 }
//                 catch(e){
//                     log.debug({
//                         title:'success',
//                         details:e.message
//                     })
//                 }
                

//             } else {
//                 try{
//                 email.send({
//                     author: -5,
//                     recipients: reduceContext.key, // sales rep internal id
//                     subject: 'Sales Orders Updated to Pending Fulfillment',
//                     body: 'The Sales Orders created this month that were in Pending Approval status have been updated to Pending Fulfillment.'
//                 });
//                 }
//                 catch(e){
//                     log.debug({
//                         title:'success',
//                         details:e.message
//                     })
//                 }

//             }
//         }

//         /**
//          * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
//          * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
//          * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
//          * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
//          *     script
//          * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
//          * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
//          *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
//          * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
//          * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
//          * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
//          *     script
//          * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
//          * @param {Object} summaryContext.inputSummary - Statistics about the input stage
//          * @param {Object} summaryContext.mapSummary - Statistics about the map stage
//          * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
//          * @since 2015.2
//          */
//         const summarize = (summaryContext) => {

//         }

//         return {getInputData, map, reduce, summarize}

//     });



/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/email', 'N/search',"N/record"],
    /**
 * @param{email} email
 * @param{search} search
 */
    (email, search,record) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            let soSearch= search.create({
                    type:'transaction',
                    isPublic:true,
                    filters:[
                        ['type','anyof','SalesOrd'],'AND',
                        ['trandate','within','thismonth'],'AND',
                        ['status','is','SalesOrd:A'],'AND',
                        ['mainline','is','T']
                    ],
                    
                    columns:[                        
                        search.createColumn({name:'salesrep'}),
                        search.createColumn({name:'internalid'})
                    ]
            });
            return soSearch;
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            function getData(){
                let result = JSON.parse(mapContext.value);
                let salesRepId = result.values.salesrep.value || 'ADMIN';
                let soNumber = result.values.internalid.value;
                return {
                    salesRepId,soNumber
                }
            }
            function writeData(data){
                mapContext.write({
                    key: data.salesRepId,
                    value: JSON.stringify({
                        soNumber: data.soNumber
                    })
                });
            }
            let data = getData();
            writeData(data);
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            function updateStatus(){
                reduceContext.values.forEach(function(value) {

                    let data = JSON.parse(value);
                    let internalId = data.soNumber;
                    record.submitFields({
                        type: record.Type.SALES_ORDER,
                        id: internalId,
                        values: {
                            orderstatus: 'B'
                        }
                    });
                });
            }
            function sendEmail(){
                if (reduceContext.key === 'ADMIN') {
                    try{
                        email.send({
                        author: -5,
                        recipients: -5, // 
                        subject: 'Sales Orders Updated to Pending Fulfillment',
                        body: 'The Sales Orders created this month that were in Pending Approval status have been updated to Pending Fulfillment.'
                    });
                    }
                    catch(e){
                        log.debug({
                            title:'success',
                            details:e.message
                        })
                    }
                    

                } else {
                    try{
                    email.send({
                        author: -5,
                        recipients: reduceContext.key, // sales rep internal id
                        subject: 'Sales Orders Updated to Pending Fulfillment',
                        body: 'The Sales Orders created this month that were in Pending Approval status have been updated to Pending Fulfillment.'
                    });
                    }
                    catch(e){
                        log.debug({
                            title:'success',
                            details:e.message
                        })
                    }

                }
            }
            updateStatus();
            sendEmail();
        }

        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }

        return {getInputData, map, reduce, summarize}

    });



    // let salesRepId = result.values.salesrep
    // ? result.values.salesrep.value
    // : 'ADMIN';