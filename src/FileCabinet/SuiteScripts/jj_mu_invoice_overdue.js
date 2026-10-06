/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            let invRec = search.lookupFields({
                type: search.Type.INVOICE,
                id:params.id,
                columns: ['duedate']
            });
            let dueDate = new Date(invRec.duedate);
            let newDate = new Date(dueDate);
            newDate.setDate(newDate.getDate() + 7);
            record.submitFields({
                type: record.Type.INVOICE,
                id: params.id,
                values: {
                    duedate: newDate
                }
            });
        }

        return {each}

    });
