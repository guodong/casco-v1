Ext.define('casco.view.vat.VatRelations',{
	extend: 'Ext.grid.Panel',
	requires: [],
	viewModel: 'vat',
	xtype: 'vatrelations',
	
	forceFit: true,
	columnLines: true,
	plugins: 'gridfilters',
		
	initComponent: function(){
		var me = this;
		me.vatres = Ext.create('casco.store.VatRelations');
		me.vatres.load({
			params: {
				vat_build_id: me.relation.id
			}
		})
		me.store = me.vatres;
		
		me.columns = [{
			text: 'TC',
			dataIndex: 'tc_tag_name',
			filter: {
				type: 'string'
			}
		},{
			text: 'TC-Version',
			dataIndex: 'tc_version_name',
		},{
			text: 'VAT',
			dataIndex: 'rs_tag_name',
		},{
			text: 'VAT-Doc',
			dataIndex: 'rs_doc_name',
			filter: {
				type: 'string'
			}
		},{
			text: 'VAT-Version',
			dataIndex: 'rs_version_name'
		}];
		
		me.callParent(arguments);
	}
	
});