Ext.define('casco.view.matrix.Summary', {
	extend: 'Ext.panel.Panel',
	layout:'anchor',
	xtype:'summary',
	requires: [],
	initComponent: function() {
		var me = this;
		var store = 
			Ext.create('Ext.data.Store', {
			 model: 'Ext.data.Model',
			 proxy: {
				 type: 'rest',
				 url: API+'verification/summary',
				 reader: {
					 type: 'json',	
				 }
			 },
			 autoLoad: true
			});
		 store.load({
				params: {
			    version:me.version
				}
			});
		me.store = store;
		var selModel=new Ext.selection.Model({mode:"MULTI"});
        me.selModel=selModel;
		me.tbar = [{
			text: 'Export',
			glyph: 0xf067,
			handler: function() {
//				alert(1);
			 	window.open(API+'/verification/summary_export?version='+(me.version?me.version:''));
			 	
            	return;
			}
		},'->',{
		    text: me.version,
			glyph: 0xf068,
		    xtype:'label'
		}];
		
	var north_columns=[
	{
		text: "",
		dataIndex: "doc_name",
		width: 120
	}, 
	{
		text: "Num of Req",
		dataIndex: "nb of req",
		width: 120
	}, {
		text: "Num of OK Req",
		dataIndex: "nb req OK",
		width: 120
	}, {
		text: "Num of NOK Req",
		dataIndex: "nb req NOK",
		width: 120
	}, {
		text: "Num of NA Req",
		dataIndex: "nb req NA",
		width: 120
	},{
		text: "Percent of completeness",
		dataIndex: "Percent of completeness",
	    width: 220,
	}];
	
	var center_columns= [
	{
		text: "",
		dataIndex: "doc_name",
		width: 120
	}, 
	{
		text: "Num of NOK items",
		dataIndex: "defect_num",
		width: 220
	}, {
		text:"Num of Not Complete items",
		dataIndex: "not_complete",
		width: 220
	}, {
		text: "Num of Wrong Coverage items",
		dataIndex: "wrong_coverage",
		width: 220
	}, {
		text: "nb of Logic or Description Mistake items",
		dataIndex: "logic_error",
		width: 300
	},{
		text: "Other",
		dataIndex: "other",
	    width: 120,
	}];

     me.items = [{
			xtype: 'gridpanel',
			forceFit:true,
			title:'Verification Result 统计',
			columns:north_columns,
			anchor:'100%, 50%',
			forceFit:true,
			//region:'north',
			//height:'%60',
			store:store,
			collapsable: true
		}, {
			title:'Defect Type 统计',
			region:'center',
			xtype: 'gridpanel',
			forceFit:true,
			columns:center_columns,
			anchor:'100%, 50%',
			store:store
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