Ext.define('casco.view.vat.Tree', {
    extend: 'Ext.tree.Panel',
    requires: [],
    alias: 'widget.vat_tree',
    
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	var me = this;
			//console.log(me.getView().up().project);
        	if(!record.get('leaf')) return;
    		var tabs = Ext.getCmp('vatpanel');
			var tab = tabs.child('#tab-vat-'+ record.data.id); //doc_id
//			var child_id = casco.model.Document;
			if(!tab){
			tabs.removeAll();
			tab = tabs.add({
				id: 'tab-vat-'+record.data.id,
				xtype: 'vat.view',
				title: 'Vat View',
				closable: true,
				document: record,
				project: this.getView().up().project
			});
			}else{tab.store.reload();}
			tabs.setActiveTab(tab);
    	},//itemdbclick
		itemcontextmenu:'onCtxMenu'
    },//lsiteners
    displayField: 'name',
    rootVisible : false,
    initComponent: function(){
    	var me = this;
	    me.store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: me.project?me.project.get('id'):'',
    			}
    		},
			 filters: [{ //不显示rs文档
            property: 'type',
            value   : /^((?!rs).)*$/
        }]
    	});
    	this.callParent();
    }
})