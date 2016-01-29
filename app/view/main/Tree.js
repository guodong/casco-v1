Ext.define('casco.view.main.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.tree',
    requires: ['casco.view.tc.Tc', 'casco.view.rs.Rs'],
    
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	var me = this;
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
    					id: 'tab-'+record.get('id'),
    					xtype: record.get('type'),
    					title: record.get('name'),
    					document: record,
    					closable: true,
    					project: me.project
    				});
    				tabs.setActiveTab(tab);
    			}
    		});
    		console.log(document);

    	},//itemdbclick
itemcontextmenu:'onCtxMenu'
    displayField: 'name',
    rootVisible : false,
    initComponent: function(){
    	var me = this;
	    this.store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: me.project?me.project.get('id'):''
    			}
    		}
    	});
    	
    	this.callParent();
    }
})