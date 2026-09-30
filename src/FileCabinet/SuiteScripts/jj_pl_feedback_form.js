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
            let portlet = params.portlet
            portlet.title = "Sales Feedback Form";
            let html = 
            `<div style="
            background: linear-gradient(135deg,#1E3A8A,#3B82F6);
            color:white;
            padding:20px;
            border-radius:12px;
            font-family:Arial,sans-serif;
            text-align:center;
            ">
            <label><b>Client Name</b></label><br>
            <input type = "text" id = "clientName" style="width:95%;padding:5px;"><br>
            <label><b>Rating</b></label><br>
            <select id = "rating" style="width:95%;padding:5px;">
            <option value = "" disabled selected> Select Rating </option>
            <option value = "1"> 1 </option>
            <option value = "2"> 2 </option>
            <option value = "3"> 3 </option>
            <option value = "4"> 4 </option>
            <option value = "5"> 5 </option>
            </select><br>
            <label><b>Comment</b></label><br>
            <textarea id = "comment" style="width:95%;"></textarea><br><br>
            <button
            onclick="document.getElementById('message').innerHTML='Feedback submitted successfully!';"
            style="background-color:green;color:white;padding:12px 28px;border:none;border-radius:8px;">
            Submit
            </button>            
            <div id = "message" style="margin-top:10px;color:white;font-weight:bold;"></div>
            </div>
            <script>
            function submitFeedback(){
                document.getElementById('message').innerHTML = "Feedback submitted successfully!";
            }
            </script>


           `; 
           portlet.html = html
        }

            
        return {render:render}

    });


    //




// /**
//  * @NApiVersion 2.1
//  * @NScriptType Portlet
//  */
// define(['N/ui/serverWidget'],
    
//     function (serverWidget) {
//         /**
//          * Defines the Portlet script trigger point.
//          * @param {Object} params - The params parameter is a JavaScript object. It is automatically passed to the script entry
//          *     point by NetSuite. The values for params are read-only.
//          * @param {Portlet} params.portlet - The portlet object used for rendering
//          * @param {string} params.column - Column index forthe portlet on the dashboard; left column (1), center column (2) or
//          *     right column (3)
//          * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
//          * @since 2015.2
//          */
//         const render = (params) => {
//             let portlet = params.portlet
//             portlet.title = "Sales Feedback Form";
//             portlet.addField({
//                 id:'custpage_client_name',
//                 type:'text',
//                 label:'Client Name'
//             });
//             let ratingField = portlet.addField({
//                 id:'custpage_rating',
//                 type:'select',
//                 label:'Rating'
//             });
//             ratingField.addSelectOption({
//                 value:'',
//                 text:'select rating'
//             });
//             ratingField.addSelectOption({
//                 value:'1',
//                 text:'1'
//             });
//             ratingField.addSelectOption({
//                 value:'2',
//                 text:'2'
//             });
//             ratingField.addSelectOption({
//                 value:'3',
//                 text:'3'
//             });
//             ratingField.addSelectOption({
//                 value:'4',
//                 text:'4'
//             });
//             ratingField.addSelectOption({
//                 value:'5',
//                 text:'5'
//             });
//             portlet.addField({
//                 id:'custpage_comment',
//                 type:'textarea',
//                 label:'COMMENT'
//             });
//             <div>
//             <button
//             onclick="document.getElementById('message').innerHTML='Feedback submitted successfully!';"
//             style="background-color:green;color:white;padding:12px 28px;border:none;border-radius:8px;">
//             Submit
//             </button>            
//             <div id = "message" style="margin-top:10px;color:white;font-weight:bold;"></div>
//             </div>

//         };
        
        

            
//         return {render:render}

//     });

