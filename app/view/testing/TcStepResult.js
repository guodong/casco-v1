Ext.define('casco.view.testing.TcStepResult', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.tcstepresult',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.TextArea',
        'Ext.form.field.Number',
        'Ext.toolbar.TextItem',
        'casco.store.TcSteps'
    ],
    id: 'mgrid',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    initComponent: function(){
    	var me = this;
    	var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	                {label: 'untested',   value: 0},
	                {label: 'passed',   value: 1},
	                {label: 'failed',   value: 2},
            ]
        });
    	me.columns = [{
    		xtype: 'rownumberer',
    		text: 'step',
    		width: 80
        },{
            text: 'Actions',
            width: '45%',
            dataIndex: 'actions'
        },{
            text: 'Expected Result',
            flex: true,
            dataIndex: 'expected_result'
        },{
    	    xtype: 'gridcolumn',
    	    dataIndex: 'result',
    		width: 120,
    	    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
    	        return resultStore.findRecord('value', value).get('label');
    	    },
    	    text: 'Result',
    	    editor: {
    	        xtype: 'combobox',
    	        queryMode: 'local',
    			displayField: 'label',
    			valueField: 'value',
    			editable: false,
    	        store: resultStore
    	    }
    	}];
    	me.callParent(arguments); //必须在getSelectionModel上边，否则报错
    }
});