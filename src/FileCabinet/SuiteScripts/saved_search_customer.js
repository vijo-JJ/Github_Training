/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */


define (['N/search','N/log'],function(search,log){
    function execute(context){
        var customer = search.create({type: "customer",
            filters: [
                
    ['datecreated', 'within', 'lastmonth'],
    'AND',
    ['subsidiary','anyof',14]

                // search.createFilter({
                //     name:'datecreated',
                //     operator:'search.Operator.WITHIN',
                //     values:['last month']
                // }),
                // search.createFilter({
                //     name:'subsidiary',
                //     operator:'operator: search.Operator.ANYOF',
                //     values:[14]
                // })
            ],
            columns:[
                search.createColumn({name:'companyname'}),
                search.createColumn({name:'email'}),
                search.createColumn({name:'datecreated'}),
                search.createColumn({name:'subsidiary'}),
                search.createColumn({name:'salesrep'})
            ]



        });
        var result=customer.run().getRange({
            start:0,
            end:99
        });
        customer.title= 'customer Search for script'
        customer.id='customsearch_customer_search_script'
    var searchId = customer.save();
log.debug({
    title:"success",
    details:"search id : "+searchId
})
var s= search.load({
    id: 'customsearch_customer_search_script' 
});

log.debug({
    title: 'Title',
    details: s.title+ "script id " +s.id+ " internal id :  "+ s.searchId
});
    }
    return {
         execute:execute};
})