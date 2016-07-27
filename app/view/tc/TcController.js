Ext.define('casco.view.tc.TcController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.tc',

	createTc : function() {
		var view = this.getView();
		console.log(view.tc);
		var tc = Ext.create('casco.model.Tc',{id:view.tc?view.tc.get('id'):null});//view.tc?view.tc:Ext.create('casco.model.Tc');
		var form = view.down('form');
		var data = form.getValues(); //提交的数据
		data.source = "";
		view.sources.each(function(s){
			data.source+=(s.get('tag')+',');
		});
		data.source=data.source.substring(0,data.source.length-1);
		data.column={};
		Ext.Object.each(data, function(key, value, myself){
		if(key!='id'&&key!='tag'&&key!='column'){data.column[key]=value;}
	    });
		data.document_id = view.document_id;//还可以这样动态添加啊
		data.version_id=view.version_id;
		data.steps = [];
		var i = 1;
		view.steps.each(function(s){
			data.steps.push({ 
				"num": s.data.num,
				"actions": s.data.actions,
				"expected result":s.get('expected result')
			});
			i++;
		});
		//data.column=data.column.substring(0,data.column.length-1);
		//data.column+='"test steps:"'+JSON.stringify(data.steps)+'"';
		console.log(data.column);
		data.steps=JSON.stringify(data.steps);
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