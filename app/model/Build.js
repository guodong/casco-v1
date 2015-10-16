Ext.define('casco.model.Build', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'build'
	}
});