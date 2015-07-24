Ext.define('casco.view.main.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.tree',

    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	if(!record.get('leaf')) return;
    		var tabs = Ext.getCmp('workpanel');
    		var tab = tabs.child('#tab-' + record.get('id'));
    		if(tab){
    			tabs.remove(tab);
    		}
    		var document = casco.model.Document;
    		casco.model.Document.load(record.get('id'), {
    			success: function(record){
    				tab = tabs.add({
    					itemId: 'tab-' + record.get('id'),
    					id: 'tab-'+record.get('id'),
    					xtype: record.get('type'),
    					title: record.get('name'),
    					document: record,
    					closable: true
    				});
    				tabs.setActiveTab(tab);
    			}
    		});

    	}
    },
    displayField: 'name',

    rootVisible : false,
    initComponent: function(){
    	var me = this;
    	this.store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: JSON.parse(localStorage.project).id
    			}
    		}
    	});
    	if(this.editable){
    		this.dockedItems = [{
    	        xtype: 'toolbar',
    	        dock: 'bottom',
    	        style: {
    	            background: '#eee'
    	        },
    	        items: [{
    	            text: 'Document',
    	            glyph: 0xf067,
    	            handler: function() {
    	                var win = Ext.create('widget.document.create', {project: me.project});
    	                win.show();
    	            }
    	        }, {
    	            text: 'Folder',
    	            glyph: 0xf067,
    	            handler: function() {
    	                var win = Ext.create('widget.document.foldercreate', {project: me.project});
    	                win.show();
    	            }
    	        }]
    	    }]
    	}
    	this.callParent();
    }
})