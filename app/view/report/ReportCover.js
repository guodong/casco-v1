Ext.define('casco.view.report.ReportCover', {
	extend: 'Ext.grid.Panel',
	xtype: 'reportcover',
	viewModel: 'main',
	requires: [],      
	           
	initComponent: function() {
		var me = this;
//        me.selModel=me.selModel?me.selModel:'';	
		me.rcover = new casco.store.ReportCover();
		me.rcover.load({
			params:{
				report_id: me.report.get('id')  //其他参数？
			},
			synchronous: true,		
			callback: function(record){
				me.columns=me.columns_store;
				me.ds = new Ext.data.JsonStore({
							  data: record[0].get('data'),
							  fields:record[0].get('fieldsNames')
				});
				me.rcover.setData(me.ds.getData());
				Ext.Array.forEach(record[0].get('columModle'),function(item){	// 具体参见动态列的实现
					var column = Ext.create('Ext.grid.column.Column', {  
						text: item['header'],
						width:140,  
						// align:'center',
						dataIndex: item['dataIndex']  
					});  
					me.columns.push(column);
					// me.headerCt.insert(me.columns.length, column);
				});
			me.reconfigure(me.rcover,me.columns);
			me.customMenuItemsCache = [];
			me.headerCt.on('menucreate', function (cmp, menu) {
            menu.on('beforeshow', me.showHeaderMenu, me);
			}, me);
		    }// callback
		});  
		 
		  me.tbar = [{
			  text: 'Export',
			  glyph: 0xf080,
			  scope: this,
			  handler:function(){
				  window.open(API+'reportcover/export?v_id='+me.report.get('id')+'&parent_id='+me.parent_id);  //?URL
				  return;
			  }
			},
			'-',
			{text: '需求覆盖状态', xtype:'label',margin:'0 50'}
			];
		  
//         me.plugins={
//		        ptype: 'cellediting',
//		        clicksToEdit: 1,
//				autoCancel:false,
//				listeners: {
//		            edit: function(editor, e) {
//					// commit 不好
//		            // e.record.commit();
//					e.record.set(e.field,e.value);
//					me.getView().refresh(); 
//		            }
//		        }
//		},

//         me.self_op=function(the,newValue,oldValue){       
//		 var rows=me.getSelectionModel().getSelection();
//		 if(rows!=undefined){
//		 Ext.Array.each(rows,function(item){
//		 item.set(newValue);
//		 });
//		 // 这行很重要,由于自定义列的后遗症
//		  me.getView().refresh();
//		 }
//		}
		
		me.columns_store=[
			 {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:170,sortable:true,
			 customMenu:[
							{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Parent Requirement Tag',width:170,dataIndex:'Parent Requirement Tag'}]}],
							 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Parent Requirement Tag');}
							}//
					   }]// customMenu
					   },
			  {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:175,sortable:true,
//		    customMenu:[
//						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Parent Requirement Text',width:175,dataIndex:'Parent Requirement Text'}]}],
//						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Parent Requirement Text');}
//						}//
//				   }]// customMenu
				   },
			  {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:160,sortable:true,
//		   customMenu:[
//						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Child Requirement Tag',width:160,dataIndex:'Child Requirement Tag'}]}],
//						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Child Requirement Tag');}
//						}//
//				   }]// customMenu
				   },
			  {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:165,sortable:true,
//		   customMenu:[
//						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Child Requirement Text',width:165,dataIndex:'Child Requirement Text'}]}],
//						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Child Requirement Text');}
//						}//
//				  }]// customMenu
				  },
			  {text:'result',dataIndex:'result',header:'result',width:80,sortable:true,
		   customMenu:[
		               {text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'result',width:80,dataIndex:'result'}]}],
		            	listeners:{focus:function(g,eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'result');}}
		               }
		               ],			  
				  },
			  {text:'justification',dataIndex:'justification',header:'justification',width:100,sortable:true,renderer: function(value){
						  var arr = [];//JSON.parse一定要记得
						  Ext.Array.each(JSON.parse(value), function(v) {
						  arr.push(v.comment==undefined?v.tag:(v.tag+':'+v.comment)); });
						  return arr.join('<br/>');
			},
//		  customMenu:[
//						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'justification',width:95,dataIndex:'justification'}]}],
//						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'justification');}
//						}//
//				  }]// customMenu
				  },
			  {text:'Comment',dataIndex:'comment',header:'Comment',width:90,sortable:true}
			];
	
		

        me.listeners={

        beforeedit:function(editor, e, eOpts){
        // 编辑按钮事件监听,并不会fireEvent
		if(me.verification.get('status')==1){
        return true;
		}else{
		return false;
        }

		}}
		me.callParent(arguments);
		},

	showHeaderMenu: function (menu) {
        var me = this;
        me.removeCustomMenuItems(menu);
        me.addCustomMenuitems(menu);
    },

  
    removeCustomMenuItems: function (menu) {
        var me = this,
            menuItem;

        while (menuItem = me.customMenuItemsCache.pop()) {
            menu.remove(menuItem.getItemId(), false);
        }
    },

    addCustomMenuitems: function (menu) {
        var me = this,
            renderedItems;

        var menuItems = menu.activeHeader.customMenu || [];

        if (menuItems.length > 0) {

			 menu.removeAll();
            if (menu.activeHeader.renderedCustomMenuItems === undefined) {
                renderedItems = menu.add(menuItems);
                menu.activeHeader.renderedCustomMenuItems = renderedItems;
            } else {
                renderedItems = menu.activeHeader.renderedCustomMenuItems;
                menu.add(renderedItems);
            }
            Ext.each(renderedItems, function (renderedMenuItem) {
                me.customMenuItemsCache.push(renderedMenuItem);
            });
        }// if
    },
	/*
	 * afterRender:function(){ var me = this; me.callParent(arguments);
	 * me.textField= me.down('textfield[name = searchField]'); me.statusBar =
	 * me.down('statusbar[name = searchStatusBar]');
	 * me.view.on('cellkeydown',me.focusTextField,me); }
	 */
	
})
