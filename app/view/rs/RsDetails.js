Ext.define('casco.view.rs.RsDetails', {
    extend: 'Ext.window.Window',
    alias: 'widget.rs.rsdetails',
    requires: [
           'casco.store.Vatstrs',
           'casco.store.Vats',
           'casco.view.rs.vat.VatTree'
    ],
    width:900,
    height:650,
    resizable: true,
    maximizable: true,
    title:'Rs View',
    modal:true,
	layout:{
		type:'border'
	},
	initComponent:function(){
		var me = this;
		me.store=Ext.create('casco.store.Rss');
		me.vat = Ext.create('casco.store.Vats');
		if(me.rs){
			me.store.add([me.rs]);
			me.vat.setData(me.rs.getData().vat);
		};
		me.vatstrstore = Ext.create('casco.store.Vatstrs');
		me.vatstrstore.load({
    		params: {
    			project_id: me.project.get('id')
    			}
    	});
		me.addVat = function(record){
			if(!record.data.leaf){
				return;
			};
			var tmp={tag: record.get('name'),id: record.get('id'), type: record.get('type')};
			if(Ext.Array.contains(me.vat,tmp))return;
			me.vat.loadData([tmp], true);
		};
		me.items = [{
			xtype: 'panel',
			bodyPadding:'10',
			region:'east',
			title:'Vat Edit',
			split: true,
			collapsible:true,
			collapsed:false,
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
				listeners: {
					itemdblclick: function(view, record, item, index, e, eOpts){
						me.addVat(record);
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
                text: '保存',
                glyph: 0xf0c7,
                scope: me,
                handler : function(){
                	var rs = me.rs;
                	var vat = [];
                	me.vat.each(function(s){
            			vat.push(s.getData());
            		});
				  var column='';
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
                          rs.set(me.down('form').getValues());
                          rs.set('vat',vat);
                          if(!me.status){
                        	  t = Ext.ComponentQuery.query("#tab-" + me.document_id)[0];
    						  t.store.reload();
                          }else{
                              me.pointer.reconfigure(me.pointer.store, me.pointer.columns);
                              me.pointer.getView().refresh();
                          }
                          Ext.Msg.alert('更新成功');
                          me.destroy();  
                		}
                	});
                	
                }
            },{
            	xtype:'tbspacer',
            },{
                text: '取消',
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
				store:me.store,
				editable: true,
				forceFit:true,
				plugins: {ptype: 'cellediting', clicksToEdit: 1}

			},{
				xtype: 'grid',
				fieldLabel: 'Vat',
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
		me.callParent();
	}
});
		
