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
/*
Ext.override(Ext.dom.Element,{
 isAncestor: function(el) {
            var ret = false,
                dom = this.dom,
                child = Ext.getDom(el);
            if (dom && child) {
                if (dom.contains) {
					//console.log(dom);
                    return dom.contains(el);
                } else if (dom.compareDocumentPosition) {
                    return !!(dom.compareDocumentPosition(child) & 16);
                } else {
                    while ((child = child.parentNode)) {
                        ret = child === dom || ret;
                    }
                }
            }
            return ret;
        }

});
		

Ext.override(Ext.grid.plugin.RowExpander, { // Override to fire collapsebody & expandbody
    init: function(grid) {
        this.callParent(arguments);
        this.grid=grid;
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
*/

Ext.define('casco.view.report.ReportCover', {
    extend: 'Ext.grid.Panel',
    xtype: 'reportcover',
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
            rowBodyTpl : new Ext.XTemplate(['<div  class="detailData"  style="width:700px;float:left;overflow-x:hidden"  scroll="no" ></div><!--<div  class="detailVat" style="margin-left:10px;float:left;overflow-x: hidden" scroll="no"></div>-->'])
        });
       // me.plugins =[expander];
        var resultStore = Ext.create('Ext.data.Store', {
            model: 'casco.model.Result',
            data: [
                {label: 'untested', value: 0},
                {label: 'passed', value: 1},
                {label: 'failed', value: -1},
            ]
        });
		
        me.listeners={
            celldblclick: function(a,b,c,record){
				var win = Ext.create('widget.reportwindow', {
					record: record,
					pointer:me
				});
				win.show();
            }
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
