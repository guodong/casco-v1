Ext.define('casco.view.testing.TestController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.testing',

	savemore: function(combo, record) {
		var form = this.getView().down('form');
		var record = form.getRecord();
		form.updateRecord(record);
	},

	createJob: function() {
		var form = this.lookupReference('job_create_form');
		var meta = form.getValues();
		rsvsd = Ext.getCmp('testing-job-rs').getStore();
		var rsvss = [];
		rsvsd.each(function(v){
		//	console.log(v);
			var obj = {
				rs_document_id: v.get('id'),
				rs_version_id: v.get('version_id')
			}
			rsvss.push(obj);//放入的是一个对象啊
		});
		meta.rs_versions = rsvss;
		var tcs = [];
		var sels = Ext.getCmp('testing-job-tc-grid').getSelection();
		for(var i in sels){
		//	console.log(sels[i].get('tc').id);
			tcs.push(sels[i].get('tc').id);
		}
		meta.tcs = tcs;
		var job = Ext.create('casco.model.Testjob', meta);
		job.save({
			success: function(){
				Ext.getCmp('joblist').store.insert(0, job);//添加入数据的方式
				Ext.getCmp('testing-job-create-window').destroy();
			}
		});
		
	}

});
