Ext.define('casco.model.ReportVats', {
    extend: 'Ext.data.Model',
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