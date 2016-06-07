Ext.define('casco.view.report.CenterCreate', {
	extend: 'Ext.window.Window',
	xtype: 'report.create',

	modal: true,
	title: 'Create Center Report Job',
	id: 'ver-create-window',
	controller: 'report',
	layout: {
		type: 'border'
	},
	height: 400,
	width: 700,
	initComponent: function() {
		var me = this;
		var p_id=me.p_id?me.p_id:'';
		var test_job = Ext.create('casco.store.Testjobs');
		test_job.load({
			params: {
				project_id: me.project.get('id'),
				report:1
			}
		});
		var rsdocs = Ext.create('casco.store.Documents');
		me.items = [{
			xtype: 'form',
			//region: 'west',
			split: true,
			reference: 'ver_create_form',
			bodyPadding: '10',
			width: 300,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			}, {
				fieldLabel: 'Version',
				msgTarget: 'under',
				name: 'version',
				xtype: 'textfield'
			},
			/*{
				xtype:'textfield',
				fieldLabel:'Child Document',
				name:'child_name',
				value:me.child_doc.data.name,
				editable:false,
				listeners:{
					afterrender:function(c,t){
						Ext.getCmp('child-version').store.load({
							params: {
								document_id: me.child_doc.data.id
							}
						});
						var grid = Ext.getCmp('parent_doc');
						me.job.rs_versions = grid.getStore();
						grid.store.load({
							params: {
								document_id: me.child_doc.data.id,
								mode: 'related'
							}
						});
					}
				}
			},*/
			{
				fieldLabel: 'Testing name',
				name: '',
				store: test_job,
				id: 'child-version',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
			},{
			fieldLabel: 'description',
			labelAlign:'top',
			name: 'description',
			xtype: 'textarea',
			flex:1,
			anchor :'100%'
		}]
		},{
			xtype: 'grid',
			id: 'parent_doc',
			region: 'center',
			forceFit:'true',
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
				text: 'Parent doc',
				dataIndex: 'name',
				width:200
			}, {
				text: 'Parent Version',
				dataIndex: 'version_id',
				width:200,
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
			}
			]//column
		}//me.items[1]
		];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: 'Create Report',
				glyph: 0xf0c7,
				listeners: {
					click: 'createCenter'
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: function(){
					
					me.destroy();
				}
			}]
		}],
        me.listeners={
		destroy:function(g, eOpts){
		//console.log(p_id);
		p_id&&Ext.getCmp(p_id).store.reload();
	
		}	
		},
		me.callParent();
	}
});