Ext.define('casco.view.vat.VatRelations',{
	extend: 'Ext.grid.Panel',
	requires: [],
	viewModel: 'vat',
	xtype: 'vatrelations',
	
	forceFit: true,
	columnLines: true,
	
	initComponent: function(){
		var me = this;
		me.vatres = Ext.create('casco.store.VatRelations');
		me.vatres.load({
			params: {
				vat_build_id: me.relation.id
			}
		})
		console.log(me.vatres);
		
		me.columns = [{
			text: 'TC',
			dataIndex: 'tc_tag',
		},{
			text: 'TC-Version',
			dataIndex: 'tc_version_name',
		},{
			text: 'VAT',
			dataIndex: 'rs_tag',
		},{
			text: 'VAT-Doc',
			dataIndex: 'rs_doc_name'
		},{
			text: 'VAT-Version',
			dataIndex: 'rs_version_name'
		}];
		
		me.callParent(arguments);
	}
	
});