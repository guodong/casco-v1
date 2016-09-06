
Ext.define('casco.view.vat.VatView',{
	extend: 'Ext.grid.Panel',
	xtype: 'vat.view',
	viewModel: 'vat',
	requires: ['casco.store.Vats'
//	           'Ext.grid.filters.Filters'
	           ], //Needed
	
//    bodyPadding: 0,
	forceFit:true,
	columnLines: true,
	
    initComponent: function(){
    	var me = this;
    	me.store = new casco.store.Vats();
    	me.store.load({
    		params: {
    			project_id: me.project.get('id'),
    			document_id: me.document.id,
    		}
    	});
//    	console.log(me.store.getData().items);
//    	var tcdocs_store = Ext.create('Ext.data.Store',{
//    		loading: true,
//			fields: ['tc_version_id','tc_doc'],
//		});
		
		
		me.columns = [{
			text : 'Name',
			dataIndex: 'name'
		},{
			text: 'Description',
			dataIndex: 'description'
		}, {
			text: 'Doc Version',
			dataIndex: 'doc_versions',
			flex: 1,
			renderer: function(value,metadata,record){ //value-rs_versions(current cell); metadata-cell metadata; record-Ext.data.Model
				return getPreview(value,metadata,record);
			}
		}, {
			text: 'Created At',
			dataIndex: 'created_at',
			width: 150
		},{
			text: 'Vat View',
			dataIndex: 'id',
			width: 130,
			renderer:function(val_id,metaData,rec){ //data value from current cell,column_cell,vat_build_data
				 var id = Ext.id();
	             Ext.defer(function() {	//延迟调用 miliseconds
	               	Ext.create('Ext.button.Button', {
					text: 'Show Relation',
					renderTo: id,
					handler: function(){
//						console.log(rec);
						var tab_json=[];
						var vatres = Ext.create('casco.store.VatRelations');
						vatres.load({
							params: {
								vat_build_id: val_id,
								tc_version_id: rec.get('tc_version_id'),
							}
						});
						vatres.on('load',function(){ //Store加载
							var vatres_data = vatres.getData().items[0];
//							console.log(vatres_data.get('vat_tc'));
							if(vatres_data.get('parent_vat')!=[]){
								var tmps=[];
								Ext.Array.each(vatres_data.get('parent_vat'),function(v){
//									console.log(v);
									var tmp={
										'xtype': 'tc_vat_relations',
//										'title': v[0].rs_doc_name+'_'+vatres_data.data.vat_build_name,
										'title': v[0].rs_doc_name,
										'id': 'vatrelations-p'+val_id+v[0].rs_version_id,
										'relations': v,
										'vatbuild_id': val_id,
										'tc_version_id': rec.get('tc_version_id'),
										'rs_version_id': v[0].rs_version_id,
										'closable': true,
									};
									tmps.push(tmp);
								});
								tab_json.push({title:'本阶段分配给其他阶段的', xtype: 'tabpanel',items:tmps,'closable':true});
							}
							if(vatres_data.get('vat_tc')!=[]){
								var tmps=[];
								Ext.Array.each(vatres_data.get('vat_tc'),function(v){
//									console.log(v[0].rs_doc_name);
									var tmp={
										'xtype': 'vat_tc_relations',
//										'title': v[0].rs_doc_name+'_'+vatres_data.data.vat_build_name,
										'title': v[0].rs_doc_name,
										'id': 'vatrelations'+val_id+v[0].rs_version_id,
										'relations': v,
										'vatbuild_id': val_id,
										'tc_version_id': rec.get('tc_version_id'),
										'rs_version_id': v[0].rs_version_id,
										'closable': true
									};
									tmps.push(tmp);
								});
								tab_json.push({title:'其他阶段分配给本阶段的', xtype: 'tabpanel',items:tmps,'closable':true});
							}
							
							var create_tab=function(record){ //写个递归方便多了啊
								if(!record) return;
								  if(Array.isArray(record)){
									   Ext.Array.each(record,function(name,index){create_tab(name)});
								   }else{
									   var tabs= Ext.getCmp('vatpanel');
									   var tab=tabs.child('#'+record.id);
//									   console.log(record.id);
									   if(!tab)tab=tabs.add(record);
									   tabs.setActiveTab(tab);
							   		}
							  }
						       create_tab(tab_json);
						});
					},
					});   
	            }, 50);
	            return Ext.String.format('<div style="color:0xf0ce" id="{0}" ></div>', id);
				}
		}];
		
		me.tbar = [{
			text: 'Export Relations',
			glyph: 0xf1c3,
			scope: this,
			hidden: true,
			handler: function(){
				var win=Ext.create('widget.vat.twowayrelation',{
					project: me.project,
				});
				win.show();
			}
		},'-',{
			xtype: 'combobox',
			displayField: 'value',
			valueField: 'id',
			emptyText: 'Export Vats',
			queryModel: 'local',
			editable: false,
			store: Ext.create('Ext.data.Store',{
				fields: ['id', 'value'],
				data: [{'id':'Assign', 'value':'本阶段分配给其他阶段的'},
				       {'id':'Assigned', 'value':'其他阶段分配给本阶段的'}]
			}),
			listeners:{
				select: function(combo,rd){
					switch(rd.id){
					case 'Assign':
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						console.log(selection);
						if (!selection) {
						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
						 combo.clearValue();
				         return;
						}
			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&tc_version_id='+selection.get('tc_version_id')+'&type='+rd.id);
						combo.setValue(combo.emptyText);
						break;
					case 'Assigned':
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (!selection) {
						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
						 combo.clearValue();
				         return;
						}
			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&tc_version_id='+selection.get('tc_version_id')+'&type='+rd.id);
						combo.setValue(combo.emptyText);
						break;
//					case 'All':
//						var view=me.getView();
//						var selection =view.getSelectionModel().getSelection()[0];
//						if (!selection) {
//						 Ext.Msg.alert('<b>Attention</b>','<div style="text-align:center;"><b>请先选择VAT版本 !</b></div>');
//						 combo.clearValue();
//				         return;
//						}
//			            window.open(API+'vat/export_all?vat_build_id='+selection.get('id')+'&type='+rd.id);
//						combo.setValue(combo.emptyText);
//						break;
					default:
						break;
					}
				}
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
		
		function getPreview(value,metadata,record){ //record-rsversions
			var tmp = [];
			var docvs = record.get('doc_versions');
			docvs.forEach(function(element, index, array){
				var str = "["+element.document.name + "-" + element.name+"]";
				tmp.push(str);
			});
			var value = tmp.join('  ');
			if(value){
				metadata.tdAttr = 'data-qtip="' + "文档版本信息:  <br/>"+value + '"' ; //提示信息
			}
		    return value;
		};
		
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

})