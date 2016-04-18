Ext.define('casco.view.testing.TemplateImport',{
	extend : 'Ext.window.Window',
	xtype : 'testing.templateimport',
	require : ['casco.store.Testjobs'],
	modal : true,
	title : 'Template Import',
	width : 500,
	frame : true,
	controller: 'testing',
	initComponent : function(){
	   var me = this;
	   var msg = function(title, msg) {  
			Ext.Msg.show({  
				title: title,  
				msg: msg,  
				minWidth: 200,  
				modal: true,  
				icon: Ext.Msg.INFO,  
				buttons: Ext.Msg.OK  
			}); 
	   };  
		Ext.apply(me, {
		items: [{
		xtype: 'form',
		reference: 'testjob_tmp',
		bodyPadding: '10',
		items:
		[{
			anchor: '100%',
			fieldLabel: '模板名称',
			name: 'name',
			margin : '15 0 10 0',
			xtype: 'textfield',
			allowBlank: false
		}, {
			xtype : 'filefield',
			name : 'exceltpl',
			fieldLabel : 'Template',
			margin : '15 0 10 0',
			labelWidth : 80,
			allowBlank : false,
			width : '100%',
			buttonText : 'Select file'
		},{
			xtype : 'hiddenfield',
			name : 'project_id',
			value :me.project_id,
			allowBlank : false
		}],
		buttons: ['->', {
			text: 'Upload',
			formBind: true,
			glyph: 0xf0c7,
			handler: function()
			{
			var fp=me.lookupReference('testjob_tmp');
			if (fp.getForm().isValid()) {  
				fp.getForm().submit({  
					url: API + '/testjob/import_tmp',
					waitMsg: 'Uploading your template...',  
					success: function(fp, o) {  
						msg('Success', o.data);  
					},
					failure: function(fp, o) {  
						msg('Failure', o.data);  
					}  
				});  
			}  
			} //handler
		}, {
			text: 'Reset',  
			handler: function() { 
				var fp=me.lookupReference('testjob_tmp');
				fp.getForm().reset();  
			}  
		}]
		}]
		});
		
		me.callParent(arguments);
	}
	
});