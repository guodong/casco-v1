Ext.define('casco.view.project.ProjectController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.project',
    requires: ['casco.ux.Registry'],
    
    onChooseProject: function(){

    	var pjt_id = this.getView().down('form').getForm().getFieldValues().project_id;
    	casco.ux.Registry.set('project_id', pjt_id);
    	localStorage.project_id = pjt_id;
    	var store = Ext.getStore('Projects');
    	casco.ux.Registry.set('project_name', store.findRecord('id', pjt_id).get('name'));
    	localStorage.project_name = store.findRecord('id', pjt_id).get('name');
        this.getView().destroy();

        Ext.widget('app-main', {project: store.findRecord('id', pjt_id)});
        
    },
    createProject: function(){
    	var self = this;
    	var form = this.lookupReference('project_create_form');
    	var pjt = new casco.model.Project(form.getValues());
    	if(pjt.get('id')){
    		pjt.set('id', 0);
    	}
    	pjt.save({
    		callback: function(){
    			Ext.Msg.alert('Message', 'Project created successfully.', function(){

		    		self.getView().destroy();
		    		localStorage.project_id = pjt.get('id');
		    		localStorage.project_name = pjt.get('name');
		            Ext.widget('app-main');
		    	});
    		}
    	});
    	
    },
    create: function(){
    	this.getView().destroy();
    	var win = Ext.create('widget.project.create',{listeners:{scope: this}});
        win.show();
    }
});