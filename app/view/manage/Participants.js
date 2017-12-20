Ext.define('casco.view.manage.Participants', {
	extend: 'Ext.window.Window',

	alias: 'widget.participants',
	requires: ['Ext.grid.plugin.CellEditing'],
	resizable: true,
	maximizable: true,
	modal: true,
	title: 'Edit Participants',
	width: 600,
	height: 550,
	autoScroll: true,
	layout: {
		type: 'border'
	},
	initComponent: function () {
		var me = this;
		var users = Ext.create('casco.store.Users');
		users.load();
		me.addSources = function (record) {
			me.participants.loadData([{
				realname: record.data.realname,
				id: record.data.id
				//role: 'member'
			}], true);
		};
		me.items = [{
			xtype: 'grid',
			region: 'west',
			store: users,
			width: 300,
			split: true,
			collapsible: true,
			autoScroll: true,
			title: '有效用户',
			columns: [
				{ text: '用户名', dataIndex: 'account' },
				{ text: '姓名', dataIndex: 'realname', flex: 1 },
				//{ text: 'jobnumber',  dataIndex: 'jobnumber'}
			],
			listeners: {
				itemclick: function (view, record, item, index, e, eOpts) {
					me.addSources(record);
				},
				itemdblclick: function (view, record, item, index, e, eOpts) {
					Ext.getCmp('selectedusers').store.remove(record);
				}
			}
		}, {
			xtype: 'grid',
			region: 'center',
			//itemId: 'sources',
			title: 'Selected Users',
			id: 'selectedusers',
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })],
			columns: [
				{ text: '姓名', dataIndex: 'realname', flex: 1 },
				{
					//xtype: 'gridcolumn',
					// renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
					// 	console.log(value)
					// },
					text: '角色',
					dataIndex: 'role',
					editor: {
						xtype: 'combo',
						//triggerAction:'all',
						displayField: 'text',
						valueField: 'value',
						store: Ext.create('Ext.data.Store', {
							fields: ['text', 'value'],
							data: [{
								"text": "负责人",
								"value": "leader"
							}, {
								"text": "成员",
								"value": "member"
							}]
						}),
						listeners: {
							change: function (filed, newValue, oldValue, op) {
								console.log(arguments)
							}
						}
					}
				}
			],
			store: me.participants,
			listeners: {
				itemdblclick: function (dv, record, item, index, e) {
					//这里面要显示出那个用户所属于的项目吧
					//me.participants.remove(record);
					var win = Ext.create('casco.view.manage.UserDocuments', { user: record, project: me.project });
					win.show();
				}
			}
		}];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '确定',
				glyph: 0xf112,
				scope: me,
				handler: this.destroy
			}]
		}];

		me.callParent(arguments);
		//this.getSelectionModel().on('selectionchange', function(){}, this);
	}
});