Ext.define('casco.store.Documents', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Document',
    pageSize: 0,
    proxy: {
        type: 'rest',
        url: API+'document',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        }
    }
});