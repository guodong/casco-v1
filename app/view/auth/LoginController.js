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
					if(d.code != 0){
						Ext.Msg.alert('Error', d.data);
					}else{
						localStorage.setItem("user", JSON.stringify(d.data));
						field.up('login').destroy();

						var store = Ext.create('casco.store.Projects');
				    	store.load({
				    		params:{
				    			user_id: JSON.parse(localStorage.user).id
				    		},
				    		callback:function(){
				    			var latest_proj = store.getCount() > 0 ? store.getAt(0) : 0;
				    			var project_id = latest_proj.get('id');
				    			console.log(project_id);
				    			Ext.widget('app-main', {project: latest_proj});
				    		}
				    	});
						}
					}
			});
		}
	},

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

					var store = Ext.create('casco.store.Projects');
			    	store.load({
			    		params:{
			    			user_id: JSON.parse(localStorage.user).id
			    		},
			    		callback:function(){
			    			var latest_proj = store.getCount() > 0 ? store.getAt(0) : 0;
			    			var project_id = latest_proj.get('id');
			    			console.log(project_id);
			    			Ext.widget('app-main', {project: latest_proj});
			    		}
			    	});
				}
			}
		});
    },

    onSelectClick: function(){
    	var me = this;
    	var project_id = this.getView().down('combo').getValue();
    	this.redirectTo('project/'+project_id, true);
    	location.reload();
    },

    onManage: function(){
    	this.redirectTo('manage', true);
    	location.reload();
    }
});