/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */

/******************************************************************************
********
 * ABC Industries
 *
 * ${OTP-1111}: ${jj_pl_assessment_quick_link.js}
 *
 *
 ******************************************************************************
********
 *
 * Author: Jobin and Jismi IT Services
 *
 * Date Created : 24-September-2026
 *
 * Description : Procurement Team Quick-Links Portlet
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
            portlet.title = 'Procurement Team Quick-Links'
            portlet.addLine({ 
            text: '🧾 Orders', 
            
            align:0
            });
            portlet.addLine({ 
            text: '🧾 Open Purchase Orders', 
            url: 'https://td3114665.app.netsuite.com/suiteanswers/article/42425',
            
            align:1
            });
            portlet.addLine({ 
            text: '💹 Vendors', 
            
            align:0
            });
            portlet.addLine({ 
            text: '💹 Vendor Bills Pending Approval,', 
            url: '#',
            align:1
            });
            portlet.addLine({ 
            text: '⚡ Quick Actions', 
            
            align:0
            });
            portlet.addLine({ 
            text: '➕ Create Purchase Order', 
            url: '#',
            align:1
            });
        }

        return {render}

    });