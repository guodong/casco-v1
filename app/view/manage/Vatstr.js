Ext.define('casco.view.manage.Vatstr', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.vatstr',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.TextArea',
        'Ext.form.field.Number',
        'Ext.toolbar.TextItem',
    ],
    columns: [{
        text: '标签',
        width: '100%',
        sortable: true,
        resizable: false,
        draggable: false,
        hideable: false,
        menuDisabled: true,
        dataIndex: 'name',
        field: {
            type: 'textareafield',
            grow: true
        }
    }],
    initComponent: function () {
        var me = this;
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');
        Ext.apply(me, {
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: ['->', {
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
        me.callParent(arguments); //必须在getSelectionModel上边，否则报错
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);

    },
    onSelectChange: function (selModel, selections) {
        this.down('#delete').setDisabled(selections.length === 0);
    },
    onAddClick: function () {
        var rec = new casco.model.Vatstr({
            name: ''
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.add(rec);
        this.getView().refresh();
        edit.startEditByPosition({
            row: this.store.getCount() - 1,
            column: 0
        });
    },
    onDeleteClick: function () {
        Ext.MessageBox.buttonText.yes = '是';
        Ext.MessageBox.buttonText.no = '否';
        var view = me.getView();
        var selection = view.getSelectionModel().getSelection()[0];

        if (selection) {

            Ext.Msg.confirm('确认', '确认删除?', function (choice) {
                if (choice == 'yes') {
                    this.store.remove(selection);
                    this.getView().refresh();
                }
            }, this);
        } else {
            Ext.Msg.alert('注意', '请先选中需要删除的Vat！');
        }


    }
});