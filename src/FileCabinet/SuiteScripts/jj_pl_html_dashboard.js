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
            portlet.title = 'Dashboard Announcement';
            let html = 
            `<div style="
            background: linear-gradient(135deg,#1E3A8A,#3B82F6);
            color:white;
            padding:20px;
            border-radius:12px;
            font-family:Arial,sans-serif;
            text-align:center;
            ">
            <img src="https://td3114665.app.netsuite.com/core/media/media.nl?id=33&c=TD3114665&h=wXV0dezvxtx2moLtsIv_nZ0WzXFu6UImFrV4eK9zMpZa_0qN&fcts=20260928213749&whence="
                 style="height:60px;margin-bottom:10px;">

            <h2 id='greetings'></h2>
            <div id="datetime"></div>
                <div style="
                background:rgba(255,255,255,0.15);
                padding:12px;
                border-radius:8px;
                margin-top:10px;
            ">
            <em>
                "Success is the sum of small efforts repeated day in and day out."
                </em>
            </div>
            </div>
            <script>
            function updateBanner(){
                let date = new Date();
                let hour = date.getHours();
                let greetings = '';
                if(hour < 12){
                    greetings = "good morning";
                }
                else if(hour < 17){
                    greetings = "good afternoon";
                }
                else {
                    greetings = "good evening";
                    }
                document.getElementById('greetings').innerHTML = greetings;
                document.getElementById('datetime').innerHTML = date.toLocaleString();
            }
            updateBanner();
            setInterval(updateBanner,1000);
            </script>

        `;
        portlet.html = html;
        }

        return {render:render}

    });



   