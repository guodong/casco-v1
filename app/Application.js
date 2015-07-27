/**
 * The main application class. An instance of this class is created by app.js
 * when it calls Ext.application(). This is the ideal place to handle
 * application launch and initialization details.
 */
Ext.define('casco.Application', {
	extend : 'Ext.app.Application',

	name : 'casco',
	
	requires: ['casco.view.auth.SelectProject'],

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
	    	before: null,
	    	action: 'onManage'
	    },
	    'testing/:id': {
	    	before: null,
	    	action: 'onTest'
	    }
	},
	defaultToken: 'selectProject',
	listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    onUnmatchedRoute: function(hash) {
        this.redirectTo('selectProject');
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
	onBeforeSelect: function(action) {
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
	onProject: function(id){
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
