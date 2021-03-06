Ext.define('casco.view.matrix.InnerParentGrid', {
	extend: 'Ext.grid.Panel',
	xtype: 'innerparentgrid',
//	viewModel: 'main',
	requires: [],      
	           
	multiSelect : true,
	selModel:{
// mode:'MULTI',
//		selType: "checkboxmodel" ,    // 5.1.0之后就不赞成使用这种方式了。。。
		type: 'checkboxmodel',
		checkOnly: false
	},
// columnLines:true,
	
	initComponent: function() {
		var me = this;
		me.stack=[];
//		me.columns = me.columns_store; //undefined why?
		me.store=Ext.create('casco.store.ParentMatrix');
		
        me.child_type=me.verification.get('child_version').document.type;
		me.matrix = new casco.store.ParentMatrix();
		me.matrix.load({
			params:{
				id: me.verification.get('id'),
				parent_v_id:me.parent_v_id
			}
		});
		me.matrix.on('load',function(){
			var prec = me.matrix.getData().items;
//			console.dir(prec[0].get('data'));
			me.columns = me.columns_store;
			Ext.Array.forEach(prec[0].get('columModle'),function(item){	// 具体参见动态列的实现
				var column = Ext.create('Ext.grid.column.Column', {  
					text: item['header']+' (P)//(C)',
					width:140,  
					dataIndex: item['dataIndex']  
				});  
				me.columns.push(column);
			});
//			console.dir(me.columns);
			me.matrix.setData(prec[0].get('data'));
//			console.dir(me.getView().getHeaderCt());
			me.reconfigure(me.matrix,me.columns);
			me.store.setData(me.matrix.getData());
//			me.store.loadData(matrix.getData());
			me.customMenuItemsCache = [];
			me.headerCt.on('menucreate', function (cmp, menu) {
            menu.on('beforeshow', me.showHeaderMenu, me);
			}, me);
		});
		
		 
		 me.plugins=[{
		        ptype: 'cellediting',
		        clicksToEdit: 2,
				listeners: {
		            edit: function(editor, e) {
					me.getView().refreshNode(e.record); 
		            } 
		        }
				
		}],
		  me.tbar = [{
			text: '保存',
			glyph: 0xf080,
			scope: this,
			handler:function(){
				var out = [];
				if(me.verification.get('status')==0){Ext.Msg.alert('','已提交，不可编辑');return;}
				var updates = me.matrix.getUpdatedRecords();
//				console.log(updates);
				updates.forEach(function(record){
					out.push(record.getData());
				})
//				console.log(out);
				Ext.Ajax.request({
					url: API + '/parentmatrix/updateall',
					method: 'post',
					jsonData: {results: out},
					success: function(){
//						me.matrix.reload(); //reconfigure问题怎么解决啊
						Ext.Msg.alert('成功', '保存成功。')
					}
				});
				
//				console.log(me.up('parentmatrix').getComponent('parentgrid'));
				var par = me.up('parentmatrix');
				par.remove('parentgrid');
				par.add([{
					xtype:'innerparentgrid',
					itemId: 'parentgrid',
					verification: par.verification,
					parent_v_id:par.parent_v_id,
					scorllable: true
				}]);
			}
		},'-',
		{text: '导出',
			glyph: 0xf080,
			scope: this,
			handler:function(){
		    	window.open(API+'parentmatrix/export?v_id='+me.verification.get('id')+'&parent_v_id='+me.parent_v_id);
            	return;
			}
		},'->',{
	          xtype: 'textfield',
//	          fieldLabel: '搜索',    
	          labelWidth: 50,
	          name: 'searchField',
	          emptyText: '搜索',
	          //hideLabel: true,
	          width: 200,
	          listeners: {
	              change: {
	                  fn: me.onTextFieldChange,
	                  scope: this,
	                  buffer: 500
	              }
	          }
	     }, {
	         xtype: 'button',
	         text: '&lt;',
	         tooltip: '往前查找',
	         handler: me.onPreviousClick,
	         scope: me
	     },{
	         xtype: 'button',
	         text: '&gt;',
	         tooltip: '往后查找',
	         handler: me.onNextClick,
	         scope: me
	     },{
	    	   xtype: 'checkbox',
	    	   hideLabel: true,
	    	   margin: '0 12px 0 0',
	    	   handler: me.caseSensitiveToggle,
	    	   scope: me
	       },'  区分大小写'];
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
		
		me.bbar = [{
			 xtype: 'statusbar',
			 defaultText:me.defaultStatusText,
			name:'searchStatusBar'
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
			  {text:'justification',dataIndex:'justification',header:'justification',width:100,sortable:true,renderer:function(value){
				  if("tc"==me.verification.get('child_version').document.type){
					  var arr=[];value=value||null;
						Ext.Array.each(JSON.parse(value), function(v) {
							arr.push(v.tag||'');
						});
						return arr.join(',');
				  }else{
					  return value;
				  }
				
			  },//render
		  customMenu:[
						{text:'筛选',menu:[{xtype:'innergrid',columns:[{text:'justification',width:95,dataIndex:'justification'}]}],
						 listeners:{focus:function(g, eOpts){g.down('innergrid').fireEvent('datachange',me.store.getData(),'justification');}
						}//
				  }]// customMen
			  ,editor: {
				  xtype: 'textfield',
				  disabled: ("tc"==me.child_type)?true:false
			  }
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
					}]// menu
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
					{"name":"logic or description mistake in Child requirement", "value":"logic or description mistake"},
					{"name":"Other", "value":"Other"}]}),
//					disabled: ,
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
//					listeners: {
//						select: function(c,re){
//							var grid = c.up().grid;
//							console.log(grid);
//							var record = grid.getSelectionModel().getSelection()[0];
//						    var rowIndex = grid.store.indexOf(record);
//						    var gridColumns = grid.headerCt.getGridColumns();
//							for (var i = 0; i < gridColumns.length; i++) {
//								if (gridColumns[i].dataIndex == this.dataIndex) {
//									var colIndex=i;break; 
//								}   
//							}
//							
////							var defect = grid.getCellSelectionModel();
//							var defect = c.up().getView().getCellSelector('Defect Type');
//							console.log(defect);
//							var editor = grid.editingPlugin;
//							editor.startEditByPosition({
//								row: rowIndex,
//								column: colIndex,
//							  });
//							
//							console.log(colIndex); 
//						    console.log(grid);
//							console.log(c.up().grid.columns); //理论上，应该遍历查找colIndex,但表格固定就可以不用
//						    
//						},
//					},
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
							}// listeners
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
		
	/*
	 * Batch editing Module realize
	 */	
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
    
    /*
     * Live Search Module Cofigures
     */	
    	bufferedRenderer: false, //否则 fly...down 会报错
        searchValue: null, //search value initialization
        indexes: [], //The row indexes where matching strings are found. (used by previous and next buttons)
        searchRegExp: null, //The generated regular expression used for searching.
        caseSensitive: false, //Case sensitive mode.
        regExpMode: false, //Regular expression mode.
        tagsRe:/<[^>]*>/gm,  //detects html tag gm 参数
    	tagsProtect:'\x0f',  //DEL ASCII code
        matchCls: 'x-livesearch-match', //@cfg {String} matchCls  The matched string css classe.
        defaultStatusText: '无匹配结果',	 
    	
    	 afterRender: function() {
    	        var me = this;
    	        me.callParent(arguments);
    	        me.textField = me.down('textfield[name=searchField]');
    	        me.statusBar = me.down('statusbar[name=searchStatusBar]');
    	    },
    	
    	focusTextField: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            if (e.getKey() === e.S) {
                e.preventDefault();
                this.textField.focus();
            }
        },
    	
    	getSearchValue: function() {
            var me = this,
                value = me.textField.getValue();
            if (value === '') {
                return null;
            }
            if (!me.regExpMode) {
                value = Ext.String.escapeRegex(value);
            } else {
                try {
                    new RegExp(value);
                } catch (error) {
                    me.statusBar.setStatus({
                        text: error.message,
                        iconCls: 'x-status-error'
                    });
                    return null;
                }
                // this is stupid
                if (value === '^' || value === '$') {
                    return null;
                }
            }
            return value;
        },
        
        onTextFieldChange: function() {
            var me = this,
                count = 0,
                view = me.view,
                cellSelector = view.cellSelector,
                innerSelector = view.innerSelector;
            view.refresh();
            // reset the statusbar
            me.statusBar.setStatus({
                text: me.defaultStatusText,
                iconCls: ''
            });
            me.searchValue = me.getSearchValue();
            me.indexes = [];
            me.currentIndex = null;
            if (me.searchValue !== null) {
                me.searchRegExp = new RegExp(me.getSearchValue(), 'g' + (me.caseSensitive ? '' : 'i'));
                me.store.each(function(record, idx) {
                    var td = Ext.fly(view.getNode(idx)).down(cellSelector),
                        cell, matches, cellHTML;
//                    console.log(td);
                    while (td) {
                        cell = td.down(innerSelector);
                        matches = cell.dom.innerHTML.match(me.tagsRe);
                        cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                        
                        // populate indexes array, set currentIndex, and replace wrap matched string in a span
                        cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                           count += 1;
                           if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                               me.indexes.push(idx);
                           }
                           if (me.currentIndex === null) {
                               me.currentIndex = idx;
                           }
                           return '<span class="' + me.matchCls + '">' + m + '</span>';
                        });
                        // restore protected tags
                        Ext.each(matches, function(match) {
                           cellHTML = cellHTML.replace(me.tagsProtect, match); 
                        });
                        // update cell html
                        cell.dom.innerHTML = cellHTML;
                        td = td.next();
                    }
                }, me);

                // results found
                if (me.currentIndex !== null) {
//                	console.log(me.currentIndex);
                    me.getSelectionModel().select(me.currentIndex);
//                    Ext.fly(me.getView().getNode(me.currentIndex)).scrollInteView();
                    me.getView().focusRow(me.currentIndex);
                    me.statusBar.setStatus({
                         text: count + ' 处匹配',
                        iconCls: 'x-status-valid'
                    });
                }
            }

            // no results found
            if (me.currentIndex === null) {
                me.getSelectionModel().deselectAll();
            }

            me.textField.focus();
        },
        
        onPreviousClick: function() {
            var me = this,
                idx;
                
            if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
                me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
                me.getSelectionModel().select(me.currentIndex);
                me.getView().focusRow(me.currentIndex);
             }
        },
        
        onNextClick: function() {
            var me = this,
                idx;
            if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
               me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
               me.getSelectionModel().select(me.currentIndex);
               me.getView().focusRow(me.currentIndex);
            }
       },
       
       caseSensitiveToggle: function(checkbox, checked) {
	       this.caseSensitive = checked;
	       this.onTextFieldChange();
	   },
	
})