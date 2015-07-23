Ext.define('casco.model.Vatstr', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'vatstr'
	}
});