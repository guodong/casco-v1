Ext.define('casco.view.tc.Tc', {
    extend : 'Ext.grid.Panel',
    xtype : 'tc',
    requires: ['casco.view.tc.TcAdd', 'casco.store.Tcs'],
    viewModel : 'main', 	//Binding
    allowDeselect: true, 	// single时，可取消选定
    
    forceFit:true,
    columnLines:true,
    
    initComponent: function(){
    	var me = this;
    	console.log(me);
    	me.versions = new casco.store.Versions();
		me.store = new casco.store.Tcs();
		me.store_tc = new casco.store.Tcs();
		me.versions.load({		//加载Data
			params:{
				document_id: me.document.id
			},
			callback: function(){
				me.down('combobox').select(me.versions.getAt(0)); 	//获取后台返回Version第1条记录 
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
					    me.columns=me.store_tc.getAt(0).get('columModle');		//后端返回的数据字段 
					    me.ds = new Ext.data.JsonStore({
										  data: (me.store_tc.getAt(0).get('data')),
										  fields:Ext.encode(me.store_tc.getAt(0).get('fieldsNames'))	//后端数据封装为JSON String
						});
//					    console.log(me.store_tc.getAt(0));
//					    console.log(me.store_tc.getAt(0).get('data'));
//					    console.log(me.store_tc.getAt(0).get('fieldsNames'));
//					    console.log(me.ds);
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
            			},method:'get',async: false,callback: function(options, success, response) {	//options-ajax
					 me.json = new Ext.util.JSON.decode(response.responseText);		//后端封装数据JSON->Obj columnModle data fieldsNames 
					 }});
//					 me.cm=Ext.create('Ext.grid.column.Column',{columns:[
//					 { header:'编号', dataIndex:'id',width:200},
//					 { header:'名称', dataIndex:'name',width:300}
//					 ]});
//					 console.dir(me.cm);
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
            }
        },'->',{
            xtype: 'textfield',
            fieldLabel: 'Search',  
            labelWidth: 50,
            name: 'searchField', 
            emptyText: 'Search',
            hideLabel: true,
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
        
        me.bbar = [{
			 xtype: 'statusbar',
			 defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		 }];
        
        me.listeners = {
        		//右键点击菜单
        		itemcontextmenu :function(view,record,item,index,e){		//Record-data.Model
        			e.stopEvent();		//preventDefault and stopPropagation
        			var grid=me;
        			if(!grid.rowCtxMenu){
        			grid.rowCtxMenu=Ext.create('Ext.menu.Menu',{	
        			items:[{
        				text:'Insert Record',
        				handler:me.onInsertRecord,
        				scope: me
        			},{
        				text:'Delete Record',
        				handler:me.onDeleteRecord,
        				scope: me
        			}/*,{
        				text:'Edit Record',
        				handler:me.onEditRecord,
        				scope: me
        			}*/]});
        			}//if
        			grid.selModel.select(record);
        			grid.rowCtxMenu.showAt(e.getXY());
        		    }
//        			destroy : function(thisGrid) {
//        				if (thisGrid.rowCtxMenu) {
//        					thisGrid.rowCtxMenu.destroy();
//        				}
//        			}        	
        };
        
        
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

    //新增TC
    onInsertRecord:function(){
    	var me = this;
		var tag='';
		me.store.each(function(record){		//取MaxTag+1
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
    },
    
    //删除TC
    onDeleteRecord:function() {
    	var me = this;
        Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){if(choice == 'yes'){
        var view=me.getView();		//Grid View
//         me.reconfigure(me.store,me.columns);
				var selection =view.getSelectionModel().getSelection()[0];		//selected
				var tc = Ext.create('casco.model.Tc',{id:selection.get('id')});		//通过Model操作数据
				console.log(tc);
		        tc.erase();
				if (selection) {
					me.store.remove(selection);
					selection.erase();
				}
        me.getView().refresh();
        }},this);
	},
	
/*	//编辑TC
	onEditRecord: function(){
		var me = this;
		var view = me.getView();
		var selection = view.getSelectionModel().getSelection()[0];
		var record = Ext.create('casco.model.Tc',{
			id:selection.get('id')
		});
		console.log(record);
		var win = Ext.create('widget.tcadd',{
			tc: record, 
			document_id: me.document.id, 
			project: me.project,
			columns:me.columns});
        win.down('form').loadRecord(record);
        win.show();
	},*/

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
//	                console.log(td);
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
//	            	console.log(me.currentIndex);
	                me.getSelectionModel().select(me.currentIndex);
//	                Ext.fly(me.getView().getNode(me.currentIndex)).scrollInteView();
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
    
//    features: [{
//    	ftype: 'summary',
//    	dock: 'top'
//    }],
    
    listeners : {//与init并列,不能直接me.*来进行调用  和在init函数内实现有什么不同？
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