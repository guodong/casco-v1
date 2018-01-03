Ext.define('casco.view.report.ReportWindow', {
	extend: 'Ext.panel.Panel',
    xtype: 'reportwindow',
    layout: 'border',
    initComponent: function () {

        var me = this;
        me.store = new casco.store.ReportCovers();
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: 'untested', value: 0},
                {label: 'passed', value: 1},
                {label: 'failed', value: -1},
            ]
        });
        me.items = [{
            title: 'Vat=>Result',
            region: 'east',     // 所在的位置
            xtype: 'gridpanel',
            width: '50%',
            split: true,  
			id:'right_store',
            store: new Ext.data.JsonStore({}),
            scrollable: true,
            columns: [
                {
                    text: '定版',
                    dataIndex: 'tag',
                    sortable: true,
                    fit: true,
                    width: 150,
                    menuDisabled: true,
                    resizable: false
                },
                {
                    text: 'build',
                    dataIndex: 'v_build',
                    sortable: true,
                    fit: true,
                    width: 150,
                    menuDisabled: true,
                    resizable: false
                },
                {
                    text: 'vat结果', dataIndex: 'vat_result', width: 150, sortable: true,
                    menuDisabled: true,
                    xtype: 'gridcolumn',
                    fit: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return resultStore.findRecord('value', value).get('label');
                    },
                    editor: {
                        xtype: 'combobox',
                        disabledCls: '',
                        queryMode: 'local',
                        displayField: 'label',
                        valueField: 'value',
                        editable: false,
                        store: resultStore,
                        listeners: {
                            select: function (combo, r) {
                            }
                        }//listeners
                    }//editor
                },
                {
                    text: '备注', dataIndex: 'comment', width: 150, sortable: true,
                    menuDisabled: true,
                    resizable: false,
                    fit: true,
                    editor: {xtype: 'textfield'}
                }],
            collapsible: true,
            animCollapse: false,
            iconCls: 'icon-grid',
            autoWidth: true,
            autoHeight: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            margins: '0 5 5 5'
        }, {
            title: 'Child=>Result',
            region: 'west',
            xtype: 'gridpanel',
            width: '50%',
            margins: '5 0 0 5',
            collapsible: true,   // 可折叠/展开
            scrollable: true,
            store: me.store,
            columns: [
                {
                    text: '子级需求标签',
                    dataIndex: 'Child Requirement Tag',
                    width: 150,
                    menuDisabled: true,
                    resizable: false,
                    sortable: true
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'result',
                    width: 90,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return resultStore.findRecord('value', value).get('label');
                    },
                    text: 'Result',
                    typeAhead: false
                },
                {
                    text: '备注',
                    dataIndex: 'comment',
                    width: 200,
                    menuDisabled: true,
                    resizable: false,
                    sortable: true,
                    editor: {xtype: 'textfield'}
                }],
            collapsible: true,
            animCollapse: false,
            iconCls: 'icon-grid',
            autoWidth: true,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            }
        },{
			xtype: 'toolbar',
			region:'south',
			split: true,
			items: ['->',{
                text: '保存',
                glyph: 0xf0c7,
                scope: me,
                handler : function(){
				var datas=[],data=[];
				var ans=Ext.create('casco.model.ReportVats');
				Ext.getCmp('right_store').store.each(function(record){
				data.push(record.getData());
				});
				datas.push({key:Ext.getCmp('right_store').store.p_id,value:data});
				me.store.sync();
				ans.set('datas',datas);
				ans.save({callback:function(){
				//me.down('gridpanel').getView().refresh();
				me.up('panel').down('cover').store.reload();
				Ext.Msg.alert('保存成功!');
				}});
				}
			},{
            	xtype:'tbspacer',
            },{
                text: '取消',
                glyph: 0xf112,
                scope: me,
                handler : this.destroy
            }]
		}],
        this.callParent();
    }

});





