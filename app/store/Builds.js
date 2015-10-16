Ext.define('casco.store.Builds', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Build',
    pageSize: 0,
    proxy: {
        type: 'rest',
        url: API+'build'
    }
});