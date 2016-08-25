Ext.define('casco.view.testing.TestController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.testing',

	savemore: function(combo, record) {
		var form = this.getView().down('form');
		var record = form.getRecord();
		form.updateRecord(record);
	},
	deleteAll:function(){
	},
	createJob: function() {
		var form = this.lookupReference('job_create_form');
		var meta = form.getValues();
		var tcs = [];
		var sels = Ext.getCmp('testing-job-tc-grid').getSelection();
		//console.log(sels);
		for(var i in sels){
			tcs.push(sels[i].get('tc').id);
		}
		meta.tcs = tcs;
		var job = Ext.create('casco.model.Testjob', meta);
		job.save({
			success: function(){
				Ext.getCmp('joblist').store.reload();//insert(0, job);//添加入数据的方式
				Ext.getCmp('testing-job-create-window').destroy();
			}
		});
		
	},
});
