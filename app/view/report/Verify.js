Ext.define('casco.view.report.Verify', {
	extend: 'Ext.panel.Panel',
	layout:'anchor',
	xtype:'verify',
	requires: [],
	initComponent: function() {
		var me = this;
		var store = 
			Ext.create('Ext.data.Store', {
			 model: 'Ext.data.Model',
			 proxy: {
				 type: 'rest',
				 url: API+'center/verify',
				 reader: {
					 type: 'json',	
				 }
			 },
			 autoLoad: true
			});
		 store.load({
				params: {
			    report_id:me.report.get('id')
				}
			});
		me.store = store;
		var selModel=new Ext.selection.Model({mode:"MULTI"});
        me.selModel=selModel;
		me.tbar = [{
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
		width: 120
	}];
	
     me.items = [{
			xtype: 'gridpanel',
			forceFit:true,
			title:'',
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