Ext.define('casco.store.ReportCovers',{
	extend: 'Ext.data.Store',
	model: 'casco.model.ReportCover',
	pageSize: 0,
	proxy:{
		type: 'rest',
		url: API + 'cover',
		withCredentials: true
	}
})