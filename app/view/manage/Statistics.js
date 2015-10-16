<<<<<<< HEAD
Ext.define('casco.view.manage.Statistics', {
	extend: 'Ext.window.Window',

	xtype: 'widget.statistics',
	requires: [],
	resizable: true,
	maximizable: true,
	modal: true,
	title: 'Statistics',
	width: 600,
	initComponent: function() {
		var me = this;
		var project = me.project;
		var docs = Ext.create('casco.store.Documents');
		docs.load({
			params: {
				project_id: project.id
			}
		});
		me.items = [{
			xtype: 'grid',
			anchor: '100%',
			store: docs,
			title: project.name,
			columns: [{
				text: 'Document',
				dataIndex: 'name',
				flex: 1
			}, {
				text: 'Num items',
				dataIndex: 'count'
			}, {
				text: 'Num passed',
				dataIndex: 'num_passed'
			}, {
				text: 'Num failed',
				dataIndex: 'num_failed'
			}, {
				text: 'Num untested',
				dataIndex: 'num_untested'
			}],
			listeners: {
				celldblclick: function(a, b, c, record) {
					if(record.get('type') != 'rs') return;
					window.open('/stat/cover.htm#' + record.get('id'));
				}
			}
		}];
		me.callParent(arguments);
	},
	doHide: function() {
		this.hide();
	}
=======
Ext.define('casco.view.manage.Statistics', {
	extend: 'Ext.window.Window',

	xtype: 'widget.statistics',
	requires: [],
	resizable: true,
	maximizable: true,
	modal: true,
	title: 'Statistics',
	width: 600,
	initComponent: function() {
		var me = this;
		var project = me.project;
		var docs = Ext.create('casco.store.Documents');
		docs.load({
			params: {
				project_id: project.id
			}
		});
		me.items = [{
			xtype: 'grid',
			anchor: '100%',
			store: docs,
			title: project.name,
			columns: [{
				text: 'Document',
				dataIndex: 'name',
				flex: 1
			}, {
				text: 'Num items',
				dataIndex: 'count'
			}, {
				text: 'Num passed',
				dataIndex: 'num_passed'
			}, {
				text: 'Num failed',
				dataIndex: 'num_failed'
			}, {
				text: 'Num norun',
				dataIndex: 'num_norun'
			}],
			listeners: {
				celldblclick: function(a, b, c, record) {
					if(record.get('type') != 'rs') return;
					window.open('/stat/cover.htm#' + record.get('id'));
				}
			}
		}];
		me.callParent(arguments);
	},
	doHide: function() {
		this.hide();
	}
>>>>>>> 9f33e85b1f51e65073d256ba200429a4188d38aa
});