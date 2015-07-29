Ext.define('casco.store.Documents', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Document',
    proxy: {
        type: 'rest',
        url: API+'document'
    },
    hasMany: 'casco.store.Version'
});