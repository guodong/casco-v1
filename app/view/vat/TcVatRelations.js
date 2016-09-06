Ext.define('casco.view.vat.TcVatRelations',{
	extend: 'Ext.grid.Panel',
	requires: [],
	viewModel: 'vat',
	xtype: 'tc_vat_relations',
	
//	forceFit: true,
	columnLines: true,
//	plugins: 'gridfilters',
		
	initComponent: function(){
		var me = this;
		me.store=Ext.create('Ext.data.Store');
//		console.log(me.relations);
		me.store.loadData(me.relations);
//		console.log(me.store);
//		me.store.on('load', function() {
//		    grid.el.select("table[class=x-grid3-row-table]").each(function(x) {
//		        x.addClass('x-grid3-cell-text-visible');
//		    });
//		});
		
		me.columns = [{
			text: 'Parent-Tag',
			dataIndex: 'rs_tag_name',
			width: '20%'
		},{
			text: 'Parent-Doc',
			dataIndex: 'rs_doc_name',
			width: '15%'
		},{
			text: 'Parent-Version',
			dataIndex: 'rs_version_name',
			width: '15%'
		},{
			text: 'Vat',
			dataIndex: 'rs_vat',
			width: '25%',
			flex: 1,
			renderer: function(value,metadata,record){ 
				if(value){
					metadata.tdAttr = 'data-qtip="' + "Vat信息:  <br/>"+value + '"' ; //提示信息
				}
			    return value;
			}
		},{
			text: 'Vat-Comment',
			dataIndex: 'rs_vat_comment',
			width: '25%',
			renderer: function(value,metadata,record){ 
				if(value){
					metadata.tdAttr = 'data-qtip="' + "Vat Comment信息:  <br/>"+value + '"' ; //提示信息
				}
			    return value;
			}
//			render: function(value,meta,record){
//				meta.attr='style="white-space:normal;"';
//				return value;
//			},
//			flex: 1, //保持最后一列的位置
		}];
		
		me.tbar=[{
            text: 'Export',
            glyph: 0xf1c3,
            scope: this,
            handler: function () {
                window.open(API + 'vat/assign?vat_build_id='+me.vatbuild_id+'&tc_version_id='+me.tc_version_id+ '&rs_version_id=' +me.rs_version_id);  
                return;
            }
        },
//        {
//        	text: 'Export All',
//        	glyph: 0xf1c3,
//        	scope: this,
//        	handler: function(){
//        		window.open(API+'vat/export_all?vat_build_id='+me.vatbuild_id+'&type=Assign');
//        		return;
//        	}
//        },
        '->',{
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
	
});