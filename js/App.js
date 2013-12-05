/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.App', {
    mixins: {
        observable: 'Ext.util.Observable'    // 讓這個 app(Desktop) 成為事件觀察者可以監看其從屬成員(such as Desktop icon app)的事件
    },

    requires: [
        'Ext.container.Viewport',

        'Ext.ux.desktop.Desktop'
    ],

    isReady: false,
    modules: null,
    useQuickTips: true,

    // ExtJS 原生定義的 constructor 涵式(你需這樣命名) - 建構子
    constructor: function (config) {

        // 觀察 app 啟動後有載入那些資源
        // debugger;

        var me = this;
        me.addEvents(                       // 讓 app 觀察自訂事件 ready, beforeunload
            'ready',
            'beforeunload'
        );

        // 以 this(app) 的角度呼叫 me.mixins.observable 的建構涵式 constructor , 並帶入參數 config
        me.mixins.observable.constructor.call(this, config);

        if (Ext.isReady) {
            // 相當於 setTimeout
            Ext.Function.defer(me.init, 10, me);
        } else {
            // 如果沒準備好就讓他在準備好的時候調用
            Ext.onReady(me.init, me);
        }
    },

    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }

        desktopCfg = me.getDesktopConfig();
        me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);

        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [ me.desktop ]
        });

        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);

        me.isReady = true;
        me.fireEvent('ready', me);
    },

    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getDesktopConfig: function () {
        var me = this, cfg = {
            app: me,
            taskbarConfig: me.getTaskbarConfig()
        };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,

    /**
     * This method returns the configuration object for the Start Button. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getStartConfig: function () {
        var me = this,
            cfg = {
                app: me,
                menu: []
            },
            launcher;

        Ext.apply(cfg, me.startConfig);

        Ext.each(me.modules, function (module) {
            launcher = module.launcher;
            if (launcher) {
                launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
                cfg.menu.push(module.launcher);
            }
        });

        return cfg;
    },

    createWindow: function(module) {
        var window = module.createWindow();
        window.show();
    },

    /**
     * This method returns the configuration object for the TaskBar. A derived class
     * can override this method, call the base version to build the config and then
     * modify the returned object before returning it.
     */
    getTaskbarConfig: function () {
        var me = this, cfg = {
            app: me,
            startConfig: me.getStartConfig()
        };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    initModules : function(modules) {
        var me = this;
        Ext.each(modules, function (module) {
            // 為每一個 module增加一個 app 的屬性，其內容帶 me ( 指這個桌面 )
            module.app = me;
        });
    },

    // 點擊應用程式的時候觸發
    getModule : function(name) {
    	var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                // debugger;
                return m;
            }
        }
        return null;
    },

    onReady : function(fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },

    getDesktop : function() {
        return this.desktop;
    },

    // 當還沒讀取完成就觸發手動觸發尚未完成的 Event 給 this, this 監聽, this 觸發( 自己傳球給自己.... )
    onUnload : function(e) {
        // this.fireEvent 是 mixin 從 Ext.util.Observable 得來的方法
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});
