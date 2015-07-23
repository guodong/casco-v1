Ext.define('casco.store.Tcs', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Tc',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'ajax',
        url: API+'tc',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});