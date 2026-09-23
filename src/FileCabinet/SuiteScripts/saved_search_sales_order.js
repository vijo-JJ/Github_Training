/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */


define(['N/search','N/log'],function(search,log){


    function execute(context){
        var so_search= search.create({
            type:'transaction',
            isPublic:true,
            filters:[
                ['type','anyof','SalesOrd'], 'AND', 
                ['status','anyof','SalesOrd:B']
            ],
            columns:[
                search.createColumn({name:'tranid'}),
                search.createColumn({name:'trandate'}),
                search.createColumn({name:'entity'}),
                search.createColumn({name:'subsidiary'}),
                search.createColumn({name:'total'})

            ]
         


        });
        so_search.id='customsearch_sales_order'
        so_search.title='cust sales order'
        
var_id=so_search.save();

        var so=search.load({
            type:'transaction',
            id:'customsearch_sales_order'

        })

        var resultset=so.run();
        resultset.each(function(result){
            var tranid=result.getValue({name:'tranid'});
            var trandate=result.getValue({name:'trandate'});
            var entityid=result.getValue({name:'entity'});
            var subsidiary=result.getText({name:'subsidiary'});
            var total=result.getValue({name:'total'});
            log.debug({
                title:"sales order",
                details:"document id : "+ tranid +" date : "+ trandate +" customer : "+ entityid +" subsidiary : "+subsidiary+ " amount : "+total
            })
            return true;
            
        })

        


    }
    return{execute:execute}
})
