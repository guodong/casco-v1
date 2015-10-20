Ext.define('casco.model.Rs', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: API+'rs'
    }
});