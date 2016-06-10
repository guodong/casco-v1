
/**
* This class is the controller for the main view for the application. It is
* specified as the "controller" of the Main view class.
*
* TODO - Replace this content of this view to suite the needs of your
* application.
*/
Ext.define('casco.view.report.ReportController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.report',
	switchProject : function(combo, record) {
		
	   //top的view啊
        this.redirectTo('project/' + record.get('id'), true);
		location.reload();
	},
	createReport: function() {
		  
		Ext.MessageBox.wait('正在处理,请稍候...', 'Create Report');
		var form = this.lookupReference('ver_create_form');
		var meta = form.getValues();
		//var test = Ext.getCmp('testing_item').getStore().getSelectionModel().getSelection()[0];
		//meta.test_id=test.id;
		meta.child_id=this.getView().child_doc.data.id?this.getView().child_doc.data.id:'';
		meta.account=JSON.parse(localStorage.user).account;
		var job = Ext.create('casco.model.Center', meta);
		job.save({
			callback: function(record,operation){
				//console.log(operation._response.responseText,operation.data);
				if(record.data.success){
				var tabs=Ext.getCmp('reportpanel');
				var childs=tabs.items;
				var count=0;
				childs.each(function(record){
                   count++;
				   if(count==1)return;
                   record.store.reload();
				});
				Ext.Msg.alert('','创建成功!');
				//Ext.getCmp('joblist').store.insert(0, job);//添加入数据的方式
				}else{
				console.log(operation._response.responseText);
				Ext.Msg.alert('创建失败!',JSON.stringify(operation._response.responseText));
				}
				Ext.getCmp('ver-create-window').destroy();
			}//callback
		});
	},
	manage : function() {
		this.redirectTo('manage', true);
		location.reload();
	},
	save : function(){

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
	reporting:function(){
        this.redirectTo('report/' +this.getView().project.get('id'), true);
		location.reload();
	},
	project:function(){

        this.redirectTo('project/' +this.getView().project.get('id'), true);
		location.reload();



	}

});