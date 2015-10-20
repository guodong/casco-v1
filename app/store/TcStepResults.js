Ext.define('casco.store.TcStepResults', {
    extend: 'Ext.data.Store',
    model: 'casco.model.TcStepResult',
    pageSize: 0, //disable paging
    //autoLoad : true,
});