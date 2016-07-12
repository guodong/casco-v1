Ext.define('casco.model.Verify', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'center/verify'
	}
});