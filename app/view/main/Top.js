Ext.define('casco.view.main.Top', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.top',
    
    controller: 'main',
    style: {background: '#167abc',padding: '10px',color: '#fff'},
    initComponent: function(){
    	var store = Ext.create('casco.store.Projects');
    	store.load({
    		params:{
    			user_id: JSON.parse(localStorage.user).id
    		}
    	});
    	this.items = [{
            xtype: 'label',
            html: 'CASCO TEST CENTER HEHEDA',
            style: 'font-size: 27px;'
        },'->',{
            text: 'Manage',
            xtype: 'button',
            handler: function(){
            	localStorage.view = 'manage';
            	location.reload();
            },
            hidden: localStorage.view == 'manage'?true:false
        }
        ,{
            text: 'Testing',
            xtype: 'button',
            handler: 'testing',
            hidden: localStorage.view == 'manage'?true:false
        },{
            text: 'Project Stat',
            xtype: 'button',
            handler: function(){
            	window.open("/prostat/projectstat-tmp.htm");
            },
            hidden: localStorage.view == 'manage'?false:true
        },{
            text: 'Relation view',
            xtype: 'button',
            handler: function(){
            	window.open('/draw/graph2.html');
            }
        },{
            xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: store,
            queryMode: 'local',
            emptyText: 'Switch Project',
            listeners: {
            	select: 'switchProject'
            }
        }];
    	this.callParent();
    }
})