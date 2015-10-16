Ext.define("casco.view.auth.SelectProject",{
    extend: 'Ext.window.Window',
    xtype: 'selectProject',
    
    requires: [
        'casco.view.auth.LoginController'
    ],
    
    controller: 'login',
    title: 'Select Project',
    closable: false,
    autoShow: true,
    initComponent: function(){
    	var store = Ext.create('casco.store.Projects');
    	store.load({
    		params: {
    			user_id: JSON.parse(localStorage.user).id
    		}
    	});
    	this.items = {
	        xtype: 'form',
	        bodyPadding: 10,
	        reference: 'form',
	        items: [{
	        	xtype: 'combobox',
	            editable: false,
	            displayField: 'name',
	            valueField: 'id',
	            store: store,
	            queryMode: 'local',
	            emptyText: 'Select Project',
	            allowBlank: false
	        }],
	        buttons: [ {
	            text: 'Manage',
	            listeners: {
	                click: 'onManage'
	            }
	        },{
	            text: 'Select',
	            formBind: true,
	            listeners: {
	                click: 'onSelectClick'
	            }
	        }]
	    };
    	this.callParent();
    }
});