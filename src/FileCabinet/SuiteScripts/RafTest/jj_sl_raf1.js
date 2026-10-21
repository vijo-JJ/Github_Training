/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget','N/https'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget,https) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            
                let form = serverWidget.createForm({
                    title:'Tv shows Form'
                });
                
                let searchField = form.addField({
                    id: 'custpage_showname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Show Name'
                });
                form.addSubmitButton({
                    label: 'search shows'
                });
                
            if (scriptContext.request.method === "POST"){
                
                let params = scriptContext.request.parameters;
                let showName = params.custpage_showname;
                searchField.defaultValue = showName;
                let response = https.get({
                    url: 'https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(showName)
                });
                let data = JSON.parse(response.body);
                form.addSubtab({
                    id:'custpage_resulttab',
                    label:'Results'
                });

                let sublist = form.addSublist({
                    id: 'custpage_sublistid',
                    type: serverWidget.SublistType.LIST,
                    label: 'Results',
                    tab:'custpage_resulttab'
                });
                sublist.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                sublist.addField({
                    id: 'custpage_type',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Type'
                });
                sublist.addField({
                    id: 'custpage_language',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Language'
                });
                sublist.addField({
                    id: 'custpage_url',
                    type: serverWidget.FieldType.TEXT,
                    label: 'URL'
                });
                for(let i=0;i<data.length;i++)
                    {
                        sublist.setSublistValue({
                            id:'custpage_name',
                            value:data[i].show.name || '',
                            line:i
                        });
                        sublist.setSublistValue({
                            id:'custpage_language',
                            value:data[i].show.language || '',
                            line:i
                        });
                        sublist.setSublistValue({
                            id:'custpage_type',
                            value:data[i].show.type || '',
                            line:i
                        });
                        sublist.setSublistValue({
                            id:'custpage_url',
                            value:data[i].show.url || '',
                            line:i
                        });
                    }
                
            }
            scriptContext.response.writePage(form);
            
        }

        return {onRequest}

    });