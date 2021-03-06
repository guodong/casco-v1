Ext.define('casco.view.manage.Projectlist', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.projectlist',
	requires: ['casco.view.manage.Projectadd'],
	
	forceFit: true,
	initComponent: function() {
		var me = this;
		var store = Ext.create('casco.store.Projects');
		store.load();
		me.store = store;
		me.tbar = [{
			hidden: localStorage.role == 'staff',
			text: '点击添加',
			glyph: 0xf067,
			handler: function() {
				var win = Ext.create('casco.view.manage.Projectadd', {store: store});
				win.show();
			}
		},{
			hidden: localStorage.role == 'staff',
			text: '删除选中',
			glyph: 0xf067,
			handler: function() {
				Ext.MessageBox.buttonText.yes = '是';
				Ext.MessageBox.buttonText.no = '否';
				var view=me.getView();
				var selection =view.getSelectionModel().getSelection()[0];

				if(selection){
					Ext.Msg.confirm('确认', '确认删除选中工程?', function(choice){   //confirm
						if(choice == 'yes'){
								me.store.remove(selection);
								selection.erase();
					}}, this);
				}else{
					Ext.Msg.alert('注意','请先选中需要删除的工程！');
				}
			}
		}];
		me.callParent();
	},
	columns: [{
		text: "名称",
		dataIndex: "name",
		width: 150
	},{
		text: "描述",
		dataIndex: "description",
		width: 200
	},{
		text: "成员",
		dataIndex: "participants",
		flex: 1,
		renderer: function(ps){
			var users = [];
			for(var i in ps){
				users.push(ps[i].realname)
			}
			return users.join(',');
		}
	}, {
		text:"编辑文档",
		hidden: localStorage.role == 'staff',  //用户权限
		width: 100,
        renderer: function(val,meta,rec) {
            var id = Ext.id();
            Ext.defer(function() {
               Ext.widget('button', {
                  renderTo: id,
//                  text: 'Edit Documents',
                  glyph: 0xf040,
                  scale: 'small',
                  handler: function() {
                	  var win = Ext.create('casco.view.manage.Document', {project: rec});
                      win.show();
                  }
               });
            }, 50);
            return Ext.String.format('<div id="{0}" style="margin-left:auto;margin-right:auto"></div>', id);
         }
      },{
    	  text: '编辑定版',
    	  hidden: localStorage.role == 'staff',  //用户权限
    	  width: 100,
    	  renderer: function(val,meta,rec){
    		  var id = Ext.id();
    		  Ext.defer(function(){
    			  Ext.widget('button',{
    				  renderTo: id,
//    				  text: 'Edit Vat',
    				  glyph: 0xf040,
    				  scale: 'small',
    				  handler: function(){
    					  var win = Ext.create('casco.view.manage.VatlistWindow',{project: rec});
    					  win.show();
    				  }
    			  });
    		  },50);
    		  return Ext.String.format('<div id="{0}"></div>', id);
    	  }
      },{
    	  text:"编辑Build",
		  width:100,
          renderer:function(val,meta,rec){
		  var id=Ext.id();
		   Ext.defer(function(){
			  Ext.widget('button', {
			      renderTo:id,
//			      text:'Edit Build',
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
		text:"统计",
		width: 130,
        renderer: function(val,meta,rec) {
            var id = Ext.id();
            Ext.defer(function() {
               Ext.widget('button', {
                  renderTo: id,
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