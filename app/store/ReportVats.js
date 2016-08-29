Ext.define('casco.store.ReportVats', {
    extend: 'Ext.data.Store',
    model: 'casco.model.ReportVats',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'reportvats',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    }
});