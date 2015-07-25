Ext.define('Folder', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'number'},
        {name: 'name',  type: 'string'},
        {name: 'fid',  type: 'number'},
    ]
});
Ext.define('casco.view.document.FolderCreate', {
    extend: 'Ext.window.Window',

    alias: 'widget.document.foldercreate',
    uses: [
           'casco.view.document.DocumentController'
    ],
    controller: 'document',
    
    modal: true,
    title: 'Create Folder',
    width: 300,
    
    initComponent: function(){
    	var me = this;
    	me.items = [{
	    	xtype: 'form',
	    	reference: 'documentfolder_create_form',
	    	bodyPadding: '10',
	    	items: [{
	            fieldLabel: 'Name',
	            msgTarget: 'under',
	            name: 'name',
	            xtype: 'textfield'
	        },{
	            name: 'type',
	            value: 'folder',
	            xtype: 'hiddenfield'
	        },{
	            name: 'project_id',
	            value: me.project.id,
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