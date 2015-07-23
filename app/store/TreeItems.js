Ext.define('casco.store.TreeItems', {
    extend: 'Ext.data.TreeStore',
    pageSize: 0,
    autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'treeitem',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        },
        extraParams: {
			project_id: localStorage.project_id
		}
    }
});