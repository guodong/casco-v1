Ext.define('casco.store.Rss', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Rs',
    pageSize: 0, //disable paging
    //autoLoad : true,
    proxy: {
        type: 'rest',
        url: API+'rs',
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json'
        }
    },
	sorters : [{
        property : 'tag', // 指定要排序的列索引
        direction : 'ASC' // 降序，  ASC：赠序
    }]
});