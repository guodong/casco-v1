Ext.define('casco.view.testing.TemplateImport',{
	extend : 'Ext.window.Window',
	xtype : 'testing.templateimport',
	require : ['casco.store.Testjobs'],
	modal : true,
	title : '导入模板',
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
		},{
			anchor: '100%',
			fieldLabel: '模板描述',
			name: 'details',
			margin : '15 0 10 0',
			xtype: 'textfield',
			allowBlank: true
		}, {
			xtype : 'filefield',
			name : 'exceltpl',
			fieldLabel : '模板',
			margin : '15 0 10 0',
			labelWidth : 100,
			allowBlank : false,
			width : '100%',
			buttonText : '选择文件'
		},{
			xtype : 'hiddenfield',
			name : 'project_id',
			value :me.project_id,
			allowBlank : false
		}],
		buttons: ['->', {
			text: '上传',
			formBind: true,
			glyph: 0xf0c7,
			handler: function()
			{
			var fp=me.lookupReference('testjob_tmp');
			if (fp.getForm().isValid()) {  
				fp.getForm().submit({  
					url: API + '/testjob/import_tmp',
					waitMsg: '正在上传模板...',  
					success: function(fp, o) {  
						msg('提示!', o.data);  
					},
					failure: function(fp, o) {
						//表单跨域提价所以报错
						msg('提示!', '上传成功!'); 
						//console.log(me.up('uploadPanel'));
						Ext.getCmp('uploadPanel').down('gridpanel').getStore().reload();
						Ext.getCmp('result-main').tmpstore.reload();
						me.destroy();
					}  
				});  
			}  
			} //handler
		}, {
			text: '重置',  
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