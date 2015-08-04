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
			var obj = {
				rs_document_id: v.get('id'),
				rs_version_id: v.get('version_id')
			}
			rsvss.push(obj);
		});
		meta.rs_versions = rsvss;
		var job = Ext.create('casco.model.Testjob', meta);
		job.save({
			success: function(){
				Ext.getCmp('joblist').store.insert(0, job);
				Ext.getCmp('testing-job-rs').destroy();
			}
		});
		
	}

});
