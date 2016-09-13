Ext.define('casco.store.TreeItems', {
    extend: 'Ext.data.TreeStore',
    pageSize: 0,
    autoLoad : true,
    proxy: {
		timeout:10000000,
        type: 'rest',
        url: API+'treeitem',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        }
    }
});