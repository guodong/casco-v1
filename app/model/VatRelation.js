Ext.define('casco.model.VatRelation',{
	extend: 'Ext.data.Model',
	proxy:{
		type: 'rest',
		url: API + 'vat/relations'
	}	
});