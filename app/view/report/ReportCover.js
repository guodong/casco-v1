/*Ext.override(Ext.grid.Panel, { 
    checkThatContextIsParentGridView: function(e){
        var target = Ext.get(e.target);
        var parentGridView = target.up('.x-grid-view');
		console.log(parentGridView,this.el);
        if (this.el != parentGridView) {
            // event of different grid caused by grids nesting 
            return false;
        } else {
            return true;
        }
    },
    processItemEvent: function( type , view , cell , recordIndex , cellIndex , e ) {
		console.log(e);
        if (e.target && !this.checkThatContextIsParentGridView(e)) {
            return false;
        } else {
            return this.callParent([ type , view , cell , recordIndex , cellIndex , e ]);
        }
    }
});*/


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


        // Suspend layouts because of possible TWO views having their height change
        Ext.suspendLayouts();
        row[addOrRemoveCls](me.rowCollapsedCls);
        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
        me.recordsExpanded[record.internalId] = isCollapsed;
        view.refreshSize();


        // Sync the height and class of the row on the locked side
        if (me.grid.ownerLockable) {
            ownerLock = me.grid.ownerLockable;
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
        this.grid.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);
        Ext.resumeLayouts(true);
    },
});


Ext.define('casco.view.report.ReportCover', {
    extend: 'Ext.grid.Panel',
    xtype: 'reportcover',
    selModel: {
                //preventFocus:true,
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
            rowBodyTpl : new Ext.XTemplate(['<div  class="detailData" ></div>'])
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

                // if (Ext.DomQuery.select("div.x-panel-bwrap", body).length == 0) {
                var data = r.get('common');
                var store = new casco.store.ReportCovers();
				store.load({id:data.join(',')});
				var row=Ext.DomQuery.select("div.detailData",body);
                var grid = new Ext.grid.GridPanel(
				 {
                        store: store,
                        columns:[
                    {
                        text: 'Child Requirement Tag',
                        dataIndex: 'Child Requirement Tag',
                        width: 200,
						menuDisabled:true,
						resizable:false,
                        sortable: true
                    },
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
                    },
                    {
                        text: 'Comment',
                        dataIndex: 'comment',
                        width: 150,
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
						preventHeader:true,
                        renderTo: row[0],
                        plugins: {
                            ptype: 'cellediting',
                            clicksToEdit: 1
                        },
                    });
					grid.getEl().swallowEvent(['mousedown', 'mouseup', 'click','contextmenu', 'mouseover', 'mouseout','dblclick', 'mousemove', 'focusmove','focuschange', 'focusin', 'focus','focusenter']);
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
                width: 300,
                sortable: true
            },
            {
                text: 'Parent Requirement Text',
                dataIndex: 'Parent Requirement Text',
                header: 'Parent Requirement Text',
                width: 300,
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
