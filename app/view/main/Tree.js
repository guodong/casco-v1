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

    	},//itemdbclick
		itemcontextmenu:function(menutree,record,items,index,e){
            var me=this;
			e.preventDefault();
			e.stopEvent();

			if(record.data.leaf==true){
				var nodemenu=new Ext.menu.Menu({
					floating:true,
					items:[/*{
						text:'select all',
						handler:function(){
						    console.log(items,index,record.id);
							for(var i=0;i<record.data.children.length;i++){
								record.childNodes[i].set('checked',true);
							}
						}
					}, */{
						text:'delete',
						handler:function(){
					    Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){if(choice == 'yes'){
							  //刷新右边的图存在难点和bug
                        
					     var tabs=Ext.getCmp('workingpanel');
						 //愚蠢的做法
						 frames['draw'].src=frames['draw'].src;
						// console.log(tabs.items.items[0].getHtml());
						 
					     record.remove(items[index]);
					     var model = new casco.model.Document({id:record.id});
					     model.erase();
                         Ext.Msg.alert("delete successfully");
    	                 
    	                  }}, this);
						

				 
						 
						
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




			  }//root节点--else
        }//itemmenu
    },//lsiteners
    displayField: 'name',
    rootVisible : false,
    initComponent: function(){
    	var me = this;
	    this.store = Ext.create('casco.store.TreeDocuments', {
    		proxy: {
    			extraParams: {
    				project_id: me.project.get('id')
    			}
    		}
    	});
    	
    	this.callParent();
    }
})