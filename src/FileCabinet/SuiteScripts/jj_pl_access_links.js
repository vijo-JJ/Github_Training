/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define([],
    
    function () {
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
            portlet.title = "Finance Quick Access";
            portlet.addLine({
                text:'📊 Reports',
                align:0
            });
            portlet.addLine({
                text:'📊 Quarterly Revenue Report',
                url:'https://jobinandjismi2021-my.sharepoint.com/personal/ginumol_jose_jobinandjismi_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fginumol%5Fjose%5Fjobinandjismi%5Fcom%2FDocuments%2FINDUCTION%20TRAINING%2FTraining%20Materials%2FDEVELOPMENT%2FBatches%2FInternship%20%26%20Induction%20training%2FLMS%20Videos%2FSuiteScript%2FWeek%202%2FDay%205%2F2%2ECustom%20Portlet%20with%20N%5Fquery%20Demo%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E221f3879%2Dc32d%2D46d1%2D8233%2D516a9bae8f9d',
                align:1
            });
            portlet.addLine({
                text:'🧾 Outstanding Invoices',
                url:'#',
                align:1
            });
            portlet.addLine({
                text:'📈 Analytics',
                align:0
            });
            portlet.addLine({
                text:'📉 Revenue',
                url:'#',
                align:1
            });
            portlet.addLine({
                text:'💹 Analysis',
                url:'#',
                align:1
            });
            portlet.addLine({
                text:'📈 Revenue Dashboard',
                url:'#',
                align:1
            });
            portlet.addLine({
                text:'⚡ Quick Actions',
                align:0
            });
            portlet.addLine({
                text:'➕ Create Invoice',
                url:'#',
                align:1
            });
            portlet.addLine({
                text:'💰 Record customer payment',
                url:'#',
                align:1
            });
            
        }

        return {render}

    });




    // portlet.html = `
    //             <div style="
    //             font-family:Arial,sans-serif;
    //             padding:15px;
    //             ">
    //             <h3 style="color:#1E3A8A;">📊 Reports</h3>
    //             <p>
    //                 📈            
    //                 <a href="https://jobinandjismi2021-my.sharepoint.com/personal/ginumol_jose_jobinandjismi_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Fginumol%5Fjose%5Fjobinandjismi%5Fcom%2FDocuments%2FINDUCTION%20TRAINING%2FTraining%20Materials%2FDEVELOPMENT%2FBatches%2FInternship%20%26%20Induction%20training%2FLMS%20Videos%2FSuiteScript%2FWeek%202%2FDay%205%2F2%2ECustom%20Portlet%20with%20N%5Fquery%20Demo%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E221f3879%2Dc32d%2D46d1%2D8233%2D516a9bae8f9d" >Quarterly Revenue Report
    //             </a>
    //             </P>
    //             <p>
    //                 🧾                
    //                 <a href="#" >Outstanding Invoices
    //             </a>
    //             </P>
    //             <hr>
    //             <h3 style="color:#1E3A8A;">📈 Analytics</h3>
    //             <p>
    //                 📉            
    //                 <a href="#" >Revenue
    //             </a>
    //             </P>
    //             <p>
    //                 💹                
    //                 <a href="#" >Profit Analysis
    //             </a>
    //             </P>
    //             <hr>
                
    //             <h3 style="color:#1E3A8A;">⚡ Quick Actions</h3>
    //             <p>
    //                 ➕            
    //                 <a href="#" >Create Invoice
    //             </a>
    //             </P>
    //             <p>
    //                 💰                
    //                 <a href="#" >Record Customer Payment
    //             </a>
    //             </P>
    //             </div>

    //         `;
            





   