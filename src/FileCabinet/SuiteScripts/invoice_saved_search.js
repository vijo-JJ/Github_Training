/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */


define(['N/search','N/log'],function(search,log){


    function execute(context){
        var inv_search= search.create({
            type:'transaction',
            isPublic:true,
            filters:[
                ['type','anyof','CustInvc'], 'AND', 
                ['amountremaining','greaterthan','0']
            ],
            columns:[
                search.createColumn({name:'tranid'}),
                search.createColumn({name:'entity'}),
                search.createColumn({name:'amountremaining'})

            ]
         


        });
        inv_search.id='customsearch_invoice_order'
        inv_search.title='cust invoice order'
        
var_id=inv_search.save();

        var so=search.load({
            type:'transaction',
            id:'customsearch_invoice_order'

        })

        var resultset=so.run();
        resultset.each(function(result){
            var tranid=result.getValue({name:'tranid'});
            var entityid=result.getValue({name:'entity'});
            var amountdue=result.getValue({name:'amountremaining'});

            log.debug({
                title:"invoice order",
                details:"document id : "+ tranid +" customer : "+ entityid +" amount due : "+ amountdue
            })
            return true;
            
        })

        


    }
    return{execute:execute}
})
