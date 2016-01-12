Ext.define('casco.view.matrix.ParentMatrix', {
	extend: 'Ext.grid.Panel',
	xtype: 'parentmatrix',
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
	forceFit:true,
//	columnLines:true,
		
	initComponent: function() {
		var me = this;
		//console.log(me.verification_id);
		me.column_store=Ext.create('Ext.data.Store', {
         fields: ['name', 'value'],
         data : [
         {"name":"NA", "value":"NA"},
		 {"name":"OK", "value":"OK"},
		 {"name":"空白", "value":"空白"}
           ]});

		me.matrix = new casco.store.ParentMatrix();
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
            


          me.text_editor = new Ext.Editor({
			// update the innerHTML of the bound element 
			// when editing completes
			updateEl: true,
			alignment: 'l-l',
			autoSize: {
				width: 'boundEl'
			},
			field: {
		    xtype:'textfield'
			}
		  });
		   me.combo_editor = new Ext.Editor({
			// update the innerHTML of the bound element 
			// when editing completes
			updateEl: true,
			alignment: 'l-l',
			autoSize: {
				width: 'boundEl'
			},
			field: {
				xtype: 'combo',
			    typeAhead:true,
                //readOnly:true,
                queryMode:'local',
                triggerAction:'all',
                valueField:'name',
                displayField:'value',
                store:me.column_store,
                lazyRender:true,
				listeners:{  
                       select : function(combo, record, index) {  
						console.log(record);
					   }
			    }
			}
		   });
		   

		
		 me.listeners = {
			celldblclick: function(th, td, cellIndex, record,tr, rowIndex, e, eOpts ){
			   
				switch(cellIndex){
                case '9':
				 me.combo_editor.startEdit(td);break;
				case '10':
                 me.combo_editor.startEdit(td);break;
                default:
				 me.text_editor.startEdit(td);
				}
			}
		
		};  

		me.columns_store=[
			 {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:200,sortable:true},
			  {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:200,sortable:true},
			  {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:200,sortable:true},
			  {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:200,sortable:true},
			  {text:'justification',dataIndex:'justification',header:'justification',width:200,sortable:true},
			  {text:'Completeness',dataIndex:'Completeness',header:'Completeness',width:200,sortable:true,
				customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'rb', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'rb', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'rb', inputValue: 'NA'}]//items
					}]//menu
			  }]//customMenu
			  },
			  {text:'No Compliance Description',dataIndex:'No Compliance Description',header:'No Compliance Description',width:200,sortable:true},
			  {text:'Defect Type',dataIndex:'Defect Type',header:'Defect Type',width:200,sortable:true,
				 customMenu:[{text:'Not complete/Wrong coverage...',menu:[{xtype:'panel',defaultType:'radio',vertical:true,items: [  
                    { boxLabel: 'Not complete', name: 'rb', inputValue: 'OK'},   
                    { boxLabel: 'logic or description mistake in Child requirement', name: 'rb', inputValue:'NOK'},
				    { boxLabel: 'Other', name: 'rb', inputValue: 'NA'}]//items
					}]//menu
			  }]//customMenu
			  },
			  {text:'Verif. Assesst',dataIndex:'Verif. Assesst',header:'Verif. Assesst',width:200,sortable:true,
			   customMenu:[{text:'OK/NOK/NA/Postponed',menu:[{xtype:'radiogroup',items: [  
                    { boxLabel: 'OK', name: 'rb', inputValue: 'OK'},   
                    { boxLabel: 'NOK', name: 'rb', inputValue:'NOK'},
				    { boxLabel: 'NA', name: 'rb', inputValue: 'NA'}]//items
					}]//menu
			  }]//customMenu
			  },
			  {text:'Verif Assest justifiaction',dataIndex:'Verif Assest justifiaction',header:'Verif Assest justifiaction',width:200,sortable:true},
			  {text:'CR',dataIndex:'CR',header:'CR',width:200,sortable:true},
			  {text:'Comment',dataIndex:'Comment',header:'Comment',width:200,sortable:true}
				];

		 me.tbar = [{
			text: 'Save',
			glyph: 0xf080,
			scope: this,
			handler: function() {
				
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
	afterRender:function(){
		var me = this;
		me.callParent(arguments);
		me.textField= me.down('textfield[name = searchField]');
		me.statusBar = me.down('statusbar[name = searchStatusBar]');
		me.view.on('cellkeydown',me.focusTextField,me);
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
