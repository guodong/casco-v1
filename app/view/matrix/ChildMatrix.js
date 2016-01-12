Ext.define('casco.view.matrix.ChildMatrix', {
	extend: 'Ext.grid.Panel',
	mixins:['Ext.plugin.Abstract'],
	xtype: 'childmatrix',
	viewModel: 'main',
	
	requires: [
	          
	           ],
	           
//	autoHeight: true,
//	allowDeselect: false,
	           
    //search参数
	searchValue:null,
	matches:[],
	//currentIndex:null,
	searchRegExp:null,
	//caseSensitive:false,
	regExpMode:false,
	//matched string css class
	matchCls:'x-livesearch-match',
	defaultStatusText:'Nothing Found',
    columnsText:'显示的列',
	forceFit:true,
//	columnLines:true,
		
	initComponent: function(component) {
		var me = this;
		//console.log(me.verification_id);
		me.matrix = new casco.store.ChildMatrix();
		me.matrix.load({
			params:{
				id: me.verification_id
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
			text: 'View Statistics',
			glyph: 0xf080,
			scope: this,
			handler: function() {
				window.open('/stat/cover.htm#'+me.curr_version.get('id'));
			}
		},'->',{
            xtype: 'textfield',
            fieldLabel: 'Search',  
            labelWidth: 50,
            name: 'searchField', 
            //hideLabel: true,
            width: 200,
            listeners: {
                change: {
                    fn: me.onTextFieldChange,
                    scope: this,
                    buffer: 500
                }
            }
       },{
           xtype: 'button',
           text: '&lt;',
           tooltip: 'Find Previous Row',
           handler: me.onPreviousClick,
           scope: me
       },{
           xtype: 'button',
           text: '&gt;',
           tooltip: 'Find Next Row',
           handler: me.onNextClick,
           scope: me
       }];
		
       	me.columns_store=[
			  {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:200,sortable:true, customMenu: [
                {
                    text: 'My menu item',
                    menu: [
                        {
                            text: 'My submenu item',
							handler: function() {
							Ext.Msg.alert('xss');
							}
                        }
                    ]
                }
            ]},
			  {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:250,sortable:true},
			  {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:200,sortable:true},
			  {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:250,sortable:true},
			  {text:'Traceability',dataIndex:'Traceability',header:'Traceability',width:200,sortable:true,
				customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',vertical:true,items: [  
                    { boxLabel: 'OK', name: 'rb', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'rb', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'rb', inputValue: 'NA'}]//items
					}]//menu
			  }]//customMenu
			  },
			  {text:'No compliance description',dataIndex:'No compliance description',header:'No compliance description',width:200,sortable:true},
			  {text:'Already described in completeness',dataIndex:'Already described in completeness',header:'Already described in completeness',width:200,sortable:true,
				 customMenu:[{text:'YES/NO',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'YES', name: 'rb', inputValue: 'OK'},   
                    { boxLabel: 'NO', name: 'rb', inputValue:'NO'}]//items
					}]//menu
			  }]//customMenu
			  },
			  {text:'Verif. Assessment',dataIndex:'Verif. Assessment',header:'Verif. Assessment',width:200,sortable:true,
				  customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'rb', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'rb', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'rb', inputValue: 'NA'}]//items
					}]//menu
			  }]//customMenu
			  },

			  {text:'Verif. Assesst',dataIndex:'Verif. Assesst',header:'Verif. Assesst',width:200,sortable:true},
			  {text:'Verif. opinion justification',dataIndex:'Verif. opinion justification',header:'Verif. opinion justification',width:200,sortable:true},
			  {text:'CR',dataIndex:'CR',header:'CR',width:50,sortable:true},
			  {text:'Comment',dataIndex:'Comment',header:'Comment',width:50,sortable:true}
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
			celldblclick: function(a,b,c,record){
				localStorage.tag = record.get('tag');
				if(c==0){
					window.open('/draw/graph2.html#'+record.get('id')+"&"+record.get('tag'));
					return;
				}
//				if(c==5||c==6){
//					var st = Ext.create('casco.store.Vat');
//					st.setData(record.get('vat'));
//					if(record.get('vatstr'))
//						st.add({id: record.get('vatstr').id, tag: record.get('vatstr').name});
//					var wd = Ext.create("casco.view.rs.vat.Add", {
//						vat: st,
//						document_id: me.document_id
//					});
//					wd.show();
//					return;
//				}
    //            console.log(me.getColumnModel().getColumnHeader());
      //  record.set('allocation','test herer');
      //  me.reconfigure(me.store,me.columns);
      //  console.log(record.getData());
				var win = Ext.create('widget.rs.rsdetails', {
					rs: record,
					pointer:me,
//					editvat: c==6||c==5,
					document_id: me.document_id,
					project:me.project,
					columns:me.columns,
					
				});
			    
				win.down('form').loadRecord(record);
				win.show();
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
