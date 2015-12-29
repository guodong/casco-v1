Ext.define('casco.model.ChildMatrix', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'childmatrix'
	}
});