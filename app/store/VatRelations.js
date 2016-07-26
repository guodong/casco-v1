Ext.define('casco.store.VatRelations',{
	extend: 'Ext.data.Store',
	model: 'casco.model.VatRelation',
	
	proxy: {
		type: 'rest',
		url: API + 'vat/relations',
		reader: {
			type: 'json'
		},
		writer: {
			type: 'json'
		},
		withCredentials: true
	}
});