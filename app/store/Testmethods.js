Ext.define('casco.store.Testmethods', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Testmethod',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'testmethod',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});