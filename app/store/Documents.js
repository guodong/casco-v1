// 160121 Q 
Ext.define('casco.store.Documents', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Document',
    proxy: {
        type: 'rest',
        url: API+'document'
    },
    hasMany: 'casco.store.Version'  //必须指定？
});