Ext.define('casco.view.matrix.VerificationCreate', {
	extend: 'Ext.window.Window',
	xtype: 'matrix.create',

	modal: true,
	title: '创建核验',
	id: 'ver-create-window',
	controller: 'matrix',
	layout: {
		type: 'border'
	},
	height: 400,
	width: 700,
	initComponent: function() {
		var me = this;
		var p_id=me.p_id?me.p_id:'';
		var child_docs = Ext.create('casco.store.Documents');
		child_docs.load({
			params: {
				id: me.child_doc.data.id,
				project_id: me.project.get('id'),
//				document_id: me.child_doc.data.id
			}
		});
//		var child_doc = me.child_doc;
//		child_doc.load({
//			params:{
//				document_id:me.document.get(id),
//			}
//		});
		var rsdocs = Ext.create('casco.store.Documents');
		me.items = [{
			xtype: 'form',
			region: 'west',
			split: true,
			reference: 'ver_create_form',
			bodyPadding: '10',
			width: 300,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			},{
				fieldLabel: '版本',
				msgTarget: 'under',
				name: 'version',
				xtype: 'textfield'
			},
			{
				xtype:'textfield',
				fieldLabel:'子级文档',
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
			},
			{
				fieldLabel: '子级版本',
				name: 'child_version_id',
				store: Ext.create('casco.store.Versions'),
				id: 'child-version',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
			},{
			fieldLabel: '描述',
			labelAlign:'top',
			name: 'description',
			xtype: 'textarea',
			flex:1,
			anchor :'100%'
		}]//me.items[0]
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
				text: '父级文档',
				dataIndex: 'name',
				width:200
			}, {
				text: '父级版本',
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
			}]//column
		}//me.items[1]	
		];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '创建报告',
				glyph: 0xf0c7,
				listeners: {
					click: 'createVerification'
				}
			}, {
				text: '取消',
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