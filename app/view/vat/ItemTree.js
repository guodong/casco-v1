Ext.define('casco.view.vat.ItemTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.vat_itemtree',
    requires: ['casco.store.TreeItems'],
    
    displayField: 'name',
    header: false,
    rootVisible : false,
    
    initComponent: function(){
    	var me = this;
    	console.log('I am created');
    	this.store = Ext.create('casco.store.TreeItems', {
    		proxy: {
    			extraParams: {
    				project_id: me.project.get('id'),
    				document_id: me.document_id //用于过滤与之相关的文档
    			}
    		}
    	});
    	
    	this.callParent();
    }
})