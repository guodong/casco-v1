Ext.define('casco.view.report.ReportCover', {
	extend: 'Ext.grid.Panel',
	xtype: 'reportcover',
	viewModel: 'main',
	plugins: {
		ptype: 'cellediting',
		clicksToEdit: 1
	},
	selModel:new Ext.selection.Model({mode:"MULTI"}),
	requires: [],      
	           
	initComponent: function() {
		var me = this;
		me.store = new casco.store.ReportCover();
		me.store.load({
			params:{
				report_id: me.report.get('id')  //其他参数？
			},
			synchronous: true
		});  
		console.log(report_id);
		 
		  me.tbar = [{
			text: 'Save',
			glyph: 0xf080,
			scope: this,
			handler:function(){  
			 var data=[];
			// 血的教训，早知道就用这了... me.matrix.sync();
			 me.store.sync({
			 callback: function(record, operation, success){
             },
			 failure: function(record, operation) {
			  me.getView().refresh(); // 这一行重要哇我晕
              Ext.Msg.alert('Failed','Save failed!');
			 },
			 success: function(record, operation) {
			 me.getView().refresh();Ext.Msg.alert('Success', 'Saved successfully.');
			 }
			 }); 
			 /*
				 * Ext.Array.each(rows,function(item){ item.dirty=false;
				 * item.commit(); data.push(item.getData()); });// each var
				 * model=Ext.create('casco.model.Verification',{id:me.verification.get('id')});
				 * model.set('data',data); model.save({ callback:
				 * function(record, operation, success){ }, failure:
				 * function(record, operation) { me.getView().refresh(); //
				 * 这一行重要哇我晕 Ext.Msg.alert('Failed','Save failed!'); }, success:
				 * function(record, operation) { me.getView().refresh(); //
				 * 这一行重要哇我晕 Ext.Msg.alert('Success', 'Saved successfully.');
				 *  }, });
				 */
			
			}
		},{
			  text: 'Export',
			  glyph: 0xf080,
			  scope: this,
			  handler:function(){
				  window.open(API+'reportcover/export?report_id='+me.report.get('id'));  //?URL
				  return;
			  }
			},
			'-',
			{
		    text: 'Refresh',
			glyph: 0xf067,
		    handler: function() {
				me.store.reload();
			}
			},
			{text: '需求覆盖状态', xtype:'label',margin:'0 50'}
			];
		  
//         me.plugins={
//		        ptype: 'cellediting',
//		        clicksToEdit: 1,
//				autoCancel:false,
//				listeners: {
//		            edit: function(editor, e) {
//					// commit 不好
//		            // e.record.commit();
//					e.record.set(e.field,e.value);
//					me.getView().refresh(); 
//		            }
//		        }
//		},

//         me.self_op=function(the,newValue,oldValue){       
//		 var rows=me.getSelectionModel().getSelection();
//		 if(rows!=undefined){
//		 Ext.Array.each(rows,function(item){
//		 item.set(newValue);
//		 });
//		 // 这行很重要,由于自定义列的后遗症
//		  me.getView().refresh();
//		 }
//		}
		
		me.columns=[
			 {text:'Parent Requirement Tag',dataIndex:'Parent Requirement Tag',header:'Parent Requirement Tag',width:170,sortable:true},
			 {text:'Parent Requirement Text',dataIndex:'Parent Requirement Text',header:'Parent Requirement Text',width:175,sortable:true},
			 {text:'Child Requirement Tag',dataIndex:'Child Requirement Tag',header:'Child Requirement Tag',width:160,sortable:true},
			 {text:'Child Requirement Text',dataIndex:'Child Requirement Text',header:'Child Requirement Text',width:165,sortable:true},
			 {text:'result',dataIndex:'result',header:'result',width:80,sortable:true},
			 {text:'justification',dataIndex:'justification',header:'justification',width:100,sortable:true,editor:{xtype:'textfield'}},
			 {text:'allocation',dataIndex:'allocation',header:'allocation',width:100,sortable:true,render:function(record){}},
			 {text:'Comment',dataIndex:'comment',header:'Comment',width:90,sortable:true,editor:{xtype:'textfield'}}
			];
	
        me.listeners={}
		me.callParent(arguments);
		},

	showHeaderMenu: function (menu) {
        var me = this;
        me.removeCustomMenuItems(menu);
        me.addCustomMenuitems(menu);
    },

  
    removeCustomMenuItems: function (menu) {
        var me = this,
            menuItem;

        while (menuItem = me.customMenuItemsCache.pop()) {
            menu.remove(menuItem.getItemId(), false);
        }
    },

    addCustomMenuitems: function (menu) {
        var me = this,
            renderedItems;

        var menuItems = menu.activeHeader.customMenu || [];

        if (menuItems.length > 0) {

			 menu.removeAll();
            if (menu.activeHeader.renderedCustomMenuItems === undefined) {
                renderedItems = menu.add(menuItems);
                menu.activeHeader.renderedCustomMenuItems = renderedItems;
            } else {
                renderedItems = menu.activeHeader.renderedCustomMenuItems;
                menu.add(renderedItems);
            }
            Ext.each(renderedItems, function (renderedMenuItem) {
                me.customMenuItemsCache.push(renderedMenuItem);
            });
        }// if
    },
	/*
	 * afterRender:function(){ var me = this; me.callParent(arguments);
	 * me.textField= me.down('textfield[name = searchField]'); me.statusBar =
	 * me.down('statusbar[name = searchStatusBar]');
	 * me.view.on('cellkeydown',me.focusTextField,me); }
	 */
	
})
