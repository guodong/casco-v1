Ext.define('casco.model.Version', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'version'
	}
});