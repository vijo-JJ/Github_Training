/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/search'],
    /**
 * @param{email} email
 * @param{search} search
 */
    (email, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            let itemSearch= search.create({
                type:'item',
                isPublic:true,
                filters:[
                    
                    
                ],
                columns:[
                    search.createColumn({name:'itemid'}),
                    search.createColumn({name:'reorderpoint'}),
                    search.createColumn({name:'quantityonhand'}),
                             
                ]
            });
    //         itemSearch.title= 'item Search for script1'
    //     itemSearch.id='customsearch_item_search_script1'
    // var searchId = itemSearch.save();

            let body = '';
            itemSearch.run().each(function(result){
                let itemName = result.getValue('itemid');
                let reorderPoint = result.getValue('reorderpoint');
                let onHand = result.getValue('quantityonhand');
                if(Number(reorderPoint) > Number(onHand)){
                    body = body + ' Item Name : ' + itemName + '\n' ;
                    body = body + ' Reorder Point : ' + reorderPoint + '\n' ;
                    body = body + ' OnHand : ' + onHand + '\n' ;
                    
                }
                return true;
                
            });
            log.debug({
                title:'success',
                details:"body" + body
            })
            email.send({
                author: -5,
                recipients:-5,
                subject:'items with onhand lower than reorder point',
                body:"body" + body                   
            });
        }

        return {execute:execute}

    });