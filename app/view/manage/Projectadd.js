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
    title: 'Project Info',
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
    	            fieldLabel: '名称',
    	            name: 'name',
    	            labelAlign: 'top',
    	            msgTarget: 'under',
    	            xtype: 'textfield',
    	            allowBlank: false
    	        },{
    	            anchor: '100%',
    	            fieldLabel: '描述',
    	            name: 'description',
    	            labelAlign: 'top',
    	            msgTarget: 'under',
    	            grow: true,	//automatically grow and shrink to its content
    	            xtype: 'textarea'
    	        }, {
    				xtype: 'grid',//貌似后台发送数据是通过store的名字来命名的哦
    				region: 'center',
    				fieldLabel: '成员',
    				maxHeight: 200,
    				dockedItems: [{
    	    	        xtype: 'toolbar', 
    	    	        dock: 'bottom',
    	    	        items: ['->',{
    	    	            glyph: 0xf067,
    	    	            text: '编辑成员',
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
    			        { text: '成员',  dataIndex: 'realname', flex: 1}
    			    ],
    			    store: me.participants
    			}, {
    				xtype : 'vatstr',
    				maxHeight: 200,
    				store: me.vatstrs
    			}],
    			buttons: ['->', {
					text: '保存',
					formBind: true,
					glyph: 0xf0c7,
					listeners: {
						click: 'createProject'
					}
				}, {
					text: '取消',
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

