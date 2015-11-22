Ext.define('casco.view.tc.TcController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.tc',

	createTc : function() {
		var view = this.getView();
		var tc = Ext.create('casco.model.Tc',{id:view.tc.get('id')});//view.tc?view.tc:Ext.create('casco.model.Tc');
		
	
		var form = view.down('form');
		var data = form.getValues(); //提交的数据
		data.source = [];
		console.log(view.sources.getData());
		view.sources.each(function(s){
			data.source.push(s.get('tag'));
		});
    
    var column='';
    Ext.Object.each(data, function(key, value, myself){
            		  	
    if(key!='id'&&key!='tag'){column+='"'+key+'":"'+value+'",';}
            	
            		  	
   });
        data.column=column.substring(0,column.length-1);
		data.document_id = view.document_id;//还可以这样动态添加啊
		data.steps = [];
		var i = 1;
		view.steps.each(function(s){
			console.log(s.data);
			data.steps.push({ 
				"num": s.data.num,
				"actions": s.data.actions,
				"expected result":s.get('expected result')
			});
			i++;
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