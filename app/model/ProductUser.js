Ext.define('casco.model.ProductUser', {
	extend: 'Ext.data.Model',
	proxy: {
        type: 'rest',
        url: API+'ProductUser'
    }
});