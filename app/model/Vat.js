Ext.define('casco.model.Vat', {
	extend : 'Ext.data.Model',
	proxy: {
        type: 'rest',
        url: API+'vat'
    }
});