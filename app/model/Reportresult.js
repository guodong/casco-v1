Ext.define('casco.model.Reportresult',{
	extend:'Ext.data.Model',
	proxy:{
		type:'rest',
		url:API + 'center/result'
	}
});