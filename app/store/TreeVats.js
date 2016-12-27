Ext.define('casco.store.TreeVats', {
    extend: 'Ext.data.TreeStore',
    pageSize: 0,
    autoLoad : true,
    proxy: {
		timeout:10000000,
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