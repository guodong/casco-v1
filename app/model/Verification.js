Ext.define('casco.model.Verification', {
	extend: 'Ext.data.Model',
	proxy: {
        type: 'rest',
        url: API+'verification'
    }
});