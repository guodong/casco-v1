Ext.define('casco.store.Testjobs', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Testjob',
    proxy: {
        type: 'rest',
        url: API+'testjob',
    }
});