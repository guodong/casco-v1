Ext.define('casco.view.vat.ViewCreate', {
	extend: 'Ext.window.Window',
	xtype: 'vat.viewcreate',
	modal: true,
	controller: 'vat',
	
	title: 'Create Vat View',
	id: 'vat-view-create',
	layout: {
		type: 'border'
	},
	height: 400,
	width: 700,
	
	initComponent: function() {
		var me = this;
		me.rs_versions = [];
		console.log(me.document);
		var tcvs = Ext.create('casco.store.Versions');
		tcvs.load({
			params:{
				document_id: me.document.get('id')
			}
		});
		var rsvs = Ext.create('casco.store.Versions');
		var rsdocs = Ext.create('casco.store.Documents');
		rsdocs.load({
			params: {
				project_id: me.project.get('id'),
				type: 'rs'
			}
		});
		
//		var tcdoc = Ext.create('casco.store.Documents');
//		tcdoc.load({
//			params:{
//				id: me.document.data.id,
//			}
//		});
//		console.log(tcdoc);
		
		me.items = [{
			xtype: 'form',
			region: 'west',
			split: true,
			reference: 'vat_view_create_form',
			bodyPadding: '10',
			width: 300,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			},{
				xtype: 'textfield',
				fieldLabel: 'Name',
				name: 'name',
				msgTarget: 'under',
				allowBlank:false, 
				blankText:"请输入自定义名称"
			}, {
				xtype: 'textfield',
				fieldLabel: 'Tc Doc',
				name: 'tc',
				value: me.document.data.name
			}, {
				fieldLabel: 'Tc Version',
				name: 'tc_version_id',
				store: tcvs,
				id: 'tc-version',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function(f, r, i) {
						var grid = Ext.getCmp('vat-view-rs');
						me.vat.rs_versions = grid.getStore();
						console.log(me.vat);
					}
				}
			},{
				xtype: 'textarea',
				fieldLabel: 'Decription',
				labelAlign:'top',
				name: 'description',
				anchor: '100%',
				grow: true
			}]
		}, {
			xtype: 'grid',
			id: 'vat-view-rs',
			region: 'center',
			store: rsdocs,
//			columnLines: true,
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
				width: 250
			}, {
				text: 'Version',
				dataIndex: 'version_id',
				renderer: function(v, md, record){
					console.log(record);
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
//				renderer: function(v, md, record){
//					
//					var versions = record.get('versions');
////					console.log(versions);
//					if(versions.length == 0) return;
//					if(!v){
//						record.set('version_id', versions[0].id);
//						return versions[0].name;
//					}
//					for(var i in versions){
//						if(v == versions[i].id){
//							return versions[i].name;
//						}
//					}
//				},
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
					click: 'createView'
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: function(){
					Ext.getCmp('vat-view-create').destroy();
					me.destroy();
				}
			}]
		}];

		me.callParent();
	}
});