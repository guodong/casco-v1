Ext.define('casco.view.testing.Result', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.result',

    bodyPadding: 0,
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    listeners : {
//        celldblclick: function(a,b,c, record, item, index, e) {
//        	var win = Ext.create('widget.testmore',{result: record});
//        	win.down('form').loadRecord(record);
//            win.show();
//        }
    },
	title: 'Testing result',
	store: Ext.create('casco.store.Results'),
	scrollable: true,
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
			text: 'tc',
			dataIndex: 'tc',
			renderer: function(v) {
				return v.tag
			}
		}, {
			text: 'description',
			dataIndex: 'tc',
			renderer: function(v) {
				return v.description
			}
		}, {
			text: "sources",
			dataIndex: "tc",
			width: 200,
			autoShow: false,
			flex:1,
			renderer: function(value) {
				var value = JSON.parse(value.source_json);
				var arr = [];
				Ext.Array.each(value, function(v) {
					arr.push(v);
				});
				return arr.join(', ');
			}
		}, {
			text: "test method",
			dataIndex: "tc",
			width: 100,
			renderer: function(v) {
				var str = "";
				for ( var i in v.testmethods) {
					str += v.testmethods[i].name;
				}
				return str;
			}
		}, {
			text: "exe time",
			dataIndex: "exe_at",
			width: 140,
			editable: false,
			editor: {
				xtype: 'datefield',
				format: 'Y-m-d',
				editable: false,
			},
			renderer: function(value){
				return Ext.util.Format.date(value, 'Y-m-d');
			}
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
		        store: resultStore,
		        listeners: {
		        	select: function(combo, r){
		        		if(r.get('value') != 2){
		        			return;
		        		}
		        		var win = Ext.create('widget.testmore',{result: Ext.getCmp('result-main').getSelectionModel().getSelection()[0]});
		            	win.down('form').loadRecord(Ext.getCmp('result-main').getSelectionModel().getSelection()[0]);
		                win.show();
		        	}
		        }
		    }
		}];
		me.tbar = [{
			text: 'Save',
			glyph: 0xf0c7,
			handler: function() {
				if(me.store.getModifiedRecords().length = 0){
					Ext.Msg.alert('Notice', 'No need to save.')
					return;
				}
				me.store.sync({
					callback: function(){
						Ext.Msg.alert('Success', 'Saved successfully.')
					}
				})
			}
		},{
			text: 'Submit',
			glyph: 0xf093,
			scope: this,
			handler: function() {
			}
		}];
    	this.callParent();
    }
})