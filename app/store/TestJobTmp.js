Ext.define('casco.store.TestJobTmp', {
    extend: 'Ext.data.Store',
    model: 'casco.model.TestJobTmp',
    proxy: {
        type: 'rest',
        url: API+'testjobtmp',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        }
    }
});