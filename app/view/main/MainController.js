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

	switchProject : function(combo, record) {
		this.redirectTo('project/' + record.get('id'), true);
		location.reload();
	},
    editUser:function(combo,record){
      
	
	 if(record.get('name')=='1'){
	 var  model= Ext.create('casco.model.User');
     model.set(JSON.parse(localStorage.user));
	 model.load();
	  var win = Ext.create('casco.view.manage.Useradd', {user:model});
	  win.down('form').loadRecord(model);
	  win.show();}
	  else if(record.get('name')=='2'){
     
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
                    console.log(main);
					loc=main.match(/^\#([a-z]*).*?$/);//蛋疼，表示project窗口不能销毁
					me.getView().up(loc[1]).destroy();
				    me.redirectTo('selectProject', true);
    	            location.reload();
			 
				}
            }//success
       });//request
	  }//else
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
	}

});
