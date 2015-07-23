Ext.define('casco.store.Vat', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Vat',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'vat',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});