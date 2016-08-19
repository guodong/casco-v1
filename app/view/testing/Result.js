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
	                {label: 'untested', value: 0},
	                {label: 'passed',   value: 1},
	                {label: 'failed',   value: -1},
            ]
        });
		me.tmpstore = Ext.create('casco.store.TestJobTmp');
		me.tmpstore.load({
			params : {
				project_id :me.project.get('id')
			}
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
				return  v.description;
			}
		}, {
			text: "source",
			dataIndex: "tc",
			width: 200,
			autoShow: false,
			hidden: true,
			renderer: function(value) {
				var value = JSON.parse('{'+value.column+'}');
				
//				var arr = [];
//				Ext.Array.each(value, function(v) {
//					arr.push(v);
//				});
				return value.source||'';
			}
		}, {
			text: "test method",
			dataIndex: "tc",
			width: 100,
			renderer: function(v) {
			//	var str = "";
			//	for ( var i in v.testmethods) {
			//		str += v.testmethods[i].name;
			//	}
			//	return str;
			return v.testmethods;
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
	        			var rd = me.getSelectionModel().getSelection()[0];
		        		if(r.get('value') != 0){
		        			rd.set('exec_at', Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		        		}
	        			Ext.each(rd.get('tc').steps, function(step){
	        				step.result = r.get('value');
	        			});
	        			Ext.getCmp('testing-step-panel').down('grid').reconfigure();
		        	}
		        }
		    }
		}];
		me.tbar = [{
            text: 'Edit checklog',
            glyph: 0xf0e8,
            width: 120,
            scope:this,
            handler : function() {
	            var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];
				console.log(selection.get('tc').tag);
				if(!selection){Ext.Msg.alert("请选择TC");return;}
				window.open('/ace-builds/editor.html?type=python&tc_id='+selection.get('tc_id')+'&tc_tag='+selection.get('tc').tag); 
	          //  me.getView().refresh();
            }
        },{
            text: 'Edit robot',
            glyph: 0xf0e8,
            width: 110,
            scope:this,
            handler : function() {
	            var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];
				if(!selection){Ext.Msg.alert("请选择TC");return;}
				window.open('/ace-builds/editor.html?type=robot&tc_id='+selection.get('tc_id')+'&tc_tag='+selection.get('tc').tag); 
	          //  me.getView().refresh();
            }
        },{
			text: 'Save',
			id: 'testing-save-btn',
			glyph: 0xf0c7,
			handler: function() {
				var out = [];
				me.job.set('user_id',JSON.parse(localStorage.user).id);
				me.job.save();
				Ext.getCmp('joblist').getStore().reload();
				console.log(me);
//				me.job.reload({
//					project_id :me.project.get('id')
//				});
				me.getStore().each(function(r){
					var steps = [];
					Ext.each(r.get('tc').steps, function(step){
						steps.push({id: step.id, step_result_id: step.step_result_id, result: step.result==null?0:step.result, comment: step.comment});
					});
					out.push({id: r.get('id'), begin_at: r.get('begin_at'), end_at: r.get('end_at'), result: r.get('result'), cr:r.get('cr'), steps: steps});
				});
				Ext.Ajax.request({
					url: API + '/result/updateall',
					method: 'post',
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
				me.job.set('user_id',JSON.parse(localStorage.user).id);
				me.job.save({
					success: function(){
						Ext.Msg.alert('Success', 'Submit successfully.')
					}
				});
				Ext.getCmp('joblist').getStore().reload();
			}
		},{
			text: 'Export Result',
			glyph: 0xf019,
			scope: this,
			xtype: 'combobox',
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: me.tmpstore,
            queryMode: 'local',
			//itemId:'switcher',	//ManagerController
            emptyText: 'Switch Template',
            listeners: {
            	select:  function(combo, record) {
				combo.setValue(combo.emptyText);
				window.open(API+'testjob/export?job_id='+me.job.get('id')+'&tmp_id='+record.get('id'));
            	return;
				},
            }
		},{
			text: 'Export Project',
			glyph: 0xf019,
			scope: this,
			handler: function() {
				window.open(API+'testjob/export_pro?job_id='+me.job.get('id'));
            	return;
			}
		}];
    	this.callParent();
    }
})