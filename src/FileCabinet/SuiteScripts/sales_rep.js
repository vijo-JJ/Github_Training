/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */

define (['N/record','N/log'],function(record,log){
    function execute(context){
        var rec = record.load({type: "customer",
            isDynamic: true,
            id:7079

        });

        rec.selectLine({
            sublistId:'salesteam',
            line:0
        })
        rec.setCurrentSublistValue({
            sublistId:'salesteam',
            fieldId:'employee',
            value:1566
        })

        rec.commitLine({
            sublistId:'salesteam'
        });
        var name=rec.getSublistText({
            sublistId: 'salesteam',
            fieldId:'employee',
            line:0
        });       
        var internal_id=rec.save();
        log.debug({
            title:"success",
            details:"New Rep :" +name
        })


    }
    return {
         execute:execute};
})