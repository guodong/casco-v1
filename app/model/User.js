Ext.define('casco.model.User', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: API+'user'
    }
});