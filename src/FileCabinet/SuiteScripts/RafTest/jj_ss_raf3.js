/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define([
    'N/search',
    'N/email'
], (
    search,
    email
) => {

    const execute = () => {

        search.create({
            type: 'customrecord_customer_email_tracking',
            columns: [
                'custrecord_customer_flag',
                'custrecord_email'
            ]
        }).run().each(function(result){

            let customerFlag = result.getValue({
                name: 'custrecord_customer_flag'
            });

            let customerEmail = result.getValue({
                name: 'custrecord_email'
            });

            if(customerEmail){

                if(customerFlag === true || customerFlag === 'T'){
                    
                    email.send({
                        author: -5,
                        recipients: customerEmail,
                        subject: 'Thank you for the support. Keep purchasing more items. Exciting discounts are waiting for you in the Christmas session.'
                    });

                }else{

                    email.send({
                        author: -5,
                        recipients: customerEmail,
                        subject: 'Exciting discounts are waiting for you in the Christmas session. We warmly welcome you.'
                    });

                }
            }

            return true;
        });

    };

    return {
        execute
    };

});