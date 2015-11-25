Ext.define('casco.view.tc.Tc', {
    extend : 'Ext.grid.Panel',
    xtype : 'tc',
    requires: ['casco.view.tc.TcAdd', 'casco.store.Tcs'],
    title : 'TSP-SyRTC',
    allowDeselect: true,
    
    //search参数
	searchValue:null,
	matches:[],
	//indexes:[],
	//currentIndex:null,
	searchRegExp:null,
	//caseSensitive:false,
	regExpMode:false,
	//matched string css class
	matchCls:'x-livesearch-match',
	defaultStatusText:'Nothing Found',
    forceFit:true,
    viewModel : 'main',
    initComponent: function(){
    	var me = this;
    	me.versions = new casco.store.Versions();
		me.store = new casco.store.Tcs();
		me.store_tc = new casco.store.Tcs();
		me.versions.load({
			params:{
				document_id: me.document.id
			},
			callback: function(){
				me.down('combobox').select(me.versions.getAt(0));
				
				var latest_v = me.versions.getCount() > 0?me.versions.getAt(0):0;
				me.curr_version = latest_v;
				if(latest_v){
					me.store_tc.load({
						scope:this,
						synchronous: true,
						params: {
							version_id: latest_v.get('id')
						},
					    callback:function(){
					    
                     //   console.log(me.store_tc.getAt(0));
					    me.columns=me.store_tc.getAt(0).get('columModle'); 
					    me.ds = new Ext.data.JsonStore({
										  data: (me.store_tc.getAt(0).get('data')),
										  fields:Ext.encode(me.store_tc.getAt(0).get('fieldsNames'))
						});
       
                        me.store_tc.setData(me.ds.getData());
						me.reconfigure(me.store_tc,me.columns);
                          
						}
					});

				}
			}
		});
        me.tbar = [{
			xtype: 'combobox',
			id: 'docv-'+me.document.id,
			fieldLabel: 'Version',
			labelWidth: 50,
			store: me.versions,
			displayField: 'name',
            valueField: 'id',
            width:200,
            queryMode: 'local',
            editable: false,
            listeners: {
            	select: function(combo, record){
				
            		me.curr_version = record;
					 Ext.Ajax.request({url: API+'tc', params:{
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
					// console.log(me.columns);
					 me.store.setData(me.ds.getData());
                     me.reconfigure(me.store,me.columns);
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
					version_id: me.down('combobox').getValue(),
					document_id: me.document.id,
					type: 'tc',
					vstore:me.versions,
				    
				});
				win.show();
			}
		},'-',{
            text: 'Export Doc',
            glyph: 0xf019,
            handler : function() {
            	window.open(API+'tc/export?version_id='+me.down('combobox').getValue());
            	return;
            	Ext.Ajax.request({
        			url : API + 'tc/export',
        			params : {doc_id: me.doc_id},
        			method: 'get',
        			success : function(response, opts) {
        				console.dir(response);
        			},
        			failure : function(response, opts) {
        				console.log('server-side failure with status code '
        						+ response.status);
        			}
        		});
            }
		
		
        },'-',{
            text: 'Add Item',
            glyph: 0xf067, 
            handler : function() {
                
			    var tag='';
				me.store.each(function(record){
			  
				if(record.get('tag')>tag)
				 
                tag=record.get('tag');
				},this);
				 
                
               
				  var suffix=tag.toString().match(/[^\d]+/g);
			    num=parseInt(tag.toString().match(/\d+/g))+1;
			//	console.log(suffix);
			    tag=suffix[0]+num+suffix[1];
               var win = Ext.create('widget.tcadd',{listeners:{scope: this}, columns:me.columns,version_id: me.curr_version.get('id'),tag_id:tag,project:me.project, document_id:me.document.id});
                win.show();
            }
        },'-',{
            text: 'Delete Item',
            glyph: 0xf068,
            handler : function() {

                Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){if(choice == 'yes'){
		 
	            var view=me.getView();
                 me.reconfigure(me.store,me.columns);
						var selection =view.getSelectionModel().getSelection()[0];
						var tc = Ext.create('casco.model.Tc',{id:selection.get('id')});
				        tc.erase();
						if (selection) {
							me.store.remove(selection);
							selection.erase();
						}
			    
	            me.getView().refresh();
	             
			
    	}}, this);


            }
        },
//        '-',{
//			text: 'View Graph',
//			glyph: 0xf0e8,
//			scope: this,
//			handler: function() {
//				window.open('/draw/graph.html?document_id='+me.document_id);
//			},
//			hidden: true
//		},
		'->',{
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
        
        me.bbar = Ext.create('casco.ux.StatusBar',{
			defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		});
        
		/*
        me.columns = [
		{text: "tag", dataIndex: "tag", width: 200, hideable: false,
		  summaryType: 'count',
		  summaryRenderer: function(value, summaryData, dataIndex) {
		      return Ext.String.format('{0} item{1}', value, value !== 1 ? 's' : '');
		  }},
		{text: "source", dataIndex: "source_json", width: 200, autoShow: false, renderer : function(value) {
			var arr = [];
			Ext.Array.each(value, function(v) {
		      arr.push(v);
		  }   //之前数组的处理
		  
		  );
			return arr.join(', ');
		}},
		{text: "test method", dataIndex: "testmethods", width: 100, renderer: function(tm){console.log(tm);var str="";for(var i in tm){str+=tm[i].name}return str;}},
		{text: "pre condition", dataIndex: "pre_condition", flex: 1},
		];

		*/
    	me.callParent(arguments);
    },
    
    afterRender:function(){
		var me = this;
		me.callParent(arguments);
		me.textField= me.down('textfield[name = searchField]');
		me.statusBar = me.down('statusbar[name = searchStatusBar]');
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
        me.indexes = [];
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
    
    features: [{
    	ftype: 'summary',
    	dock: 'top'
    }],
    
    listeners : {//与init并列,不能直接me.*来了进行调用
        celldblclick: function(a,b,c, record, item, index, e) {
        	if(c==0){
				console.log();
				window.open('/draw/graph2.html#'+record.get('id')+'&'+record.get('tag'));
				return;
			}
        	var win = Ext.create('widget.tcadd',{tc: record, document_id: this.document.id, project: this.project,columns:this.columns});
            win.down('form').loadRecord(record);
            win.show();
        }
    }
})