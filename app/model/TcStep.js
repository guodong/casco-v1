Ext.define('casco.model.TcStep', {
	extend : 'Ext.data.Model',
		proxy: {
        type: 'rest',
        url: API+'tc/tc_steps'
    }
});