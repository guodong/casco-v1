Ext.define('casco.view.rs.vat.VatTree', {
	extend: 'Ext.tree.Panel',
	xtype: 'vattree',
	requires: ['casco.store.TreeVats'],

	displayField: 'name',
	header: false,
	rootVisible: false,
	initComponent: function() {
		var me = this;
		this.store = Ext.create('casco.store.TreeVats', {
			proxy: {
				extraParams: {
					project_id: me.project.get('id'),
					document_id: me.document_id, // 用于过滤与之相关的文档
					tag: localStorage.tag,
					rs_id: me.rs.get('id')
				}
			}
		});
		me.listeners = {
			beforeload: function(store, ops, eopts) {
				ops.setParams({
					id: ops.node.get('id')
				})
			}
		};

		this.callParent();
	}
})