Ext.define('casco.view.matrix.ParentMatrix', {
	extend: 'Ext.panel.Panel',
	xtype: 'parentmatrix',
	viewModel: 'main',
	controller:'matrix',
	requires: ['casco.view.matrix.InnerParentGrid'],   
	
	layout: 'fit',
	           	
	initComponent: function() {
		var me = this;
		me.items = [{
			xtype:'innerparentgrid',
			itemId: 'parentgrid',
			verification: me.verification,
			parent_v_id:me.parent_v_id,
			scorllable: true
		}];
		me.callParent(arguments);
		},
	
		
})