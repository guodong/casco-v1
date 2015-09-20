Ext.define('casco.view.manage.Useredit', {
	extend: 'Ext.window.Window',

	xtype: 'widget.useredit',
	requires: [],
	controller: 'manage',
	resizable: true,
	maximizable: true,
	modal: true,
	title:'Edit User',
	width: 300,
	initComponent: function() {
		var me = this;
	 	
		me.projects = Ext.create('casco.store.Projects');  //作用？？？？？
		if(me.user!=null){
			me.projects.setData(me.user.get('projects'));
		}
		console.log(me.user.get('role_id'));
		var pros_store=Ext.create('casco.store.Projects');
		pros_store.load();
        me.pros_store=pros_store;
		var store = Ext.create('Ext.data.Store', {
         fields: ['name', 'value'],
         data : [
          
         {"name":"Staff", "value":"0"},
		 {"name":"Manager", "value":"1"}
		
        
           ]});
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
				},{
					anchor: '100%',
					fieldLabel: 'Role',
					name: 'role_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'combobox',
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    store: store,
                    queryMode: 'local',
                    emptyText: me.user.get('role_id')=='0'?'Staff':'Manager',
                   
				},/*{
					anchor: '100%',
					fieldLabel: 'Role',
					anchor: '100%',
					fieldLabel: 'role_id',
					name: 'role_id',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'textfield',
					allowBlank: false,
                   
				},*/{
    				xtype: 'grid',
    				region: 'center',
    				fieldLabel: 'Projects',
   				    dockedItems: [{
    	    	        xtype: 'toolbar', 
    	    	        dock: 'bottom',
    	    	        items: [{
    	    	            glyph: 0xf067,
    	    	            text: 'Edit UserDocuments',
    	    	            handler: function(){
    	    					var wd = Ext.create("casco.view.manage.UserDocuments",{user:me.user});
    	    					wd.show();
    	    				}
    	    	        }]
    	    	    }],
    			    columns: [
    			        { text: 'Projects',  dataIndex: 'name', flex: 1}
    			    ],
    			    store: me.projects,//分两种情况吧,add和edit
					
					
    			},{
				   xtype:'checkboxfield',//
				   fieldLabel:'Lock',
				   checked:me.user.get('islock')=='0'?false:true,
				   name:'islock',
                   inputValue:'1',
				   uncheckedValue:'0',
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