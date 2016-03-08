Ext.define("casco.view.auth.Login",{
    extend: 'Ext.window.Window',
    xtype: 'login',
    
    requires: [
        'casco.view.auth.LoginController'
    ],
    
    controller: 'login',
    title: 'Login Window',
    closable: false,
    autoShow: true,
    
    items: {
        xtype: 'form',
        bodyPadding: 10,
        reference: 'form',
        items: [{
            xtype: 'textfield',
            name: 'account',
            fieldLabel: 'Account',
            allowBlank: false,
            listeners:{
            	// add 'Enter' event
            	specialkey:'onKeyEnter'
            }
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Password',
            allowBlank: false,
            listeners:{
            	// add 'Enter' event
            	specialkey:'onKeyEnter'
            }
        }],
        buttons: [{
            text: 'Login',
            formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }
});