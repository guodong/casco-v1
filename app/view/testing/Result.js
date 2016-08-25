//Ext.define('Dbn.override.grid.CellEditor', {
//override: 'Ext.grid.CellEditor',
//compatibility: '6.0.1.250',
//
//beforeItemUpdate: function(record, recordIndex, oldItemDom, columnsToUpdate) {
//if(Ext.getDetachedBody().isAncestor(this.el)) return;
//this.callParent([record, recordIndex, oldItemDom, columnsToUpdate]);
//}
//});

Ext.define('casco.view.testing.Result', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.result',

    bodyPadding: 0,
    bufferedRenderer: false, //Solution:Uncaught TypeError: Failed to execute 'insertBefore' on 'Node': parameter 1 is not of type 'Node'.
    
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    listeners : {
          cellclick: function(a,b,c, record, item, index, e) {
        	Ext.getCmp('testing-step-panel').down('form').loadRecord(record);
        	Ext.getCmp('testing-step').store.loadData(record.get('tc').steps);
        }
    },
	title: 'Testing result',
	store: Ext.create('casco.store.Results'),
	scrollable: true,
	job: Ext.create('casco.model.Testjob'),
    initComponent: function(){
    	var me = this;
    	var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	                {label: 'untested',   value: 0},
	                {label: 'passed',   value: 1},
	                {label: 'failed',   value: -1},
            ]
        });
		me.tmpstore = Ext.create('casco.store.TestJobTmp');
		me.tmpstore.load({
			params : {
				project_id :me.project.get('id')
			}
		});
    	me.store.setListeners({
    		beforeload: function(){
				var cs = me.getColumns();
				var stepcs = Ext.getCmp('testing-step-panel').down('grid').getColumns();
    			if(me.job.get('status') == 1){
    				Ext.each(cs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(1);
    					}
    				});
    				Ext.each(stepcs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(1);
    					}
    				});
    				Ext.getCmp('testing-cr').setEditable(false);
    				Ext.getCmp('testing-save-btn').hide();
    				Ext.getCmp('testing-submit-btn').hide();
    			}else{
    				Ext.each(cs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(0);
    					}
    				});
    				Ext.each(stepcs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(0);
    					}
    				});
    				Ext.getCmp('testing-cr').setEditable(true);
    				Ext.getCmp('testing-save-btn').show();
    				Ext.getCmp('testing-submit-btn').show();
    			}
    		}
    	});
		me.columns = [{
			text: 'tc',
			dataIndex: 'tc',
			renderer: function(v) {
				return v.tag
			}
		}, {
			text: 'description',
			dataIndex: 'tc',
			flex:1,
			renderer: function(v) {
				return  v.description;
			}
		}, {
			text: "source",
			dataIndex: "tc",
			width: 200,
			autoShow: false,
			hidden: true,
			renderer: function(value) {
				var value = JSON.parse('{'+value.column+'}');
				
//				var arr = [];
//				Ext.Array.each(value, function(v) {
//					arr.push(v);
//				});
				return value.source||'';
			}
		}, {
			text: "test method",
			dataIndex: "tc",
			width: 100,
			renderer: function(v) {
			//	var str = "";
			//	for ( var i in v.testmethods) {
			//		str += v.testmethods[i].name;
			//	}
			//	return str;
			return v.testmethods;
			}
		}, {
			text: "begin at",
			dataIndex: "begin_at",
			width: 180,
			editor: {
				editable: false,
				disabledCls: '',
				xtype: 'datetimefield',
				format: 'Y-m-d H:i:s'
			},
			renderer: function(value, md, record){
				if(typeof(value) == 'object'){
					var str = Ext.util.Format.date(value, 'Y-m-d H:i:s');
					return str;
				}
				if(value == '0000-00-00 00:00:00' || value == null){
					return '';
				}
				return value;
			}
		}, {
			text: "end at",
			dataIndex: "end_at",
			width: 180,
			editor: {
				editable: false,
				disabledCls: '',
				xtype: 'datetimefield',
				format: 'Y-m-d H:i:s'
			},
			renderer: function(value){
				if(typeof(value) == 'object'){
					var str = Ext.util.Format.date(value, 'Y-m-d H:i:s');
					return str;
				}
				if(value == '0000-00-00 00:00:00' || value == null){
					return '';
				}
				return value;
			}
		}, {
		    xtype: 'gridcolumn',
		    dataIndex: 'result',
			  width: 120,
		    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		        return resultStore.findRecord('value', value).get('label');
		    },
		    text: 'Result',
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
	        			var rd = me.getSelectionModel().getSelection()[0];
		        		if(r.get('value') != 0){
		        			rd.set('exec_at', Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		        		}
	        			Ext.each(rd.get('tc').steps, function(step){
	        				step.result = r.get('value');
	        			});
	        			Ext.getCmp('testing-step-panel').down('grid').reconfigure();
		        	}
		        }
		    }
		}];
		me.tbar = [{
			xtype: 'combobox',
			displayField: 'value',
			valueField: 'id',
			emptyText: 'Edit TestScripts',
			queryModel: 'local',
			editable: false,
			store: Ext.create('Ext.data.Store',{
				fields: ['id', 'value'],
				data: [{'id':'EC', 'value':'Edit checklog'},
				       {'id':'ER', 'value':'Edit robot'},
				       {'id':'GT', 'value':'Generate TestScript'}]
			}),
			listeners:{
				select: function(combo,rd){
					switch(rd.id){
					case 'EC':
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
//						console.log(selection.get('tc').tag);
						if(!selection){
							Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择TC !</b></div>');
							combo.setValue(combo.emptyText);
							return;
							}
						window.open('/ace-builds/editor.html?type=python&tc_id='+selection.get('tc_id')+'&tc_tag='+selection.get('tc').tag); 
						combo.setValue(combo.emptyText);
						break;
					case 'ER':
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if(!selection){
							Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择TC !</b></div>');
							combo.clearValue();
							return;
							}
						window.open('/ace-builds/editor.html?type=robot&tc_id='+selection.get('tc_id')+'&tc_tag='+selection.get('tc').tag); 
						combo.clearValue();
						break;
					case 'GT':
						console.log(me.getView().getStore().getData().length);
						var view=me.getView();
						var dd=view.getStore().getData();
						if(!dd.length){
							Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择Testjob !</b></div>');
							combo.clearValue();
							return;
						}
//						window.open(API+'testjob/export_pro?job_id='+me.job.get('id'));
//						combo.clearValue();
						break;
					default:
						break;
					}
				}
			}
		},{
			text: 'Export Result',
//			glyph: 0xf019,
//			scope: this,
			xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: me.tmpstore,
            queryMode: 'local',
			//itemId:'switcher',	//ManagerController
            emptyText: 'Export Results',
            listeners: {
            	select:  function(combo, record) {
				combo.setValue(combo.emptyText);
				window.open(API+'testjob/export?job_id='+me.job.get('id')+'&tmp_id='+record.get('id'));
            	return;
				},
            }
		},{
			text: 'Save',
			id: 'testing-save-btn',
			glyph: 0xf0c7,
			handler: function() {
				var out = [];
				me.job.set('user_id',JSON.parse(localStorage.user).id);
				me.job.save();
				Ext.getCmp('joblist').getStore().reload();
				console.log(me);
//				me.job.reload({
//					project_id :me.project.get('id')
//				});
				me.getStore().each(function(r){
					var steps = [];
					Ext.each(r.get('tc').steps, function(step){
						steps.push({id: step.id, step_result_id: step.step_result_id, result: step.result==null?0:step.result, comment: step.comment});
					});
					out.push({id: r.get('id'), begin_at: r.get('begin_at'), end_at: r.get('end_at'), result: r.get('result'), cr:r.get('cr'), steps: steps});
				});
				Ext.Ajax.request({
					url: API + '/result/updateall',
					method: 'post',
					jsonData: {results: out},
					success: function(){
//						me.getView().refresh();
						me.store.reload();
						Ext.Msg.alert('Success', 'Saved successfully.')
					}
				});
			}
		},{
			text: 'Submit',
			id: 'testing-submit-btn',
			glyph: 0xf093,
			scope: this,
			handler: function() {
				me.job.set('status', 1);
				me.job.set('user_id',JSON.parse(localStorage.user).id);
				me.job.save({
					success: function(){
						Ext.Msg.alert('Success', 'Submit successfully.')
					}
				});
				Ext.getCmp('joblist').getStore().reload();
			}
		},'->',{
            xtype: 'textfield',
//            fieldLabel: 'Search',  
            labelWidth: 50,
            name: 'searchField',
            emptyText: 'Search',
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
       }];
		
		me.bbar = [{
			 xtype: 'statusbar',
			 defaultText:me.defaultStatusText,
			name:'searchStatusBar'
		 }];
		
    	this.callParent();
    },
    
    /*
     * Live Search Module Cofigures
     */	
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
       }
})