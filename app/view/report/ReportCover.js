Ext.override(Ext.grid.plugin.RowExpander, { // Override to fire collapsebody & expandbody
    init: function(grid) {
        this.callParent(arguments);
//        grid.getView().addEvents('collapsebody', 'expandbody');//ext论坛找到的解决办法，这样也无法添加事件
//存储grid对象
        this.grid=grid;
       // this.grid.addEvents('collapsebody', 'expandbody');//给grid对象添加事件
    },
    toggleRow: function(rowIdx, record) {
        var me = this,
            view = me.view,
            rowNode = view.getNode(rowIdx),
            row = Ext.fly(rowNode, '_rowExpander'),
            nextBd = row.down(me.rowBodyTrSelector, true),
            isCollapsed = row.hasCls(me.rowCollapsedCls),
            addOrRemoveCls = isCollapsed ? 'removeCls' : 'addCls',
            ownerLock, rowHeight, fireView;


        // Suspend layouts because of possible TWO views having their height change
        Ext.suspendLayouts();
        row[addOrRemoveCls](me.rowCollapsedCls);
        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
        me.recordsExpanded[record.internalId] = isCollapsed;
        view.refreshSize();


        // Sync the height and class of the row on the locked side
        if (me.grid.ownerLockable) {
            ownerLock = me.grid.ownerLockable;
//            fireView = ownerLock.getView();
            view = ownerLock.lockedGrid.view;
            fireView=ownerLock.lockedGrid.view;
            rowHeight = row.getHeight();
            // EXTJSIV-9848: in Firefox the offsetHeight of a row may not match
            // it is actual rendered height due to sub-pixel rounding errors. To ensure
            // the rows heights on both sides of the grid are the same, we have to set
            // them both.
            row.setHeight(isCollapsed ? rowHeight : '');
            row = Ext.fly(view.getNode(rowIdx), '_rowExpander');
            row.setHeight(isCollapsed ? rowHeight : '');
            row[addOrRemoveCls](me.rowCollapsedCls);
            view.refreshSize();
        } else {
            fireView = view;
        }
//通过grid触发事件，而不是view
        this.grid.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);
//下面为ext论坛的解决办法，无效
//fireView.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);
        // Coalesce laying out due to view size changes
        Ext.resumeLayouts(true);
    },
});

Ext.define('casco.view.report.ReportCover', {
    extend: 'Ext.grid.Panel',
    xtype: 'reportcover',
    selModel: {
        selType: 'cellmodel'
    },
    collapsible: true,
    animCollapse: false,
    initComponent: function () {
        var me = this;
        me.store = new casco.store.ReportCover();
        me.store.load({
            params: {
                report_id: me.report.get('id')  //其他参数？
            },
            synchronous: true
        });
        var expander = new Ext.grid.plugin.RowExpander({
            rowBodyTpl : new Ext.XTemplate(['<div id="myrow-{id}" ></div>'])
        });

        me.plugins =[expander];
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: 'untested', value: 0},
                {label: 'passed', value: 1},
                {label: 'failed', value: 2},
            ]
        });

        me.listeners={
            expandbody: function (expander, r, body, rowIndex) {

                var id=Ext.id();
                // if (Ext.DomQuery.select("div.x-panel-bwrap", body).length == 0) {
                var data = r.get('common');
				console.log(data);
                var store = new Ext.data.SimpleStore({
                    fields: ["Child Requirement Tag","allocation", "justification", "comment"]
                    , data: data
                });
				var row ="myrow-"+r.get("id");
				console.log('the row is the'+row);
                var grid = new Ext.grid.GridPanel(
                    {
                        store: store,
                        columns:[
                    {
                        text: 'Child Requirement Tag',
                        dataIndex: 'Child Requirement Tag',
                        header: 'Child Requirement Tag',
                        width: 100,
                        sortable: true
                    },
                    {
                        text: 'justification',
                        dataIndex: 'justification',
                        header: 'justification',
                        width: 100,
                        sortable: true,
                        editor: {xtype: 'textfield'}
                    },
                    {
                        text: 'allocation', dataIndex: 'allocation', header: 'allocation', width: 100, sortable: true,
                        renderer: function (value) {
                            var arr = [];
                            value = value || null;
                            Ext.Array.each(JSON.parse(value), function (v) {
                                arr.push(v.tag || '');
                            });
                            return arr.join(',');
                        }//render
                    },
                    {
                        text: 'Comment',
                        dataIndex: 'comment',
                        header: 'Comment',
                        width: 90,
                        sortable: true,
                        editor: {xtype: 'textfield'}
                    }
                ],
                        autoWidth: true,
                        autoHeight: true,
                        renderTo: row,
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        }
                    }
                );
                //  }//if
            }//expandbody
        }
        me.tbar = [{
            text: 'Save',
            glyph: 0xf080,
            scope: this,
            handler: function () {
                var data = [];
                // 血的教训，早知道就用这了... me.matrix.sync();
                me.store.sync({
                    callback: function (record, operation, success) {
                    },
                    failure: function (record, operation) {
                        me.getView().refresh(); // 这一行重要哇我晕
                        Ext.Msg.alert('Failed', 'Save failed!');
                    },
                    success: function (record, operation) {
                        me.getView().refresh();
                        Ext.Msg.alert('Success', 'Saved successfully.');
                    }
                });

            }
        }, {
            text: 'Export',
            glyph: 0xf080,
            scope: this,
            handler: function () {
                window.open(API + 'reportcover/export?report_id=' + me.report.get('id'));  //?URL
                return;
            }
        },
            '-',
            {
                text: 'Refresh',
                glyph: 0xf067,
                handler: function () {
                    me.store.reload();
                }
            },
            {text: '需求覆盖状态', xtype: 'label', margin: '0 50'}
        ];

        me.columns = [{
				 dataIndex: 'id',
                header: 'id',
			    hidden:true

		},
            {
                text: 'Parent_Requirement_Tag',
                dataIndex: 'Parent_Requirement_Tag',
                header: 'Parent_Requirement_Tag',
                width: 600,
                sortable: true
            },
            {
                text: 'Parent Requirement Text',
                dataIndex: 'Parent Requirement Text',
                header: 'Parent Requirement Text',
                width: 600,
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
                typeAhead: false,
                editor: {
                    xtype: 'combobox',
                    disabledCls: '',
                    queryMode: 'local',
                    displayField: 'label',
                    valueField: 'value',
                    readOnly: true,
                    store: resultStore,
                    listeners: {
                        select: function (combo, r) {
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
                }//editor
            }
        ];
        this.callParent();
    },


})
