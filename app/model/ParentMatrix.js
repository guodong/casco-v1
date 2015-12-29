Ext.define('casco.model.ParentMatrix', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'parentmatrix'
	}
});