Ext.define('casco.model.Tc', {
	extend : 'Ext.data.Model',
	proxy: {
        type: 'rest',
        url: API+'tc'
    }
});