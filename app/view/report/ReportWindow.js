Ext.define('casco.view.report.ReportWindow', {
    extend: 'Ext.window.Window',
    xtype: 'reportwindow',
    width: 900,
    height: 500,
    fit: true,
    layout: 'border',
    initComponent: function () {

        var me = this;
        var r = me.record;
        me.store = new casco.store.ReportCovers();
        me.store.load({params: {p_id: me.record ? me.record.get('id') : null}});
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: 'untested', value: 0},
                {label: 'passed', value: 1},
                {label: 'failed', value: -1},
            ]
        });
        var vats = me.record.get('vats'), vatstr = [];
        Ext.Array.each(JSON.parse(vats),
            function (item, index) {
                vatstr.push(item);
            }
        );
        var right_store = new Ext.data.JsonStore({
            auteLoad: true, //此处设置为自动加载
            data: vatstr,
            model: 'casco.model.ReportField',
            p_id: r.get('id')
        });
        console.log(right_store.getData());
        me.items = [{
            title: 'Vat=>Result',
            region: 'east',     // 所在的位置
            xtype: 'gridpanel',
            width: '50%',
            split: true,        
            store: right_store,
            scrollable: true,
            columns: [
                {
                    text: 'vat',
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
                    text: 'vat_result', dataIndex: 'vat_result', width: 150, sortable: true,
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
                    text: 'comment', dataIndex: 'comment', width: 150, sortable: true,
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
                    text: 'Child Requirement Tag',
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
                    text: 'Comment',
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
                text: 'Save',
                glyph: 0xf0c7,
                scope: me,
                handler : function(){
				var datas=[],data=[];
				var ans=Ext.create('casco.model.ReportVats');
				right_store.each(function(record){
				data.push(record.getData());
				});
				//datas[vats.store.p_id]=data;
				datas.push({key:right_store.p_id,value:data});
				me.store.sync();
				ans.set('datas',datas);
				ans.save({callback:function(){
				console.log(me.pointer);
				//me.pointer.reconfigure(me.pointer.store, me.pointer.columns);
                me.pointer.store.reload();
				//me.down('gridpanel').getView().refresh();
				Ext.Msg.alert('保存成功!');
				me.destroy();
				}});
				}
			},{
            	xtype:'tbspacer',
            },{
                text: 'Cancel',
                glyph: 0xf112,
                scope: me,
                handler : this.destroy
            }]
		}],
        this.callParent();
    }

});





