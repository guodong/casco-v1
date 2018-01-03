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
Ext.define('casco.view.report.Cover', {
    extend: 'Ext.grid.Panel',
    xtype: 'cover',
    collapsible: true,
    animCollapse: false,
    initComponent: function () {
        var me = this;
        me.store = new casco.store.ReportCover();
        me.store.load({
            params: {
                report_id: me.report?me.report.get('id'):null  //其他参数？
            },
            synchronous: true
        });
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: 'untested', value: 0},
                {label: 'passed', value: 1},
                {label: 'failed', value: -1},
            ]
        });
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
            }];
        me.listeners={
            celldblclick: function(a,b,c,record){
				me.up('panel').down('reportwindow').record=record;
				me.up('panel').down('reportwindow').store.load({params: {p_id: record ? record.get('id') : null}});
				var vats = record?record.get('vats'):null, vatstr = [];
				Ext.Array.each(JSON.parse(vats),
					function (item, index) {
						vatstr.push(item);
					}
				);
				var right_store = new Ext.data.JsonStore({
					auteLoad: true, //此处设置为自动加载
					data: vatstr,
					model: 'casco.model.ReportField',
					p_id: record?record.get('id'):null
				});
				//Ext.getCmp('right_store').store=right_store;
				Ext.getCmp('right_store').reconfigure(right_store);
            }
        },
        me.tbar = [{
            text: '导出',
            glyph: 0xf1c3,
            scope: this,
            handler: function () {
                window.open(API + 'reportcover/export?report_id=' + me.report.get('id'));  //?URL
                return;
            }
        },
            '-',
            {
                text: '刷新',
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
       }


})
