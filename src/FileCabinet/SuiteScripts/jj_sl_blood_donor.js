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
            let regForm = serverWidget.createForm({
                title:'Blood Donors'
            });

            regForm.addField({
                id: 'custpage_bld_grp',
                type: serverWidget.FieldType.SELECT,
                label: 'Blood Group',
                source: 'customlist7'
            });

            regForm.addSubmitButton({
                label: 'Search'
            });
            let sublist = regForm.addSublist({
                id: 'custpage_sublistid',
                type: serverWidget.SublistType.LIST,
                label: 'Blood Donor'
            });
            sublist.addField({
                id: 'custpage_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            });
            
            sublist.addField({
                id: 'custpage_phno',
                type: serverWidget.FieldType.TEXT,
                label: 'Phone Number'
            });
            
            let bloodGroup = scriptContext.request.parameters.custpage_bld_grp;
            let filters = [                
            ];
            if (bloodGroup) {
                    filters.push(['custrecord10','anyof',bloodGroup]);
                }
            let soSearch= search.create({
                type:'customrecord6',
                isPublic:true,
                filters:filters,
                
                columns:[
                    search.createColumn({name:'custrecord8'}),
                    search.createColumn({name:'custrecord9'}),
                    
                ]
            });
                
        let line = 0;
        soSearch.run().each(function(result){
            let name = result.getValue('custrecord8');
            let phoneNumber = result.getValue('custrecord9');
            


            sublist.setSublistValue({
                id: 'custpage_name',
                line: line,
                value: name
            });

            sublist.setSublistValue({
                id: 'custpage_phno',
                line: line,
                value: phoneNumber
            });

            line++;
            return true
        });
            scriptContext.response.writePage({
            pageObject:regForm
        });
        }

        return {onRequest}

    });



//     /**
//  * @NApiVersion 2.1 
//  * @NScriptType Suitelet
//  */
// define(['N/search', 'N/ui/serverWidget'],

//     (search, serverWidget) => {

//         const onRequest = (scriptContext) => {

//             let regForm = createForm();

//             let bloodGroup = scriptContext.request.parameters.custpage_bld_grp;

//             populateSublist(regForm, bloodGroup);

//             scriptContext.response.writePage({
//                 pageObject: regForm
//             });
//         };

//         function createForm() {

//             let regForm = serverWidget.createForm({
//                 title: 'Blood Donors'
//             });

//             regForm.addField({
//                 id: 'custpage_bld_grp',
//                 type: serverWidget.FieldType.SELECT,
//                 label: 'Blood Group',
//                 source: 'customlist7'
//             });

//             regForm.addSubmitButton({
//                 label: 'Search'
//             });

//             let sublist = regForm.addSublist({
//                 id: 'custpage_sublistid',
//                 type: serverWidget.SublistType.LIST,
//                 label: 'Blood Donor'
//             });

//             sublist.addField({
//                 id: 'custpage_name',
//                 type: serverWidget.FieldType.TEXT,
//                 label: 'Name'
//             });

//             sublist.addField({
//                 id: 'custpage_phno',
//                 type: serverWidget.FieldType.TEXT,
//                 label: 'Phone Number'
//             });

//             return regForm;
//         }

//         function getDonorSearch(bloodGroup) {

//             let filters = [];

//             if (bloodGroup) {
//                 filters.push([
//                     'custrecord10',
//                     'anyof',
//                     bloodGroup
//                 ]);
//             }

//             return search.create({
//                 type: 'customrecord6',
//                 isPublic: true,
//                 filters: filters,
//                 columns: [
//                     search.createColumn({ name: 'custrecord8' }),
//                     search.createColumn({ name: 'custrecord9' })
//                 ]
//             });
//         }

//         function populateSublist(regForm, bloodGroup) {

//             let donorSearch = getDonorSearch(bloodGroup);

//             let sublist = regForm.getSublist({
//                 id: 'custpage_sublistid'
//             });

//             let line = 0;

//             donorSearch.run().each(function(result) {

//                 let name = result.getValue('custrecord8') || '';
//                 let phoneNumber = result.getValue('custrecord9') || '';

//                 sublist.setSublistValue({
//                     id: 'custpage_name',
//                     line: line,
//                     value: name
//                 });

//                 sublist.setSublistValue({
//                     id: 'custpage_phno',
//                     line: line,
//                     value: phoneNumber
//                 });

//                 line++;
//                 return true;
//             });
//         }

//         return {
//             onRequest
//         };

//     });