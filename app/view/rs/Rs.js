Ext.define('casco.view.rs.Rs', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.rs',
	viewModel: 'main',
//	
//	requires: [
//	           'casco.store.Versions',
//	           'casco.store.Rss',
//	           'casco.view.rs.RsImport',
//	           'casco.view.rs.RsDetail',
//	           'casco.ux.LiveSearchGridPanel'
//	           'casco'
//	           ],
//	           
//	//autoHeight: true,
//	//allowDeselect: false,
	
		
	initComponent: function() {
		var me = this;
//		me.versions = new casco.store.Versions();
//		me.store = new casco.store.Rss();
//		me.versions.load({
//			params:{
//				document_id: 'd6889236-ad21-11e4-aa9b-cf2d72b432dc' //me.document.id
//			},
//			synchronous: true,
//			callback: function(){
//				me.down('combobox').select(me.versions.getAt(0));     //取最近的版本
//				var latest_v = me.versions.getCount() > 0?me.versions.getAt(0):0;
//				me.curr_version = latest_v;
//				if(latest_v){
//					me.store.load({
//						params: {
//							version_id: latest_v.get('id')
//						}
//					});
////					me.store.each(function(rs){     
////						if(rs.tcs.length){
////							cvd++;
////						}
////					});
//				}				
//			}
//		});
//		
//		me.tbar = [{
//			xtype: 'combobox',
//			id: 'docv-'+ me.document.id,
//			fieldLabel: 'Version',
//			labelWidth: 50,
//			store: me.versions,
//			displayField: 'name',
//            valueField: 'id',
//            width:200,
//            queryMode: 'local',
//            editable: true,
//            lastQuery: '',
//            listeners: {
//            	select: function(combo, record){
//            		me.curr_version = record;
//            		me.store.load({
//            			params:{
//                			version_id: record.get('id')
//            			}
//            		})
//            	},
//            	beforequery : function(e){
//            		e.query = new RegExp(e.query.trim(), 'i');
//            		e.forceAll = true;
//        	   	}
//            }  
//		},'-',{
//			text: 'Import Doc',
//			glyph: 0xf093,
//			scope: this,
//			handler: function() {
//				var win = Ext.create('widget.rs.rsimport', {
//					listeners: {
//						scope: this
//					},
//					//version_id: me.down('combobox').getValue(),
//					document_id: me.document.id,
//					vstore:me.versions,
//					type: 'rs'
//				});
//				win.show();
//				}   
//		},'-',{
//			text: 'View Doc',
//			glyph: 0xf108,
//			scope: this,
//			handler: function() {
//				window.open("/viewdoc.html?file="+me.curr_version.get('filename'),"_blank","width=800,height=900");
//			}
//		},'-',{
//			text: 'View Graph',
//			glyph: 0xf0e8,
//			scope: this,
//			handler: function() {
//				window.open('/draw/graph.html?document_id='+me.document_id);
//			},
//			hidden: true
//		},'-',{
//			text: 'View Statistics',
//			glyph: 0xf080,
//			scope: this,
//			handler: function() {
//				window.open('/stat/cover.htm#'+me.document_id);
//			}
//		}];
//			
//		me.listeners = {
//			celldblclick: function(a,b,c,record){
//				if(c==0){
//					window.open('/draw/graph2.html#'+record.get('tag'));
//					return;
//				}
//				if(c==5||c==6){
//					var st = Ext.create('casco.store.Vat');
//					st.setData(record.get('vat'));
//					if(record.get('vatstr'))
//						st.add({id: record.get('vatstr').id, tag: record.get('vatstr').name});
//					var wd = Ext.create("casco.view.rs.vat.Add", {
//						vat: st,
//						document_id: me.document_id
//					});
//					wd.show();
//					return;
//				}
//				var win = Ext.create('widget.rs.rsdetail', {
//					rs: record,
//					editvat: c==6||c==5,
//					document_id: me.document_id
//				});
//				win.down('form').loadRecord(record);
//				win.show();
//			}
//		};
//		
//		Ext.create('casco.ux.LiveSearchGridPanel',{
//			store:me.store,
//			columnLines:true,
//			columns :[{
//				text: "tag",
//				dataIndex: "tag",
//				width: 130,
//		        summaryType: 'count',
//		        summaryRenderer: function(value, summaryData, dataIndex) {
//		            return Ext.String.format('{0} item{1}', value, value !== 1 ? 's' : '');
//		        }
//			}, {
//				text: "allocation",
//				dataIndex: "allocation",
//				flex: 1
//			}, {
//				text: "implement",
//				dataIndex: "implement",
//				width: 100,
//		        summaryRenderer: function(value, summaryData, dataIndex) {
//		        //return 'covered:' +cvd;
//		        }
//			}, {
//				text: "category",
//				dataIndex: "category",
//				width: 130
//			}, {
//				text: "tcs",
//				dataIndex: "tcs",
//				width: 250,
//				renderer: function(value) {
//					var str = ""; 
//					Ext.Array.each(value, function(v) {
//						str += v.tag + " ";
//						});
//					return str;
//				}
//			}, {
//				text: "vat",
//				dataIndex: "vat",
//				width: 250,
//				renderer : function(value) {
//					if(!value) return '';
//					var arr = [];
//					Ext.Array.each(value, function(v) {
//				        arr.push(v.tag);
//				    });
//					return arr.join(', ');
//				}
//			}, {
//				text: "vat string",
//				dataIndex: "vatstr",
//				width: 100,
//				renderer: function(value) {
//					return value?value.name:'';
//				}
//			}],
//			height: 350,
//			width: Ext.themeName === 'neptune-touch' || Ext.themeName === 'crisp' ? 700:670,
//			title: 'Live Search Grid',
//			renderTo: 'grid-example',
//			viewConfig: {
//				stripeRows: true
//			    }
//		});
 		me.callParent();
	},
		
    viewConfig: { 
        stripeRows: false, 
        getRowClass: function(record) {
        	if(record.get('tcs') == undefined)
        		return 'red';
        	if(record.get('tcs').length != 0)
        		return ''; 
        	if(record.get('tcs').length == 0 && !record.get('vat').length && !record.get('vatstr'))
        		return 'red'; 
        	if(!record.get('vat').length || record.get('vatstr'))
        		return 'yellow'; 
        } 
    },
    features: [{
    	ftype: 'summary',
    	dock: 'top'
    }],	
})