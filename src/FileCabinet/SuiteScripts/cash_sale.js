/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
*/


define(['N/record'],function(record){

function execute(context){
    var rec=record.load({
        type:'cashsale',
        id:135238
    });
    var doc_id=rec.getValue({
        fieldId:'tranid'

    });
    var name=rec.getText({
        fieldId:'entity'

    });   
    var total=rec.getValue({
        fieldId:'total'

    });      

    log.debug({
        title:"Cash Details",
        details:"Document Number : " + doc_id +"  " + "Company Name : " + name + "Total Amount : " + total
    })

}
        return{execute:execute}



    

})