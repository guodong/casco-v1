Ext.define('casco.view.testing.JobCreate', {
	extend: 'Ext.window.Window',
	xtype: 'testing.jobcreate',

	modal: true,
	title: 'Create Job',
	id: 'testing-job-create-window',
	controller: 'testing',
	layout: {
		type: 'border'
	},
	height: 700,
	width: 700,
	initComponent: function() {
		var me = this;
		me.rs_versions = [];
		var vat = Ext.create('casco.store.Vats');
		vat.load({
			params: {
				project_id: me.project.get('id'),
				type: 'tc'
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
			width: 300,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			},{
				xtype: 'hiddenfield',
				name: 'user_id',
				value: JSON.parse(localStorage.user).id
			},{
				fieldLabel: 'Name',
				msgTarget: 'under',
				allowBlank:false, 
				blankText:"不能为空",
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
				store: builds
			},{
				fieldLabel: 'Vat Version',
				name: 'vat_build_id',
				store: vat,
				id: 'vat_build_id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function(f, r, i){
						Ext.getCmp('testing-job-tc-grid').getStore().load({
							params: {
								version_id: r.get('tc_version_id'),
								act:'stat'
							}
						});
						Ext.getCmp('vat_tc').setValue(r.get('tc_version').document.name+':'+r.get('tc_version').name);
						Ext.getCmp('testing-job-rs').getStore().setData(r.get('rs_versions'));

						//console.log(Ext.getCmp('testing-job-rs').getStore().getData());

					}
				}
			},
			{	
				fieldLabel: 'Tc Version',
				name: 'tc_version_name',
				msgTarget: 'under',
				id:'vat_tc',
				xtype: 'textfield',
				editable: false
			}]
		},  {
			xtype: 'grid',
			id: 'testing-job-rs',
			region: 'center',
			store: vats,
		    columns: [{
				text: 'Rs doc',
				dataIndex: 'document',
				flex: 1,
				renderer: function(v) {
				return v.name;
				}
			}, {
				text: 'Version',
				dataIndex: 'name',
				renderer: function(v, md, record){
				return v
				},
			}]
		},{
			xtype: 'grid',
			id: 'testing-job-tc-grid',
			region: 'south',
			height: 400,
			store: Ext.create('casco.store.Tcs'),
			selModel: {
				selType: 'checkboxmodel',
				checkOnly: true
			},
			columns: [{
				text: 'tag',
				dataIndex: 'tc',
				renderer: function(v) {
				return v.tag;
			}
			},{
				text: 'description',
				dataIndex: 'tc',
				flex: 1,
				renderer: function(v) {
				return v.description;
			}
			}, {
			text: "test method",
			dataIndex: "tc",
			renderer: function(v) {
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
				text: 'Save',
				glyph: 0xf0c7,
				listeners: {
					click: 'createJob'
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: function(){
					Ext.getCmp('testing-job-rs').destroy();
					me.destroy();
				}
			}]
		}],

		me.callParent();
	}
});