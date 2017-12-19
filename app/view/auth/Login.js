Ext.define("casco.view.auth.Login",{
    extend: 'Ext.window.Window',
    xtype: 'login',
    
    requires: [
        'casco.view.auth.LoginController'
    ],
    
    controller: 'login',
    title: '登录',
    closable: false,
    autoShow: true,
    
    initComponent:function(){
    	var me = this;
    	this.items = {
    	        xtype: 'form',
    	        bodyPadding: 10,
    	        reference: 'form',
    	        items: [{
    	            xtype: 'textfield',
    	            name: 'account',
    	            fieldLabel: '用户名',
    	            allowBlank: false,
    	            listeners:{
    	            	// add 'Enter' event
    	            	specialkey:'onKeyEnter'
    	            }
    	        }, {
    	            xtype: 'textfield',
    	            name: 'password',
    	            inputType: 'password',
    	            fieldLabel: '密码',
    	            allowBlank: false,
    	            listeners:{
    	            	// add 'Enter' event
    	            	specialkey:'onKeyEnter'
    	            }
    	        }],
    	        buttons: [{
    	            text: '登录',
    	            formBind: true,
    	            listeners: {
    	                click: 'onLoginClick'
    	            }
    	        }]
    	    };
    	this.callParent();
    }
});