Ext.define('casco.store.Rss', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Rs',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'rs',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});