/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */


define(['N/ui/serverWidget','N/log','N/search'],function(serverWidget,log,search){
    function beforeLoad(context){
        if(context.type !== context.UserEventType.CREATE){
    return;
}

        var form =context.form;
        var vendorsublist=form.addSublist({
            id:"custpage_vendor_sublist",
            type:serverWidget.SublistType.LIST,
            label:"existing vendors"

        });
        vendorsublist.addField({
            id:"custpage_vendor_name",
            type:serverWidget.FieldType.TEXT,
            label:"vendor name"
        });
        vendorsublist.addField({
            id:"custpage_vendor_subsidiary",
            type:serverWidget.FieldType.TEXT,
            label:"subsidiary name"
        });

        var vendorsearch=search.create({type:'vendor',
            isPublic:true,
            columns:
            [
                search.createColumn({name:'entityid'}),
                search.createColumn({name:'subsidiary'})
            ]
    });
    var line=0;
    var resultset=vendorsearch.run();
    resultset.each(function(result){
        var vname=result.getValue({name:'entityid'});
        var subsidiary=result.getText({name:'subsidiary'})
        vendorsublist.setSublistValue({
            id:'custpage_vendor_name',
            line:line,
            value:vname
        });
        vendorsublist.setSublistValue({
            id:'custpage_vendor_subsidiary',
            line:line,
            value:subsidiary
        });
        log.debug({
        title:'success',
        details:"vendor name : "+vname +" subsidiary : " + subsidiary
    });
    line++;
    return true;

    });
    

    }
        return {
         beforeLoad:beforeLoad};
});