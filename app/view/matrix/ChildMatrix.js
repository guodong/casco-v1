Ext.define('casco.view.matrix.ChildMatrix', {
	extend: 'Ext.grid.Panel',
	mixins:['Ext.plugin.Abstract'],
	xtype: 'childmatrix',
	viewModel: 'main',
	requires: ['casco.view.matrix.MatrixController'
	           ],
	searchValue:null,
	matches:[],
	controller:'matrix',
	// currentIndex:null,
	searchRegExp:null,
	// caseSensitive:false,
	regExpMode:false,
	// matched string css class
	matchCls:'x-livesearch-match',
	defaultStatusText:'Nothing Found',
    columnsText:'显示的列',
	selModel:{
    selType: "checkboxmodel" , 
    checkOnly: true
	}, 
	// forceFit:true,
// columnLines:true,
		
	initComponent: function(component) {
		var me = this;
		me.array=[];
		me.stack=[];
		me.matrix = new casco.store.ChildMatrix();
		me.matrix.on('load',function(g, records){
		// var cs = me.getColumns();
		// var st=me.getStore().getFields('Traceability');

			
		});
		me.matrix.load({
			params:{
				id: me.verification.get('id')
			},
			synchronous: true,
			callback: function(record){		
		    me.ds = new Ext.data.JsonStore({
							  data: record[0].get('data'),
							  fields:record[0].get('fieldsNames')
			});
		    me.store.setData(me.ds.getData());me.matrix.setData(me.ds.getData());
			// console.log(me.ds.getData());
			me.columns=me.columns_store;
			// innerGrid的store都要来一发
			// Ext.getCmp('inner_trac').store=me.matrix.getAt(0).get('Traceability');
			Ext.Array.forEach(record[0].get('columModle'),function(item){
		    var column = Ext.create('Ext.grid.column.Column', {  
				text: item['header']+' (P)//(C)',  
				width:100,  
				style: "text-align:center;",  
				align:'center',  
				dataIndex: item['dataIndex']  
			});  
            me.columns.push(column);
			// me.headerCt.insert(me.columns.length, column);
			});
			me.reconfigure(me.store,me.columns);
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
			  me.getView().refresh(); 
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
			  me.getView().refresh(); 
              Ext.Msg.alert('Failed','Save failed!');
			 },
			 success: function(record, operation) {
			 me.getView().refresh(); 
			 Ext.Msg.alert('Success', 'Saved successfully.');
			 
			 },
			 });
			
			}
		},'-',{text: 'Export',
			glyph: 0xf080,
			scope: this,
			handler:function(){
		    	window.open(API+'childmatrix/export?v_id='+me.verification.get('id'));
            	return;
		}
		}];

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
		
		me.plugins={
		        ptype: 'cellediting',
		        clicksToEdit: 1,
				autoCancel:false,
				listeners: {
		            edit: function(editor, e) {
					e.record.set(e.field,e.value);
					me.getView().refresh(); 
		            }
		        }
		},

       	me.columns_store=[
			  {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:160,sortable:true,
			  customMenu:[
					{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'Child Requirement Tag',dataIndex:'Child Requirement Tag'}]}],
					 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Child Requirement Tag');}
					}//
			   }]//customMenu
			   },
			  {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:165,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:170,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:175,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Traceability',dataIndex:'Traceability',header:'Traceability',width:100,sortable:true,
				  customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'Traceability', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'Traceability', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'Traceability', inputValue: 'NA'}],
					listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}],// menu
			  },{text:'筛选',menu:[{xtype:'innergrid',columns:[{dataIndex:'Traceability',text:'Traceability'}]}],
					listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'Traceability');}}
					//],// menu
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
			  {text:'No compliance description',dataIndex:'No compliance description',header:'No compliance description',width:190,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Already described in completeness',dataIndex:'Already described in completeness',header:'Already described in completeness',width:240,sortable:true,
				 customMenu:[{text:'YES/NO',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'YES', name: 'Already described in completeness', inputValue: 'YES'},   
                    { boxLabel: 'NO', name: 'Already described in completeness', inputValue:'NO'}],
					 listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}]// menu
			  },{text:'筛选',menu:{items:[{xtype:'innergrid',columns:[{text:'Already described in completeness',dataIndex:'Already described in completeness',width:20}]}],
					 listeners:{afterrender:function(g, eOpts){g.down('innergrid').getStore().setData(me.store.getData());g.down('innergrid').fireEvent('datachange',me.store.getData(),g.down('innergrid').getColumns()[0].dataIndex);}
				}}//menu
			  }]// customMenu
			  ,editor: {
			        xtype: 'combo',
			        triggerAction:'all',
					displayField: 'name',
					valueField: 'value',
					store:Ext.create('Ext.data.Store', {
					fields: ['name', 'value'],
					data : [{"name":"YES", "value":"YES"},{"name":"NO", "value":"NO"}]}),
			    }
			  },
			  {text:'Verif. Assessment',dataIndex:'Verif. Assessment',header:'Verif. Assessment',width:135,sortable:true,
				  customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'Verif. Assessment', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'Verif. Assessment', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'Verif. Assessment', inputValue: 'NA'}],
					listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}],// menu
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
			  {text:'Verif. Assesst',dataIndex:'Verif. Assesst',header:'Verif. Assesst',width:110,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Verif. opinion justification',dataIndex:'Verif. opinion justification',header:'Verif. opinion justification',width:185,sortable:true,editor:{xtype:'textfield'}},
			  {text:'CR',dataIndex:'CR',header:'CR',width:50,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Comment',dataIndex:'Comment',header:'Comment',width:90,sortable:true,editor:{xtype:'textfield'}}
				];



		me.bbar = ['-',{
			summaryType: 'count',
	        summaryRenderer: function(value, summaryData, dataIndex) {
	            return Ext.String.format('{0} item{1}', value, value !== 1 ? 's' : '');
	        }
		}]
		
		me.bbar = Ext.create('casco.ux.StatusBar',{
			defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		});
    
		me.listeners = {
		beforeedit:function(editor, e, eOpts){
		return me.verification.get('status')==1?true:false;
        },
		statesave:function(g){
		// Ext.Msg.alert('hehe');
		g.matrix.each(function(record){   
		console.log(record);
		},this);
		},
		afterrender:function(g){	  
		}
		}
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
		//console.log(menu.items);
		//console.log(menu.items.items);
    },
	/*
	 * afterRender:function(){
	 * 
	 * var me = this; var menu = me.headerCt.getMenu(); console.log(menu);
	 * 
	 * menu.add([{ text: 'Custom Item', handler: function() { var
	 * columnDataIndex = menu.activeHeader.dataIndex; alert('custom item for
	 * column "'+columnDataIndex+'" was pressed'); } }]);
	 *  },
	 */
	
    features: [{
    	ftype: 'summary',
    	dock: 'top'
    }],	
})
