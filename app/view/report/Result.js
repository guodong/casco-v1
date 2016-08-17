Ext.define('casco.view.report.Result', {
    extend: 'Ext.grid.Panel',
    xtype: 'result',
    bodyPadding: 0,
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    listeners : {
          cellclick: function(a,b,c, record, item, index, e) {
        }
    },
	title: 'report result',
	scrollable: true,
    initComponent: function(){
    	var me = this;
    	var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	            {label: '<span style="color:blue">untested</span>', value: 0},
                {label: '<span style="color:green">passed</span>', value: 1},
                {label: '<span style="color:red">failed</span>', value: -1},
            ]
        });
		 this.store = Ext.create('casco.store.Reportresult');
		 this.store.reload({
    		params: {
			    report_id:me.report.get('id')
			}
    	});
		me.columns = [{
			text: 'id',
			dataIndex: 'id',
			hidden:true
		},{
			text: 'tag',
			dataIndex: 'tag',
			width:300,
			renderer: function(v) {
				return v;
			}
		}, {
			text: 'description',
			dataIndex: 'description',
			flex:1,
			width:1000,
			renderer: function(v) {
				return v;
			}
		}, {
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
				readOnly:true,
		        store: resultStore,
		        listeners: {
		        	select: function(combo, r){
	        			var rd = me.getSelectionModel().getSelection()[0];
		        		if(r.get('value') != 0){
		        			rd.set('exec_at', Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		        		}
	        			Ext.each(rd.get('tc').steps, function(step){
	        				step.result = r.get('value');
	        			});
		        	}
		        }
		    }
		},{
			text: "Build",
			dataIndex: "build",
			width: 100,
		}];
		me.tbar = [{
			text: 'Export',
			glyph: 0xf067,
			handler: function() {
			 	window.open(API+'/center/export_result?report_id='+(me.report.get('id')?me.report.get('id'):''));
            	return;
			}
		},{
			text: 'Refresh',
			glyph: 0xf019,
			scope: this,
			handler: function() {
				me.store.reload();
            	return;
			}
		}];
    	this.callParent();
    }
})