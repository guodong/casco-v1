Ext.define('casco.store.Center', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Center',
    proxy: {
        type: 'rest',
        url: API+'center',
    }
});