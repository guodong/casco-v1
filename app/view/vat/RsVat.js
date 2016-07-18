
Ext.define('casco.view.vat.RsVat',{
	extend: 'Ext.grid.Panel',
	xtype: 'rsvat',
	viewModel: 'vat',
	requires: [],
	
	columnLines: true,
	
	initComponent: function(){
		var me = this;
		me.versions = new casco.store.Versions();
		me.store = new casco.store.Vats();
		me.store_vat = new casco.store.Vats();
		me.versions.load({
			params:{
				document_id: me.document.id
			},
			synchronous: true,
			callback: function(){
				me.down('combobox').select(me.versions.getAt(0));  //取最近的版本
				var latest_v = me.versions.getCount() > 0?me.versions.getAt(0):0;
				me.curr_version = latest_v;
				if(latest_v){
					me.store_vat.load({
						scope:this,
						synchronous: true,
						params: {
							version_id: latest_v.get('id')
						},
					    callback:function(){
//					    me.vatjson=me.store_rs.getAt(0).get('vatjson'); //后台返回的VatJSON信息
						},
                     
						})
					};
				}				
			});
		me.callParent(arguements);
		
		},
	})