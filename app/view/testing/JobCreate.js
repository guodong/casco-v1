Ext.define('casco.view.testing.JobCreate', {
	extend: 'Ext.window.Window',

	xtype: 'testing.jobcreate',

	modal: true,
	title: 'Create Job',
	width: 300,
	controller: 'testing',

	initComponent: function() {
		var me = this;
		var tcdocs = Ext.create('casco.store.Documents');
		tcdocs.load({
			params: {
				project_id: me.project.get('id'),
				type: 'tc'
			}
		});
		var rsdocs = Ext.create('casco.store.Documents');
		var builds = Ext.create('casco.store.Builds');
		builds.load({
			params: {
				project_id: me.project.get('id')
			}
		});
		me.items = [{
			xtype: 'form',
			reference: 'job_create_form',
			bodyPadding: '10',
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			},{
				fieldLabel: 'Name',
				msgTarget: 'under',
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
			}, {
				xtype: 'combobox',
				editable: false,
				fieldLabel: 'Tc Document',
				displayField: 'name',
				valueField: 'id',
				store: tcdocs,
				allowBlank: false,
				queryMode: 'local',
				listeners: {
					select: function(f, r, i) {
						var st = Ext.create('casco.store.Versions');
						st.load({
							params: {
								document_id: r.get('id')
							},
							callback: function() {
								Ext.getCmp('test-tc-version').store = st;
							}
						});
						Ext.getCmp('test-rs').store.load({
							params: {
								document_id: r.get('id'),
								type: 'rs',
								mode: 'related'
							}
						});
					}
				}
			}, {
				fieldLabel: 'Tc Version',
				name: 'tc_version_id',
				id: 'test-tc-version',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
			}, {
				xtype: 'combobox',
				id: 'test-rs',
				editable: false,
				fieldLabel: 'Rs Document',
				displayField: 'name',
				valueField: 'id',
				store: rsdocs,
				allowBlank: false,
				queryMode: 'local',
				listeners: {
					select: function(f, r, i) {
						var st = Ext.create('casco.store.Versions');
						st.load({
							params: {
								document_id: r.get('id')
							},
							callback: function() {
								Ext.getCmp('test-rs-version').store = st;
							}
						});
					}
				}
			}, {
				fieldLabel: 'Rs Version',
				name: 'rs_version_id',
				id: 'test-rs-version',
				xtype: 'combobox',
				allowBlank: false,
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
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
				handler: me.destroy
			}]
		}],

		me.callParent();
	}
});