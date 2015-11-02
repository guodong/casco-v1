Ext.define('casco.view.rs.RsDetails', {
    extend: 'Ext.window.Window',
    alias: 'widget.rs.rsdetails',
    
    requires: [
          // 'casco.view.document.DocumentController',
           'casco.store.Vatstrs',
           'casco.store.Vat',
           'casco.view.rs.vat.VatTree'
    ],
    
    width:900,
    height:400,
//    autoScroll:true,
    resizable: true,
    maximizable: true,
//  header:false,
    title:'Rs View',
    
    modal:true,
	layout:{
		type:'border'
	},
	
	initComponent:function(){
		var me = this;
		me.store=Ext.create('casco.store.Rss');
		me.vat = Ext.create('casco.store.Vat');
		
		me.store.add([me.rs]);


		if(me.rs){
			
			me.vat.setData(me.rs.getData());
		}
	//	console.log(me.store);
		me.vatstrstore = Ext.create('casco.store.Vatstrs');
//		me.vatstrstore = new casco.store.Vatstrs();
        //终于用这种方式遍历出来了啊
        Ext.Array.each(me.columns, function(name, index, countriesItSelf) {
       // console.log(name.width);
		me.columns[index].width='100%';
		me.columns[index].editor={xtype:'textfield'};
        });
        
        console.log(me.columns);
		 
		me.vatstrstore.load({
    		params: {
    			project_id: me.project.get('id')
    			}
    	});
		
		me.addVat = function(record){
			if(record.data.type == 'folder'){
				return;
			}
			me.vat.loadData([{tag: record.get('name'),id: record.get('id'), type: record.get('type')}], true);
		};

		
		
		me.items = [{
			xtype: 'panel',
			bodyPadding:'10',
			region:'east',
			title:'Vat Edit',
			split: true,
			collapsible:true,
			collapsed:true,
			width:400,
			layout:{
				type:'border'
			},
			items: [{
				xtype: 'vattree',
				region: 'west',
				width: 200,
		        split: true,
		        collapsible: true,
				autoScroll: true,
				document_id: me.document_id,
				project: me.project,
				rs: me.rs,
//				console.log(me.rs.get('tag')),
//				itag: me.rs.get('tag'),
//				proxy: {
//	    			extraParams: {
//	    				itag: me.rs.get('tag')
//	    			}
//	    		}
				listeners: {
					itemdblclick: function(view, record, item, index, e, eOpts){
						me.addVat(record);
//						var me = this;
//			        	if(!record.get('leaf')) return;
			        	
					}
				}
			},{
				xtype: 'grid',
				region: 'center',
				itemId: 'vat',
			    columns: [
			        { text: 'Tag',  dataIndex: 'tag', flex: 1}
			    ],
			    store: me.vat,
			    listeners : {
			        itemdblclick: function(dv, record, item, index, e) {
			        	me.vat.remove(record);
			        }
			    }
			}],
		},{
			xtype: 'toolbar',
			region:'south',
			split: true,
			items: ['->',{
                text: 'Close',
                glyph: 0xf112,
                scope: me,
                handler : this.destroy
            },{
            	xtype:'tbspacer',
            },{
                text: 'Save',
                glyph: 0xf0c7,
                scope: me,
                handler : function(){
                	var rs = me.rs;
                	var vat = [];
                	me.vat.each(function(s){
            			vat.push(s.getData());
            		});
                	rs.set('vat', vat);
//                	if(me.down("#vatstr_id").getValue().length == 36)
//                		rs.set('vatstr_id', me.down("#vatstr_id").getValue());
                	rs.save({
                		callback: function(){
                        	//var t = Ext.ComponentQuery.query("#tab-"+me.document_id)[0];
              		      	//Ext.getCmp().getStore.reload();
                		}
                	});
                	this.destroy();
                }
            }]
		},{
			xtype:'form',
			title:false,
			bodyPadding:'10',
			region:'center',
			//autoScroll:true,
			items: [{
				xtype: 'gridpanel',
				fieldLabel: 'gridpanel',
				id:'inpanel',
			    columns:me.columns,
				store:me.store,
				editable: true,
				forceFit:true,
				plugins: {ptype: 'cellediting', clicksToEdit: 1}

			},{
				xtype: 'grid',
				fieldLabel: 'Vat',
				//hidden:true,
			    plugins: {
			        ptype: 'cellediting',
			        clicksToEdit: 2
			    },
			    columns: [{ 
			    		text: 'Vat',  
			    		dataIndex: 'tag', 
			    		flex: 1
			    	},{
			        	text:'Comment',
			        	dataIndex:'comment',
			        	flex:2,
			        	editor:{
			        		xtype:'textfield',
			        	}
			        }
			    ],
			    store: me.vat
			}]
		}],
					 
     
     //    Ext.getCmp('inpanel').reconfigure(me.store,me.columns);

	  /*console.log(me.items[2].items);		
	   me.items[2].items.push({
    	            fieldLabel: 'test',
    	            xtype: 'textfield',
					region:'north',
    	            editable: false,
        	    	width: '100%',
    				
    	           
    	        });
		//me.redoLayout();		
		*/
//	    listeners: {
//	        itemdblclick: function(view, record, item, index, e, eOpts){
//	        	var me = this;
//	        	if(!record.get('leaf')) return;
//	    		var tabs = Ext.getCmp('workpanel');
//	    		var tab = tabs.child('#tab-' + record.get('id'));
//	    		if(tab){
//	    			tabs.remove(tab);
//	    		}
//	    		var document = casco.model.Document;
//	    		casco.model.Document.load(record.get('id'), {
//	    			success: function(record){
//	    				tab = tabs.add({
//	    					id: 'tab-'+record.get('id'),
//	    					xtype: record.get('type'),
//	    					title: record.get('name'),
//	    					document: record,
//	    					closable: true,
//	    					project: me.project
//	    				});
//	    				tabs.setActiveTab(tab);
//	    			}
//	    		});
//
//	    	}//itemdbclick
//	    }
//		
		me.callParent();
	}
});
		
