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
//		console.log(me.relations);
		me.store.loadData(me.relations);
//		console.log(me.store);
		
		me.columns = [{
			text: 'Parent-Tag',
			dataIndex: 'rs_tag_name',
			width: '20%'
		},{
			text: 'Parent-Version',
			dataIndex: 'rs_version_name',
			width: '20%'
		},{
			text: 'VAT',
			dataIndex: 'rs_vat',
			width: '60%'
		}];
		
		this.callParent();
	}
	
});