Ext.define('casco.store.ChildMatrix', {
    extend: 'Ext.data.Store',
    model: 'casco.model.ChildMatrix',
    pageSize: 0,
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'childmatrix',
        withCredentials: true
    }
});