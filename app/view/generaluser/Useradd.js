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
	 	
		me.projects = Ext.create('casco.store.Projects');  //作用？？？？？
		if(me.user!=null){
			me.projects.setData(me.user.get('projects'));
		}
		 
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
					value:'casco123',
					allowBlank: false,
					//hidden: me.user?true:false
				}, {
					anchor: '100%',
					fieldLabel: 'Role',
					name: 'Role',
					labelAlign: 'top',
					msgTarget: 'under',
					
					
					xtype: 'combobox',
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    store: store,
                    queryMode: 'local',
                    emptyText: 'Please select role',
                   
				},{
    				xtype: 'grid',
    				region: 'center',
    				fieldLabel: 'Select Documents',
   				    dockedItems: [{
    	    	        xtype: 'toolbar', 
    	    	        dock: 'bottom',
    	    	        items: [{
    	    	            glyph: 0xf067,
    	    	            text: 'Select project-documents',
    	    	            handler: function(){
    	    					var wd = Ext.create("casco.view.manage.UserDocuments", {
    	    						participants: this.participants
    	    					});
    	    					wd.show();
    	    				}
    	    	        }]
    	    	    }],
    			    columns: [
    			        { text: 'Projects',  dataIndex: 'name', flex: 1}
    			    ],
    			    store: me.projects,
				
					
    			}/*,{
					anchor: '100%',
					fieldLabel: 'Project',
					name: 'project',
					labelAlign: 'top',
					msgTarget: 'under',
					xtype: 'combobox',
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    store: me.pros_store,
                    queryMode: 'local',
                    emptyText: 'Please select thedocument',
                   
				}*/],
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