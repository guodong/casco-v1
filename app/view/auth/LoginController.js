Ext.define('casco.view.auth.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',
    onLoginClick: function(){
    	var me = this;
    	var view = this.getView();
    	var form = view.down("form");
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
                    Ext.widget('commonView');



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