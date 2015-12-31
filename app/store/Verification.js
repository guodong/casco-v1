Ext.define('casco.store.Verification', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Verification',
    proxy: {
        type: 'rest',
        url: API+'verification',
    }
});