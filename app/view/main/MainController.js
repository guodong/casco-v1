//相关动作具体实现，如btn点击，combobox切换  具体可见Top.js 
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
	
	//@Top.js
	switchProject : function(combo, record) {
		this.redirectTo('project/' + record.get('id'), true);
		location.reload();  //否则组件重复注册 可考虑局部刷新？？ Viewport创建一次，必须Refresh
	},
	
	onCtxMenu:function(){},
	
	//@Top.js
	editUser:function(combo,record){
		Ext.MessageBox.buttonText.yes = '是';
		Ext.MessageBox.buttonText.no = '否';
		if(record.get('name')=='1'){
			combo.setValue(combo.emptyText);
			var model= Ext.create('casco.model.User');
			model.setId(JSON.parse(localStorage.user).id);
			casco.model.User.load(JSON.parse(localStorage.user).id,{
				callback:function(record, operation,ops){
					var win = Ext.create('casco.view.manage.Useredit', {
						user:record,
						isTop: '1'
							});
					win.down('form').loadRecord(record);//动态填充表单
					win.show();
				}
			});
		}else if(record.get('name')=='2'){
			var me = this;
			Ext.Msg.confirm('确认', '确认注销登录？', function(choice){if(choice == 'yes'){
				var view = this.getView();
				Ext.Ajax.request({
					url: API + 'logout',
					withCredentials: true,
					success: function(response){
						var d = Ext.decode(response.responseText);
						if(d.code != 0){
							Ext.Msg.alert('注意', '登出失败！');
						}else{
							//首先清空localsotrage
							localStorage.clear();
							console.log(Ext.util.Cookies.get('laravel_session'));
							Ext.util.Cookies.clear('laravel_session');
							var main=location.hash;
							// console.log(main);
							loc=main.match(/^\#([a-z]*).*?$/);//蛋疼，表示project窗口不能销毁
							//	console.log(loc[1]);
							var parent=(loc[1]=="project")?"app-main":loc[1];
							me.getView().up(parent)?me.getView().up(parent).destroy():null;
							me.redirectTo('selectProject', true);
							location.reload();
						}
					}//success
				});//request
			}else{
//				console.log(me.getView().getComponent('logoutBtn'));
				me.getView().getComponent('logoutBtn').setValue('');
			}}, this);//confirm
		}//else
	},
	
	manage : function() {
		this.redirectTo('manage', true);
		location.reload();
	},
	
	vat: function(){
		this.redirectTo('vat/' +this.getView().project.get('id'), true);
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
	},
	report:function(){
        this.redirectTo('report/'+this.getView().project.get('id'), true);
		location.reload();
	}


});
