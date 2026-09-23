/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */


define (['N/search','N/log'],function(search,log){
    function execute(context){
        var invoice = search.create({type: "transaction",
            isPublic:true,
            filters: [
                
    ['type', 'is', 'CustInvc'],
    'AND',
    ['status','is','CustInvc:A']

            ],
            columns:[
                search.createColumn({name:'tranid'}),
                search.createColumn({name:'email'}),
                search.createColumn({name:'trandate'}),
                search.createColumn({name:'entity'}),
                search.createColumn({name:'total'})
            ]



        });

     
        invoice.title= 'invoice Search for script'
        invoice.id='customsearch_invoice_search_script'
    var searchId = invoice.save();
log.debug({
    title:"success",
    details:"search id : "+searchId
})
var s= search.load({
    id: 'customsearch_invoice_search_script' 
});

log.debug({
    title: 'Title',
    details: s.title+ "script id " +s.id+ " internal id :  "+ s.searchId
});
    }
    return {
         execute:execute};
})