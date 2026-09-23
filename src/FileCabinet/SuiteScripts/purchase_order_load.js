/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
*/


define(['N/record'],function(record){

function execute(context){
    var rec=record.load({
        type:'purchaseorder',
        id:138320
    });

    var numLines = rec.getLineCount({ sublistId: 'item' }); 
    // log.debug({
    //     title:"success",
    //     details:"numline  "+ numLines
    // })

    // var item=rec.getSublistText({
    //     sublistId:'item',
    //     fieldId:'item',
    //     line:0
    // });
    // var quantity=rec.getSublistText({
    //     sublistId:'item',
    //     fieldId:'quantity',
    //     line:0
    // });
    // var rate=rec.getSublistText({
    //     sublistId:'item',
    //     fieldId:'rate',
    //     line:0
    // });
    // log.debug({
    //     title:"purchase order items",
    //     details:"item : " + item +"  " + "quantity : " + quantity +"  "+ "rate : " + rate
    // });


    for (var i = 0; i < numLines; i++) {
        var item=rec.getSublistText({
            sublistId:'item',
            fieldId:'item',
            line:i
        });

        var quantity=rec.getSublistValue({
            sublistId:'item',
            fieldId:'quantity',
            line:i
        });
        var rate=rec.getSublistText({
            sublistId:'item',
            fieldId:'rate',
            line:i
        });   
        log.debug({
            title:"purchase order items",
            details:"item : " + item +"  " + "quantity : " + quantity +"  "+ "rate : " + rate
    });
    }  
      

}
        return{execute:execute}



    

})