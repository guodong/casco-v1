//151016
Ext.define('casco.model.Role',{
	extend:'Ext.data.Model',
	proxy:{
		type:'rest',
		url:API + 'role'
	}
});