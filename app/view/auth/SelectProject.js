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
//    	console.log((localStorage));
    	store.load({
    		params: {
    			user_id: (localStorage.user)?JSON.parse(localStorage.user).id:''
    		}
    	});
    	console.log(store);
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
	            hidden: JSON.parse(localStorage.user).role_id == 0 ? true: false,
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