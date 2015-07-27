Ext.define('casco.view.testing.Main', {
	extend: 'Ext.container.Viewport',
	xtype: 'testing',

	requires: ['Ext.plugin.Viewport', ],

	layout: {
		type: 'border'
	},
	defaults: {
		bodyPadding: 0,
	},
	initComponent: function() {
		var me = this;
		var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	                {label: 'untested',   value: 0},
	                {label: 'passed',   value: 1},
	                {label: 'failed',   value: 2},
            ]
        });
		me.items = [{
			region: 'north',
			xtype: 'top',
			project: me.project
		}, {
			region: 'center',
			items: [{
				xtype: 'testing.job',
				id: 'joblist',
				title: me.project.get('name') + ' Testjobs',
				height: 300,
				split: true,
				collapsible: true,
				editable: false,
				project: me.project
			}, {
				xtype: 'testing.result',
				id: 'result-main'
			}]

		}];
		this.callParent();
	}
});
