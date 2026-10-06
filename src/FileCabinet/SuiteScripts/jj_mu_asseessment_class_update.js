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
            log.debug("classNumber");
            try{
                let stdRec = search.lookupFields({
                type: 'customrecord8',
                id:params.id,
                columns: ['custrecord12']
            });

            let classNumber = parseInt(stdRec.custrecord12[0].value);
            // let classNumber = stdRec.custrecord12;
            log.debug(classNumber);
            if (parseInt(classNumber) < 10){
                classNumber++;
            }
            else if (parseInt(classNumber) === 10){
                classNumber = "11"
            }

            log.debug(classNumber);
            record.submitFields({
                type: 'customrecord8',
                id: params.id,
                values: {
                    custrecord12: classNumber
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