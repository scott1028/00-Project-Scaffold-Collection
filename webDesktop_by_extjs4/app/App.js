/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */


// 定義一個 MyDesktop.App 的 Class, 並詳細的描述他的內容、動態加載等等
Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',               // 繼承自桌面 App Class

    requires: [                                 // require 為動態加載, 當創建這個累的時候就加載這些類別 (案需加載), 也可以單一加載，如 Ext.require('Product', callbackFunction );
        'Ext.window.MessageBox',

        'Ext.ux.desktop.ShortcutModel',

        'MyDesktop.SystemStatus',
        'MyDesktop.VideoWindow',
        'MyDesktop.GridWindow',
        'MyDesktop.TabWindow',
        'MyDesktop.AccordionWindow',
        'MyDesktop.Notepad',
        'MyDesktop.BogusMenuModule',
        'MyDesktop.BogusModule',

//        'MyDesktop.Blockalanche',
        'MyDesktop.Settings'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

// 以下直接註解，就只剩下桌面了！

    getModules : function(){
        return [
            new MyDesktop.VideoWindow(),
            //new MyDesktop.Blockalanche(),
            new MyDesktop.SystemStatus(),
            new MyDesktop.GridWindow(),
            new MyDesktop.TabWindow(),
            new MyDesktop.AccordionWindow(),
            new MyDesktop.Notepad(),
            new MyDesktop.BogusMenuModule(),
            new MyDesktop.BogusModule()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        // 額外增加一些新屬性進去
        return Ext.apply(ret, {
            //cls: 'ux-desktop-black',

            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: 'FAQ Manager', iconCls: 'grid-shortcut', module: 'grid-win' },
                    { name: 'Privilege Manager', iconCls: 'accordion-shortcut', module: 'acc-win' },
                    { name: 'Product', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: 'Package', iconCls: 'cpu-shortcut', module: 'systemstatus'},          // Module 感覺上是 Component ID
                    // 似乎可以自由增加 App 到桌面上
                    { name: 'Topup', iconCls: 'cpu-shortcut'}
                ]
            }),

            wallpaper: 'wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?');
    },

    onSettings: function () {
        var dlg = new MyDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
