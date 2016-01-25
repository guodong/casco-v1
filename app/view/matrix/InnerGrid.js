Ext.define('casco.view.matrix.InnerGrid', {
	extend: 'Ext.grid.Panel',
	//layout:'border',
	xtype:'innergrid',
	requires: [],
	width:250,
	height:400,
	selModel:{
    selType: "checkboxmodel" , 
    checkOnly: true
	}, 
	initComponent: function() {
		var me = this;
		//依赖注入进来
		var store =Ext.create('Ext.data.Store', {
				 model: 'Ext.data.Model',
				 data:''
				 } );
		me.store=store;
		me.data=store;
		me.filter_obj;
		//我查这个堆栈有问题!屌屌的
		console.log(me.up('gridpanel'));
		me.stack=me.up('gridpanel').stack;
		//me.columns=me.columns?me.columns:'';
		//console.log(me.store);
		me.tbar = [{
			text: '筛选',
			glyph: 0xf067,
			handler: function() {
			
				var index=me.getColumns()[1].dataIndex;var mark=false;
			    //还需保存一份快照
				if(me.stack.length>0){
				var json=me.stack.pop();
				if(json&&json.index==index){
					mark=true;
					me.filter_obj=json.store;
				}
				    me.stack.push(json);
				}
			     console.log('filter_obj',me.filter_obj?me.filter_obj.getData():null);
			    //filterBy的store选取,filter_obj存在说明是index符合,则store变化，否则current
			    var parent_ma=me.filter_obj||me.up('gridpanel').matrix;
			    console.log('parent_ma_o',parent_ma.getData());
			    var records =[]; parent_ma.each(function(r){records.push(r.copy());});
			    var store2 = new Ext.data.Store({recordType:parent_ma.recordType});
			    store2.add(records);
			    var rows=me.getSelectionModel().getSelection();
			    if(me.getSelectionModel().getCount()==me.store.getCount()){
			    //全选状态,只pop()不行
			    if(mark){me.stack.length>0?me.stack.pop():'';}
			    }else{
			    me.stack.push({'index':index,'data':me.store.getData(),'store': store2});	
			    }
			    parent_ma.filterBy(function(record,id){
			    var flag=false;
			    Ext.Array.each(rows,function(item){
			    if(record.getData()[index]==item.getData()[index])
			    {flag=true;return;}
			    });//each
			    return flag;
			    });//filter
			    console.log('parent_ma_c',parent_ma.getData());
			    me.up('gridpanel').getStore().setData(parent_ma.getData());
			    me.up('gridpanel').getView().refresh();
			    //me.getView().destroy();
			    me.up('menu').hide();
            	
			}
		},'-',{
		    text: '取消',
			glyph: 0xf068,
		    handler:function(){
			//console.log(me.up());
			//me.destroy();
			me.up('menu').hide();
			}
		}];
		
		me.filter=function(data,index){
			if(!data)return [];
			var array=[];
			data.each(function(record){
				//console.log(index,record.getData()[index],record.getData());
				var flag=true;
				Ext.Array.each(array, function(item, index1, countriesItSelf) {
				if(item[index]==record.getData()[index]){flag=false;}
				});
				flag?array.push(record.getData()):'';
			});
			return array;
		}
		//data要做个distinct
		me.store.on('datachanged',function(g,eOpts){
			//console.log('已经出发了');
		//console.log(me.store.getData());
		});
		me.addListener("datachange",function(data,index){  
			console.log('触发事件!stack',me.stack);
			var array=[];
		   if(me.stack.length>0){
			var json=me.stack.pop();
			if(json&&json.index==index){
			me.stack.push(json);
			//json的store去重
			array=me.filter(json.store.getData(),index);
			me.store.setData(array);
			return;
			}else{
			me.stack.push(json);
			}
			console.log(me.stack);
			}//if
			array=me.filter(data,index);
			//me.stack.push({'index':index,'data':me.store.getData()});
			me.store.setData(array);
	      });
	  me.callParent();
	},
    listeners : {
        itemdblclick: function(dv, record, item, index, e) {
        	
        }
    }

});