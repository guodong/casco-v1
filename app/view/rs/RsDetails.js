Ext.define('casco.view.rs.RsDetails', {
    extend: 'Ext.window.Window',
    alias: 'widget.rs.rsdetails',
    
    requires: [
           'casco.store.Vatstrs',
           'casco.store.Vat',
           'casco.view.rs.vat.VatTree'
    ],
    
    width:900,
    height:650,
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
		console.log(me.rs);
//		me.store.add([me.rs]);
		if(me.rs){
			me.store.add([me.rs]);
			me.vat.setData(me.rs.getData().vat);
		};
	//	console.log(me.store);
		
		me.vatstrstore = Ext.create('casco.store.Vatstrs');
//		me.vatstrstore = new casco.store.Vatstrs();	//same
		me.vatstrstore.load({
    		params: {
    			project_id: me.project.get('id')
    			}
    	});
		console.log(me.vatstrstore);
		
		me.addVat = function(record){
			//console.log(record);
			if(!record.data.leaf){
				return;
			};
			var tmp={tag: record.get('name'),id: record.get('id'), type: record.get('type')};
			console.log(me.vat);
			if(Ext.Array.contains(me.vat,tmp))return;
			me.vat.loadData([tmp], true);
		};
		console.log(me.store);

		
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
                text: 'Save',
                glyph: 0xf0c7,
                scope: me,
                handler : function(){
                	var rs = me.rs;
                	var vat = [];
                	me.vat.each(function(s){
            			vat.push(s.getData());
            		});
            		  
            		  var column='';
            		  //console.log(me.down('form').getValues());
            		  //可以不用很low的拼接,可以push2array2join
            		  var my_rs=Ext.create('casco.model.Rs',{id:me.status?rs.get('id'):null});
            		  Ext.Object.each(me.down('form').getValues(), function(key, value, myself){
            		  	
            		  	if(key!='id'&&key!='tag'){column+='"'+key+'":"'+value+'",';}
            	      else if(key=='tag'){my_rs.set('tag',value);}
            		  	
            		  });
            		  
            		  my_rs.set('column',column.substr(0,column.length-1));
            		
                	my_rs.set('vat', vat);
                	my_rs.set('version_id',me.version_id);
                	my_rs.save({
                		callback: function(record, operation, success){
                        //	var t = Ext.ComponentQuery.query("#tab-"+me.document_id)[0];
                        //console.log(me.down('form').getValues());
                          rs.set(me.down('form').getValues());
                          rs.set('vat',vat);
                          //me.up('gridpanel').store.reload();
                          if(!me.status){
                        	  t = Ext.ComponentQuery.query("#tab-" + me.document_id)[0];
    						  t.store.reload();
                          }else{
                              me.pointer.reconfigure(me.pointer.store, me.pointer.columns);
                              me.pointer.getView().refresh();
                          }
                          Ext.Msg.alert('更新成功');
                        	//暂时修改前端对象吧
                          me.destroy();  
													//var t = Ext.ComponentQuery.query("#tab-" + me.document_id)[0];
													//t.store.reload();
                        	
              		     
                		}
                	});
                	
                }
            },{
            	xtype:'tbspacer',
            },{
                text: 'Cancel',
                glyph: 0xf112,
                scope: me,
                handler : this.destroy
            }]
		},{
			xtype:'form',
			title:false,
			bodyPadding:'10',
			region:'center',
			autoScroll:true,
			items: [{
				anchor : '100%',
				fieldLabel : 'Tag',
				name : 'tag',
				value: me.tag_id,
				xtype : 'textfield',
				allowBlank: false,
				blankText: 'Tag不能为空，请输入Tag',
				regex: /(\[.+\])/,
				regexText: 'Tag格式错误，须包含[]且不为空',
				msgTarget : 'side'
				},
			{
				xtype: 'gridpanel',
				fieldLabel: 'gridpanel',
				id:'inpanel',
			 //   columns:me.columns,
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
					 
     
    console.log(me.columns);
	  
	  Ext.Array.each(me.columns, function(name, index, countriesItSelf) {
		  if(name.dataIndex == 'tag') return;
		Ext.Array.insert(me.items[2].items,1,
			    [{anchor : '100%',
				fieldLabel : name.dataIndex,
				name : name.dataIndex,
				xtype : 'textarea',
				grow: true,
	            allowBlank: true}]);//插入值即可
		
        },this,true);
        
		//me.redoLayout();		
	 
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
		
