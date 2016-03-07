Ext.define('casco.view.manage.Versions', {
	extend :'Ext.window.Window',
	xtype :'widget.versions',
	requires : [],
	layout :'fit',
	resizable :true,
	maximizable :true,
	modal :true,
	title :'Versions Management',
	width :650,
	height:300,
	initComponent : function() {
		var me = this;
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		    autoCancel: false,
            saveBtnText: '保存',
            cancelBtnText: '取消',
            errorsText: '错误',
            dirtyText: "你要确认或取消更改",
			listeners:{
			 edit:function(editor, e) {
				    // commit the changes right after editing finished
				    e.record.commit();
				}
			
		}
		});
		var columns =[{
			text :'版本name',
			dataIndex :'name',
			width :'200',
			editor : {
				xtype :'textfield'
			}
		}, {
			text :'导入时的字段(显示的列)',
			dataIndex :'headers',
			width :'300',
			editor : {
				xtype :'textfield'
			}
		}, {
			text :'所属文档',
			dataIndex :'document',
			renderer :function(v){
				return v?v.name:'';
			}
		}, {
			text :'created_at',
			dataIndex :'created_at',
			width :'200'
		}, {
			text :'updated_at',
			dataIndex :'updated_at',
			width :'200'
		}];
		me.store = Ext.create('casco.store.Versions');
		me.store.load({
			params : {
				document_id :me.document_id
			}
		});
		var onDelete=function(){
			var grid=me.down('gridpanel');
			var selected=grid.selModel.getSelection();
			Ext.MessageBox.confirm('Confirm delete','Are you sure?',function(btn){
			if(btn=='yes'){grid.store.remove(selected);grid.store.sync();
			}
			});
			};
		var onInsertRecord=function(){
		var grid=me.down('gridpanel');
		var selected=grid.selModel.getSelection();
		rowEditing.cancelEdit();
		var newstore =new casco.model.Version({document:me.store.getAt(0).get('document')});
		console.log(newstore);
		me.store.insert(selected[0].index,newstore);
		rowEditing.startEdit(selected[0].index,0);
		};
			
			
			
		var pagingToolbar = {
			xtype :'pagingtoolbar',
			store :me.store,
			displayInfo :true,
			pageSize :50,
			items : [ '-', {
				text :'Save Changes',
				handler : function(item,e) {
					me.store.sync({
					 callback: function(record, operation, success){
		             },
					 failure: function(record, operation) {
					  item.up('window').down('gridpanel').getView().refresh(); 
		              Ext.Msg.alert('Failed','Save failed!');
					 },
					 success: function(record, operation) {
					 item.up('window').down('gridpanel').getView().refresh();
					 Ext.Msg.alert('Success', 'Saved successfully.');}
					 });
				}
			}, {
				text :'Reject Changes',
				handler : function() {
					me.store.rejectChanges();
				}
			}, '-' ]
		};
		var doRowCtxMenu=function(view,record,item,index,e){
			e.stopEvent();
			var grid=me.down('gridpanel');
			if(!grid.rowCtxMenu){
			grid.rowCtxMenu=Ext.create('Ext.menu.Menu',{	
			items:[{
				text:'Insert Record',
				handler:onInsertRecord
			},
			{
				text:'Delete Record',
				handler:onDelete
			}]});
			}//if
			grid.selModel.select(record);
			grid.rowCtxMenu.showAt(e.getXY());
		};

		me.items = [{
			xtype :'gridpanel',
			forceFit :true,
			title :'',
			columns :columns,
			forceFit :true,
			loadMask :true,
			bbar :pagingToolbar,
			plugins : {
			ptype: 'cellediting',
	        clicksToEdit: 1
		    },
			selType :'rowmodel',
			store :me.store,
			listeners:{
					itemcontextmenu :doRowCtxMenu,
					destroy : function(thisGrid) {
						if (thisGrid.rowCtxMenu) {
							thisGrid.rowCtxMenu.destroy();
						}
					}
			}// listeners
		}];
		
	me.callParent(arguments);
},
doHide : function() {
	this.hide();
}

});