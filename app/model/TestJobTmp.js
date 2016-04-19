Ext.define('casco.model.TestJobTmp', {
	extend: 'Ext.data.Model',
	proxy: {
		type: 'rest',
		url: API+'testjobtmp'
	}
});