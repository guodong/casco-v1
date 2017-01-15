
Ext.define('casco.view.manage.Testmethod', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.testmethod',
	requires: ['casco.view.manage.Methodadd'],
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Testmethods');
		store.load();
		me.store = store;
		me.tbar = ['-',{
//			hidden: localStorage.role == 'staff' ? true: false,  //用户权限
			text: '点击添加',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.manage.Methodadd', {store: store});
				win.show();
			}
		},'-',{
//			hidden: JSON.parse(localStorage.user).role_id == 0 ? true: false,  //用户权限
			text: '删除选中',
			glyph: 0xf068,
			handler: function() {
				Ext.MessageBox.buttonText.yes = '是';
				Ext.MessageBox.buttonText.no = '否';
				var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];
				if(selection){
					Ext.Msg.confirm('确认', '确认删除选中方法?', function(choice){   //confirm
						if(choice == 'yes'){
							me.store.remove(selection);
							selection.erase();
						}}, this);
				}else
					Ext.Msg.alert('注意','请先选中需要删除的方法！');
			}
		}, '->', {
	        xtype: 'textfield',
	        fieldLabel: 'Search',
	        labelWidth: 50,
	        name: 'searchField',
	        emptyText: '查找关键字',
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
	      }, {
	        xtype: 'button',
	        text: '&gt;',
	        tooltip: 'Find Next Row',
	        handler: me.onNextClick,
	        scope: me
	      }, {
	        xtype: 'checkbox',
	        hideLabel: true,
	        margin: '0 12px 0 0',
	        handler: me.caseSensitiveToggle,
	        scope: me
	      }, '  区分大小写'];
		
		me.bbar = [{
		      xtype: 'statusbar',
		      defaultText: me.defaultStatusText,
		      name: 'searchStatusBar'
		    }];
		me.callParent();
	},
	columns: [{
		text: "测试方法",
		dataIndex: "name",
		width: '40%'
	}, {
		text: "创建时间",
		dataIndex: "created_at",
		width: '30%'
	}, {
		text: "更新时间",
		dataIndex: "updated_at",
		width: '30%'
	}],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.manage.Methodadd', {method: record});
            win.down('form').loadRecord(record);
            win.show();
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
    tagsRe: /<[^>]*>/gm,  //detects html tag gm 参数
    tagsProtect: '\x0f',  //DEL ASCII code
    matchCls: 'x-livesearch-match', //@cfg {String} matchCls  The matched string css classe.
    defaultStatusText: '无匹配项',

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
//              	console.log(me.currentIndex);
          me.getSelectionModel().select(me.currentIndex);
//                  Ext.fly(me.getView().getNode(me.currentIndex)).scrollInteView();
          me.getView().focusRow(me.currentIndex);
          me.statusBar.setStatus({
            text: count + ' 处匹配.',
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