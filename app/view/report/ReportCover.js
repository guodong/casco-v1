Ext.override(Ext.grid.ColumnManager,{
 getHeaderIndex: function(header) {
	 //屌不屌?
        if (header&&header.isGroupHeader) {
            // Get the first header for the particular group header. The .getHeaderColumns API
            // will sort out if it's to be just visible columns or all columns.
            header = this.getHeaderColumns(header)[0];
        }
        return Ext.Array.indexOf(this.getColumns(), header);
    }

});

Ext.override(Ext.dom.Element,{
 isAncestor: function(el) {
            var ret = false,
                dom = this.dom,
                child = Ext.getDom(el);
            if (dom && child) {
                if (dom.contains) {
					//console.log(dom);
                    return dom.contains(el);
                } else if (dom.compareDocumentPosition) {
                    return !!(dom.compareDocumentPosition(child) & 16);
                } else {
                    while ((child = child.parentNode)) {
                        ret = child === dom || ret;
                    }
                }
            }
            return ret;
        }

});
		

Ext.override(Ext.grid.plugin.RowExpander, { // Override to fire collapsebody & expandbody
    init: function(grid) {
        this.callParent(arguments);
        this.grid=grid;
    },
    toggleRow: function(rowIdx, record) {
        var me = this,
            view = me.view,
            rowNode = view.getNode(rowIdx),
            row = Ext.fly(rowNode, '_rowExpander'),
            nextBd = row.down(me.rowBodyTrSelector, true),
            isCollapsed = row.hasCls(me.rowCollapsedCls),
            addOrRemoveCls = isCollapsed ? 'removeCls' : 'addCls',
            ownerLock, rowHeight, fireView;


        Ext.suspendLayouts();
        row[addOrRemoveCls](me.rowCollapsedCls);
        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
        me.recordsExpanded[record.internalId] = isCollapsed;
        view.refreshSize();


        if (me.grid.ownerLockable) {
            ownerLock = me.grid.ownerLockable;
            view = ownerLock.lockedGrid.view;
            fireView=ownerLock.lockedGrid.view;
            rowHeight = row.getHeight();
            row.setHeight(isCollapsed ? rowHeight : '');
            row = Ext.fly(view.getNode(rowIdx), '_rowExpander');
            row.setHeight(isCollapsed ? rowHeight : '');
            row[addOrRemoveCls](me.rowCollapsedCls);
            view.refreshSize();
        } else {
            fireView = view;
        }
        this.grid.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);
        Ext.resumeLayouts(true);
    },
});


