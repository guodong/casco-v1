Ext.define('casco.view.main.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.tree',

    requires: ['casco.view.tc.Tc'],
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
    					id: 'tab-'+record.get('id'),
    					xtype: record.get('type'),
    					title: record.get('name'),
    					document: record,
    					closable: true
    				});
    				tabs.setActiveTab(tab);
    			}
    		});

    	},//itemdbclick
		itemcontextmenu:function(menutree,record,items,index,e){

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
							
                         record.remove(items[index]);
					     var model = new casco.model.Document({id:record.id});
					     model.erase();

    	 
    	                  }}, this);
						//console.log(items,index,e,record);
						 Ext.Msg.alert("delete successfully");
						}
					}/*,{
						text:'reselect',
						handler:function(){
							for (var i=0;i<record.data.children;i++ )
							{record.childNodes[i].set('checked',false);
							}
                        }//handler

					}*/]

				});//nodemenu

				nodemenu.showAt(e.getXY());

 





            }//if
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