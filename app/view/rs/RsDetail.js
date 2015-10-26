Ext.define('casco.view.rs.RsDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.rs.rsdetail',
    
    requires: [
          // 'casco.view.document.DocumentController',
           'casco.store.Vatstrs',
           'casco.store.Vat'
    ],
    
    modal: true,
    title: 'Rs Detail',
    width: 600,
    height:600,
    
    layout:{
    	type:'border'
    },
    
    initComponent: function(){
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
    	Ext.apply(me, {
    		dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                style: {background: '#eee'},
                items: ['->',
                        {
                    text: 'Close',
                    glyph: 0xf112,
                    scope: me,
                    handler : this.destroy
                },
                {
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
                }
                ]
            }],
    		items: [{
    	    	xtype: 'form',
    	    	bodyPadding: '10',
    	    	width: '100%',
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
    				hidden: me.editvat?true:false,
    	            name: 'description'
    	        },{
    	            fieldLabel: 'implement',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	            name: 'implement'
    	        },{
    	            fieldLabel: 'priority',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	            name: 'priority'
    	        },{
    	            fieldLabel: 'contribution',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	            name: 'contribution'
    	        },{
    	            fieldLabel: 'category',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	            name: 'category'
    	        },{
    	            fieldLabel: 'allocation',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	            name: 'allocation'
    	        },{
    	            fieldLabel: 'vat string',
    	            xtype: 'combobox',
    	            displayField: 'name',
    	            valueField: 'id',
    	            id: 'vatstr_id',
    	            hidden:true,
        	    	width: '100%',
    	            name: 'vatstr_id',
    	            store: me.vatstrstore,
    	            editable: false,
    	            queryMode: 'local'
    	        },{
    	            fieldLabel: 'test',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	           
    	        }, {
    				xtype: 'grid',
    				fieldLabel: 'Vat',
    				//hidden:true,
    				dockedItems: [{
    	    	        xtype: 'toolbar', 
    	    	        dock: 'bottom',
    	    	        items: [{
    	    	            glyph: 0xf067,
    	    	            text: 'Edit Vat',
    	    	            handler: function(){
    	    					var wd = Ext.create("casco.view.rs.vat.Add", {
    	    						vat: me.vat,
    	    						document_id: me.document_id
    	    					});
    	    					wd.show();
    	    				}
    	    	        }]
    	    	    }],
    			    columns: [
    			        { text: 'Vat',  dataIndex: 'tag', flex: 1}
    			    ],
    			    store: me.vat
    			}]
    	    },{
    	            fieldLabel: 'test1',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    	            name: 'test'
    	        }]
    	});
		me.items.add({
    	            fieldLabel: 'test',
    	            xtype: 'textfield',
    	            editable: false,
        	    	width: '100%',
    				hidden: me.editvat?true:false,
    	           
    	        });
		me.doLayout();
    	me.callParent(arguments);
    },
    doHide: function(){
        this.hide();
    }
});