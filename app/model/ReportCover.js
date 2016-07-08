Ext.define('casco.model.ReportCover',{
	extend:'Ext.data.Model',
	proxy:{
		type: 'rest',
		url: API + 'cover'
	}
})