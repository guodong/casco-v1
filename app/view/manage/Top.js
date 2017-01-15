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
		var states = Ext.create('Ext.data.Store', {
         fields: ['abbr', 'name'],
         data : [
         {"abbr":"修改信息", "name":"1"},
		 {"abbr":"注销登录", "name":"2"}
           ]});

    	this.items = [{
            xtype: 'label',
            html: '卡斯柯测试平台',
            style: {'font-size':'27px','font-weight':'bold'}
        },'->',{
            xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: store,
            queryMode: 'local',
			itemId:'switcher',	//ManageController
            emptyText: '（切换工程）',
            listeners: {
            	select: 'switchProject'
            }
        },{
            xtype: 'combobox',
            itemId: 'logoutBtn',
            editable: false,
            displayField: 'abbr',
            valueField: 'name',
            store: states,
			width: '10%',
            queryMode: 'local',
            emptyText: JSON.parse(localStorage.user).realname,
            listeners: {
            	select: 'editUser',
            }
        }];
    	this.callParent();
    }

})