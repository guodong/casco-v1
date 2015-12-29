Ext.define('casco.store.ParentMatrix', {
    extend: 'Ext.data.Store',
    model: 'casco.model.ParentMatrix',
    pageSize: 0,
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'parentmatrix',
        withCredentials: true
    }
});