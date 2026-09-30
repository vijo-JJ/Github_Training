/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/search'],
    
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
            let portlet = params.portlet;
            portlet.title = "Upcoming Birthdays";
            portlet.addColumn({
                id: 'name',
                type: 'text',
                label: 'Employee Name'
            });
            portlet.addColumn({
                id: 'department',
                type: 'text',
                label: 'Department'
            });
            portlet.addColumn({
                id: 'birthday_date',
                type: 'text',
                label: 'Birthday Date'
            });
            let employeeSearch = search.create({
                type:search.Type.EMPLOYEE,
                filters:[
                    ['isinactive','is','F']
                    
                ],
                columns:[
                    'entityid',
                    'department',
                    'birthdate'
                ]
            });
            
            let resultset = employeeSearch.run();
            resultset.each(function(result){
                let birthDate = result.getValue('birthdate');
                if(birthDate){
                    let month = new Date(birthDate).getMonth();
                    if(month === new Date().getMonth()){
                        portlet.addRow({
                            row: {
                                name:result.getValue('entityid'),
                                department:result.getText('department'),
                                birthday_date:birthDate  
                                }
                        });
                    }
                }
                
        

                return true
            })


        }

        return {render:render}

    });



   