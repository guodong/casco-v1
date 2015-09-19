Ext.define('casco.view.manage.ManageController', {
    extend: 'Ext.app.ViewController',

    requires: [
               'casco.view.manage.Userlist'
    ],

    alias: 'controller.manage',
    onLogout: function () {
        Ext.Msg.confirm('Confirm', 'Are you sure to logout?', function (choice) {
            if (choice === 'yes') {
                localStorage.removeItem('uid');

                this.getView().destroy();

                Ext.widget('login');
            }
        }, this);
    },
    createuser: function () {
    	var view = this.getView();
    	var self = this;
    	var form = this.lookupReference('useraddform');//获取对应的form表单
    	var user = view.user?view.user:Ext.create('casco.model.User');
    	user.set(form.getValues());
    	user.save({
    		callback: function(){
    			Ext.Msg.alert('Message', 'User manage successfully.', function(){
    				var t = Ext.ComponentQuery.query("#tab-userlist")[0];
    				if(!view.user)t.store.add(user);
    				form.up("window").destroy();
		    	});
    		}
    	});
    },
	createFolder:function (){//build
		var view = this.getView();
    	var self = this;
    	var form = this.lookupReference('build_create_form');//获取对应的form表单
    	var build = view.build?view.build:Ext.create('casco.model.Build');
    	build.set(form.getValues());
    	build.save({
    		callback: function(){
    			Ext.Msg.alert('Message', 'Build manage successfully.', function(){
    				var t = Ext.ComponentQuery.query("#build_list")[0];
    				if(!view.user)t.store.add(build);
    				form.up("window").destroy();
		    	});
    		}
    	});



	},
    createmethod: function () {
    	var view = this.getView();
    	var self = this;
    	var form = this.lookupReference('methodaddform');
    	var method = view.method?view.method:Ext.create('casco.model.Testmethod');
    	method.set(form.getValues());
    	method.save({
    		callback: function(){
    			Ext.Msg.alert('Message', 'Method manage successfully.', function(){
    				var t = Ext.ComponentQuery.query("#tab-testmethod")[0];//基于属性ID进行检索
    				if(!view.method)t.store.add(method);
    				form.up("window").destroy();//销毁整个窗口
		    	});
    		}
    	});
    },
    createProject : function() {
		var view = this.getView();
		var project = view.project?view.project:Ext.create('casco.model.Project');
		var form = view.down('form');
		var data = form.getValues(); //提交的数据,没有name的需要手动添加进入表单么？
		data.document_id = view.document_id;
		data.vatstrs = [];
		view.vatstrs.each(function(s){
			data.vatstrs.push({
				id: s.data.id,
				name: s.data.name
			});
		});
		data.participants = [];
		view.participants.each(function(s){
			data.participants.push(s.getData());
		});
		project.set(data);
		project.save({
			callback: function() {
				form.up("window").destroy();
				var t = Ext.ComponentQuery.query("#tab-projectlist")[0];
				t.store.reload();
			}
		});
	},
	createDocument:function(){
		
	   	var view = this.getView();
    	var self = this;
    	var form = this.lookupReference('documentaddform');//获取对应的form表单
    	var doc = view.doc?view.doc:Ext.create('casco.model.Document');
    	doc.set(form.getValues());
    	doc.save({
    		callback: function(){
    			Ext.Msg.alert('Message', 'Save Document Successfully.', function(){
					form.up("window").destroy();
					//重新刷新左边的树的结构
                    var t = Ext.ComponentQuery.query("#mtree")[0];
				    t.store.reload();
    			 
		    	});
    		}
    	});
	},
	seldoc: function(view, record, item, index, e, eOpts){//only leaf can  be listened
		var json = record.data;
		if(!record.data.leaf) return;
		var tabs = this.lookupReference('main');
	
		var tab = tabs.child('#tab-' + json.id);
		if(!tab){
			tab = tabs.add({
				itemId: 'tab-' + json.id,
				id: 'tab-'+json.id,
				xtype: json.id,//这个是存在的
				title: json.text,
				closable: true
			});
		}
        
		tabs.setActiveTab(tab);
	}
});
