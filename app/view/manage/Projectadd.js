Ext.define('casco.view.manage.Projectadd', {
    extend: 'Ext.window.Window',
    xtype: 'widget.projectadd',
    requires: [
               'casco.view.manage.Vatstr',
               'casco.view.manage.Participants'
      
    ],
    resizable: true,
    maximizable: true,
    modal: true,
    title: 'Create Project',
    width: 300,
    controller: 'manage',
    initComponent: function(){
    	var me = this;
    	me.participants = Ext.create('casco.store.Users');
    	me.vatstrs = Ext.create('casco.store.Vatstrs');
    	if(me.project){console.log(me.project.get('participants'));
    		me.participants.setData(me.project.get('participants'));
    		me.vatstrs.setData(me.project.get('vatstrs'));
    	}
    	Ext.apply(me, {
    		items: [{
    	    	xtype: 'form',
    	    	bodyPadding: '10',
    	    	reference: 'project_create_form',
    	    	items: [{
    	            anchor: '100%',
    	            fieldLabel: 'Name',
    	            name: 'name',
    	            labelAlign: 'top',
    	            msgTarget: 'under',
    	            xtype: 'textfield',
    	            allowBlank: false
    	        },{
    	            anchor: '100%',
    	            fieldLabel: 'Description',
    	            name: 'description',
    	            labelAlign: 'top',
    	            msgTarget: 'under',
    	            xtype: 'textarea'
    	        }, {
    				xtype: 'grid',//貌似后台发送数据是通过store的名字来命名的哦
    				region: 'center',
    				maxHeight: 200,
    				fieldLabel: 'Participants',
    				dockedItems: [{
    	    	        xtype: 'toolbar', 
    	    	        dock: 'bottom',
    	    	        items: [{
    	    	            glyph: 0xf067,
    	    	            text: 'Edit Participants',
    	    	            handler: function(){
    	    					var wd = Ext.create("casco.view.manage.Participants", {
    	    						participants: me.participants,
									project:me.project
    	    					});
    	    					wd.show();
    	    				}
    	    	        }]
    	    	    }],
    			    columns: [
    			        { text: 'Participants',  dataIndex: 'realname', flex: 1}
    			    ],
    			    store: me.participants
    			}, {
    				maxHeight: 200,
    				xtype : 'vatstr',
    				store: me.vatstrs
    			}],
    			buttons: ['->', {
					text: 'Save',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createProject'
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
    doHide: function(){
        this.hide();
    }
});