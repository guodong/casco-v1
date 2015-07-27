/**
 * 定义了一个背景透明的Button类，继承于Button
 */
Ext.define('casco.ux.ButtonTransparent', {
    extend : 'Ext.button.Button', // 继续于Ext.button.Button
    alias : 'widget.buttontransparent', // 此类的xtype类型为buttontransparent
    // 类初始化时执行
    initComponent : function() {
    	
        // 设置事件监听
        this.listenerss = {
            // 鼠标移开，背景设置透明
            mouseout : function() {
            	b = document.getElementById(this.id);
            	b.color = '#fff';
                this.setTransparent(document.getElementById(this.id));
            },
            // 鼠标移过，背景取消透明
            mouseover : function() {
                var b = document.getElementById(this.id);
                b.style.backgroundImage = '';
                b.style.backgroundColor = '';
                b.style.borderColor = '';
            },
            // 背景设置透明
            afterrender : function() {
                this.setTransparent(document.getElementById(this.id));
            }
        };

        this.callParent(arguments); // 调用你模块的initComponent函数
    },
    
    setTransparent : function(b) {
        b.style.backgroundImage = 'inherit';
        b.style.backgroundColor = 'inherit';
        b.style.borderColor = 'transparent';
    }
});