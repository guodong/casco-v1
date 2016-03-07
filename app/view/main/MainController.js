/**
* This class is the controller for the main view for the application. It is
* specified as the "controller" of the Main view class.
*
* TODO - Replace this content of this view to suite the needs of your
* application.
*/
Ext.define('casco.view.main.MainController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.main',
    initComponent: function(){
	 var self = this;
	 this.callParent();
	},
	switchProject : function(combo, record) {
		this.redirectTo('project/' + record.get('id'), true);
		location.reload();
	},
	editUser:function(combo,record){


		if(record.get('name')=='1'){
			combo.setValue(combo.emptyText);
			var  model= Ext.create('casco.model.User');
			model.setId(JSON.parse(localStorage.user).id);
			casco.model.User.load(JSON.parse(localStorage.user).id,{
				callback:function(record, operation,ops){
					var win = Ext.create('casco.view.manage.Useredit', {user:record});
					win.down('form').loadRecord(record);//动态填充表单
					win.show();
				}
			});
		}else if(record.get('name')=='2'){

			Ext.Msg.confirm('Confirm', 'Are you sure to logout?', function(choice){if(choice == 'yes'){
				var me = this;
				var view = this.getView();
				Ext.Ajax.request({
					url: API + 'logout',
					withCredentials: true,
					success: function(response){
						var d = Ext.decode(response.responseText);
						if(d.code != 0){
							Ext.Msg.alert('Error', 'Logout failure.');
						}else{
							//首先清空localsotrage
							localStorage.clear();
							var main=location.hash;
							// console.log(main);
							loc=main.match(/^\#([a-z]*).*?$/);//蛋疼，表示project窗口不能销毁
							//	console.log(loc[1]);
							var parent=(loc[1]=="project")?"app-main":loc[1];
							me.getView().up(parent).destroy();
							me.redirectTo('selectProject', true);
							location.reload();

						}
					}//success
				});//request
			}}, this);//confirm
		}//else
	},
	buildCtxMenu:function(){
         return Ext.create('Ext.menu.Menu',{
         items:[{
			 itemId:'add',
			 handler:'onAdd',
			 },
			 {
             itemId:'edit',
			 handler:'onEdit'
			 },
			{
			 itemId:'delete',
			 handler:'onDelete'
			 }
		 ]
		 });
	},
	onConfirmDelete:function(answer,value,cfg,button){
       if(answer!='yes')return;
	   var menu=button.up(),node=menu.treeNode;
	   var model = new casco.model.Document({id:node.id});
	   model.erase();
	   node.remove(true);
	 },
	
	onDelete:function(button){
	   var callback=Ext.bind(this.onConfirmDelete,undefined,[button],true);
        Ext.Msg.confirm(
			'Approve deletion',
			'Are you sure want to delete this node?',callback);
	},
	onAdd:function(button){
		console.log(button.itemId);
		var mark=button.itemId;var global=this;var type;var text;
		var menu=button.up().up(),node=menu?menu.treeNode:'',view=menu?menu.treeView:'',delay=view.expandDuration+50,newNode,doCreate;
		switch(mark){
		case 'edit_verisons'://Edit versions
		console.log(button.up().treeNode.id);
		var win=Ext.create('casco.view.manage.Versions',{'document_id':button.up().treeNode.id});win.show();
		return;
        case 'add_rs':
		 type='rs';text='New RS Document';break;
		case  'add_tc':
         type='tc';text='New TC Document';break;
		case  'add_folder':
         type='folder';text='New folder';break;
         default:type='rs';text='New RS Document';
		}
		//console.log(button.up().up().treeView);
         var menu=button.up().up(),node=menu.treeNode,view=menu.treeView,delay=view.expandDuration+50,newNode,doCreate;
		 doCreate=function(){
		 //console.log(location.hash.substring(location.hash.lastIndexOf('/')+1));
         newNode=node.appendChild({name:text,text:text,type:type,fid:node.id,project_id:global.getView().project.get('id')||'',leaf:true});
		 }
		  if(!node.isExpanded()){
            node.expand(false,Ext.callback(this.doCreate,this,[],delay));
		  }else{
           doCreate();
		  }
	},
	 onCtxMenu:function(view,record,element,index,evtObj){

          view.select(record);
		  evtObj.stopEvent();
		  if(!this.ctxMenu){
           this.ctxMenu=this.buildCtxMenu();
		  }
           this.ctxMenu.treeNode=record;
		   this.ctxMenu.treeEle=element;
		   this.ctxMenu.treeView=view;
		   var ctxMenu=this.ctxMenu;
		   var addItem=ctxMenu.getComponent('add');
		   var editItem=ctxMenu.getComponent('edit');
		   var deleteItem=ctxMenu.getComponent('delete');
          
		   if(!record.isLeaf()){
           addItem.setText('Add document');
		   addItem.treeNode=record;
		   addItem.treeView=view;
		   addItem.treeEle=element;
		   addItem.setMenu({items:[{
			 text:'Add Rs Document',
			 itemId:'add_rs',
			 handler:'onAdd'
			 },
			 {
			 text:'Add Tc Document',
             itemId:'add_tc',
			 handler:'onAdd'
			 },
			 {
			 text:'Add folder',
			 itemId:'add_folder',
			 handler:'onAdd'
			 }]});
           deleteItem.setText('Delete Folder');
		   editItem.setText('Edit Folder');
		   addItem.enable();
		   deleteItem.enable();
		   editItem.enable();
		   }else{
           addItem.setText('Edit Versions');
           addItem.itemId='edit_verisons';
           deleteItem.setText('Delete document');
		   editItem.setText('Edit document');
		   addItem.enable();
		   deleteItem.enable();
		   editItem.enable();
		   }
           ctxMenu.showAt(evtObj.getXY());
	 },
     onEdit:function(button,node){
	   var me=this;
	   var menu=button.up(),
		   node=menu.treeNode||node,
		   view=menu.treeView,
		   tree=view.ownerCt,
		   selMdl=view.getSelectionModel(),
		   colHdr=tree.headerCt.getHeaderAtIndex(0);
	   if(selMdl.getCurrentPositon){
        pos=selMdl.getCurrentPosition();
		colHdr=tree.headerCt.getHeaderAtIndex(pos.column);
	   }
	  //console.log(node,colHdr);
	  var editor = new Ext.Editor({
			updateEl: true,
			alignment: 'l-l',
			autoSize: {
				width: 'boundEl'
			},
			field: {
				xtype: 'textfield'
			}
			});
	 console.log(Ext.get(menu.treeEle).query('span'));
     editor.startEdit(Ext.get(menu.treeEle).query('span')[0]);
     editor.on('complete',function(this_g, value, startValue, eOpts){
		   console.log(node.id);
		   var id;
	       re=/^(([a-z]|[0-9])*-*){3,}([a-z]|[0-9])*$/g; 
           if(re.test(node.id)){
             id=node.id?node.id:'';
		   }
	       var model =id?new casco.model.Document({id:id}):new casco.model.Document();
		   model.set(node.getData());
	  	   model.set('name',value);
	  	   model.save({callback: function(record, operation, success) {
			   Ext.getCmp('mtree').getStore().reload();
	  	    }
	  	   });
	});
	},
	manage : function() {
		this.redirectTo('manage', true);
		location.reload();
	},
	testing : function() {
		this.redirectTo('testing/' + this.getView().project.get('id'));
		location.reload();
		return;
		var tabs = Ext.getCmp('workpanel');
		var tab = tabs.child('#tab-testing');
		if(!tab){
			tab = tabs.add({
				id: 'tab-testing',
				xtype: 'test',
				title: 'Testing',
				closable: true,
				project: this.getView().project
			});
		}
		tabs.setActiveTab(tab);
	},
	matrix:function(){
        this.redirectTo('matrix/'+this.getView().project.get('id'), true);
		location.reload();
	}

});
