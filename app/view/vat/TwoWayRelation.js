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
				disabled: true
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
				glyph: 0xf1c3,
				handler: function(){
					var self = this;var obj=null;
					var form = me.down('form').getForm();
					console.log(form);
					if (form.isValid()) {
						// ajax请求				
						                    setTimeout(function(){Ext.destroy(me);},1000);
											form.submit({// 为什么一直为false
												url : API + 'vat/export',
												//waitMsg : 'Uploading file...',
												listeners:{
												actioncomplete:function(){
												this.destroy();
												}
												},
												success : function(form,action) {
													 self.up('window').destroy();
												},
						                        failure: function(form,action) {
													 self.up('window').destroy();
												}
											});// submit
											
						 }//valid
						
					
					
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