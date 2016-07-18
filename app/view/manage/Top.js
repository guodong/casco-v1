//主界面Head-样式，按钮，Controller-main.MainController
Ext.define('casco.view.manage.Top', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'manage_top',
    controller: 'main',
    style: {background: '#167abc',padding: '10px',color: '#fff'},
    
    initComponent: function(){
    	var store = Ext.create('casco.store.Projects');
    	store.load({
    		params:{
    			user_id: JSON.parse(localStorage.user).id
    		}
    	});
//    	console.log(me.project);
		var states = Ext.create('Ext.data.Store', {
         fields: ['abbr', 'name'],
         data : [
         {"abbr":"EditInfo", "name":"1"},
		 {"abbr":"Logout", "name":"2"}
           ]});

    	this.items = [{
            xtype: 'label',
            html: 'CASCO TEST CENTER',
            style: {'font-size':'27px','font-weight':'bold'}
        },'->',{
            xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: store,
            queryMode: 'local',
			itemId:'switcher',	//ManageController使用
            emptyText: 'Switch Project',
            listeners: {
            	select: 'switchProject'
            }
        },{
            xtype: 'combobox',
            editable: false,
            displayField: 'abbr',
            valueField: 'name',
            store: states,
			width: '10%',
            queryMode: 'local',
            emptyText: JSON.parse(localStorage.user).realname,
            listeners: {
            	select: 'editUser'
            }
        }];
    	this.callParent();
    }

})