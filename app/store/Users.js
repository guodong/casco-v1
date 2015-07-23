Ext.define('casco.store.Users', {
    extend: 'Ext.data.Store',
    model: 'casco.model.User',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'user',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});