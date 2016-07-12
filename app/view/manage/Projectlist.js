Ext.define('casco.view.manage.Projectlist', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.projectlist',
	requires: ['casco.view.manage.Projectadd'],
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Projects');
		store.load();
		me.store = store;
		me.tbar = [{
			hidden: localStorage.role == 'staff' ? true: false,
			text: 'Create Project',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.manage.Projectadd', {store: store});
				win.show();
			}
		},{
			hidden: localStorage.role == 'staff' ? true: false,
			text: 'Delete Project',
			glyph: 0xf067,
			handler: function() {
				Ext.Msg.confirm('Confirm', 'Are you sure to delete?', function(choice){   //confirm
					if(choice == 'yes'){
						var view=me.getView();
						var selection =view.getSelectionModel().getSelection()[0];
						if (selection) {
							me.store.remove(selection);
							selection.erase();
						}
				}}, this);
			}
		}];
		me.callParent();
	},
	columns: [{
		text: "name",
		dataIndex: "name",
		width: 130
	},{
		text: "description",
		dataIndex: "description",
		width: 130
	},{
		text: "participants",
		dataIndex: "participants",
		width: 130,
		renderer: function(ps){
			var users = [];
			for(var i in ps){
				users.push(ps[i].realname)
			}
			return users.join(',');
		}
	}, {
		text:"Documents",
		hidden: localStorage.role == 'staff' ? true: false,  //用户权限
		width: 150,
        renderer: function(val,meta,rec) {
            var id = Ext.id();
            Ext.defer(function() {
               Ext.widget('button', {
                  renderTo: id,
                  text: 'Edit Documents',
                  glyph: 0xf040,
                  scale: 'small',
                  handler: function() {
                	  var win = Ext.create('casco.view.manage.Document', {project: rec});
                      win.show();
                  }
               });
            }, 50);
            return Ext.String.format('<div id="{0}"></div>', id);
         }
      },{
    	  text:"Build",
		  width:130,
          renderer:function(val,meta,rec){
		  var id=Ext.id();
		   Ext.defer(function(){
			  Ext.widget('button', {
			      renderTo:id,
			      text:'View   Build',
				  glyph: 0xf040,
                  scale: 'small',
                  handler: function() {
	                var win = Ext.create('casco.view.manage.Buildlistwindow', {project: rec});   
			        win.show();
                  }
		      });
		   },50);
		   
          return Ext.String.format('<div id="{0}"></div>',id);

          }
	  },{
		text:"statistics",
		width: 110,
        renderer: function(val,meta,rec) {
            var id = Ext.id();
			 
            Ext.defer(function() {
               Ext.widget('button', {
                  renderTo: id,
                  text: 'Statistic',
                  scale: 'small',
                  glyph: 0xf0ce,
                  handler: function() {
                	  var win = Ext.create('casco.view.manage.Statistics', {project: rec});
                      win.show();
                  }
               });
			   
            }, 50);
            return Ext.String.format('<div id="{0}"></div>', id);
         }
      }],
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	if(localStorage.role == 'staff') return;  //用户权限
        	var win = Ext.create('casco.view.manage.Projectadd', {project: record});
            win.down('form').loadRecord(record);
            win.show();
        }
    }

})