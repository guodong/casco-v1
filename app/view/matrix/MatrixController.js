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
	switchView:function(combo,record){
    

	  var v_id=combo.val_id;
	  var title='';var xtype='';
      switch(record.get('name')){
      case 'ParentMatrix':
          xtype='parentmatrix';
		  title='parent_matrix';
		  break;
	  case 'ChildMatrix':
           xtype='childmatrix';
		  title='child_matrix';
		  break;
	  case  'Revision':
		  break;
	  case  'Summary':
		  xtype='summary';
	      title='summary';
		  break;
	  case  'all':
		  break;
	   default:
	  }
	    var tabs = Ext.getCmp('matrixpanel');
		var selModel=new Ext.selection.Model({mode:"MULTI"});
		var tab = tabs.child('#tab-'+record.get('name')+'-'+v_id);
		if(!tab){
		tab = tabs.add({
			id: 'tab-'+record.get('name')+'-'+v_id,
			xtype: xtype,
			title: title,
			version:record.get('version')?record.get('version'):null,
			closable: true,
			selModel:selModel,
			verification_id:v_id
		});
		}
		tabs.setActiveTab(tab);

	},
	createVerification: function() {
		Ext.MessageBox.wait('正在处理,请稍候...', 'Create Verification');
		var form = this.lookupReference('ver_create_form');
		var meta = form.getValues();
		rsvsd = Ext.getCmp('parent_doc').getStore();
		var rsvss = [];
		rsvsd.each(function(v){
		//	console.log(v);
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
			}
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
	project:function(){

        this.redirectTo('project', true);
		location.reload();



	}

});
