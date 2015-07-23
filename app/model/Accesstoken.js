Ext.define('casco.model.Accesstoken', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: API+'accesstoken'
    }
});