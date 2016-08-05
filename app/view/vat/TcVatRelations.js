Ext.define('casco.view.vat.TcVatRelations',{
	extend: 'Ext.grid.Panel',
	requires: [],
	viewModel: 'vat',
	xtype: 'tc_vat_relations',
	
	forceFit: true,
	columnLines: true,
//	plugins: 'gridfilters',
		
	initComponent: function(){
		var me = this;
		me.store=Ext.create('Ext.data.Store');
		console.log(me.relations);
		me.store.loadData(me.relations);
		console.log(me.store);
		
		me.columns = [{
			text: 'TC',
			dataIndex: 'tc_tag_name'
		},{
			text: 'TC-Version',
			dataIndex: 'tc_version_name'
		},{
			text: 'VAT',
			dataIndex: 'rs_tag_name'
		},{
			text: 'VAT-Doc',
			dataIndex: 'rs_doc_name'
		},{
			text: 'VAT-Version',
			dataIndex: 'rs_version_name'
		}];
		
		this.callParent();
	}
	
});