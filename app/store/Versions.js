Ext.define('casco.store.Versions', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Version',
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