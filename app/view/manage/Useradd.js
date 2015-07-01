Ext.define('casco.view.manage.Useradd', {
	extend: 'Ext.window.Window',

	xtype: 'widget.useradd',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title:'Edit User',
	width: 300,
	initComponent: function() {
		var me = this;
	 	console.log(me.user);
	   
		me.projects = Ext.create('casco.store.Projects');  //作用？？？？？
		if(me.user){
			me.projects.setData(me.user.get('projects'));
		}
		Ext.apply(me, {
			
			items: [{
				xtype: 'form',
				reference: 'useraddform',
				bodyPadding: '10',
				items: [{
					anchor: '100%',
					fieldLabel: 'Account',
					name: 'account',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: 'Realname',
					name: 'realname',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false
				}, {
					anchor: '100%',
					fieldLabel: 'Jobnumber',
					name: 'jobnumber',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield'
				},/*{                                        //用户角色
					anchor: '100%',
					fieldLabel: 'role',
					name: 'role',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield'
				}, */ {
					anchor: '100%',
					fieldLabel: 'Password',
					name: 'password',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					inputType: 'password',
					allowBlank: false,
					//hidden: me.user?true:false
				}, {
    				xtype: 'grid',
    				region: 'center',
    				fieldLabel: 'Joined Projects',
//    				dockedItems: [{
//    	    	        xtype: 'toolbar', 
//    	    	        dock: 'bottom',
//    	    	        items: [{
//    	    	            glyph: 0xf067,
//    	    	            text: 'Edit Participants',
//    	    	            handler: function(){
//    	    					var wd = Ext.create("casco.view.manage.Participants", {
//    	    						participants: me.participants
//    	    					});
//    	    					wd.show();
//    	    				}
//    	    	        }]
//    	    	    }],
    			    columns: [
    			        { text: 'Projects',  dataIndex: 'name', flex: 1}
    			    ],
    			    store: me.projects,
					hidden: me.user?false:true
    			}],
				buttons: ['->', {
					text: 'Save',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createuser'
					}
				}, {
					text: 'Cancel',
					glyph: 0xf112,
					scope: me,
					handler: this.destroy
				}]

			}]
		});
		me.callParent(arguments);
	},
	doHide: function() {
		this.hide();
	}
});