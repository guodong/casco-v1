Ext.define('casco.store.ReportCovers',{
	extend: 'Ext.data.Store',
	model: 'casco.model.ReportCovers',
	pageSize: 0,
	proxy:{
		type: 'rest',
		url: API + 'reportcovers',
		withCredentials: true
	}
})