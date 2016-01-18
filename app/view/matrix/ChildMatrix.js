Ext.define('casco.view.matrix.ChildMatrix', {
	extend: 'Ext.grid.Panel',
	mixins:['Ext.plugin.Abstract'],
	xtype: 'childmatrix',
	viewModel: 'main',
	
	requires: ['casco.view.matrix.MatrixController'
	          
	           ],
	           
//	autoHeight: true,
//	allowDeselect: false,
	           
    //search参数
	searchValue:null,
	matches:[],
	controller:'matrix',
	//currentIndex:null,
	searchRegExp:null,
	//caseSensitive:false,
	regExpMode:false,
	//matched string css class
	matchCls:'x-livesearch-match',
	defaultStatusText:'Nothing Found',
    columnsText:'显示的列',
	//selModel: new Ext.selection.CheckboxModel({checkOnly:true}), 
	forceFit:true,
//	columnLines:true,
		
	initComponent: function(component) {
		var me = this;
		me.selType=me.verification.get('status')==1?'checkboxmodel':'',
		me.matrix = new casco.store.ChildMatrix();
		me.matrix.load({
			params:{
				id: me.verification.get('id')
			},
			synchronous: true,
			callback: function(record){		
            me.columns=me.columns_store;
		    me.ds = new Ext.data.JsonStore({
							  data: record[0].get('data'),
							  fields:record[0].get('fieldsNames')
			});
			me.matrix.setData(me.ds.getData());
			Ext.Array.forEach(record[0].get('columModle'),function(item){
		    var column = Ext.create('Ext.grid.column.Column', {  
				text: item['header'],  
				width:60,  
				style: "text-align:center;",  
				align:'center',  
				dataIndex: item['dataIndex']  
			});  
            me.columns.push(column);
			//me.headerCt.insert(me.columns.length, column);
			});
			me.reconfigure(me.matrix,me.columns);
			me.customMenuItemsCache = [];
			me.headerCt.on('menucreate', function (cmp, menu) {
            menu.on('beforeshow', me.showHeaderMenu, me);
			}, me);

		    }//callback
		});
    

		
		 me.tbar = [{
			text: 'Save',
			glyph: 0xf080,
			scope: this,
			handler:function(){
		     
			 if(me.verification.get('status')==0){Ext.Msg.alert('','已提交，不可编辑');return;}
			 var data=[];
			//血的教训，早知道就用这了... me.matrix.sync();
			 var rows=me.getSelectionModel().getSelection();
			 if(rows==null||rows==undefined||rows==[]||rows=='')
			 {me.matrix.sync({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.getView().refresh(); //这一行重要哇我晕
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
			 });//each
			 var model=Ext.create('casco.model.Verification',{id:me.verification.get('id')});
			 model.set('data',data);
			 model.save({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.getView().refresh(); //这一行重要哇我晕
              Ext.Msg.alert('Failed','Save failed!');
			 },
			 success: function(record, operation) {
			 me.getView().refresh(); //这一行重要哇我晕
			 Ext.Msg.alert('Success', 'Saved successfully.');
			 
			 },
			 });
			
			}
		},/*'-',{text: 'Cancel',
			glyph: 0xf080,
			scope: this,
			handler:function(){
		    me.matrix.rejectChanges();
			me.getView().refresh();}
		},*/'-',{text: 'Export',
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
					//commit 不好
		            //e.record.commit();
					e.record.set(e.field,e.value);
					me.getView().refresh(); 
		            }
		        }
		},

       	me.columns_store=[
			  {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:200,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:250,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:200,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:250,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Traceability',dataIndex:'Traceability',header:'Traceability',width:200,sortable:true,
				  customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'Traceability', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'Traceability', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'Traceability', inputValue: 'NA'}],
					listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}],//menu	
			  }]//customMenu
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
			  {text:'No compliance description',dataIndex:'No compliance description',header:'No compliance description',width:200,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Already described in completeness',dataIndex:'Already described in completeness',header:'Already described in completeness',width:200,sortable:true,
				 customMenu:[{text:'YES/NO',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'YES', name: 'Already described in completeness', inputValue: 'YES'},   
                    { boxLabel: 'NO', name: 'Already described in completeness', inputValue:'NO'}],
					 listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}]//menu
			  }]//customMenu
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
			  {text:'Verif. Assessment',dataIndex:'Verif. Assessment',header:'Verif. Assessment',width:200,sortable:true,
				  customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'Verif. Assessment', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'Verif. Assessment', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'Verif. Assessment', inputValue: 'NA'}],
					listeners:{
						change:function(the,newValue,oldValue){
						 me.self_op(the,newValue,oldValue);}
					}
					}],//menu
			  }]//customMenu
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
			  {text:'Verif. Assesst',dataIndex:'Verif. Assesst',header:'Verif. Assesst',width:200,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Verif. opinion justification',dataIndex:'Verif. opinion justification',header:'Verif. opinion justification',width:200,sortable:true,editor:{xtype:'textfield'}},
			  {text:'CR',dataIndex:'CR',header:'CR',width:50,sortable:true,editor:{xtype:'textfield'}},
			  {text:'Comment',dataIndex:'Comment',header:'Comment',width:50,sortable:true,editor:{xtype:'textfield'}}
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
         
     
		 
		 
	/*	
       me.items=[{
	   xtype:'textfield',
	   value:'text',
	   
	   
	   },{
       xtype:'gridpanel',
	   height: 200,
	   width: 400,
	   region: 'center',
		split: true,
		border: false,
		store: me.ds,
		cm: me.cm


	   }];
         

		me.columns = [{
			text: "tag",
			dataIndex: "tag",
			width: 130,
	        summaryType: 'count',
	        summaryRenderer: function(value, summaryData, dataIndex) {
	            return Ext.String.format('{0} item{1}', value, value !== 1 ? 's' : '');
	        }
		}, {
			text: "allocation",
			dataIndex: "allocation",
			flex: 1
		}, {
			text: "category",
			dataIndex: "category",
			flex:1,
//			width: 130,
		}, {
			text: "tcs",
			dataIndex: "tcs",
			width: 250,
			renderer: function(value) {
				var str = ""; 
				Ext.Array.each(value, function(v) {
					str += v.tag + " ";
				});
				return str;
			}
		}, {
			text: "vat",
			dataIndex: "vat",
			width: 250,
			renderer : function(value) {
				if(!value) return '';
				var arr = [];
				Ext.Array.each(value, function(v) {
			        arr.push(v.tag);
			    });
				return arr.join(', ');
			}
		}];
		*/
		
		me.listeners = {
		beforeedit:function(editor, e, eOpts){
		return me.verification.status==1?true:false;
        }
		};
		
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
        }//if
    },
