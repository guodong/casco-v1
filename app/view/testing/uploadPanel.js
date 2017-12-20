Ext.define("casco.view.testing.uploadPanel", {
	extend: 'Ext.panel.Panel',
	xtype: 'uploadPanel',
	controller: 'testing',
	initComponent: function (cfg) {
		var me = this;
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			autoCancel: false,
			saveBtnText: '保存',
			cancelBtnText: '取消',
			errorsText: '错误',
			dirtyText: "请确认或取消更改",
			listeners: {
				edit: function (editor, e) {
					// commit the changes right after editing finished
					e.record.commit();
				}
			}
		});
		var doRowCtxMenu = function (view, record, item, index, e) {
			e.stopEvent();
			var grid = me.down('gridpanel');
			if (!grid.rowCtxMenu) {
				grid.rowCtxMenu = Ext.create('Ext.menu.Menu', {
					items: [
						{
							text: 'Delete Record',
							handler: onDelete
						}]
				});
			}// if
			grid.selModel.select(record);
			grid.rowCtxMenu.showAt(e.getXY());
		};
		var onDelete = function () {
			var grid = me.down('gridpanel');
			var selected = grid.selModel.getSelection();
			Ext.MessageBox.confirm('Confirm delete', 'Are you sure?', function (btn) {
				if (btn == 'yes') {
					grid.store.remove(selected);
					grid.store.sync({ callback: function (record, operation, success) { Ext.getCmp('result-main').tmpstore.reload(); } });
				}
			});
		};
		var pagingToolbar = {
			xtype: 'pagingtoolbar',
			store: me.store,
			displayInfo: true,
			pageSize: 50,
			doRefresh: function () {
				me.store.reload();
			},
			items: ['-', {
				text: '保存',
				glyph: 0xf0c7,
				handler: function (item, e) {
					me.store.sync({
						callback: function (record, operation, success) {
						},
						failure: function (record, operation) {
							item.up('window').down('gridpanel').getView().refresh();
							Ext.getCmp('result-main').tmpstore.reload();
							Ext.Msg.alert('失败', '保存失败。');
						},
						success: function (record, operation) {
							item.up('window').down('gridpanel').getView().refresh();
							Ext.getCmp('result-main').tmpstore.reload();
							Ext.Msg.alert('成功', '保存成功。');
						}
					});
				}
			}/*, {
				text :'取消',
				glyph: 0xf0e2,
				handler : function() {
					me.store.rejectChanges();
				}
			}, */, '-']
		};
		this.gp = new Ext.grid.GridPanel({// 修改为可编辑表格
			border: false,
			selModel: 'rowmodel',
			store: me.store,
			columns: [
				// new Ext.grid.RowNumberer(),
				{ header: '文件名', width: 100, sortable: true, dataIndex: 'name', menuDisabled: true, editor: { xtype: 'textfield' } },
				{ header: '大小(bytes)', width: 100, sortable: true, dataIndex: 'size', menuDisabled: true, renderer: this.formatFileSize },
				{ header: '类型', width: 70, sortable: true, dataIndex: 'type', menuDisabled: true, renderer: this.formatFileSize },
				{ header: '文件说明', width: 150, sortable: true, dataIndex: 'details', menuDisabled: true, editor: { xtype: 'textfield' } },
				//			{header: '路径', width: 100, sortable: true,dataIndex: 'path', menuDisabled:true}, 
				{ header: '创建时间', width: 150, sortable: true, dataIndex: 'created_at', menuDisabled: true },
				{ header: '修改时间', width: 150, sortable: true, dataIndex: 'updated_at', menuDisabled: true },
				//{header: ' ',width:40,dataIndex:'id', menuDisabled:true,renderer:this.formatDelBtn}         
			],
			bbar: pagingToolbar,
			plugins: {
				ptype: 'cellediting',
				clicksToEdit: 1
			},
			listeners: {
				itemcontextmenu: doRowCtxMenu,
				destroy: function (thisGrid) {
					if (thisGrid.rowCtxMenu) {
						thisGrid.rowCtxMenu.destroy();
					}
				}
			}// listeners
		});


		/*this.setting = {  
			upload_url : this.uploadUrl,   
			flash_url : this.flashUrl,  
			file_size_limit : this.fileSize || (1024*50) ,// 上传文件体积上限，单位MB
			file_post_name : this.filePostName,  
			file_types : this.fileTypes||"*.*",  // 允许上传的文件类型
			file_types_description : "All Files",  // 文件类型描述
			file_upload_limit : "0",  // 限定用户一次性最多上传多少个文件，在上传过程中，该数字会累加，如果设置为“0”，则表示没有限制
			// file_queue_limit : "10",//上传队列数量限制，该项通常不需设置，会根据file_upload_limit自动赋值
			post_params : this.postParams||{Detail:'ok'} ,  
			use_query_string : true,  
			debug : false, 
			custom_settings : {// 自定义参数
				scope_handler : this  
			},  
			file_queued_handler : 'onFileQueued',  
			swfupload_loaded_handler : function(){console.log('fuck you');},// 当Flash控件成功加载后触发的事件处理函数
			file_dialog_start_handler : function(){},// 当文件选取对话框弹出前出发的事件处理函数
			file_dialog_complete_handler : 'onDiaogComplete',// 当文件选取对话框关闭后触发的事件处理
			upload_start_handler : 'onUploadStart',// 开始上传文件前触发的事件处理函数
			upload_success_handler : 'onUploadSuccess',// 文件上传成功后触发的事件处理函数
			swfupload_loaded_handler : function(){},// 当Flash控件成功加载后触发的事件处理函数
			upload_progress_handler : 'uploadProgress',  
			upload_complete_handler : 'onUploadComplete',  
			upload_error_handler : 'onUploadError',  
			file_queue_error_handler : 'onFileError' 
		};  */
		me.tbar = [
			{
				text: '添加文件', glyph: 0xf067, handler: function () {
					var win = Ext.widget('testing.templateimport', {
						project_id: me.project.get('id'),
					});
					win.show();
				}
			}
			//            ,'-',  
			//           // {text:'删除文件',ref:'../uploadBtn',iconCls:'btn-up',handler:'startUpload',scope:me},'-',  
			//           // {text:'停止上传',ref:'../stopBtn',iconCls:'btn-cancel',handler:'stopUpload',scope:this,disabled:true},'-',
			//            {text:'删除所有',ref:'../deleteBtn',iconCls:'btn-clear',handler:'deleteAll',scope:me},'-'  
		],
			me.layout = 'fit',
			me.items = [this.gp],
			me.callParent(arguments);
	}// init
});


