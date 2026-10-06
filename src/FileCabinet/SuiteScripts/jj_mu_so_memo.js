/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            record.submitFields({
                type: 'salesorder',
                id: params.id,
                values: {
                    memo: "memo updated"
                }
            });
        }

        return {each}

    });



    // let salesOrderSearch= search.create({
    //             type:'transaction',
    //             isPublic:true,
    //             filters:[
    //                 ['type', 'is', 'SalesOrd'],'AND', 
    //                 ['trandate','within','lastmonth'],'AND',
    //                 ['mainline', 'is', 'T']
    //             ],
    //             columns:[
    //                 search.createColumn({name:'internalid'}),
                                
                    
    //             ]
                
    //         });