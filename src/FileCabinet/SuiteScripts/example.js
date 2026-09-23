/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/ui/serverWidget','N/log','N/search'],function(serverWidget,log,search){
    function beforeLoad(context){
        if(context.type!=context.UserEventType.CREATE){
            return;
        }
        var form=context.form;
        var customerlist=form.addSublist({
            id:'custpage_customerlist',
            type:serverWidget.SublistType.LIST,
            label:'customer list'
        });
        customerlist.addField({
            id:'custpage_customer_name',
            type:serverWidget.FieldType.TEXT,
            label:'customer name'
        });
        customerlist.addField({
            id:'custpage_subsidiary',
            type:serverWidget.FieldType.TEXT,
            label:'subsidiary'
        });

        var custsearch=search.create({
            type:"customer",
            columns:[
                search.createColumn({name:'entityid'}),
                search.createColumn({name:'subsidiary'})
            ]
            

        });
        line=0
        var resultset=custsearch.run();
        resultset.each(function(result){
            var cname=result.getValue({name:'entityid'});
            var csubsidiary=result.getValue({name:'subsidiary'})
            customerlist.setSublistValue({
                id:'custpage_customer_name',
                line:line,
                value:cname
            });
            customerlist.setSublistValue({
                id:'custpage_subsidiary',
                line:line,
                value:csubsidiary
            })
            log.debug({
                title:"customer list",
                details:'Name : '+ cname +' subsidiary : '+ csubsidiary
            });
            line++;
            return true;
        })


    }
    return{beforeLoad:beforeLoad}
})