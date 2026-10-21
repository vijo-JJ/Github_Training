/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/email', 'N/render', 'N/search'],
    /**
 * @param{email} email
 * @param{render} render
 * @param{search} search
 */
    (email, render, search) => {
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
            const invoiceSearchObj = search.create({
                type: "invoice",
                settings:[{"name":"consolidationtype","value":"ACCTTYPE"},{"name":"includeperiodendtransactions","value":"F"}],
                filters:
                [
                    ["type","anyof","CustInvc"], 
                    "AND", 
                    ["amountremaining","greaterthan","0.00"], 
                    "AND", 
                    ["duedate","before","today"], 
                    "AND", 
                    ["mainline","is","T"], 
                    "AND", 
                    ["custbody_exclude_overdue_email","is","F"]
                ],
                columns:
                [
                    search.createColumn({name: "entity", label: "Name"}),
                    search.createColumn({name: "duedate", label: "Due Date/Receive By"}),
                    search.createColumn({name: "internalid", label: "Internal ID"}),
                    search.createColumn({name: "tranid", label: "Document Number"})
                ]
            });

            return invoiceSearchObj;
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
            log.debug({
                    title:'success',
                    details:'here in map'
                });
            let result = JSON.parse(mapContext.value);
            let customerName = result.values.entity.value;
            let duedate = result.values.duedate;
            let internalId = result.id;
            let tranId = result.values.tranid;

            mapContext.write({
                key:customerName,
                value:JSON.stringify({
                    duedate:duedate,
                    internalId:internalId,
                    tranId:tranId
                })
            });
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
            try{ 

            
            log.debug({
                    title:'success',
                    details:'here in reduce'
                });
            let pdfFilefor15 = []; 
            let pdfFilefor30 = [];
            reduceContext.values.forEach(element => {
                let data = JSON.parse(element);
                let duedate = data.duedate;
                let internalId = data.internalId;
                const today = new Date();

                const dueDateObj = new Date(duedate);

                const diffDays = Math.floor(
                    (today - dueDateObj) / (1000 * 60 * 60 * 24)
                );
                log.debug({
                    title:'date diffrence',
                    details:diffDays
                })
                log.debug({
                    title:'internal id 11',
                    details:reduceContext.key
                })
                
                if (diffDays === 15 ){
                    let pdfFile = render.transaction({
                        entityId: Number(internalId),
                        printMode: render.PrintMode.PDF
                    });
                    pdfFilefor15.push(pdfFile)

                }
                else if (diffDays === 30 ){
                    let pdfFile = render.transaction({
                        entityId: Number(internalId),
                        printMode: render.PrintMode.PDF
                    });
                    pdfFilefor30.push(pdfFile)

                }
                log.debug({
                    title:'internal id22',
                    details:reduceContext.key
                })
                
            });
            log.debug({
                    title:'success',
                    details:'hiiiii'
                });
            log.debug({
                    title:'success',
                    details:pdfFilefor15.length + " " + pdfFilefor30.length
                });
            if(pdfFilefor15.length > 0)
                email.send({
                        author: -5,
                        recipients: reduceContext.key,
                        subject: 'Freindly reminder ,the invoice has been overdue for 15 days',
                        body: 'Please review the attached invoice Order.',
                        attachments: pdfFilefor15
            });
            if(pdfFilefor30.length > 0)
                email.send({
                        author: -5,
                        recipients: reduceContext.key,
                        subject: 'Warning ,the invoice has been overdue for 30 days',
                        body: 'Please review the attached invoice Order.',
                        attachments: pdfFilefor30
            });
            }
            catch(e){
                log.debug({
                    title:'failed',
                    details:e.message
                });
            }

                

            
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