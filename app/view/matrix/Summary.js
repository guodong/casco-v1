Ext.define('casco.view.matrix.Summary', {
	extend: 'Ext.panel.Panel',
	layout: {
		type: 'border'
	},
	xtype:'summary',
	requires: [],
	height:500,
    forceFit:true,
	flex: 1,
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
			glyph: 0xf067,	//resources
			text: me.version,
		    xtype:'label'
		}, {
			text: 'Export',
			glyph: 0xf068,
			handler: function() {
			 	window.open(API+'/verification/summary_export?version='+me.version);
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
		text: "nb of req",
		dataIndex: "nb of req",
		width: 120
	}, {
		text: "nb of OK",
		dataIndex: "nb req OK",
		width: 120
	}, {
		text: "nb req NOK",
		dataIndex: "nb req NOK",
		width: 120
	}, {
		text: "nb req NA",
		dataIndex: "nb req NA",
		width: 120
	},{
		text: "Percent of completeness",
		dataIndex: "Percent of completeness",
	    width: 120,
	}];
	
	var center_columns= [
	{
		text: "",
		dataIndex: "doc_name",
		width: 120
	}, 
	{
		text: "Total number of NOK items",
		dataIndex: "Total number of NOK items",
		width: 120
	}, {
		text:"The number of NOK items(Not Complete)",
		dataIndex: "nb req OK",
		width: 120
	}, {
		text: "The number of NOK items(Wrong Coverage)",
		dataIndex: "nb req NOK",
		width: 120
	}, {
		text: "The number of NOK items(Logic or Description Mistake)",
		dataIndex: "nb req NA",
		width: 120
	},{
		text: "Other",
		dataIndex: "other",
	    width: 120,
	}];

     me.items = [{
			xtype: 'gridpanel',
			title:'north',
			columns:north_columns,
			//frame:true,
			//anchor:'100%, 60%',
			region:'north',
			height:'%60',
			store:store,
			collapsable: true
		}, {
			//height:100,
			region:'center',
			xtype: 'gridpanel',
			title:'center',
			height:'%40',
			flex: 1,
			columns:center_columns,
			//anchor:'100%, 40%',
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