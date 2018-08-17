Ext.define('casco.view.manage.VatCreate', {
	extend: 'Ext.window.Window',
	requires: ['casco.view.vat.VatController'],
	xtype: 'vat.vatcreate',
	modal: true,
	controller: 'manage',

	title: '创建/编辑定版',
	id: 'vat-view-create-window',
	layout: {
		type: 'border'
	},
	height: 500,
	width: 800,

	initComponent: function () {
		var me = this;
		me.rs_versions = [];
		var docs = Ext.create('casco.store.Documents');
		docs.load({
			params: { project_id: me.project.id },
		});
		docs.filter(new Ext.util.Filter({
			filterFn: function (item) {
				return item.getData().type != 'folder'; //过滤掉folder
			}
		}));
		var tcdocs = Ext.create('casco.store.Documents');
		tcdocs.load({
			params: {
				project_id: me.project.get('id'),
				type: 'tc'
			}
		});
		var rsdocs = Ext.create('casco.store.Documents');
		rsdocs.load({
			params: {
				project_id: me.project.get('id'),
				type: 'rs'
			}
		});

		me.items = [{
			xtype: 'form',
			region: 'west',
			split: true,
			reference: 'vat_view_create_form',
			bodyPadding: '10',
			width: 200,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			}, {
				xtype: 'textfield',
				fieldLabel: '名称',
				labelAlign: 'top',
				name: 'name',
				msgTarget: 'under',
				allowBlank: false,
				blankText: "请输入Vat名称"
			}, {
				xtype: 'textarea',
				fieldLabel: '描述',
				labelAlign: 'top',
				name: 'description',
				anchor: '100%',
				maxHeight: 50,
				grow: true,
			}]
		}, {
			xtype: 'grid',
			id: 'vat-view-tc',
			region: 'east',
			store: tcdocs,
			width: 300, //important to avoid layout run failed
			split: true,
			plugins: {
				ptype: 'cellediting',
				clicksToEdit: 1,
				listeners: {
					beforeedit: function (editor, e) {
						var combo = e.grid.columns[e.colIdx].getEditor(e.record);
						var st = Ext.create('casco.store.Versions', { data: e.record.get('versions') });
						console.log(st);
						combo.setStore(st);
					}
				}
			},
			columns: [{
				text: '测试文档',
				dataIndex: 'name',
				width: 150
			}, {
				text: '版本',
				dataIndex: 'version_id',
				width: 150,
				renderer: function (v, md, record) {
					var versions = record.get('versions');
					if (versions.length == 0) return;
					if (!v) {
						record.set('version_id', versions[0].id);
						return versions[0].name;
					}
					for (var i in versions) {
						if (v == versions[i].id) {
							return versions[i].name;
						}
					}
				},
				editor: {
					xtype: 'combobox',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					editable: false
				}
			}]

		}, {
			xtype: 'grid',
			id: 'vat-view-rs',
			region: 'center',
			store: rsdocs,
			width: 300,
			//			columnLines: true,
			plugins: {
				ptype: 'cellediting',
				clicksToEdit: 1,
				listeners: {
					beforeedit: function (editor, e) {
						console.log(e);
						var combo = e.grid.columns[e.colIdx].getEditor(e.record);
						var st = Ext.create('casco.store.Versions', { data: e.record.get('versions') });
						console.log(st);
						combo.setStore(st);
					}
				}
			},
			columns: [{
				text: '需求文档',
				dataIndex: 'name',
				width: 150
			}, {
				text: '版本',
				dataIndex: 'version_id',
				flex: 1,
				renderer: function (v, md, record) {
					//					console.log(record);
					var versions = record.get('versions');
					if (versions.length == 0) return;
					if (!v) {
						record.set('version_id', versions[0].id);
						return versions[0].name;
					}
					for (var i in versions) {
						if (v == versions[i].id) {
							return versions[i].name;
						}
					}
				},
				editor: {
					xtype: 'combobox',
					queryMode: 'local',
					displayField: 'name',
					valueField: 'id',
					editable: false
				}
			}]
		}];
		var evtName = me.status ? "saveVat" : "createVat";
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '保存',
				glyph: 0xf0c7,
				listeners: {
					click: evtName
				}
			}, {
					text: '取消',
					glyph: 0xf112,
					scope: me,
					handler: function () {
						Ext.getCmp('vat-view-create-window').destroy();
						me.destroy();
					}
				}]
		}];
		me.callParent();
	}
});