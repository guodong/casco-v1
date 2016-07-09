Ext.define('casco.store.Reportresult',{
	extend:'Ext.data.Store',
	model:'casco.model.Reportresult',
	proxy:{
		type:'rest',
		url:API + 'center/result',
		reader:{
			type:'json'
		},
		writer:{
			type:'json'
		}
	}
});