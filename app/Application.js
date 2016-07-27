/**
 * The main application class. An instance of this class is created by app.js
 * when it calls Ext.application(). This is the ideal place to handle
 * application launch and initialization details.
 */
Ext.define('casco.Application', {
	extend : 'Ext.app.Application',
	name : 'casco',
	requires: ['casco.view.auth.SelectProject','casco.model.Project','casco.view.matrix.Matrix','casco.view.report.Report'],

	stores : [
	// TODO: add global / shared stores here
	],
	
	routes: {
	    'project/:id': {
	    	before: 'onBeforeProject',
	    	action: 'onProject'
	    },
	    'selectProject': {
	    	before: 'onBeforeSelect',
	    	action: 'onSelect'
	    },
	    'manage': {
	    	//before: 'onBeforeManage',
	    	action: 'onManage'
	    },
	    'vat/:id':{
	    	//before: 'onBeforeVat',
	    	action: 'onVat'
	    },
		'matrix/:id': {
			//before: 'onBeforeMatrix',
			action: 'onMatrix',
		},
		'report/:id': {
			//before: //'onBeforeReport',
			action: 'onReport',
		},
	    'testing/:id': {
	    	//before: 'onBeforeTesting',
	    	action: 'onTest'
	    }
	},
	
	defaultToken: 'selectProject',
//	defaultToken: 'project/:id',
	listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    onUnmatchedRoute: function(hash) {
    	console.log('unmatched',hash);
        //this.redirectTo('');
        // Do something...
    },
    
	onSelect : function() {
    	Ext.widget('selectProject');
    },
	onBeforeProject: function(id, action) {
		Ext.Ajax.request({
			url: API + 'session',
			withCredentials: true,
			success: function(response){
				var d = Ext.decode(response.responseText);
				if(d.code != 0){
					action.stop(true);
					Ext.widget('login');
				}else{
					action.resume();
				}
			}
		});
    },
	/*onBeforeTesting: function(id, action) {
		Ext.Ajax.request({
			url: API + 'session',
			withCredentials: true,
			success: function(response){
				var d = Ext.decode(response.responseText);
				if(d.code != 0){
					action.stop(true);
					Ext.widget('login');
				}else{
					action.resume();
				}
			}
		});
    },
	onBeforeReport: function(id, action) {
		Ext.Ajax.request({
			url: API + 'session',
			withCredentials: true,
			success: function(response){
				var d = Ext.decode(response.responseText);
				if(d.code != 0){
					action.stop(true);
					Ext.widget('login');
				}else{
					action.resume();
				}
			}
		});
    },
	onBeforeMatrix: function(id, action) {
		Ext.Ajax.request({
			url: API + 'session',
			withCredentials: true,
			success: function(response){
				var d = Ext.decode(response.responseText);
				if(d.code != 0){
					action.stop(true);
					Ext.widget('login');
				}else{
					action.resume();
				}
			}
		});
    },
	*/
	onBeforeSelect: function(action) { //判断服务器用户登录状态
		Ext.Ajax.request({
			url: API + 'session',
			withCredentials: true,
			success: function(response){
				var d = Ext.decode(response.responseText);
				if(d.code != 0){
					action.stop(true);
					Ext.widget('login');
				}else{
					if(!localStorage.user) localStorage.setItem("user", JSON.stringify(d.data));
					action.resume();
				}
			}
		});
    },
	onProject: function(id){
		var me = this;
		//静态方法会自增id
		var model=Ext.create('casco.model.Project');
		model.set('id',id);
		var me = this;
		casco.model.Project.load(id, {
    		success: function(project){
    			Ext.widget('app-main', {project: project});
    		}
    	});
	},
	
	onManage: function(){
		Ext.widget('manage');
	},
	
	onVat: function(id){
		var me = this;
		var model = Ext.create('casco.model.Project');
		model.set('id',id);
		model.load({
			scope: this,
			success:function(project){
				Ext.widget('vat',{project: project});
			}
		});
	},
	
	onMatrix: function(id){
		//var handle=Ext.create('casco.view.matrix.Matrix');
		//hadle.show();
		id=id?id:null;
		var me = this;
		//静态方法会自增id
		var model=Ext.create('casco.model.Project');
		model.set('id',id);
		//麻蛋依赖注入好有依赖性!牵一发动全身
		model.load({
			scope:this,
    		success: function(project){
    			Ext.widget('matrix', {project: project});
    		}
    	});
	},
	
	onReport: function(id){
		//var handle=Ext.create('casco.view.matrix.Matrix');
		//hadle.show();
		id=id?id:null;
		var me = this;
		//静态方法会自增id
		var model=Ext.create('casco.model.Project');
		model.set('id',id);
		//麻蛋依赖注入好有依赖性!牵一发动全身
		model.load({
			scope:this,
    		success: function(project){
    			Ext.widget('report', {project: project});
    		}
    	});
	},
	onTest: function(id) {
		casco.model.Project.load(id, {
    		success: function(project){
    			Ext.widget('testing', {project: project});
    		}
    	});
	},
	
	launch : function() {
//		Ext.Ajax.request({
//			url: API + 'session',
//			withCredentials: true,
//			success: function(response){
//				var d = Ext.decode(response.responseText);
//				if(d.code != 0){
//					Ext.widget('login');
//				}else{
//					Ext.widget('selectProject');
//				}
//			}
//		});

		//Ext.widget(uid ? ((localStorage.view == 'manage') ? 'manage'
			//	: 'app-main') : 'login');
	}
});
