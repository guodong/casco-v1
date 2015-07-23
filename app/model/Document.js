Ext.define('casco.model.Document', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'document'
	}
});