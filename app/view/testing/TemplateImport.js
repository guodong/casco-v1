Ext.define('casco.view.testing.TemplateImport',{
	extend : 'Ext.window.Window',
	xtype : 'testing.templateimport',
	require : ['casco.store.Testjobs'],
	
	modal : true,
	title : 'Template Import',
	width : 500,
	frame : true,
	viewModel : 'main',
	
	initComponent : function(){
		var me = this;
		me.items = [{
			xtype : 'filefield',
			name : 'exceltpl',
			fieldLabel : 'Template',
			margin : '15 0 10 0',
			labelWidth : 80,
			allowBlank : false,
//			anchor : 0,
			width : '100%',
			buttonText : 'Select file'
		},{
			
		}]
		
		me.callParent(arguments);
	}
	
});