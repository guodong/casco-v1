Ext.define('casco.view.auth.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',
    
    onKeyEnter: function(field,e){
		if(e.getKey() == e.ENTER){
			var form = field.up('form').getForm();
			Ext.Ajax.request({
				url: API + 'login',
				params: form.getValues(),
				withCredentials: true,
				success: function(response){
					var d = Ext.decode(response.responseText);
					console.log(response);
					console.log(d);
					if(d.code != 0){
						Ext.Msg.alert('Error', d.data);
					}else{
						localStorage.setItem("user", JSON.stringify(d.data));
						field.up('login').destroy();
						if(JSON.parse(localStorage.user).role_id=='1'){
						Ext.widget('selectProject');//管理员的界面
						}else{//普通用户的视图
	                    //普通用户直接进入project视图如何
	                    Ext.widget('selectProject');
						}
					}
				}
			});
		}
	},

    onLoginClick: function(){
    	var me = this;
    	var view = this.getView();
    	var form = view.down("form");
    	console.log(me);
    	console.log(view);
    	console.log(form);
    	Ext.Ajax.request({
			url: API + 'login',
			params: form.getValues(),
			withCredentials: true,
			success: function(response){
				var d = Ext.decode(response.responseText);
				if(d.code != 0){
					Ext.Msg.alert('Error', d.data);
				}else{
					localStorage.setItem("user", JSON.stringify(d.data));
					me.getView().destroy();
					if(JSON.parse(localStorage.user).role_id=='1'){
					Ext.widget('selectProject');//管理员的界面
					}else{//普通用户的视图
                    //普通用户直接进入project视图如何
                    Ext.widget('selectProject');
					}
				}
			}
		});
    },
    
    onSelectClick: function(){
    	var me = this;
    	var project_id = this.getView().down('form combo').getValue();
    	this.redirectTo('project/'+project_id, true);
    	location.reload();
    },
    
    onManage: function(){
    	this.redirectTo('manage', true);
    	location.reload();
    }
});