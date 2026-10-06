/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */

/******************************************************************************
********
 * ABC Industries
 *
 * ${OTP-1111}: ${jj_pl_assessment_emp_leave.js}
 *
 *
 ******************************************************************************
********
 *
 * Author: Jobin and Jismi IT Services
 *
 * Date Created : 24-September-2026
 *
 * Description : Employee Leave Request Form
 * REVISION HISTORY
 *
 * @version 2.1  ABC-5 : 24-September-2026 : Created the initial build by JJI0045
 *
 * 
 *
 *
 ******************************************************************************
*********/


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
            const portlet = params.portlet;
            portlet.title='Employee Leave Request Form'
            let html = 
            `<div style="
            background: linear-gradient(135deg,#1E3A8A,#3B82F6);
            color:white;
            padding:20px;
            border-radius:12px;
            font-family:Arial,sans-serif;
            text-align:center;
            ">
            <label><b>Leave Type</b></label><br>
            <input type = "text" id = "leave_type" style="width:95%;padding:5px;"><br>
            <label><b>From Date</b></label><br>
            <input type = "date" id = "from_date" style="width:95%;padding:5px;"><br>
            <label><b>To Date</b></label><br>
            <input type = "date" id = "to_date" style="width:95%;padding:5px;"><br>
            <label><b>Reason</b></label><br>
            <textarea id = "reason" style="width:95%;"></textarea><br><br>
            <button
            onclick="document.getElementById('message').innerHTML='leave submitted successfully!';"
            style="background-color:green;color:white;padding:12px 28px;border:none;border-radius:8px;">
            Submit
            </button>            
            <div id = "message" style="margin-top:10px;color:white;font-weight:bold;"></div>
            </div>
            
           `; 
           portlet.html = html
        }

        return {render}

    });