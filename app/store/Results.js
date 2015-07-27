Ext.define('casco.store.Results', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Result',
    proxy: {
        type: 'rest',
        url: API+'result',
        withCredentials: true
    }
});