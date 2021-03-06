
Ext.define('casco.view.manage.Statistics', {
	extend: 'Ext.window.Window',

	xtype: 'widget.statistics',
	requires: [],
	resizable: true,
	maximizable: true,
	modal: true,
	title: '统计',
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
				text: '文档',
				dataIndex: 'name',
				flex: 1
			}, {
				text: '总数',
				dataIndex: 'count'
			}, {
				text: '通过数量',
				dataIndex: 'num_passed'
			}, {
				text: '失败数量',
				dataIndex: 'num_failed'
			}, {
				text: '未运行数量',
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

});