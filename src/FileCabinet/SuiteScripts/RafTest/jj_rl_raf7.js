/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/error', 'N/record', 'N/search', 'N/task'],
    /**
 * @param{error} error
 * @param{record} record
 * @param{search} search
 * @param{task} task
 */
    (error, record, search, task) => {
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
            try{

                if (!requestBody){
                    throw error.create({
                        name:'EMPTY_BODY',
                        message:'Request body is empty'
                    });
                }

                if (!requestBody.folderName){
                    throw error.create({
                        name:'FOLDER_REQUIRED',
                        message:'Folder Name is required'
                    });
                }

                if (!requestBody.emailAddress){
                    throw error.create({
                        name:'EMAIL_REQUIRED',
                        message:'Email Address is required'
                    });
                }

                if (!requestBody.startDate){
                    throw error.create({
                        name:'DATE_REQUIRED',
                        message:'Start Date is required'
                    });
                }

                let folderSearch = search.create({
                    type: search.Type.FOLDER,
                    filters:[
                        ['name','is',requestBody.folderName]
                    ],
                    columns:[
                        'internalid'
                    ]
                });

                let existingFolder =
                folderSearch.run().getRange({
                    start:0,
                    end:1
                });

                if (existingFolder.length > 0){

                    return {
                        success:false,
                        message:'Folder name already exists'
                    };

                }

                let folderObj = record.create({
                    type:record.Type.FOLDER
                });

                folderObj.setValue({
                    fieldId:'name',
                    value:requestBody.folderName
                });

                let folderId = folderObj.save();
                
                let mrTask = task.create({
                    taskType:task.TaskType.MAP_REDUCE,
                    scriptId:'customscript_jj_rl_raf7',
                    deploymentId:'customdeploy_jj_rl',
                    params:{
                        custscript_folder_id:folderId,
                        custscript_email:requestBody.emailAddress,
                        custscript_start_date:requestBody.startDate
                    }
                });

                let taskId = mrTask.submit();

                return {
                    success:true,
                    folderId:folderId,
                    taskId:taskId,
                    message:'Statement generation started'
                };

            }
            catch(ex){

                return {
                    success:false,
                    message:ex.message
                };

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




 