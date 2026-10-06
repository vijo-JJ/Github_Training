/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            let regForm = serverWidget.createForm({
                title:'Registration Form'
            });
            regForm.addField({
                id: 'custpage_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            }).isMandatory = true;
            regForm.addField({
                id: 'custpage_age',
                type: serverWidget.FieldType.INTEGER,
                label: 'Age'
            });
            regForm.addField({
                id: 'custpage_phone',
                type: serverWidget.FieldType.PHONE,
                label: 'Phone Number'
            });
            regForm.addField({
                id: 'custpage_email',
                type: serverWidget.FieldType.EMAIL,
                label: 'Email'
            });
            regForm.addField({
                id: 'custpage_father_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Fathers Name'
            });
            regForm.addField({
                id: 'custpage_address',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Address'
            });
            regForm.addSubmitButton({
                label: 'Submit Button'
            });
            scriptContext.response.writePage({
                pageObject:regForm
            });

        }

        return {onRequest}

    });