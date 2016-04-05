Ext.define('casco.view.tc.Tc', {
    extend : 'Ext.grid.Panel',
    xtype : 'tc',
    requires: ['casco.view.tc.TcAdd', 'casco.store.Tcs'],
    title : 'TSP-SyRTC',
    allowDeselect: true,
    viewModel : 'main',
    
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
					 me.store.setData(me.ds.getData());
                     me.reconfigure(me.store,me.columns);
            	}
            }
		},'-',{
			text: 'Import',
			glyph: 0xf093,
			scope: this,
			width: 90,
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
            text: 'Export',
            glyph: 0xf019,
            width: 90,
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
            text: 'Add',
            glyph: 0xf067,
            width: 80,
            handler : function() {
                
			    var tag='';
				me.store.each(function(record){
			  
				if(record.get('tag')>tag)	 
                tag=record.get('tag');
				},this);
				 
			   var re=/^\[(.*)?\]$/g; 
               if(re.test(tag)){
				var suffix=tag.toString().match(/[^\d]+/g);
			    num=parseInt(tag.toString().match(/\d+/g))+1;
				tag=suffix[0]+num+suffix[1];
				}else{
				tag=null;
				}

                var win = Ext.create('widget.tcadd',{listeners:{scope: this}, columns:me.columns,version_id: me.curr_version.get('id'),tag_id:tag,project:me.project, document_id:me.document.id});
                win.show();
            }
        },'-',{
            text: 'Delete',
            glyph: 0xf068,
            width: 90,
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
                }},this);
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
       },{
    	   xtype: 'checkbox',
    	   hideLabel: true,
    	   margin: '0 12px 0 0',
    	   handler: me.caseSensitiveToggle,
    	   scope: me
       },'  Case sensitive'];
        
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
                console.log(td);
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
                me.getSelectionModel().select(me.currentIndex);
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
         }
    },
    
    onNextClick: function() {
        var me = this,
            idx;
            
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
           me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
           me.getSelectionModel().select(me.currentIndex);
        }
   },
    
    caseSensitiveToggle: function(checkbox, checked) {
        this.caseSensitive = checked;
        this.onTextFieldChange();
    },
    
//    features: [{
//    	ftype: 'summary',
//    	dock: 'top'
//    }],
    
    listeners : {//与init并列,不能直接me.*来了进行调用
        celldblclick: function(a,b,c, record, item, index, e) {
        	if(c==0){
				window.open('/draw/graph2.html#'+record.get('tag')+'&id='+record.get('id'));
				return;
			}
        	var win = Ext.create('widget.tcadd',{tc: record, document_id: this.document.id, project: this.project,columns:this.columns});
            win.down('form').loadRecord(record);
            win.show();
        }
    }
})