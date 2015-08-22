Ext.define('Ext.ux.desktop.LoginForm', {
    extend: 'Ext.window.Window',
    xtype: 'login',
    title: 'Login System',
    autoShow: true,
    items: [{
        xtype: 'form',
        reference: 'form',
        items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: 'Username',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Password',
            allowBlank: false
        }, {
            xtype: 'displayfield',
            hideEmptyLabel: false,
            value: 'Enter any non-blank password'
        }],
        buttons: [{
            text: 'Login',
            formBind: true,
            handler: function(){
                myDesktopApp = new MyDesktop.App();
                this.up('login').hide();
            }
        }]
    }],
    constructor : function(){
        this.callSuper();

        // Test Login
        if(true) return;

        //
        this.hide();
    }
});
