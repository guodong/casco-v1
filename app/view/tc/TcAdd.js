Ext.define('casco.view.tc.TcAdd', {
	extend: 'Ext.window.Window',
	alias: 'widget.tcadd',
	requires: ['casco.view.document.DocTree', 'casco.view.tc.TcStep',
	'casco.view.document.DocumentController',
	'casco.view.tc.TcController',
	'casco.view.tc.source.Add','casco.store.TcSteps','casco.store.Sources'],
	controller: 'tc',

	modal: true,
	title: 'TC Item',
	width: 800,
	height: 500,
	autoScroll: true,
	maximizable: true,
	resizable: true,
	layout: {
		type: 'anchor'
	},

	initComponent: function() {
		var me = this;
		console.log(me);
		me.sources = Ext.create('casco.store.Sources');
		me.steps = Ext.create('casco.store.TcSteps');
		me.steps.load({
			params:{
				tc_id:me.tc?me.tc.get('id'):null
			}
		});
		if(me.tc){
			var a=new Array();
			var list=me.tc.get('source')?me.tc.get('source').split(','):null;
			Ext.Array.each(list,function(name, index, countriesItSelf){   
				a.push({tag:name});
			});
			me.sources.setData(a);
		}
		var tm = Ext.create('casco.store.Testmethods');
		tm.load({
			params: {
				project_id: me.project.get('id')
			}
		});

		me.items = [{
			xtype: 'form',
			reference: 'TcAddform',
			bodyPadding: 10,
			items: [{
				name : 'id',
				xtype : 'hiddenfield',
			},/*{
			name: 'version_id',
			xtype: 'hiddenfield',
			value: me.version_id
			},*/{
			anchor : '100%',
			fieldLabel : 'Tag',
			name : 'tag',
			xtype : 'textfield',
			allowBlank: true,
			value: me.tag_id
		}/*, {
		anchor : '100%',
		fieldLabel : 'Description',
		name : 'description',
		xtype : 'textarea',
		allowBlank: true
		}, {
		anchor : '100%',
		xtype : 'tagfield',	 //!!
		//defaultType:'checkbox',
		name : 'testmethod_id',
		fieldLabel : 'Test Methods',
		displayField : 'name',	//获取id，显示name
		valueField : 'id',
		queryMode: 'local',
		//				editable : true,
		store:tm,
		allowBlank: true
		},{
		anchor : '100%',
		fieldLabel : 'pre-condition',
		name : 'pre-condition',
		xtype : 'textarea',
		maxHeight: 50,
		allowBlank: true
		}*/,{
		xtype: 'grid',
		fieldLabel: 'source',
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			items: [{
				glyph: 0xf067,
				text: 'Edit Sources',
				handler: function(){
					var wd = Ext.create("casco.view.tc.source.Add", {
						sources: me.sources,
						document_id: me.document_id,
						project: me.project
					});
					wd.show();
				}
			}]
		}],
		columns: [
		{ text: 'source',  dataIndex: 'tag', flex: 1}
		],
		store: me.sources
	}, {
		xtype : 'tcstep',
		reference : 'mgrid',
		id: 'mgrid',
		store: me.steps
	}],
	buttons: ['->', {
		text: 'Save',
		formBind: true,
		glyph: 0xf0c7,
		listeners: {
			click: 'createTc'
		}
	}, {
		text: 'Cancel',
		glyph: 0xf112,
		scope: me,
		handler: this.destroy
	}]
}];


//	me.doLayout();思路很简单，如果列名有则就添加进去否则next
var array= [];
Ext.Array.each(me.items[0].items,function(name, index, countriesItSelf){ 	//me.items[0].items，表单项 4项
	array.push(name.name);  
});

//console.log(me.columns);	//DB tc.columns  dataIndex,header,width 

Ext.Array.each(me.columns,function(name, index, countriesItSelf){
//	console.log(name);
	if(name.dataIndex=='source'||name.dataIndex=="sources") return;		//过滤动态列中的source
	if(!Ext.Array.contains(array,name.dataIndex)){
		Ext.Array.insert(me.items[0].items,2, 	//写入动态列
		[{anchor : '100%',
			fieldLabel : name.dataIndex,
			name : name.dataIndex,
			xtype : 'textarea',
			maxHeight: 50,
		allowBlank: true}]);//插入值即可
	}},this,true);

me.callParent(arguments);
}
});