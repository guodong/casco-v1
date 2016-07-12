Ext.define('casco.store.Verify', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Verify',
    proxy: {
        type: 'rest',
        url: API+'center/verify',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        }
    }
});