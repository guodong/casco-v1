//151016
Ext.define(casco.store.Roles,{
	extend:Ext.data.Store,
	model:casco.model.Role,
	proxy:{
		type:'rest',
		url:API + 'role',
		reader:{
			type:'json'
		},
		writer:{
			type:'json'
		}
	}
});