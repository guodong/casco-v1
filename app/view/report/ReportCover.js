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

		

Ext.override(Ext.grid.plugin.RowExpander, { // Override to fire collapsebody & expandbody
    init: function(grid) {
        this.callParent(arguments);
//        grid.getView().addEvents('collapsebody', 'expandbody');//ext论坛找到的解决办法，这样也无法添加事件
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


        Ext.suspendLayouts();
        row[addOrRemoveCls](me.rowCollapsedCls);
        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
        me.recordsExpanded[record.internalId] = isCollapsed;
        view.refreshSize();


        if (me.grid.ownerLockable) {
            ownerLock = me.grid.ownerLockable;
            view = ownerLock.lockedGrid.view;
            fireView=ownerLock.lockedGrid.view;
            rowHeight = row.getHeight();
            row.setHeight(isCollapsed ? rowHeight : '');
            row = Ext.fly(view.getNode(rowIdx), '_rowExpander');
            row.setHeight(isCollapsed ? rowHeight : '');
            row[addOrRemoveCls](me.rowCollapsedCls);
            view.refreshSize();
        } else {
            fireView = view;
        }
        this.grid.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);
        Ext.resumeLayouts(true);
    },
});


Ext.define('casco.view.report.ReportCover', {
    extend: 'Ext.grid.Panel',
    xtype: 'reportcover',
    selModel: {
                mode : "SINGLE"
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
            rowBodyTpl : new Ext.XTemplate(['<div  class="detailData"  style="width:400px;float:left;overflow-x:hidden"  scroll="no" ></div><!--<div  class="detailVat" style="margin-left:10px;float:left;overflow-x: hidden" scroll="no"></div>-->'])
        });
        me.plugins =[expander];
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: '<span style="color:blue">untested</span>', value: 0},
                {label: '<span style="color:green">passed</span>', value: 1},
                {label: '<span style="color:red">failed</span>', value: -1},
            ]
        });

        me.listeners={
            expandbody: function (expander, r, body, rowIndex) {
                var data = r.get('id');
				//console.log(data);
                var store = new casco.store.ReportCovers();
				store.load({params:{p_id:data}});
				var row=Ext.DomQuery.select("div.detailData",body);
				var col=Ext.DomQuery.select("div.detailVat",body);
                var grid = new Ext.grid.GridPanel(
				 {
                        store: store,
                        columns:[
                    {
                        text: 'Child Requirement Tag',
                        dataIndex: 'Child Requirement Tag',
                        width: 150,
						menuDisabled:true,
						resizable:false,
                        sortable: true
                    },
					 {
						xtype: 'gridcolumn',
						dataIndex: 'result',
						width: 70,
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
						menuDisabled:true,
						resizable:false,
                        sortable: true,
						editor:{xtype:'textfield'}
                    }],
						collapsible:true,
						animCollapse:false,
						iconCls:'icon-grid',
                        autoWidth: true,
                        autoHeight: true,
						scrollable:false,
						preventHeader:true,
                        renderTo: row[0],
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        }
                    });
			var right_grid = new Ext.grid.GridPanel(
				 {
                        store: Ext.create('Ext.data.Store',{r}),
                        columns:[
                    {
                        text: 'vat',
                        dataIndex: 'vat',
                        width: 150,
                        sortable: true,
						menuDisabled:true,
						resizable:false,
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
                        text: 'vat_result', dataIndex: 'vat_result',  width: 150, sortable: true,
						menuDisabled:true,
						resizable:false,
						editor:{xtype:'textfield'}
                    }],
						collapsible:true,
						animCollapse:false,
						iconCls:'icon-grid',
                        autoWidth: true,
                        autoHeight: true,
						scrollable:false,
						preventHeader:true,
                      //  renderTo: col[0],
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },
                    });
					grid.getEl().swallowEvent(['mousedown', 'mouseup', 'click','contextmenu', 'mouseover', 'mouseout','dblclick', 'mousemove', 'focusmove','focuschange', 'focusin', 'focus','focusenter']);
				//	right_grid.getEl().swallowEvent(['mousedown', 'mouseup', 'click','contextmenu', 'mouseover', 'mouseout','dblclick', 'mousemove', 'focusmove','focuschange', 'focusin', 'focus','focusenter']);
				//  }//if
            }//expandbody
			,
			collapsebody:function(rowNode,record,expandRow,opts){
				var detailData=Ext.DomQuery.select("div.detailData",expandRow);
				var parent=detailData[0];
				var child=parent.firstChild;
				while(child){
				child.parentNode.removeChild(child);
				child=child.nextSibling;
				}
			}
        }
        me.tbar = [{
            text: 'Save',
            glyph: 0xf080,
            scope: this,
            handler: function () {
                var data = [];
				//有那么多store怎么破
				var detailData=Ext.DomQuery.select("div.detailData");
				for(var i=0;i<detailData.length;i++){
				if(detailData[i].childNodes.length>0){
				var compoment=Ext.getCmp(detailData[i].childNodes[0].id);
				compoment&&compoment.store.sync();
				}
				}
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
            }
        ];
        this.callParent();
    },


})
