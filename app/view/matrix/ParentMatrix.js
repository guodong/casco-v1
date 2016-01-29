// 160121 Q T
Ext.define('casco.view.matrix.ParentMatrix', {
	extend: 'Ext.grid.Panel',
	xtype: 'parentmatrix',
	viewModel: 'main',
	requires: [],      
	           
    // search参数
	searchValue:null,
	matches:[],
	// currentIndex:null,
	searchRegExp:null,
	// caseSensitive:false,
	regExpMode:false,
	// matched string css class
	matchCls:'x-livesearch-match',
	defaultStatusText:'Nothing Found',
	
	multiSelect : true,
	selModel:{
// 		mode:'MULTI',
		selType: "checkboxmodel" ,    // 5.1.0之后就不赞成使用这种方式了。。。
		checkOnly: false
	},
// columnLines:true,
	
	initComponent: function() {
		var me = this;
// me.selType=me.verification.get('status')==1?'checkboxmodel':'';
		me.column_store=Ext.create('Ext.data.Store', {
         fields: ['name', 'value'],
         data : [
                 {"name":"NA", "value":"NA"},
                 {"name":"OK", "value":"OK"},
                 {"name":"空白", "value":"空白"}
           ]
		});
		me.stack=[];
        me.selModel=me.selModel?me.selModel:'';		// 赋值作用？？？
		me.matrix = new casco.store.ParentMatrix();
		me.matrix.load({
			params:{
				id: me.verification.get('id'),
				parent_v_id:me.parent_v_id
			},
			synchronous: true,		// 同步作用 ？？？
			callback: function(record){
				me.columns=me.columns_store;
				me.ds = new Ext.data.JsonStore({
							  data: record[0].get('data'),
							  fields:record[0].get('fieldsNames')
				});
				me.matrix.setData(me.ds.getData());
				Ext.Array.forEach(record[0].get('columModle'),function(item){	// 具体参见动态列的实现
					var column = Ext.create('Ext.grid.column.Column', {  
						text: item['header']+' (P)//(C)',
						width:140,  
						// align:'center',
						dataIndex: item['dataIndex']  
					});  
					me.columns.push(column);
					// me.headerCt.insert(me.columns.length, column);
				});
				console.log(me.columns);
			me.reconfigure(me.matrix,me.columns);
			me.customMenuItemsCache = [];
			me.headerCt.on('menucreate', function (cmp, menu) {
            menu.on('beforeshow', me.showHeaderMenu, me);
			}, me);

			
            
		    }// callback
		});  
		 
		  me.tbar = [{
			text: 'Save',
			glyph: 0xf080,
			scope: this,
			handler:function(){  
             if(me.verification.get('status')==0){Ext.Msg.alert('','已提交，不可编辑');return;}
			 var data=[];
			// 血的教训，早知道就用这了... me.matrix.sync();
			 var rows=me.getSelectionModel().getSelection();
			 if(rows==null||rows==undefined||rows==[]||rows=='')
			 {me.matrix.sync({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.getView().refresh(); // 这一行重要哇我晕
              Ext.Msg.alert('Failed','Save failed!');
			 },
			 success: function(record, operation) {
			 me.getView().refresh();Ext.Msg.alert('Success', 'Saved successfully.');
			 }
			 });return;}
			 Ext.Array.each(rows,function(item){
			 item.dirty=false;
			 item.commit(); 
			 data.push(item.getData());
			 });// each
			 var model=Ext.create('casco.model.Verification',{id:me.verification.get('id')});
			 model.set('data',data);
			 model.save({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.getView().refresh(); // 这一行重要哇我晕
              Ext.Msg.alert('Failed','Save failed!');
			 },
			 success: function(record, operation) {
			 me.getView().refresh(); // 这一行重要哇我晕
			 Ext.Msg.alert('Success', 'Saved successfully.');
			 
			 },
			 });
			
			}
		},'-',{text: 'Export',
			glyph: 0xf080,
			scope: this,
			handler:function(){
		    	window.open(API+'parentmatrix/export?v_id='+me.verification.get('id')+'&parent_v_id='+me.parent_v_id);
            	return;
			}
			},'-',
		{text: me.title, xtype:'label',margin:'0 50'}];

         me.plugins={
		        ptype: 'cellediting',
		        clicksToEdit: 1,
				autoCancel:false,
				listeners: {
		            edit: function(editor, e) {
					// commit 不好
		            // e.record.commit();
					e.record.set(e.field,e.value);
					me.getView().refresh(); 
		            }
		        }
		},

         me.self_op=function(the,newValue,oldValue){       
		 var rows=me.getSelectionModel().getSelection();
		 if(rows!=undefined){
		 Ext.Array.each(rows,function(item){
		 item.set(newValue);
		 });
		 // 这行很重要,由于自定义列的后遗症
		  me.getView().refresh();
		 }
		}
		
		me.columns_store=[
			 {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:170,sortable:true,
			 customMenu:[
							{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Parent Requirement Tag',width:170,dataIndex:'Parent Requirement Tag'}]}],
							 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Parent Requirement Tag');}
							}//
					   }]// customMenu
					   },
			  {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:175,sortable:true,
		    customMenu:[
						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Parent Requirement Text',width:175,dataIndex:'Parent Requirement Text'}]}],
						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Parent Requirement Text');}
						}//
				   }]// customMenu
				   },
			  {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:160,sortable:true,
		   customMenu:[
						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Child Requirement Tag',width:160,dataIndex:'Child Requirement Tag'}]}],
						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Child Requirement Tag');}
						}//
				   }]// customMenu
				   },
			  {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:165,sortable:true,
		   customMenu:[
						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Child Requirement Text',width:165,dataIndex:'Child Requirement Text'}]}],
						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Child Requirement Text');}
						}//
				  }]// customMenu
				  },
			  {text:'justification',dataIndex:'justification',header:'justification',width:95,sortable:true,editor:{xtype:'textfield'},
		  customMenu:[
						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'justification',width:95,dataIndex:'justification'}]}],
						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'justification');}
						}//
				  }]// customMenu
				  },
			  {text:'Completeness',dataIndex:'Completeness',header:'Completeness',width:110,sortable:true,
				 customMenu:[{text:'批量编辑',menu:[{xtype:'radiogroup',columns:1,vertical:true,
					 items: [  
                    { boxLabel: 'OK', name: 'Completeness', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'Completeness', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'Completeness', inputValue: 'NA'}],
					listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}]//menu
				  },{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Completeness',width:110,dataIndex:'Completeness'}] }],
						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Completeness');}}
			 

				  }]
			  ,editor: {
			        xtype: 'combo',
			        triggerAction:'all',
					displayField: 'name',
					valueField: 'value',
					store:Ext.create('Ext.data.Store', {
					fields: ['name', 'value'],
					data : [{"name":"NA", "value":"NA"},{"name":"OK", "value":"OK"},{"name":"NOK", "value":"NOK"}]}),
			    }
			  },
			  {text:'No Compliance Description',dataIndex:'No Compliance Description',header:'No Compliance Description',width:190,sortable:true,editor:{xtype:'textfield'},
			  customMenu:[
							{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'No Compliance Description',width:165,dataIndex:'No Compliance Description'}]}],
							 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'No Compliance Description');}
							}//
					  }]// customMenu
					  },
			  {text:'Defect Type',dataIndex:'Defect Type',header:'Defect Type',width:100,sortable:true,
				  customMenu:[{text:'批量编辑',menu:[{xtype:'radiogroup',columns:1,vertical:true,
                    items: [ 
                    { boxLabel: 'Not complete', name: 'Defect Type', inputValue: 'Not complete'},
				    { boxLabel: 'Wrong coverage', name: 'Defect Type', inputValue: 'Wrong coverage'},   
                    { boxLabel: 'logic or description mistake in Child requirement', name: 'Defect Type', inputValue:'logic or description mistake in Child requirement'},
				    { boxLabel: 'Other', name: 'Defect Type', inputValue: 'Other'}],
				    listeners:{change:function(the,newValue,oldValue){me.self_op(the,newValue,oldValue);}}
					}]// menu
			  },{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Defect Type',width:100,dataIndex:'Defect Type'}]}],
					 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Defect Type');}}
			  	}]// customMenu
			  ,editor: {
			        xtype: 'combo',
			        triggerAction:'all',
					displayField: 'name',
					valueField: 'value',
					store:Ext.create('Ext.data.Store', {
					fields: ['name', 'value'],
					data : [{"name":"Not complete", "value":"Not complete"},{"name":"Wrong coverage", "value":"Wrong coverage"},
					{"name":"logic or description mistake in Child requirement", "value":"logic or description mistake in Child requirement"},
					{"name":"Other", "value":"Other"}]}),
			    }
			  },
			  {text:'Verif. Assesst',dataIndex:'Verif_Assesst',width:110,sortable:true,
			   customMenu:[{text:'批量编辑',menu:[{xtype:'radiogroup',columns:1,vertical:true,items: [  
                    { boxLabel: 'OK', name: 'Verif_Assesst', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name:'Verif_Assesst', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'Verif_Assesst', inputValue: 'NA'}],
					listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}],// menu
			  },{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Verif. Assesst',width:100,dataIndex:'Verif_Assesst'}]}],
					 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Verif_Assesst');}}
			  	}]// customMenu
			  ,editor: {
			        xtype: 'combo',
			        triggerAction:'all',
					displayField: 'name',
					valueField: 'value',
					store:Ext.create('Ext.data.Store', {
					fields: ['name', 'value'],
					data : [{"name":"NA", "value":"NA"},{"name":"OK", "value":"OK"},{"name":"NOK", "value":"NOK"}]}),
			    }
			  },
			  {text:'Verif Assest justifiaction',dataIndex:'Verif Assest justifiaction',header:'Verif Assest justifiaction',width:175,sortable:true,editor:{xtype:'textfield'},
			  customMenu:[
							{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Verif Assest justifiaction',width:165,dataIndex:'Verif Assest justifiaction'}]}],
							 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Verif Assest justifiaction');}
							}//
					  }]// customMenu
					  },
			  {text:'CR',dataIndex:'CR',header:'CR',width:50,sortable:true,editor:{xtype:'textfield'},
			  customMenu:[
							{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'CR',width:165,dataIndex:'CR'}]}],
							 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'CR');}
							}//
					  }]// customMenu
					  },
			  {text:'Comment',dataIndex:'Comment',header:'Comment',width:90,sortable:true,editor:{xtype:'textfield'},
			  customMenu:[
							{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Comment',width:90,dataIndex:'Comment'}]}],
							 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Comment');}
							}//listeners
					  }]// customMenu
			  }
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
	/*afterRender:function(){
		var me = this;
		me.callParent(arguments);
		me.textField= me.down('textfield[name = searchField]');
		me.statusBar = me.down('statusbar[name = searchStatusBar]');
		me.view.on('cellkeydown',me.focusTextField,me);
	}*/
	
})
