/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search','N/ui/dialog'],
/**
 * @param{record} record
 */
function(record,search,dialog) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        if(scriptContext.sublistId === 'item' && scriptContext.fieldId === 'item'){
            const itemid = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'item'
            });
            if(!itemid){
                return;
            }
            const itemData = search.lookupFields({
                type:search.Type.INVENTORY_ITEM,
                id:itemid,
                columns:['custitem1','custitem2','custitem3']
            });
            const length = parseFloat(itemData.custitem1) || 0;
            const breadth = parseFloat(itemData.custitem2) || 0;
            const height = parseFloat(itemData.custitem3) || 0;
            scriptContext.currentRecord.setCurrentSublistValue({
                sublistId:'item',
                fieldId:'custcol1',
                value: length * breadth * height
            });
            const rate = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'rate'
            });
            
            scriptContext.currentRecord.setCurrentSublistValue({
                sublistId:'item',
                fieldId:'amount',
                value: rate * length * breadth * height
            });


        }
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
function postSourcing(scriptContext) {
    if(scriptContext.sublistId === 'item' && scriptContext.fieldId === 'item'){
        const rate = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'rate'
            });
            const containerBox = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'custcol1'
            });
            scriptContext.currentRecord.setCurrentSublistValue({
                sublistId:'item',
                fieldId:'amount',
                value: rate * containerBox
            });


        }

    // if (
    //     scriptContext.sublistId === 'item' &&
    //     (scriptContext.fieldId === 'item' || scriptContext.fieldId === 'rate')
    // ) {

    //     const itemid = scriptContext.currentRecord.getCurrentSublistValue({
    //         sublistId: 'item',
    //         fieldId: 'item'
    //     });

    //     if (!itemid) {
    //         return;
    //     }

    //     const itemData = search.lookupFields({
    //         type: search.Type.ITEM,
    //         id: itemid,
    //         columns: ['custitem1', 'custitem2', 'custitem3']
    //     });

    //     const length = parseFloat(itemData.custitem1) || 0;
    //     const breadth = parseFloat(itemData.custitem2) || 0;
    //     const height = parseFloat(itemData.custitem3) || 0;

    //     const containerBox = length * breadth * height;

    //     const rate = parseFloat(
    //         scriptContext.currentRecord.getCurrentSublistValue({
    //             sublistId: 'item',
    //             fieldId: 'rate'
    //         })
    //     ) || 0;

    //     scriptContext.currentRecord.setCurrentSublistValue({
    //         sublistId: 'item',
    //         fieldId: 'custcol1',
    //         value: containerBox,
    //         ignoreFieldChange: true
    //     });

    //     scriptContext.currentRecord.setCurrentSublistValue({
    //         sublistId: 'item',
    //         fieldId: 'amount',
    //         value: rate * containerBox,
    //         ignoreFieldChange: true
    //     });
    // }
}

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
        if(scriptContext.sublistId === 'item'){
            const rate = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'rate'
            });
            const containerBox = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'custcol1'
            });
            const amount = scriptContext.currentRecord.getCurrentSublistValue({
                sublistId:'item',
                fieldId:'amount'
            });
            if (amount !== rate * containerBox ){
                dialog.alert({
                    title:'validation error',
                    message:'amount must be equal to rate * container'
                });
                return false;
            }
            

        }
        return true;
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        // pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});