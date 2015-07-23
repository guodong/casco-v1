Ext.define('casco.store.Builds', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Build',
    pageSize: 0,
    proxy: {
        type: 'rest',
        url: API+'build',
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