/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
 */
    (record,search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            log.debug({
                    title:"success",
                    details:"inside"
                });
            try{
                let stockUpdate = search.lookupFields({
                type: 'customrecord11',
                id:params.id,
                columns: ['custrecord17']
            });
            let status = '';
            let quantity = stockUpdate.custrecord17;
            log.debug(quantity);
            if (quantity > 10){
                status = "in stock"
            }

            else{
                status = "low stock"
            }
            log.debug(status);
            record.submitFields({
                type: 'customrecord11',
                id: params.id,
                values: {
                    custrecord16: status
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