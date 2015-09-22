Ext.define('casco.view.rs.Rs', {
	extend: 'Ext.grid.Panel',
	xtype: 'rs',
	viewModel: 'main',
	
	requires: [
	           'casco.store.Versions',
	           'casco.store.Rss',
	           'casco.view.rs.RsImport',
	           'casco.view.rs.RsDetails',
	           'casco.ux.StatusBar'
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
	
//	columnLines:true,
		
	initComponent: function() {
		var me = this;
		me.versions = new casco.store.Versions();
		me.store = new casco.store.Rss();
		me.versions.load({
			params:{
				document_id: me.document.id
			},
			synchronous: true,
			callback: function(){
				me.down('combobox').select(me.versions.getAt(0));     //取最近的版本
				var latest_v = me.versions.getCount() > 0?me.versions.getAt(0):0;
				me.curr_version = latest_v;
				if(latest_v){
					me.store.load({
						params: {
							version_id: latest_v.get('id')
						}
					});
//					me.store.each(function(rs){     
//						if(rs.tcs.length){
//							cvd++;
//						}
//					});
				}				
			}
		});
		
		me.tbar = [{
			xtype: 'combobox',
			id: 'docv-'+ me.document.id,
			fieldLabel: 'Version',
			labelWidth: 50,
			store: me.versions,
			displayField: 'name',
            valueField: 'id',
            width:200,
            queryMode: 'local',
            editable: true,
            lastQuery: '',
            listeners: {
            	select: function(combo, record){
            		me.curr_version = record;
            		me.store.load({
            			params:{
                			version_id: record.get('id')
            			}
            		})
            	},
            	beforequery : function(e){
            		e.query = new RegExp(e.query.trim(), 'i');
            		e.forceAll = true;
        	   	}
            }  
		},'-',{
			text: 'Import Doc',
			glyph: 0xf093,
			scope: this,
			handler: function() {
				var win = Ext.create('widget.rs.rsimport', {
					listeners: {
						scope: this
					},
					//version_id: me.down('combobox').getValue(),
					document_id: me.document.id,
					vstore:me.versions,
					type: 'rs'
				});
				console.log(me.versions);
				win.show();
				}   
		},'-',{
			text: 'View Doc',
			glyph: 0xf108,
			scope: this,
			handler: function() {
				window.open("/viewdoc.html?file="+me.curr_version.get('filename'),"_blank","width=800,height=900");
			}
		},
//		'-',{
//			text: 'View Graph',
//			glyph: 0xf0e8,
//			scope: this,
//			handler: function() {
//				window.open('/draw/graph.html?document_id='+me.document_id);
//			},
//			hidden: true
//		},
		'-',{
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
			text: "implement",
			dataIndex: "implement",
			flex:1,
//			width: 100,
//	        summaryRenderer: function(value, summaryData, dataIndex) {
//	            //return 'covered:' +cvd;
//	        }
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
		
		me.listeners = {
			celldblclick: function(a,b,c,record){
				localStorage.tag = record.get('tag');
				if(c==0){
					window.open('/draw/graph2.html#'+record.get('tag'));
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
				var win = Ext.create('widget.rs.rsdetails', {
					rs: record,
//					editvat: c==6||c==5,
					document_id: me.document_id,
					project:me.project,
				});
				win.down('form').loadRecord(record);
				win.show();
			}
		};
		
		me.callParent(arguments);
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
            me.store.each(function(record, idx) {
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
