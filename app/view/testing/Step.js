Ext.define('casco.view.testing.Step', {
    extend: 'Ext.panel.Panel',

    xtype: 'testing.step',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.TextArea',
        'Ext.form.field.Number',
        'Ext.toolbar.TextItem',
        'casco.store.TcSteps'
    ],
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
    	me.items = [{
    		xtype: 'form',
    		bodyPadding: 10,
    		items: [{
    			xtype: 'textfield',
    			id: 'testing-cr',
    			fieldLabel: 'CR',
    			name: 'cr',
    			width: '100%',
    			labelWidth: 50,
        		listeners: {
        			change: function(t, v){
        				t.up('form').getRecord().set('cr', v);
        			}
        		}
    		}]
    	},{
    		xtype: 'grid',
    		id: 'testing-step',
    	    store: Ext.create('casco.store.Tcs'),
    	    sortableColumns: false,
    	    plugins: {
    	        ptype: 'cellediting',
    	        clicksToEdit: 1
    	    },
    		columns: [{
        		xtype: 'rownumberer',
        		text: 'step',
        		width: 70
            },{
                text: 'Actions',
                width: '35%',
                dataIndex: 'actions'
            },{
                text: 'Expected Result',
                hidden: true,
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
    				disabledCls: '',
        	        queryMode: 'local',
        			displayField: 'label',
        			valueField: 'value',
        			editable: false,
        	        store: resultStore,

    		        listeners: {
    		        	select: function(combo, r){
    		        		me.down('grid').getSelectionModel().getSelection()[0].set('result', r.get('value')); //必须先手动把值付给store，因为ext先触发select事件后付给store的
    		        		var result = 1;
    		        		me.down('grid').getStore().each(function(step){
    		        			if(step.get('result') == 2){
    		        				result = 2;
    		        				return false;
    		        			}else if(step.get('result') == 0){
    		        				result = 0;
    		        			}
    		        		});console.log(result)
    		        		me.down('form').getRecord().set('result', result);
    		        	}
    		        }
        	    }
        	},{
        		text: 'comment',
        		dataIndex: 'comment',
                flex: true,
        		editor: {
    				disabledCls: '',
        			xtype: 'textfield'
        		}
        	}]
    	}];
    	me.callParent(arguments); //必须在getSelectionModel上边，否则报错
    }
});