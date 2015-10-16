Ext.define('casco.store.Vatstrs', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Vatstr',
    proxy: {
        type: 'rest',
        url: API+'vatstr',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});