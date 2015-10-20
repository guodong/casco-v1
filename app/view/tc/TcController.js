Ext.define('casco.view.tc.TcController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.tc',

	createTc : function() {
		var view = this.getView();
		var tc = view.tc;
		var form = view.down('form');
		var data = form.getValues(); //提交的数据
		data.document_id = view.document_id;
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
			callback: function() {
				form.up("window").destroy();
				var t = Ext.ComponentQuery.query("#tab-" + data.document_id)[0];
				t.store.reload();
			}
		});
	}
});