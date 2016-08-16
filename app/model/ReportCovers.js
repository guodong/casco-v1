Ext.define('casco.model.ReportCovers',{
	extend:'Ext.data.Model',
	proxy:{
		type: 'rest',
		url: API + 'covers'
	}
})