Ext.define('casco.view.report.ReportCover', {
    extend: 'Ext.grid.Panel',
    xtype: 'reportcover',
    selModel: {
                mode : "SINGLE"
            },
    collapsible: true,
    animCollapse: false,
    initComponent: function () {
        var me = this;
        me.store = new casco.store.ReportCover();
        me.store.load({
            params: {
                report_id: me.report.get('id')  //其他参数？
            },
            synchronous: true
        });
        var expander = new Ext.grid.plugin.RowExpander({
            rowBodyTpl : new Ext.XTemplate(['<div  class="detailData"  style="width:700px;float:left;overflow-x:hidden"  scroll="no" ></div><!--<div  class="detailVat" style="margin-left:10px;float:left;overflow-x: hidden" scroll="no"></div>-->'])
        });
        me.plugins =[expander];
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: 'untested', value: 0},
                {label: 'passed', value: 1},
                {label: 'failed', value: -1},
            ]
        });
		
        me.listeners={
            expandbody: function (expander, r, body, rowIndex) {
                var data = r.get('id');
                var store = new casco.store.ReportCovers();
				store.load({params:{p_id:data}});
				var row=Ext.DomQuery.select("div.detailData",body);
				var col=Ext.DomQuery.select("div.detailVat",body);
              /*  var grid = new Ext.grid.GridPanel(
				 {
                        store: store,
                        columns:[
                    {
                        text: 'Child Requirement Tag',
                        dataIndex: 'Child Requirement Tag',
                        width: 150,
						menuDisabled:true,
						resizable:false,
                        sortable: true
                    },
					 {
						xtype: 'gridcolumn',
						dataIndex: 'result',
						width: 70,
						renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
							return resultStore.findRecord('value', value).get('label');
						},
						text: 'Result',
						typeAhead: false
					},
                    {
                        text: 'Comment',
                        dataIndex: 'comment',
						width: 200,
						menuDisabled:true,
						resizable:false,
                        sortable: true,
						editor:{xtype:'textfield'}
                    }],
						collapsible:true,
						animCollapse:false,
						iconCls:'icon-grid',
                        autoWidth: true,
                        autoHeight: true,
						scrollable:false,
						preventHeader:true,
                        //renderTo: row[0],
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        }
                    });
			var right_grid = new Ext.grid.GridPanel(
				 {
                        store: null,//Ext.create('Ext.data.Store',{r}),
                        columns:[
                    {
                        text: 'vat',
                        dataIndex: 'vat',
                        width: 150,
                        sortable: true,
						menuDisabled:true,
						resizable:false,
						renderer: function (value) {
                            var arr = [];
                            value = value || null;
                            Ext.Array.each(JSON.parse(value), function (v) {
                                arr.push(v.tag || '');
                            });
                            return arr.join(',');
                        }//render
                    },
                    {
                        text: 'vat_result', dataIndex: 'vat_result',  width: 150, sortable: true,
						menuDisabled:true,
						resizable:false,
						editor:{xtype:'textfield'}
                    }],
						collapsible:true,
						animCollapse:false,
						iconCls:'icon-grid',
                        autoWidth: true,
                        autoHeight: true,
						scrollable:false,
						preventHeader:true,
                      //  renderTo: col[0],
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },
                    });
					*/
				 var vats=r.get('vats'),vatstr=[];
				  Ext.Array.each(JSON.parse(vats), 
                       function(item, index) {
							vatstr.push(item);
                          }
                  );
				 var right_store = new  Ext.data.JsonStore({
					auteLoad:true, //此处设置为自动加载
					data:vatstr,
					model:'casco.model.ReportField',
					p_id:r.get('id')
				 }) ;
				console.log(right_store.getData());
				var panel = Ext.create("Ext.panel.Panel", {
					width: 700,
					height:250,
					fit:true,
					layout: 'border',
					renderTo: row[0],
					items: [{
						title: 'South Region (可调整大小)',
						region: 'east',     // 所在的位置
						xtype: 'gridpanel',
						width: '50%',
						split: true,         // 允许调整大小
						store: right_store,//new Ext.data.Storer,//
						scrollable:true,
                        columns:[
                    {
                        text: 'vat',
                        dataIndex: 'tag',
                        sortable: true,
						fit:true,
						width: 150,
						menuDisabled:true,
						resizable:false
                    },
                    {
                        text: 'vat_result', dataIndex: 'vat_result',  width: 150, sortable: true,
						menuDisabled:true,
						xtype: 'gridcolumn',
						fit:true,
						renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
							return resultStore.findRecord('value', value).get('label');
						},
						editor: {
						xtype: 'combobox',
						disabledCls: '',
						queryMode: 'local',
						displayField: 'label',
						valueField: 'value',
						editable: false,
						store: resultStore,
						listeners: {
							select: function(combo, r){
							}
						}//listeners
						}//editor
                    },
					{ text: 'comment', dataIndex: 'comment',  width: 150, sortable: true,
					menuDisabled:true,
					resizable:false,
					fit:true,
					editor:{xtype:'textfield'}
					}],
						collapsible:true,
						animCollapse:false,
						iconCls:'icon-grid',
                        autoWidth: true,
                        autoHeight: true,
						preventHeader:true,
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },
						listeners:{
						afterrender:function(){
						this.getEl().swallowEvent(['mousedown', 'mouseup', 'click','contextmenu', 'mouseover', 'mouseout','dblclick', 'mousemove', 'focusmove','focuschange', 'focusin', 'focus','focusenter']);
						}
						},
						margins: '0 5 5 5'
					}, {
						title: 'West Region (可折叠/展开)',
						region: 'west',
						xtype: 'gridpanel',
						width: '50%',
						margins: '5 0 0 5',
						collapsible: true,   // 可折叠/展开
						scrollable:true,
						store: store,
                        columns:[
                    {
                        text: 'Child Requirement Tag',
                        dataIndex: 'Child Requirement Tag',
                        width: 150,
						menuDisabled:true,
						resizable:false,
                        sortable: true
                    },
					 {
						xtype: 'gridcolumn',
						dataIndex: 'result',
						width: 90,
						renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
							return resultStore.findRecord('value', value).get('label');
						},
						text: 'Result',
						typeAhead: false
					},
                    {
                        text: 'Comment',
                        dataIndex: 'comment',
						width: 200,
						menuDisabled:true,
						resizable:false,
                        sortable: true,
						editor:{xtype:'textfield'}
                    }],
						collapsible:true,
						animCollapse:false,
						iconCls:'icon-grid',
                        autoWidth: true,
                        autoHeight: true,
						preventHeader:true,
						listeners:{
						afterrender:function(){
						this.getEl().swallowEvent(['mousedown', 'mouseup', 'click','contextmenu', 'mouseover', 'mouseout','dblclick', 'mousemove', 'focusmove','focuschange', 'focusin', 'focus','focusenter']);
						}
						},
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        }
					}]
				});
				 panel.getEl().swallowEvent(['mousedown', 'mouseup', 'click','contextmenu', 'mouseover', 'mouseout','dblclick', 'mousemove', 'focusmove','focuschange', 'focusin', 'focus','focusenter']);

            }
			,
			collapsebody:function(rowNode,record,expandRow,opts){
				var detailData=Ext.DomQuery.select("div.detailData",expandRow);
				var parent=detailData[0];
				var child=parent.firstChild;
				while(child){
				child.parentNode.removeChild(child);
				child=child.nextSibling;
				}
			}
        }
        me.tbar = [{
            text: 'Save',
            glyph: 0xf0c7,
            scope: this,
            handler: function () {
                var datas=[];
				var detailData=Ext.DomQuery.select("div.detailData");
				var ans=Ext.create('casco.model.ReportVats');
				for(var i=0;i<detailData.length;i++){
				if(detailData[i].childNodes.length>0){
				var compoment=Ext.getCmp(detailData[i].childNodes[0].id).items.getAt(2);
				var vats=Ext.getCmp(detailData[i].childNodes[0].id).items.getAt(1),data=[];
				vats.store.each(function(record){
				data.push(record.getData());
				});
				//console.log(data);
				//datas[vats.store.p_id]=data;
				datas.push({key:vats.store.p_id,value:data});
				compoment&&compoment.store.sync();
				}}
				ans.set('datas',datas);
				ans.save({callback:function(){
				Ext.Msg.alert('保存成功!');
				}});
				
            }
        }, {
            text: 'Export',
            glyph: 0xf1c3,
            scope: this,
            handler: function () {
                window.open(API + 'reportcover/export?report_id=' + me.report.get('id'));  //?URL
                return;
            }
        },
            '-',
            {
                text: 'Refresh',
                glyph: 0xf021,
                handler: function () {
                    me.store.reload();
                }
            },
            {text: '需求覆盖状态', xtype: 'label', margin: '0 50'},
            '->',{
                xtype: 'textfield',
                labelWidth: 50,
                name: 'searchField', 
                emptyText: 'Search',
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
               tooltip: 'Find Previous Row',
               handler: me.onPreviousClick,
               scope: me
           },{
               xtype: 'button',
               text: '&gt;',
               tooltip: 'Find Next Row',
               handler: me.onNextClick,
               scope: me
           },{
        	   xtype: 'checkbox',
        	   hideLabel: true,
        	   margin: '0 12px 0 0',
        	   handler: me.caseSensitiveToggle,
        	   scope: me
           },'  区分大小写'];
        
        me.bbar = [{
			 xtype: 'statusbar',
			 defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		 }];

        me.columns = [
            {
                text: 'Parent Requirement Tag',
                dataIndex: 'Parent Requirement Tag',
                header: 'Parent Requirement Tag',
                width: 400,
                sortable: true
            },
            {
                text: 'Parent Requirement Text',
                dataIndex: 'Parent Requirement Text',
                header: 'Parent Requirement Text',
                width: 350,
                sortable: true
            },
             {
                xtype: 'gridcolumn',
                dataIndex: 'result',
                fit:true,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return resultStore.findRecord('value', value).get('label');
                },
                text: 'Result',
                typeAhead: false
            }
        ];
        this.callParent();
    },
    
    /*
     * Live Search Module Cofigures
     */	
    	bufferedRenderer: false, //searchlive need
        searchValue: null, //search value initialization
        indexes: [], //The row indexes where matching strings are found. (used by previous and next buttons)
        searchRegExp: null, //The generated regular expression used for searching.
        caseSensitive: false, //Case sensitive mode.
        regExpMode: false, //Regular expression mode.
        tagsRe:/<[^>]*>/gm,  //detects html tag gm 参数
    	tagsProtect:'\x0f',  //DEL ASCII code
        matchCls: 'x-livesearch-match', //@cfg {String} matchCls  The matched string css classe.
        defaultStatusText: 'Nothing Found',	 
    	
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
                        text: count + ' matche(s) found.',
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
       }


})
