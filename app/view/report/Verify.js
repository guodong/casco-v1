Ext.define('casco.view.report.Verify', {
	extend: 'Ext.panel.Panel',
	layout:'anchor',
	xtype:'verify',
	multiSelect : true,
	requires: [],
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Verify', {
    		proxy: {
    			extraParams: {
    			report_id:me.report.get('id'),
				doc_id:me.doc_id?me.doc_id:null
    			}
    		}
    	});
		store.load();
		me.store = store;
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
			glyph: 0xf067,
			handler: function() {
			 	window.open(API+'/verification/summary_export?v_id='+(me.verification.get('id')?me.verification.get('id'):''));
            	return;
			}
		},'-',{
		    text: 'Refresh',
			glyph: 0xf067,
		    handler: function() {
				me.store.reload();
			}
		}];
		
	var north_columns=[
	{
		text: "Req ID",
		dataIndex: "id",
		hidden:true
	}, 
	{
		text: "Req ID",
		dataIndex: "tag",
		width: 120
	}, 
	{
		text: "Description",
		dataIndex: "description",
		width: 120
	}, {
		text: "Result",
		dataIndex: "result",
		width: 120
	}, {
		text: "Test case ID",
		dataIndex: "test_case",
		width: 120
	}, {
		text: "Comment",
		dataIndex: "comment",
		editor:{xtype:'textfield'},
		width: 120
	}];
	
     me.items = [{
			xtype: 'gridpanel',
			forceFit:true,
			title:'',
			plugins: {
			ptype: 'cellediting',
			clicksToEdit: 1
			},
			selModel:new Ext.selection.Model({mode:"MULTI"}),
			columns:north_columns,
			anchor:'100%, 100%',
			forceFit:true,
			region:'north',
			//height:'%60',
			store:store,
			collapsable: true
		}];
	  me.callParent();
	},
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	//if(localStorage.role == 'staff') return;  //用户权限
			Ext.Msg.alert('Warning','不可编辑!');
        }
    }

});