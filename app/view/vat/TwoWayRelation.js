Ext.define('casco.view.vat.TwoWayRelation', {
	extend: 'Ext.window.Window',
	xtype: 'vat.twowayrelation',
	modal: true,
	
	title: 'Relation Exporting',
	id: 'two-way-relation-window',
	height: 380,
	width: 400,
	
	initComponent: function() {
		var me = this;
//		me.rs_versions = [];
//		console.log(me.document);
//		tcvs.load({
//			params:{
//				document_id: me.document.get('id')
//			}
//		});
		var parentDocs = Ext.create('casco.store.Documents');
		parentDocs.load({
			params: {
				project_id: me.project.get('id'),
				type: 'rs'
			}
		});
		var childDocs = Ext.create('casco.store.Documents');
		childDocs.load({
			params: {
				project_id: me.project.get('id')
			}
		});
		var parentVs = Ext.create('casco.store.Versions');
		var childVs = Ext.create('casco.store.Versions');
		
		me.items = [{
			xtype: 'form',
			reference: 'two_way_relation_form',
			bodyPadding: 20,
			items: [{
				xtype: 'hiddenfield',
				name: 'project_id',
				value: me.project.get('id')
			},{
				fieldLabel: 'Parent Document',
				name: 'parent_doc_name',
				labelWidth : 115,
				store: parentDocs,
				id: 'parent-doc-id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function(f, r, i) {
						parentVs.load({
							params: {
								document_id: r.get('id')
								}
						});
					}
				}
			},{
				fieldLabel: 'Parent Version',
				name: 'parent_version_name',
				labelWidth : 115,
				store: parentVs,
				id: 'parent-verison-id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
			},{
				fieldLabel: 'Child Document',
				name: 'child_doc_name',
				labelWidth : 115,
				store: childDocs,
				id: 'child-doc-id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
				listeners: {
					select: function(f, r, i) {
						childVs.load({
							params: {
								document_id: r.get('id')
								}
						});
					}
				}
			},{
				fieldLabel: 'Child Version',
				name: 'child_version_name',
				labelWidth : 115,
				store: childVs,
				id: 'child-verison-id',
				xtype: 'combobox',
				allowBlank: false,
				editable: false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'id',
			},{
				xtype : 'filefield',
				name : 'file',
				fieldLabel : 'Excel',
				labelWidth : 60,
				msgTarget : 'side',
				allowBlank : false,
				blankText: '请选择需要导入的Excel',
				anchor : 0,
				width : '100%',
				buttonText : 'Select Excel'
			}]
		}];
		
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: 'Export',
				glyph: 0xf080,
				handler: function(){
					
				}
			}, {
				text: 'Cancel',
				glyph: 0xf112,
				scope: me,
				handler: function(){
					Ext.getCmp('two-way-relation-window').destroy();
					me.destroy();
				}
			}]
		}];

		me.callParent();
	}
});