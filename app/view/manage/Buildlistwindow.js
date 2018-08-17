Ext.define('casco.view.manage.Buildlistwindow', {
	extend: 'Ext.window.Window',
 
	alias: 'widget.Buildlistwindow',
	requires: ['casco.view.testing.BuildCreate','casco.store.Builds','casco.view.manage.Buildlist'],
    resizable: true,
	maximizable: true,
	modal: true,
	title: '查看Build',
	width: 405,
    controller: 'manage',
	initComponent: function() {
		    var me=this;
		  	Ext.apply(me, {
			
			items: [{
				xtype: 'buildlist',
				project:me.project,
			    id:'build_list',
				anchor: '100%'
				 
			}]
		   });
           me.callParent();
	} 
	
  /*  listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.testing.BuildCreate', {user: record});//这里初始化的什么玩意
            win.down('form').loadRecord(record);
            win.show();
        }
    }//listener
	*/
})