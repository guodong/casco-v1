Ext.define('casco.view.matrix.Tree', {
    extend: 'Ext.tree.Panel',
    requires: ['casco.view.matrix.Verification','casco.view.matirx.TreeCellEditing'],
    alias: 'widget.matrix_tree',
    listeners: {
        itemdblclick: function(view, record, item, index, e, eOpts){
        	var me = this;
			//console.log(me.getView().up().project);
        	if(!record.get('leaf')) return;
    		var tabs = Ext.getCmp('matrixpanel');
			//console.log(record.get('id'));
			var tab = tabs.child('#tab-verification-'+record.data.id);
			if(!tab){
			tab = tabs.add({
				id: 'tab-verification-'+record.data.id,
				xtype: 'matrix.verification',
				title: 'verification',
				closable: true,
				child_id:record.data.id?record.data.id:'',
				project: this.getView().up().project
			});
			}
			tabs.setActiveTab(tab);
    	},//itemdbclick
		itemcontextmenu:'onCtxMenu'
			
		
		/*
		function(menutree,record,items,index,e){
            var me=this;
			e.preventDefault();
			e.stopEvent();

			if(record.data.leaf==true){
				var nodemenu=new Ext.menu.Menu({
					floating:true,
					items:[{
						text:'select all',
						handler:function(){
						    console.log(items,index,record.id);
							for(var i=0;i<record.data.children.length;i++){
								record.childNodes[i].set('checked',true);
							}
						}
					}, {
						text:'delete',
						handler:function(){
					    Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){if(choice == 'yes'){
							  //ˢ���ұߵ�ͼ�����ѵ��bug
                        
					   
						// frames['draw'].src=frames['draw'].src+'&t='+new Date().getTime();
						// console.log(tabs.items.items[0].getHtml());
						 
					     record.remove(items[index]);
					     var model = new casco.model.Document({id:record.id});
					     model.erase();
                         Ext.Msg.alert("delete successfully");
						 Ext.fly('draw').dom.contentWindow.location.reload();
    	                 
    	                  }}, this);
						

				          var tabs=Ext.getCmp('matrixpanel');
						  
						 
						 
						
						}//handler
					}]//items

				});//nodemenu

				nodemenu.showAt(e.getXY());

 
           }else{

             var nodemenu=new Ext.menu.Menu({
					floating:true,
					items:[{
						text:'Add Document',
						handler:function(){
					 
						  var win = Ext.create('casco.view.manage.Documentadd', {project:me.project,fid:record});
				          win.show();
						 
						}
					}]
			   
			 });

                nodemenu.showAt(e.getXY());




			  }//root�ڵ�--else
        }//itemmenu
		*/
    },//lsiteners
    displayField: 'name',
    rootVisible : false,
    initComponent: function(){
    	var me = this;
		var treeEditor=Ext.create('casco.view.matirx.TreeCellEditing',{clicksToEdit:1});
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