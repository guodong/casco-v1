Ext.define('casco.view.rs.RsDetails', {
    extend: 'Ext.window.Window',
    alias: 'widget.rs.rsdetails',
    
    requires: [
          // 'casco.view.document.DocumentController',
           'casco.store.Vatstrs',
           'casco.store.Vat',
           'casco.view.main.ItemTree'
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
		
		me.vat = Ext.create('casco.store.Vat');
		if(me.rs){
			me.vat.setData(me.rs.get('vat'));
		}
		me.vatstrstore = Ext.create('casco.store.Vatstrs');
//		me.vatstrstore = new casco.store.Vatstrs();
		me.vatstrstore.load({
    		params: {
    			project_id: me.project.get('id')
    			}
    	});
		
		me.addVat = function(record){
			if(record.data.type != 'item'){
				return;
			}
			me.vat.loadData([{tag: record.data.name,id: record.data.item_id}], true);
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
				xtype: 'itemtree',
				region: 'west',
				width: 200,
		        split: true,
		        collapsible: true,
				autoScroll: true,
				document_id: me.document_id,
				project: me.project,
				listeners: {
					itemdblclick: function(view, record, item, index, e, eOpts){
						me.addVat(record);
					}
				}
			},{
				xtype:'toolbar',
				region:'south',
				split:true,
				items: ['->',{
	                text: 'Submit',
	                glyph: 0xf093,
	                scope: me,
//	                handler : this.destroy
	            }]
			},{
				xtype: 'grid',
				region: 'center',
				itemId: 'Vat',
			    columns: [
			        { text: 'Vat',  dataIndex: 'tag', flex: 1}
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
                	if(me.down("#vatstr_id").getValue().length == 36)
                		rs.set('vatstr_id', me.down("#vatstr_id").getValue());
                	rs.save({
                		callback: function(){
                        	var t = Ext.ComponentQuery.query("#tab-"+me.document_id)[0];
              		      	t.store.reload();
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
			autoScroll:true,
			items: [{
	            fieldLabel: 'tag',
	            xtype: 'textfield',
	            editable: false,
    	    	width: '100%',
	            name: 'tag'
	        },{
	            fieldLabel: 'description',
	            xtype: 'textareafield',
	            editable: false,
    	    	width: '100%',
	            name: 'description'
	        },{
	            fieldLabel: 'implement',
	            xtype: 'textfield',
	            editable: false,
    	    	width: '100%',
	            name: 'implement'
	        },{
	            fieldLabel: 'priority',
	            xtype: 'textfield',
	            editable: false,
    	    	width: '100%',
	            name: 'priority'
	        },{
	            fieldLabel: 'contribution',
	            xtype: 'textfield',
	            editable: false,
    	    	width: '100%',
	            name: 'contribution'
	        },{
	            fieldLabel: 'category',
	            xtype: 'textfield',
	            editable: false,
    	    	width: '100%',
	            name: 'category'
	        },{
	            fieldLabel: 'allocation',
	            xtype: 'textfield',
	            editable: false,
    	    	width: '100%',
	            name: 'allocation'
	        }, {
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
		}]
		me.callParent();
	}
});
		
