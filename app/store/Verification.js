Ext.define('casco.store.Verification', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Testjob',
    proxy: {
        type: 'rest',
        url: API+'verification',
    }
});