Ext.define('casco.store.TreeDocuments', {
    extend: 'Ext.data.TreeStore',
    //model: 'casco.model.Document',
    pageSize: 0,
    autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'tree',
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