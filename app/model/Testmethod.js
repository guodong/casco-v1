Ext.define('casco.model.Testmethod', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: API+'testmethod'
    }
});