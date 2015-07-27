Ext.define('casco.ux.Registry', {
    singleton: true,
    data: {},
    set: function(key, value) {
        this.data.key = value;
        return this;
    },
    get: function(key){
    	return this.data.key;
    }
});