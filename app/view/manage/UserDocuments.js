Ext.define('casco.view.manage.UserDocuments', {
	extend: 'Ext.window.Window',
	controller: 'manage',
	alias: 'widget.UserDocuments',
	requires: ['Ext.grid.plugin.CellEditing'],
	resizable: true,
	maximizable: true,
	modal: true,
	autoScroll: true,
	title: '文档权限',
	//title: 'Documents Privileges',
	width: 400,
	id: 'userdocs',
	minHeight: 400,
	layout: {
		type: 'fit'
	},
	initComponent: function () {
		var me = this;
		//var projects = Ext.create('casco.store.Projects');
		//projects.load();
		var documents = Ext.create('casco.store.Documents');
		documents.load();
		var test = function (node, checked) {

			for (var j = 0; j < node.childNodes.length; j++) {
				//	node.childNodes[j].fireEvent('checkchange',node.childNodes[j], checked);//为什么不会递归地触发,不搞了搞死了
				node.childNodes[j].set('checked', checked);
				if (node.childNodes[j].hasChildNodes()) {

					test(node.childNodes[j], checked);
				}

			}//for

		}//test

		var test_parent = function (node) {



			var flag = 0;
			// console.log(node.parentNode);                              
			if (node.parentNode == null) { return; }
			for (var k = 0; k < node.parentNode.childNodes.length; k++) {


				//    console.log(node.parentNode.childNodes[k].);              
				if (node.parentNode.childNodes[k].get('checked')) {

					//	 console.log(node.parentNode.childNodes[k].checked);    
					continue;

				}

				else flag = 1; break;
			}//for                                                                              
			if (node.parentNode.parentNode == null) { return; }
			node.parentNode.set('checked', (flag == 0) ? true : false);
			//不用写递归是因为set方法的时候会触发父类的事件从而执行,然而并不是这样                                                    
			if (node.parentNode != null) test_parent(node.parentNode);







		}//test_parent
		this.test = test;

		this.test_parent = test_parent;
		//获取用户相关的文档store
		/*	var user_docs=Ext.create('casco.store.ProjectUser');
			user_docs.load({
					  params: {
					  user_id: me.user.get('id')
						}
					 });
			documents.filterBy(function(record){
				return record.get('document_type')!='folder';
			});
			*/

		//获取文档树结构吧
		var store = Ext.create('casco.store.TreeItems', {
			proxy: {
				extraParams: {

					user_id: me.user.get('id'),
					project_id: me.project.get('id')
				}
			}
		});

		store.proxy.url = API + 'treeitem';
		store.load();


		/*	me.addSources = function(record){
				
				var docs_id=[];
				var new_docs;
				if(me.user_docs){
				 //如果是Json数组怎么办呢?
				 me.user_docs.each(function(rec){
				 docs_id=rec.get('doc_noedit').split(',');
				 if(!Ext.Array.contains(docs_id,record.data.document_id)){
					new_docs=me.user_docs.get('doc_nonedit')+','+record.data.document_id;
					console.log(new_docs);
				//	me.user_docs.loadData([{project_id: record.data.project_id,user_id:me.user.get('id'),document_id:new_docs}], true);
			  
					});
				 }else{
				   //否则就不做处理
	
				 }
				
	
				}else{//if user_docs为空的情形吧
				 
				 new_docs=record.data.document_id;
				 me.user_docs.loadData([{project_id: record.data.project_id,user_id:me.user.get('id'),document_id:new_docs}], true);
				}
				
			};*/
		me.items = [{/*{
			xtype: 'grid',
			region: 'west',
			store: documents,
			width: 350,
	        split: true,
	        collapsible: true,
			autoScroll: true,
			title: 'Avaliable Documents',
		    columns: [
				        { text: 'project_name',  dataIndex: 'project_name',width:120},
				        { text: 'document_name',  dataIndex: 'document_name',width:130},
				        { text: 'document_type',  dataIndex: 'document_type',width:120}
		
		    ],
		    listeners : {
		        itemdblclick: function(view, record, item, index, e, eOpts){
					me.addSources(record);
				}
		    }
		},*/
			xtype: 'form',
			//   region: 'center',
			//layout:"fit",
			reference: 'prosuserform',
			bodyPadding: '0',
			items: [],
			// items: [{
			// 	anchor: '100%',
			// 	xtype: 'treepanel',
			// 	id: 'doc_tree',
			// 	store: store,
			// 	containerScroll: true,
			// 	editable: false,
			// 	animate: false,
			// 	bodyPadding: 0,
			// 	split: true,
			// 	collapsible: true,
			// 	root: { text: 'Projects-Documents', draggable: false, id: 'root' },
			// 	listeners: {
			// 		scope: this,
			// 		checkchange: function (node, checked) {
			// 			//console.log(node.get('text')); 
			// 			//this.test(node,checked);
			// 			//this.test_parent(node);
			// 		}//checkchange
			// 	}//listener

			// }]


			/*,{
			xtype: 'grid',
			region: 'east
			',
			//itemId: 'sources',
			title: 'Selected Documents',
			id: 'selecteddocuments',
			plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
		    columns: [
				        { text: 'project_name',  dataIndex: 'project_name', flex: 1},
				//  { text: 'documents_id',  dataIndex: 'documents_id', flex: 1},
				   {
				            //xtype: 'gridcolumn',
				            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
				                console.log(value)
				            },  
				            text: 'Document_name',
				            dataIndex: 'text',
				            editor: {
				                xtype: 'combo',
				                displayField: 'text',
				                valueField: 'value',
				                store: Ext.create('Ext.data.Store', {
									fields : [ 'text', 'value' ],
										data : [ {
										"text" : "负责人",
										"value" : "leader"
									}, {
										"text" : "成员",
										"value" : "member"
									} ]
								}),
								listeners: {
							        change: function (filed, newValue, oldValue, op) {console.log(arguments)
							        }
								}
				            }
				        },
				  { text: 'project_id',  dataIndex: 'user_id', flex: 1},
		    ],
		    store: user_docs,
		    listeners : {
		        itemdblclick: function(dv, record, item, index, e) {
		        	me.user_docs.remove(record);
		        }
		    }
		}*/}];
		me.dockedItems = [{
			xtype: 'toolbar',
			dock: 'bottom',
			style: {
				background: '#eee'
			},
			items: ['->', {
				text: '保存',
				formBind: true,
				glyph: 0xf0c7,
				listeners: {
					click: 'save_userdocs'
				}
			}, {
					text: '取消',
					glyph: 0xf112,
					scope: me,
					handler: this.destroy
				}]
		}];
		me.callParent(arguments);
		//this.getSelectionModel().on('selectionchange', function(){}, this);
	}
});
