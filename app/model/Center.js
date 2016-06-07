Ext.define('casco.model.Center', {
	extend: 'Ext.data.Model',
	proxy: {
        type: 'rest',
        url: API+'center'
    }
});