Ext.define('casco.view.report.Tree', {
    extend: 'Ext.tree.Panel',
    requires: ['casco.view.report.Center','casco.view.report.TreeCellEditing'],
    alias: 'widget.report_tree',
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	var me = this;
			//console.log(me.getView().up().project);
        	if(!record.get('leaf')) return;
    		var tabs = Ext.getCmp('reportpanel');
			var tab = tabs.child('#tab-center-'+record.data.id);
//			var child_id = casco.model.Document;
			if(!tab){
			tabs.removeAll();
			tab = tabs.add({id: 'tab-center-'+record.data.id,
				xtype: 'report.center',
				title: 'center',
				closable: true,
				child_doc:record,
				project: this.getView().up().project
			});
			}else{tab.store.reload();}
			tabs.setActiveTab(tab);
    	}//itemdbclick
		//itemcontextmenu:'onCtxMenu'
    },//lsiteners
    displayField: 'name',
    rootVisible : false,
    initComponent: function(){
    	var me = this;
		var treeEditor=Ext.create('casco.view.report.TreeCellEditing',{clicksToEdit:1});
		me.treeEditor=treeEditor;
	    me.plugins=[treeEditor];
		var onAdd=onEdit=onDelete=Ext.emptyFn;
	    this.store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: me.project?me.project.get('id'):'',
    			}
    		},
			 filters: [
        {//不显示rs文档
            property: 'type',
            value   : /^((?!rs).)*$/
        }
				 ]
    	});
    	this.callParent();
    }
})