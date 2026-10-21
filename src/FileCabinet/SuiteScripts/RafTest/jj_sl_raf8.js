/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget','N/http','N/search'],
    
    (serverWidget,http,search) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            let form = serverWidget.createForm({
                    title:'University List'
                });
                
                const searchField = form.addField({
                    id: 'custpage_country',
                    type: serverWidget.FieldType.SELECT,
                    
                    label: 'Country Name'
                });
                searchField.isMandatory = true;
                searchField.addSelectOption({ value: '', text: '' });
                searchField.addSelectOption({ value: 'India', text: 'India' });
                searchField.addSelectOption({ value: 'China', text: 'China' });
                searchField.addSelectOption({ value: 'Japan', text: 'Japan' });
                form.addSubmitButton({
                    label: 'Submit'
                });
                if(scriptContext.request.method === "POST"){
                    let params = scriptContext.request.parameters;
                    let countryName = params.custpage_country;
                    log.debug({
                        title:'success',
                        details:countryName
                    })
                    searchField.defaultValue = countryName;
                    let response = http.get({
                        url: 'http://universities.hipolabs.com/search?country=' + encodeURIComponent(countryName)
                    });
                    let data = JSON.parse(response.body);


                    let sublist = form.addSublist({
                    id: 'custpage_sublistid',
                    type: serverWidget.SublistType.LIST,
                    label: 'Results',
                    
                    });
                    sublist.addField({
                        id: 'custpage_country_name',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Country'
                    });
                    sublist.addField({
                        id: 'custpage_state',
                        type: serverWidget.FieldType.TEXT,
                        label: 'State/Province'
                    });
                    sublist.addField({
                        id: 'custpage_link',
                        type: serverWidget.FieldType.URL,
                        label: 'URL'
                    });
                    for(let i = 0;i < data.length;i++ ){
                        sublist.setSublistValue({
                            id:'custpage_country_name',
                            value:data[i].country || '',
                            line:i
                        });
                        sublist.setSublistValue({
                            id:'custpage_state',
                            value:data[i]['state-province'] || 'Not Provided',
                            line:i
                        });
                        sublist.setSublistValue({
                            id:'custpage_link',
                            value:data[i].web_pages[0] || '',
                            line:i
                        });
                    }
                }
                scriptContext.response.writePage(form);
        }

        return {onRequest}

    });