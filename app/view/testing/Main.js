Ext.define('casco.view.testing.Main', {
	extend: 'Ext.container.Viewport',
	xtype: 'testing',
	requires: ['Ext.plugin.Viewport', 'casco.model.Result'],
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
			data: [{
				label: 'untested',
				value: 0
			}, {
				label: 'passed',
				value: 1
			}, {
				label: 'failed',
				value: 2
			}, ]
		});
		me.items = [{
			region: 'north',
			xtype: 'top',
			project: me.project
		}, {
			region: 'center',
			height: 'auto',
			xtype: 'testing.job',
			id: 'joblist',
			title: me.project.get('name') + ' Testjobs',
			collapsible: true,
			project: me.project
		}, {
			region: 'south',
			flex: 1,
			layout: 'border',
			items: [{
				xtype: 'testing.result',
				id: 'result-main',
				title: '测试结果',
				width: '60%',
				region: 'center',
				project:me.project,
				scrollable: true,
			}, {
				xtype: 'testing.step',
				id: 'testing-step-panel',
				title: '步骤信息',
				width: '40%',
				region: 'east',
				split: true,
			}]

		}];
		this.callParent();
	}
});
