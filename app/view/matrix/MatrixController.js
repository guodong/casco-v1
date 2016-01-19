/**
* This class is the controller for the main view for the application. It is
* specified as the "controller" of the Main view class.
*
* TODO - Replace this content of this view to suite the needs of your
* application.
*/
Ext.define('casco.view.matrix.MatrixController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.matrix',
	switchProject : function(combo, record) {
		
	   //top的view啊
        this.redirectTo('matrix/' + record.get('id'), true);
		location.reload();
	},
	switchView:function(combo,irecord,rec){
    
      combo.setValue(combo.emptyText);
	  var v_id=combo.val_id;
	  var json=[];
      switch(irecord.get('name')){
      case 'ParentMatrix':

          json={'xtype':'parentmatrix'};
		
		  break;
	  case 'ChildMatrix':
          json={'xtype':'childmatrix'};
		  
		  break;
	  case  'Summary':
		  json={'xtype':'summary'};
		  break;
	  case  'All':
		  json=[{'xtype':'parentmatrix'},{'xtype':'childmatrix'}
				,{'xtype':'summary'}];
		  break;
	   default:
	  }

       //写个递归方便多了啊
       var create_tab=function(record){
       if(Array.isArray(record)){
       Ext.Array.each(record,function(name,index){create_tab(name)});
	   }
       else{
		var tabs= Ext.getCmp('matrixpanel');
		var tab=tabs.child('#'+record.xtype+v_id);
		  if(!tab)tab=tabs.add({
			id:record.xtype+v_id,
			xtype: record.xtype,
			title: record.xtype,
			version:irecord.get('version')?irecord.get('version'):null,
			closable: true,
			verification:rec
		});
	    tabs.setActiveTab(tab);
	   }
	   }
       create_tab(json);
	},

	buildCtxMenu:function(){

         return Ext.create('Ext.menu.Menu',{
         items:[{
			 itemId:'add',
			 handler:'onAdd'
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
	   node.remove(true);

	 },
	
	 onDelete:function(button){
       
	   var callback=Ext.bind(this.onConfirmDelete,undefined,[button],true);
        Ext.Msg.confirm(
			'Approve deletion',
			'Are you sure want to delete this node?',callback);

        
	},
	onAdd:function(button){
         var menu=button.up(),node=menu.treeNode,view=menu.treeView,delay=view.expandDuration+50,newNode,doCreate;
		 doCreate=function(){
         newNode=node.appendChild({text:'New employee',leaf:true});
		 onEdit(button,newNode);
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
		   this.ctxMenu.treeView=view;
		   
		   var ctxMenu=this.ctxMenu;
		   var addItem=ctxMenu.getComponent('add');
		   var editItem=ctxMenu.getComponent('edit');
		   var deleteItem=ctxMenu.getComponent('delete');
          
		   if(!record.isLeaf()){
           addItem.setText('Add document');
           deleteItem.setText('Delete document');
		   editItem.setText('Edit document');
           
		   addItem.enable();
		   deleteItem.enable();
		   editItem.enable();
		   }else{

           addItem.setText('Can\'t Add document');
           deleteItem.setText('Delete document');
		   editItem.setText('Edit document');
		   addItem.disable();
		   deleteItem.enable();
		   editItem.enable();
		   }
           ctxMenu.showAt(evtObj.getXY());
	 },
     onEdit:function(button,node){
       
	   var menu=button.up(),
		   node=node||menu.treeNode,
		   view=menu.treeView,
		   tree=view.ownerCt,
		   selMdl=view.getSelectionModel(),
		   colHdr=tree.headerCt.getHeaderAtIndex(0);

	   if(selMdl.getCurrentPositon){
        pos=selMdl.getCurrentPosition();
		colHdr=tree.headerCt.getHeaderAtIndex(pos.column);
	   }

	  var editor = new Ext.Editor({
    // update the innerHTML of the bound element 
    // when editing completes
    updateEl: true,
    alignment: 'l-l',
    autoSize: {
        width: 'boundEl'
    },
    field: {
        xtype: 'textfield'
    }
});
 editor.startEdit(colHdr);
      // tree.treeEditor.startEdit(colHdr); 
	  // tree.treeEditor.startEdit(node,colHdr);
	  },

	createVerification: function() {
		Ext.MessageBox.wait('正在处理,请稍候...', 'Create Verification');
		var form = this.lookupReference('ver_create_form');
		var meta = form.getValues();
		rsvsd = Ext.getCmp('parent_doc').getStore();
		var rsvss = [];
		rsvsd.each(function(v){
			var obj = {
				parent_document_id: v.get('id'),
				parent_version_id: v.get('version_id')
			}
			rsvss.push(obj);//放入的是一个对象啊
		});
		meta.account=JSON.parse(localStorage.user).account;
		meta.parent_versions = rsvss;
		var job = Ext.create('casco.model.Verification', meta);
		job.save({
			success: function(){
				Ext.Msg.alert('','创建成功!');
				var tabs=Ext.getCmp('matrixpanel');
				var childs=tabs.items;
				var count=0;
				childs.each(function(record){
                   count++;
				   if(count==1)return;
                   record.store.reload();
				});
				//Ext.getCmp('joblist').store.insert(0, job);//添加入数据的方式
				Ext.getCmp('ver-create-window').destroy();
			},
			failure: function(){
				Ext.Msg.alert('','创建失败，请检查配置');
			}

		});
		
	},
	manage : function() {
		this.redirectTo('manage', true);
		location.reload();
	},
	save : function(){

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
	project:function(){

        this.redirectTo('project', true);
		location.reload();



	}

});
