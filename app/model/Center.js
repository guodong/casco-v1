Ext.define('casco.model.Center', {
	extend: 'Ext.data.Model',
	proxy: {
		timeout:10000000,
        type: 'rest',
        url: API+'center'
    }
});