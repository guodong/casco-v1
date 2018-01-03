Ext.define('casco.view.report.Verify', {
	extend: 'Ext.panel.Panel',
	layout:'anchor',
	xtype:'verify',
	multiSelect : true,
	requires: [],
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Verify', {
    		proxy: {
    			extraParams: {
    			report_id:me.report.get('id'),
				doc_id:me.doc_id?me.doc_id:null
    			}
    		}
    	});
		store.load({
	      scope: this,
          callback: function(records, operation, success) {
		  if(!records||records.length==0){
		  Ext.destroy(me);
		  }
		  }
          });
		var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	            {label: '<span style="color:blue">untested</span>', value: 0},
                {label: '<span style="color:green">passed</span>', value: 1},
                {label: '<span style="color:red">failed</span>', value: -1},
            ]
        });
		me.store = store;
		me.tbar = [{
			text: '保存',
			glyph: 0xf0c7,
			scope: this,
			handler:function(){  
			 var data=[];
			 me.store.sync({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.down('gridpanel').getView().refresh(); // 这一行重要哇我晕
              Ext.Msg.alert('失败','保存失败');
			 },
			 success: function(record, operation) {
			 me.down('gridpanel').getView().refresh();
			 Ext.Msg.alert('成功', '保存成功。');
			 }
			 }); 
			
			}
		},{
			text: '导出',
			glyph: 0xf1c3,
			handler: function() {
				console.log(me.doc_id);
			 	window.open(API+'center/export_verify?report_id='+(me.report.get('id')||'')+'&doc_id='+(me.doc_id||''));
            	return;
			}
		},'-',{
		    text: '刷新',
			glyph: 0xf021,
		    handler: function() {
				me.store.reload();
			}
		},'->',{
            xtype: 'textfield',
            labelWidth: 50,
            name: 'searchField', 
            emptyText: '搜索',
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
		
		me.bbar = [{
			 xtype: 'statusbar',
			 defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		 }];
		
	var north_columns=[
	{
		text: "需求编号",
		dataIndex: "id",
		hidden:true
	}, 
	{
		text: "标签",
		dataIndex: "tag",
		width: 120
	}, 
	{
		text: "描述",
		dataIndex: "description",
		width: 120
	},
	{
		    xtype: 'gridcolumn',
		    dataIndex: 'result',
			width: 120,
		    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		        return resultStore.findRecord('value', value).get('label');
		    },
		    text: '结果',
			typeAhead:false, 
		    editor: {
		        xtype: 'combobox',
				disabledCls: '',
		        queryMode: 'local',
				displayField: 'label',
				valueField: 'value',
				editable: false,
				readOnly: true,
		        store: resultStore,
		        listeners: {
		        	select: function(combo, r){
	        		/*	var rd = me.getSelectionModel().getSelection()[0];
		        		if(r.get('value') != 0){
		        			rd.set('exec_at', Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		        		}
	        			Ext.each(rd.get('tc').steps, function(step){
	        				step.result = r.get('value');
	        			});
	        			Ext.getCmp('testing-step-panel').down('grid').reconfigure();
						*/
		        	}
		        }
		    }
		}, {
		text: "测试用例编号",
		dataIndex: "test_case",
		width: 120
	}, {
		text: "备注",
		dataIndex: "comment",
		editor:{xtype:'textfield'},
		width: 120
	}];
	
     me.items = [{
			xtype: 'gridpanel',
			forceFit:true,
			title:'',
			plugins: {
			ptype: 'cellediting',
			clicksToEdit: 1
			},
			selModel:new Ext.selection.Model({mode:"MULTI"}),
			columns:north_columns,
			anchor:'100%, 100%',
			forceFit:true,
			region:'north',
			//height:'%60',
			store:store,
			collapsable: true
		}];
	  me.callParent();
	},
	
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	//if(localStorage.role == 'staff') return;  //用户权限
			Ext.Msg.alert('注意','不可编辑!');
        }
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

});