/**
* @NAPIVersion 2.0
* @NScriptType ScheduledScript
*/


define(['N/record','N/log'],function(record){
    function execute(context){
        var rec=record.create({type:"vendor",
            isDynamic:true
        });
         rec.setValue({
            fieldId: 'companyname',
            value:"New Vendor"
        });
      
        rec.setValue({
            fieldId:'email',
            value:'contacte@gmail.com'
        });
        rec.setValue({
            fieldId:'phone',
            value:'9987876567'
        });
        rec.setValue({
            fieldId:'subsidiary',
            value:14
        });

        var internal_id=rec.save();
        log.debug({
            title:"success",
            details:"vendor id :" +internal_id
        })


    }
        return {
         execute:execute};
})