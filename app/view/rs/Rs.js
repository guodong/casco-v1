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
	           
	 
	           /**
	            * @private
	            * search value initialization
	            */
	           searchValue: null,
	           
	           /**
	            * @private
	            * The row indexes where matching strings are found. (used by previous and next buttons)
	            */
	           indexes: [],
	           
	           /**
	            * @private
	            * The generated regular expression used for searching.
	            */
	           searchRegExp: null,
	           
	           /**
	            * @private
	            * Case sensitive mode.
	            */
	           caseSensitive: false,
	           
	           /**
	            * @private
	            * Regular expression mode.
	            */
	           regExpMode: false,
	           
	           /**
	            * @cfg {String} matchCls
	            * The matched string css classe.
	            */
	           matchCls: 'x-livesearch-match',
	           
	           defaultStatusText: 'Nothing Found',	           

	           
	forceFit:true,
	bufferedRenderer: false,
	columnLines:true,
		
	initComponent: function() {
		var me = this;
		me.versions = new casco.store.Versions();
		me.store = new casco.store.Rss();
		me.store_rs = new casco.store.Rss();
		me.versions.load({
			params:{
				document_id: me.document.id
			},
			synchronous: true,
			callback: function(){
				me.down('combobox').select(me.versions.getAt(0));  //取最近的版本
				var latest_v = me.versions.getCount() > 0?me.versions.getAt(0):0;
				me.curr_version = latest_v;
				if(latest_v){
					me.store_rs.load({
						scope:this,
						synchronous: true,
						params: {
							version_id: latest_v.get('id')
						},
					    callback:function(){
                            
					    me.columns=me.store_rs.getAt(0).get('columModle'); 
					 
					    me.ds = new Ext.data.JsonStore({
										  data: (me.store_rs.getAt(0).get('data')),
										  fields:(me.store_rs.getAt(0).get('fieldsNames'))
						});
                     
                        me.store_rs.setData(me.ds.getData());
						me.reconfigure(me.store_rs,me.columns);

						}
					});
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
					  Ext.Ajax.request({url: API+'rs', params:{
                			version_id:record.get('id')
            			},method:'get',async: false,callback: function(options, success, response) {
					 me.json = new Ext.util.JSON.decode(response.responseText);
					 }});
					 me.cm=Ext.create('Ext.grid.column.Column',{columns:[
					 { header:'编号', dataIndex:'id',width:200},
					 { header:'名称', dataIndex:'name',width:300}
					 ]});
					  me.ds = new Ext.data.JsonStore({
					  data: me.json.data,
					  fields:me.json.fieldsNames
					 });
					 
					 me.columns=me.json.columModle;
				//	 console.log(me.columns);
					 me.store.setData(me.ds.getData());
                     me.reconfigure(me.store,me.columns);
					
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
       },'  Case sensitive'];
		

//		me.bbar = ['-',{
//			summaryType: 'count',
//	        summaryRenderer: function(value, summaryData, dataIndex) {
//	            return Ext.String.format('{0} item{1}', value, value !== 1 ? 's' : '');
//	        }
//		}]
		
		me.bbar = Ext.create('casco.ux.StatusBar',{
			defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		});
         
		
		me.listeners = {
			celldblclick: function(a,b,c,record){
				localStorage.tag = record.get('tag');
				if(c==0){
					window.open('/draw/graph2.html#'+record.get('tag')+"&id="+record.get('id'));
					return;
				}
				var win = Ext.create('widget.rs.rsdetails', {
					rs: record,
					pointer:me,
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
	
	 afterRender: function() {
	        var me = this;
	        me.callParent(arguments);
	        me.textField = me.down('textfield[name=searchField]');
	        me.statusBar = me.down('statusbar[name=searchStatusBar]');
	    },
	
	// detects html tag
    tagsRe: /<[^>]*>/gm,
    
    // DEL ASCII code
    tagsProtect: '\x0f',
	
	focusTextField: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (e.getKey() === e.S) {
            e.preventDefault();
            this.textField.focus();
        }
    },
	
	tagsRe:/<[^>]*>/gm,  //detects html tag gm 参数
	tagsProtect:'\x0f',  //DEL ASCII code
	
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
//                console.log(td);
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
            	console.log(me.currentIndex);
                me.getSelectionModel().select(me.currentIndex);
//                Ext.fly(me.getView().getNode(me.currentIndex)).scrollInteView();
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
   },
		
    viewConfig: { 
        stripeRows: true, 
//        getRowClass: function(record) {
//        	if(record.get('tcs') == undefined)
//        		return 'red';
//        	if(record.get('tcs').length != 0)
//        		return ''; 
//        	if(record.get('tcs').length == 0 && !record.get('vat').length && !record.get('vatstr'))
//        		return 'red'; 
//        	if(!record.get('vat').length || record.get('vatstr'))
//        		return 'yellow'; 
//        } 
    },
//    features: [{
//    	ftype: 'summary',
//    	dock: 'top'
//    }],	
})