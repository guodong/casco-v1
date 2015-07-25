Ext.define('casco.view.rs.RsImport', {
	extend : 'Ext.window.Window',
	alias : 'widget.rs.rsimport',
	
	requires : [ 
	             'casco.store.Rss', 
	             'casco.store.Versions',
	             //'casco.view.document.version.Create' 
	             ],
	//uses : [],

	modal : true,
	title : 'Document Import',
	width : 400,
	frame : true,
	id : 'import-window',
	viewModel : 'main',
	initComponent : function() {
		var me = this;
		me.aflag = '';
		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			items : [ {
				xtype : 'combobox',
				fieldLabel : 'Version',
				labelWidth : 50,
				store : me.vstore,
				displayField : 'name',
				valueField : 'id',
				queryMode : 'local',
				editable : true,
				width : '100%',
				lastQuery: '',
				listeners : {
					beforequery : function(e) {
						e.query = new RegExp(e.query.trim(), 'i');
						e.forceAll = true;
					},
					blur:function(e){
						var input = e.getRawValue().trim();
						e.setRawValue(input);
						if(input == '') 
							Ext.Msg.alert('Error','Vesrion is NULL ！');
						else if(e.store.find('name',input) == -1){
							Ext.Msg.alert('Notice','New Version: '+ input);
							me.aflag = input;
						}
							//else Ext.Msg.alert('Notice','Exist Version: '+ input);
					}
				}
			}, 
			/*
			 * { fieldLabel: 'Version', name: 'version_id', xtype:
			 * 'hiddenfield', value: me.version_id },
			 */
			{
				xtype : 'filefield',
				name : 'file',
				fieldLabel : 'File',
				labelWidth : 50,
				msgTarget : 'side',
				allowBlank : false,
				anchor : 0,
				width : '100%',
				buttonText : 'Select File'
			}, {
				xtype : 'hiddenfield',
				name : 'type',
				value : me.type, 
				allowBlank : false,
			},{
				xtype:'hiddenfield',
				name:'isNew',
				value: 0,
			},{
				xtype: 'hiddenfield',
				name: 'document_id',
				value: me.document_id
			}],

			buttons : [ {
				text : 'Import',
				handler : function() {
					var self = this;
					var form = this.up('form').getForm();
					//Ext.Msg.alert('Test',);
					if(me.aflag) form.findField('isNew').setValue = 1;
					if (form.isValid()) {
						form.submit({
							url : API + 'docfile',
							waitMsg : 'Uploading file...',
							success : function(fp, o) {
								self.up('window').doHide();
								var t = Ext.ComponentQuery.query("#tab-"
										+ me.document_id)[0];
								t.store.reload();
							}
						});
					}
				}
			} ],
		} ];
		me.callParent(arguments);
	},

	doHide : function() {
		this.hide();
	}
});