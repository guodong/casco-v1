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
			 	window.open(API+'/verification/summary_export?version='+me.version?me.version:'');
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
	    width: 220,
	}];
	
	var center_columns= [
	{
		text: "",
		dataIndex: "doc_name",
		width: 120
	}, 
	{
		text: "nb of NOK items",
		dataIndex: "Total number of NOK items",
		width: 220
	}, {
		text:"nb of Not Complete",
		dataIndex: "nb req OK",
		width: 220
	}, {
		text: "nb of Wrong Coverage",
		dataIndex: "nb req NOK",
		width: 220
	}, {
		text: "nb of Logic or Description Mistake",
		dataIndex: "nb req NA",
		width: 220
	},{
		text: "Other",
		dataIndex: "other",
	    width: 220,
	}];

     me.items = [{
			xtype: 'gridpanel',
			forceFit:true,
			title:'summary',
			columns:north_columns,
			anchor:'100%, 50%',
			forceFit:true,
			//region:'north',
			//height:'%60',
			store:store,
			collapsable: true
		}, {
			title:'summary',
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