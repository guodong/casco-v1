Ext.define('casco.view.matrix.Tree', {
    extend: 'Ext.tree.Panel',
    requires: ['casco.view.matrix.Verification','casco.view.matirx.TreeCellEditing'],
    alias: 'widget.matrix_tree',
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	var me = this;
        	console.log(record);
			//console.log(me.getView().up().project);
        	if(!record.get('leaf')) return;
    		var tabs = Ext.getCmp('matrixpanel');
			var tab = tabs.child('#tab-verification-'+record.data.id);
//			var child_id = casco.model.Document;
			if(!tab){
			tabs.removeAll();
//			console.log(record);
			tab = tabs.add({id: 'tab-verification-'+record.data.id,
				xtype: 'matrix.verification',
				title: 'verification',
				closable: true,
				child_doc:record,
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
		var treeEditor=Ext.create('casco.view.matirx.TreeCellEditing',{clicksToEdit:1});
		me.treeEditor=treeEditor;
	    me.plugins=[treeEditor];
		var onAdd=onEdit=onDelete=Ext.emptyFn;
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