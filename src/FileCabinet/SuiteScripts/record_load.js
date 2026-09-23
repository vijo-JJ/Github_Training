/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 */

define (['N/record','N/log'],function(record,log){
    function execute(context){
        var rec = record.load({type: "customer",
         id:7079

        });

        var companyname=rec.getText({
            fieldId:'companyname'
        });
            var webaddress=rec.getText({
            fieldId:'url'
        });
            var category=rec.getText({
            fieldId:'category'
        });
            var email=rec.getText({
            fieldId:'email'
        });
            var phone=rec.getText({
            fieldId:'phone'
        });
            var address=rec.getText({
            fieldId:'defaultaddress'
        });
            var subsidiary=rec.getText({
            fieldId:'subsidiary'
        });
        

        log.debug({
            title:"customer",
            details:"company name " + companyname +" " +  "web address " + webaddress+ " " +   "category " + category +" " +    "email " + email +" " +   "phone " + phone +" " +   "address " + address +" " +   "subsidiary " + subsidiary 
        });



    }
    return {
         execute:execute};
})