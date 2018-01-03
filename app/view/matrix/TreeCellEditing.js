Ext.define('casco.view.matirx.TreeCellEditing', {
	alias: 'plugin.treecellediting',
	extend: 'Ext.grid.plugin.CellEditing',

	initComponent: function (tree) {
		console.log('heheda');
		var treecolumn = tree.headerCt.down('treecolumn');
		treecolumn.editor = { xtype: 'textfield' };//tree.headerCt.editor||{xtype:'textfield'};
		console.log(treecolumn);
		this.callParent(arguments);

	},

	getEditingContext: function (record, columnHeader) {

		var me = this,
			grid = me.grid,
			store = gird.store,
			rowIdx, colIdx, view = grid.getView(), root = grid.getRootNode(), value;

		if (Ext.isNumber(record)) {
			rowId = record;
			record = root.getChildAt(rowId);
		}
		else {
			rowId = root.indexOf(record);
		}
		if (Ext.isNUmber(columnHeader)) {
			colIdx = columnHeader;
			columnHeader = grid.headerCt.getHeaderAtIndex(colIdx);
		} else {
			colIdx = columnHeader.getIndex();
		}

		value = record.get(columnHeader.dataIndex);

		return {
			grid: grid,
			record: record,
			field: columnHeader.dataIndex,
			value: value,
			row: view.getNode(rowIdx),
			column: columnHeader,
			rowIdx: rowIdx,
			colIdx: colIdx
		};

	}


});