Ext.define('casco.view.testing.JobCreate', {
	extend: 'Ext.window.Window',
	xtype: 'testing.jobcreate',

	modal: true,
	title: 'Create Job',
	controller: 'testing',
	layout: {
		type: 'border'
	},
	height: 300,
	width: 1000,
	initComponent: function() {
		var me = this;
		me.rs_versions = [];
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
			region: 'west',
			split: true,
			reference: 'job_create_form',
			bodyPadding: '10',
			width: 300,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			}, {
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
				name: 'tc_id',
				valueField: 'id',
				store: tcdocs,
				allowBlank: false,
				queryMode: 'local',
				listeners: {
					select: function(f, r, i) {
						Ext.getCmp('test-tc-version').store.load({
							params: {
								document_id: r.get('id')
							}
						});
						var grid = Ext.getCmp('testing-job-rs');
						me.job.rs_versions = grid.getStore();
						grid.store.load({
							params: {
								document_id: r.get('id'),
								type: 'rs',
								mode: 'related'
							}
						})
					}
				}
			}, {
				fieldLabel: 'Tc Version',
				name: 'tc_version_id',
				store: Ext.create('casco.store.Versions'),
				id: 'test-tc-version',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id'
			}]
		}, {
			xtype: 'grid',
			id: 'testing-job-rs',
			region: 'center',
			store: Ext.create('casco.store.Documents'),
			plugins: {
		        ptype: 'cellediting',
		        clicksToEdit: 1,
		        listeners: {
		            beforeedit: function(editor, e) {
		            	var combo = e.grid.columns[e.colIdx].getEditor(e.record);
		            	var st = Ext.create('casco.store.Versions', {data: e.record.get('versions')});
		            	
		            	combo.setStore(st);
		            }
		        }
		    },
		    columns: [{
				text: 'Rs doc',
				dataIndex: 'name',
				flex: 1
			}, {
				text: 'Version',
				dataIndex: 'version_id',
				renderer: function(v, md, record){
					var versions = record.get('versions');
					if(versions.length == 0) return;
					if(!v){
						record.set('version_id', versions[0].id);
						return versions[0].name;
					}
					for(var i in versions){
						if(v == versions[i].id){
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