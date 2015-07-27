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
		var job = Ext.create('casco.model.Testjob', form.getValues());
		job.save({
			success: function(){
				Ext.getCmp('joblist').store.insert(0, job);
			}
		});
		
	}

});
