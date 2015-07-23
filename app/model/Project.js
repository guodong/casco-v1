Ext.define('casco.model.Project', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API + 'project'
	}
});