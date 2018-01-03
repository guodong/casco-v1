Ext.define('casco.view.tc.TcStep', {
  extend: 'Ext.grid.Panel',

  alias: 'widget.tcstep',
  requires: [
    'Ext.grid.plugin.CellEditing',
    'Ext.form.field.TextArea',
    'Ext.form.field.Number',
    'Ext.toolbar.TextItem',
    'casco.store.TcSteps'
  ],
  id: 'mgrid',
  columns: [{
    xtype: 'rownumberer',
    text: '序号',
    dataIndex: 'num',
    width: 70
  }, {
    text: 'Actions',
    width: '45%',
    resizable: false,
    draggable: false,
    hideable: false,
    menuDisabled: true,
    dataIndex: 'actions',
    field: {
      type: 'textareafield',
      grow: true
    }
  }, {
    text: '预期结果',
    flex: true,
    sortable: true,
    resizable: false,
    draggable: false,
    hideable: false,
    menuDisabled: true,
    dataIndex: 'expected_result',
    field: {
      type: 'textareafield'
    }
  }],
  initComponent: function() {
    var me = this;
    this.editing = Ext.create('Ext.grid.plugin.CellEditing');
    Ext.apply(me, {
      plugins: [this.editing],
      dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
          glyph: 0xf067,
          text: '添加',
          scope: me,
          handler: this.onAddClick,
        }, {
          glyph: 0xf068,
          text: '删除',
          disabled: true,
          itemId: 'delete',
          scope: me,
          handler: this.onDeleteClick,
        }]
      }],
    });
    me.callParent(arguments); //必须在getSelectionModel上边，否则报错(叼炸天)
    this.getSelectionModel().on('selectionchange', this.onSelectChange, this);

  },
  onSelectChange: function(selModel, selections) {
    this.down('#delete').setDisabled(selections.length === 0);
  },
  onAddClick: function() {
    var rec = new casco.model.TcStep({
      num: this.store.getCount() + 1,
      actions: '',
      expected_result: ''
    }), edit = this.editing;

    edit.cancelEdit();
    this.store.add(rec);
    this.getView().refresh();
    edit.startEditByPosition({
      row: this.store.getCount() - 1,
      column: 1
    });
  },
  onDeleteClick: function() {
    Ext.Msg.confirm('确认', '确认删除?', function(choice) {
      if (choice == 'yes') {
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
          this.store.remove(selection);
          this.getView().refresh();
        }
      }
    }, this);

  }
});