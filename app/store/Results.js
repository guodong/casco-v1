Ext.define('casco.store.Results', {
    extend: 'Ext.data.Store',
    model: 'casco.model.Result',
    proxy: {
        type: 'rest',
        url: API+'result',
        withCredentials: true
    },
	sorters : [{
        property : 'tag', // 指定要排序的列索引
        direction : 'ASC' // 降序，  ASC：赠序
    }]
});