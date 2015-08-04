Ext.define('casco.view.testing.Result', {
    extend: 'Ext.grid.Panel',
    xtype: 'testing.result',

    bodyPadding: 0,
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    listeners : {
        cellclick: function(a,b,c, record, item, index, e) {
        	Ext.getCmp('testing-step-panel').down('form').loadRecord(record);
        	Ext.getCmp('testing-step').store.loadData(record.get('tc').steps);
        }
    },
	title: 'Testing result',
	store: Ext.create('casco.store.Results'),
	scrollable: true,
	job: Ext.create('casco.model.Testjob'),
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
    	me.store.setListeners({
    		beforeload: function(){
				var cs = me.getColumns();
				var stepcs = Ext.getCmp('testing-step-panel').down('grid').getColumns();
    			if(me.job.get('status') == 1){
    				Ext.each(cs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(1);
    					}
    				});
    				Ext.each(stepcs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(1);
    					}
    				});
    				Ext.getCmp('testing-cr').setEditable(false);
    				Ext.getCmp('testing-save-btn').hide();
    				Ext.getCmp('testing-submit-btn').hide();
    			}else{
    				Ext.each(cs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(0);
    					}
    				});
    				Ext.each(stepcs, function(c){
    					if(c.getEditor()){
    						c.getEditor().setDisabled(0);
    					}
    				});
    				Ext.getCmp('testing-cr').setEditable(true);
    				Ext.getCmp('testing-save-btn').show();
    				Ext.getCmp('testing-submit-btn').show();
    			}
    		}
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
			flex:1,
			renderer: function(v) {
				return v.description
			}
		}, {
			text: "sources",
			dataIndex: "tc",
			width: 200,
			autoShow: false,
			hidden: true,
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
			text: "begin at",
			dataIndex: "begin_at",
			width: 180,
			editor: {
				editable: false,
				disabledCls: '',
				xtype: 'datetimefield',
				format: 'Y-m-d H:i:s'
			},
			renderer: function(value, md, record){
				if(typeof(value) == 'object'){
					var str = Ext.util.Format.date(value, 'Y-m-d H:i:s');
					return str;
				}
				if(value == '0000-00-00 00:00:00' || value == null){
					return '';
				}
				return value;
			}
		}, {
			text: "end at",
			dataIndex: "end_at",
			width: 180,
			editor: {
				editable: false,
				disabledCls: '',
				xtype: 'datetimefield',
				format: 'Y-m-d H:i:s'
			},
			renderer: function(value){
				if(typeof(value) == 'object'){
					var str = Ext.util.Format.date(value, 'Y-m-d H:i:s');
					return str;
				}
				if(value == '0000-00-00 00:00:00' || value == null){
					return '';
				}
				return value;
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
		        store: resultStore,
		        listeners: {
		        	select: function(combo, r){
		        		if(r.get('value') != 0){
		        			var rd = me.getSelectionModel().getSelection()[0];
		        			rd.set('exec_at', Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		        			return;
		        		}
		        	}
		        }
		    }
		}];
		me.tbar = [{
			text: 'Save',
			id: 'testing-save-btn',
			glyph: 0xf0c7,
			handler: function() {
				var out = [];
				me.getStore().each(function(r){
					var steps = [];
					Ext.each(r.get('tc').steps, function(step){
						steps.push({id: step.id, step_result_id: step.step_result_id, result: step.result==null?0:step.result, comment: step.comment});
					});
					out.push({id: r.get('id'), begin_at: r.get('begin_at'), end_at: r.get('end_at'), result: r.get('result'), cr:r.get('cr'), steps: steps});
				});
				Ext.Ajax.request({
					url: API + '/result/updateall',
					method: 'put',
					jsonData: {results: out},
					success: function(){
						Ext.Msg.alert('Success', 'Saved successfully.')
					}
				});
			}
		},{
			text: 'Submit',
			id: 'testing-submit-btn',
			glyph: 0xf093,
			scope: this,
			handler: function() {
				me.job.set('status', 1);
				me.job.save({
					success: function(){
						Ext.Msg.alert('Success', 'Submit successfully.')
					}
				});
			}
		},{
			text: 'Export',
			glyph: 0xf019,
			scope: this,
			handler: function() {
			}
		}];
    	this.callParent();
    }
})