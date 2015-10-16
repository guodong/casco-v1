Ext.define('casco.model.Testjob', {
	extend: 'Ext.data.Model',
	proxy: {
        type: 'rest',
        url: API+'testjob'
    }
});