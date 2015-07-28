Ext.define('casco.view.testing.BuildCreate', {
    extend: 'Ext.window.Window',

    alias: 'widget.testing.buildcreate',
    
    modal: true,
    title: 'Create Build Version',
    width: 300,
    
    initComponent: function(){
    	var me = this;
    	me.items = [{
	    	xtype: 'form',
	    	reference: 'build_create_form',
	    	bodyPadding: '10',
	    	items: [{
	            fieldLabel: 'Version',
	            msgTarget: 'under',
	            name: 'name',
	            xtype: 'textfield'
	        },{
	            name: 'project_id',
	            value: localStorage.project_id,
	            xtype: 'hiddenfield'
	        }]
	    }];
    	Ext.apply(me, {
    		dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                style: {background: '#eee'},
                items: ['->',
                    {
                        text: 'Save',
                        glyph: 0xf0c7,
                        listeners: {
                            click: 'createFolder'
                        }
                    },{
                        text: 'Cancel',
                        glyph: 0xf112,
                        scope: me,
                        handler : this.doHide
                    }
                ]
            }],
    		
    	});
    	me.callParent(arguments);
    },
    doHide: function(){
        this.hide();
    },
});