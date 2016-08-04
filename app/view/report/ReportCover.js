Ext.define('casco.view.report.ReportCover', {
	extend: 'Ext.grid.Panel',
	xtype: 'reportcover',
	plugins: {
		ptype: 'cellediting',
		clicksToEdit: 1
	},
	initComponent: function() {
		var me = this;
		me.store = new casco.store.ReportCover();
		me.store.load({
			params:{
				report_id: me.report.get('id')  //其他参数？
			},
			synchronous: true
		}); 
		var resultStore = Ext.create('Ext.data.Store', {
        	model: 'casco.model.Result',
            data : [
	                {label: 'untested',   value: 0},
	                {label: 'passed',   value: 1},
	                {label: 'failed',   value: 2},
            ]
        });
		  me.tbar = [{
			text: 'Save',
			glyph: 0xf080,
			scope: this,
			handler:function(){  
			 var data=[];
			// 血的教训，早知道就用这了... me.matrix.sync();
			 me.store.sync({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.getView().refresh(); // 这一行重要哇我晕
              Ext.Msg.alert('Failed','Save failed!');
			 },
			 success: function(record, operation) {
			 me.getView().refresh();Ext.Msg.alert('Success', 'Saved successfully.');
			 }
			 }); 
			 /*
				 * Ext.Array.each(rows,function(item){ item.dirty=false;
				 * item.commit(); data.push(item.getData()); });// each var
				 * model=Ext.create('casco.model.Verification',{id:me.verification.get('id')});
				 * model.set('data',data); model.save({ callback:
				 * function(record, operation, success){ }, failure:
				 * function(record, operation) { me.getView().refresh(); //
				 * 这一行重要哇我晕 Ext.Msg.alert('Failed','Save failed!'); }, success:
				 * function(record, operation) { me.getView().refresh(); //
				 * 这一行重要哇我晕 Ext.Msg.alert('Success', 'Saved successfully.');
				 *  }, });
				 */
			
			}
		},{
			  text: 'Export',
			  glyph: 0xf080,
			  scope: this,
			  handler:function(){
				  window.open(API+'reportcover/export?report_id='+me.report.get('id'));  //?URL
				  return;
			  }
			},
			'-',
			{
		    text: 'Refresh',
			glyph: 0xf067,
		    handler: function() {
				me.store.reload();
			}
			},
			{text: '需求覆盖状态', xtype:'label',margin:'0 50'}
			];
		  
		me.columns=[
			 {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:170,sortable:true},
			 {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:175,sortable:true},
			 {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:160,sortable:true},
			 {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:165,sortable:true},
			 {  xtype: 'gridcolumn',
		    dataIndex: 'result',
			width: 120,
		    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		        return resultStore.findRecord('value', value).get('label');
		    },
		    text: 'Result',
			typeAhead:false, 
		    editor: {
		        xtype: 'combobox',
				disabledCls: '',
		        queryMode: 'local',
				displayField: 'label',
				valueField: 'value',
				readOnly: true,
		        store: resultStore,
		        listeners: {
		        	select: function(combo, r){
	        		/*	var rd = me.getSelectionModel().getSelection()[0];
		        		if(r.get('value') != 0){
		        			rd.set('exec_at', Ext.Date.format(new Date(), 'Y-m-d H:i:s'));
		        		}
	        			Ext.each(rd.get('tc').steps, function(step){
	        				step.result = r.get('value');
	        			});
	        			Ext.getCmp('testing-step-panel').down('grid').reconfigure();
						*/
		        	}
		        }
		    }//editor
			},
			 {text:'justification',dataIndex:'justification',header:'justification',width:100,sortable:true,editor:{xtype:'textfield'}},
			 {text:'allocation',dataIndex:'allocation',header:'allocation',width:100,sortable:true,render:function(record){}},
			 {text:'Comment',dataIndex:'comment',header:'Comment',width:90,sortable:true,editor:{xtype:'textfield'}}
			];

			this.callParent();
		},


})
