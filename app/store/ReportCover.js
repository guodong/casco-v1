Ext.define('casco.store.ReportCover',{
	extend: 'Ext.data.Store',
	model: 'casco.model.ReportCover',
	pageSize: 0,
	proxy:{
		type: 'rest',
		url: API + 'reportcover',
		withCredentials: true
	}
})