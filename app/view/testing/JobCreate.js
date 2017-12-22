Ext.define('casco.view.testing.JobCreate', {
	extend: 'Ext.window.Window',
	xtype: 'testing.jobcreate',
	modal: true,
	title: '创建Job',
	id: 'testing-job-create-window',
	controller: 'testing',
	layout: {
		type: 'border'
	},
	height: 700,
	width: 700,
	initComponent: function () {
		var me = this;
		me.rs_versions = [];
		var vat = Ext.create('casco.store.Vats');
		vat.load({
			params: {
				project_id: me.project.get('id'),
				type: 'tc',
			}
		});

		var vats = Ext.create('casco.store.Vats');
		var builds = Ext.create('casco.store.Builds');
		builds.load({
			params: {
				project_id: me.project.get('id')
			}
		});
		me.items = [{
			xtype: 'form',
			region: 'west',
			split: true,
			reference: 'job_create_form',
			bodyPadding: '10',
			width: 320,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			}, {
				xtype: 'hiddenfield',
				name: 'user_id',
				value: JSON.parse(localStorage.user).id
			}, {
				fieldLabel: '名称',
				msgTarget: 'under',
				allowBlank: false,
				blankText: "不能为空",
				name: 'name',
				xtype: 'textfield'
			}, {
				xtype: 'combobox',
				name: 'build_id',
				editable: false,
				fieldLabel: 'Build',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				allowBlank: false,
				blankText: "不能为空",
				store: builds
			}, {
				fieldLabel: 'Vat版本',
				name: 'vat_build_id',
				store: vat,
				id: 'vat_build_id',
				xtype: 'combobox',
				allowBlank: false,
				blankText: "不能为空",
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function (f, r, i) {
						Ext.getCmp('vat_tc').getStore().setData(r.get('tc_versions'));
						Ext.getCmp('testing-job-rs').getStore().setData(r.get('rs_versions'));
					}
				}
			},
			{
				fieldLabel: '测试用例版本',
				name: 'tc_version_id',
				store: Ext.create('Ext.data.Store'),
				id: 'vat_tc',
				xtype: 'combobox',
				allowBlank: false,
				blankText: "不能为空",
				editable: false,
				queryMode: 'local',
				displayField: 'document.name',
				valueField: 'id',
				displayTpl: new Ext.XTemplate('<tpl for=".">{document.name} - {name}</tpl>'),
				//				setValue(r.get('tc_version').document.name+':'+r.get('tc_version').name);
				listeners: {
					select: function (f, r, i) {
						Ext.getCmp('testing-job-tc-grid').getStore().load({
							params: {
								version_id: r.get('id'),
								act: 'stat'
							}
						});
					}
				}
			}]
		}, {
			xtype: 'grid',
			id: 'testing-job-rs',
			region: 'center',
			store: vats,
			columns: [{
				text: '需求文档',
				dataIndex: 'document',
				flex: 1,
				renderer: function (v) {
					return v.name;
				}
			}, {
				text: '版本',
				dataIndex: 'name',
				renderer: function (v, md, record) {
					return v
				},
			}]
		}, {
			xtype: 'grid',
			id: 'testing-job-tc-grid',
			region: 'south',
			height: 400,
			store: Ext.create('casco.store.Tcs'),
			selModel: {
				type: 'checkboxmodel',
				checkOnly: true
			},
			columns: [{
				text: '标签',
				dataIndex: 'tc',
				renderer: function (v) {
					return v.tag;
				}
			}, {
				text: '描述',
				dataIndex: 'tc',
				flex: 1,
				renderer: function (v) {
					return v.description;
				}
			}, {
				text: "测试方法",
				dataIndex: "tc",
				renderer: function (v) {
					return v.testmethods;
				}
			}]
		}];
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
					click: 'createJob'
				}
			}, {
					text: '取消',
					glyph: 0xf112,
					scope: me,
					handler: function () {
						Ext.getCmp('testing-job-rs').destroy();
						me.destroy();
					}
				}]
		}],

			me.callParent();
	}
});