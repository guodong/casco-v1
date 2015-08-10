Ext.define('casco.store.TreeVats', {
    extend: 'Ext.data.TreeStore',
    pageSize: 0,
    autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'treevat',
        reader: {
            type: 'json',
        },
        writer: {
            type: 'json'
        }
    }
});