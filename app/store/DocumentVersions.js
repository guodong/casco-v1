Ext.define('casco.store.DocumentVersions', {
    extend: 'Ext.data.Store',
    model: 'casco.model.DocumentVersion',
    proxy: {
        type: 'rest',
        url: API+'version',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        }
    }
});