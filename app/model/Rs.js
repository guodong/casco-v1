Ext.define('casco.model.Rs', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id', type: 'auto' },
        { name: 'tag', type: 'auto' },
        { name: 'description', type: 'auto' },
        { name: 'implement', type: 'auto' },
        { name: 'priority', type: 'auto' },
        { name: 'contribution', type: 'auto' },
        { name: 'category', type: 'auto' },
        { name: 'allocation', type: 'auto' }

    ]
});
