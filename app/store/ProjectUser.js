Ext.define('casco.store.ProjectUser', {
    extend: 'Ext.data.Store',
    model: 'casco.model.ProductUser',
    pageSize: 0,
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'projectuser',
        withCredentials: true
    }
});