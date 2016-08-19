Ext.define('casco.view.vat.VatTcRelations',{
	extend: 'Ext.grid.Panel',
	requires: [],
	viewModel: 'vat',
	xtype: 'vat_tc_relations',
	
	forceFit: true,
	columnLines: true,
//	plugins: 'gridfilters',
		
	initComponent: function(){
		var me = this;
		me.store=Ext.create('Ext.data.Store');
		me.store.loadData(me.relations);
		
		me.columns = [{
			text: 'VAT',
			dataIndex: 'rs_tag_name',
		},{
			text:'VAT-Doc',
			dataIndex: 'rs_doc_name'
		},{
			text: 'VAT-Version',
			dataIndex: 'rs_version_name'
		},{
			text: 'TC',
			dataIndex: 'tc_tag_name'
		},{
			text: 'TC-Version',
			dataIndex: 'tc_version_name'
		}];
		
		this.callParent();
	}
	
});