//}),

	afterRender:function(){
		var me = this;
		me.callParent(arguments);
		me.textField= me.down('textfield[name = searchField]');
		me.statusBar = me.down('statusbar[name = searchStatusBar]');
		me.view.on('cellkeydown',me.focusTextField,me);
		/*
		var menu = me.headerCt.getMenu();
		menu.removeAll();
		menu.add([{
			text: 'Custom Item',
			handler: function() {
				var columnDataIndex = menu.activeHeader.dataIndex;
				alert('custom item for column "'+columnDataIndex+'" was pressed');
			}
		}]); 
		*/
	},
	
	focusTextField: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (e.getKey() === e.S) {
            e.preventDefault();
            this.textField.focus();
        }
    },
	
	tagsRe:/<[^>]*>/gm,  //detects html tag gm 参数
	tagsProtect:'\x0f',  //DEL ASCII code
	
	getSearchValue:function(){
		var me = this,
		value = me.textField.getValue();  
		if(value === ''){
			return null;
		}
		if(!me.regExpMode){
			value = Ext.String.escapeRegex(value);
		}else{
			try{
				new RegExp(value);
			}catch(error){
				me.statusBar.setStatus({
					text:error.message,
					iconCls:'x-status-error'
				});
				return null;
			}
			if(value === '^' || value === '$'){
				return null;
			}
		}
		return value;
	},
	
	gotoCurrent: function() {
        var pos = this.matches[this.currentIndex];
        this.getNavigationModel().setPosition(pos.record, pos.column);
        this.getSelectionModel().select(pos.record);
    },
	
	onTextFieldChange: function() {
        var me = this,
        count = 0,
        view = me.view,
        cellSelector = view.cellSelector,
        innerSelector = view.innerSelector;
        columns = me.visibleColumnManager.getColumns();

        view.refresh();
        // reset the statusbar
        me.statusBar.setStatus({
            text: me.defaultStatusText,
            iconCls: '',
        });

        me.searchValue = me.getSearchValue();
        me.matches = [];
        me.currentIndex = null;

        if (me.searchValue !== null) {
            me.searchRegExp = new RegExp(me.getSearchValue(), 'g' + (me.caseSensitive ? '' : 'i'));
            me.store_rs.each(function(record, idx) {
                var node = view.getNode(record);
                
                if (node) {
                    Ext.Array.forEach(columns, function(column) {
                        var cell = Ext.fly(node).down(column.getCellInnerSelector(), true),
                            matches, cellHTML,
                            seen;

                        if (cell) {
                            matches = cell.innerHTML.match(me.tagsRe);
                            cellHTML = cell.innerHTML.replace(me.tagsRe, me.tagsProtect);

                            // populate indexes array, set currentIndex, and replace wrap matched string in a span
                            cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                                ++count;
                                if (!seen) {
                                    me.matches.push({
                                        record: record,
                                        column: column
                                    });
                                    seen = true;
                                }
                                return '<span class="' + me.matchCls + '">' + m + '</span>';
                            }, me);
                            // restore protected tags
                            Ext.each(matches, function(match) {
                                cellHTML = cellHTML.replace(me.tagsProtect, match);
                            });
                            // update cell html
                            cell.innerHTML = cellHTML;
                        }
                    });
                }
             }, me);

             // results found
             if (count) {
                me.currentIndex = 0;
                me.gotoCurrent();
                me.statusBar.setStatus({
                    text: Ext.String.format('{0} match{1} found.', count, count === 1 ? 'es' : ''),
                    iconCls: 'x-status-valid'
                });
             }
         }

         // no results found
         if (me.currentIndex === null) {
             me.getSelectionModel().deselectAll();
             me.textField.focus();
         }
    },
    
    onPreviousClick: function() {
        var me = this,
            matches = me.matches,
            len = matches.length,
            idx = me.currentIndex;

        if (len) {
            me.currentIndex = idx === 0 ? len - 1 : idx - 1;
            me.gotoCurrent();
        }
    },
    
    onNextClick: function() {
        var me = this,
            matches = me.matches,
            len = matches.length,
            idx = me.currentIndex;

        if (len) {
            me.currentIndex = idx === len - 1 ? 0 : idx + 1;
            me.gotoCurrent();
        }
    },
		
    viewConfig: { 
        stripeRows: true, 
        getRowClass: function(record) {
        	if(record.get('tcs') == undefined)
        		return 'red';
        	if(record.get('tcs').length != 0)
        		return ''; 
        	if(record.get('tcs').length == 0 && !record.get('vat').length && !record.get('vatstr'))
        		return 'red'; 
        	if(!record.get('vat').length || record.get('vatstr'))
        		return 'yellow'; 
        } 
    },
    features: [{
    	ftype: 'summary',
    	dock: 'top'
    }],	
})
