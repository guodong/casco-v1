Ext.define('casco.view.tc.TcController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.tc',

	createTc : function() {
		var view = this.getView();
		var tc = Ext.create('casco.model.Tc',{id:view.tc.get('id')});//view.tc?view.tc:Ext.create('casco.model.Tc');
		
	
		var form = view.down('form');
		var data = form.getValues(); //提交的数据
		console.log(data);
    
    var column='';
    Ext.Object.each(data, function(key, value, myself){
            		  	
    if(key!='id'&&key!='tag'){column+='"'+key+'":"'+value+'",';}
            	
            		  	
   });
    data.column=column.substring(0,column.length-1);
		data.document_id = view.document_id;//还可以这样动态添加啊
		data.steps = [];
		var i = 1;
		view.steps.each(function(s){
			data.steps.push({ 
				num: i,
				actions: s.data.actions,
				expected_result: s.data.expected_result
			});
			i++;
		});
		data.sources = [];
		view.sources.each(function(s){
			data.sources.push(s.getData());
		});
		//var tc = Ext.create('casco.model.Tc');console.log(tc.get('tag'))
		tc.set(data);
		tc.save({
			
			callback: function(record, operation, success) {
				form.up("window").destroy();
				var t = Ext.ComponentQuery.query("#tab-" + data.document_id)[0];
				t.store.reload();
			}
		});
	}
});