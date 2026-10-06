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
            log.debug("entered");
            try{
                let libRec = search.lookupFields({
                type: 'customrecord12',
                id:params.id,
                columns: ['custrecord20']
            });

            
            let dueDate = new Date(libRec.custrecord20);
            let newDate = new Date(dueDate);

        
                newDate.setDate(newDate.getDate() + 7);
 
                record.submitFields({
                    type: 'customrecord12',
                    id: params.id,
                    values: {
                        custrecord20: newDate
                    }
                });
            
 
            
            
            } 
            catch(e){
                log.debug({
                    title:"failed",
                    details:e.message
                });
            }
        }

        return {each}

    });