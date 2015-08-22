/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

// 這邊用來裝載 Desktop Class, 然後 Desktop Class , Bottom Status Bar 等等, 然後 Desktop Class 在裝載桌面上的元件。

Ext.define('Ext.ux.desktop.App', {
    mixins: {                                // (*) mixins 是 ExtJS Class 的固有成員
        observable: 'Ext.util.Observable'    // 讓這個 app(Desktop) 成為事件觀察者可以監看其從屬成員(such as Desktop icon app)的事件
                                             // 當然你也可以這樣寫 mixins: ['Ext.util.Observable']
                                             // observable 名稱可以換掉但是底下建構子也要一併修改並呼叫
    },

    // requires 會在 Class 準備 Instances "前" 全數動態加載好
    requires: [
        'Ext.container.Viewport',            // 不這樣寫, 你就要寫很巢狀的 Ext.require('A',function(){ Ext.require('B',function(){ .... }) }); 不易閱讀！
        'Ext.ux.desktop.Desktop',            // 之後再 constructor->init 內將調用, 這個 Class 定義在 Desktop.js 內。
                                             // 在 desktop.html 內 'Ext.ux.desktop': 'js' 有 path 參考轉向。

        // Add My Additional UI
        'Ext.ux.desktop.LoginForm'           // Login Page
    ],

    isReady: false,
    modules: null,                           // 在 init() 內將被填寫為此 App 加載的各種 Sub App, Notepad....等等
    useQuickTips: true,

    // ExtJS 原生定義的 constructor 涵式(你需這樣命名) - 建構子
    constructor: function (config) {
        var me = this;
        
        // 以 this(app) 的角度呼叫 me.mixins.observable 的建構涵式 constructor , 並帶入參數 config
        // 因為 mixin 的時候取名為 observable
        // ExtJS 似乎不會自行幫你呼叫 Mixins 的建構子
        me.mixins.observable.constructor.call(this, config);

        // 觀察 app 啟動後有載入那些資源
        // debugger;

        // 讓 app 觀察自訂事件 ready、beforeunload, 從 Ext.util.Observable 獲得的方法
        me.addEvents(                       
            'ready',                        // 雖然可以從 mixins 獲得其成員、方法，但是最好還是要呼叫建構子，以免發生 Bug
            'beforeunload'
        );

        // 這很基本就不說了...
        if (Ext.isReady) {
            // 相當於 setTimeout
            Ext.Function.defer(me.init, 10, me);
        } else {
            // 如果沒準備好就讓他在準備好的時候調用
            Ext.onReady(me.init, me);
        }
    },

    // 這是自訂的 function , 並不是 ExtJS 內定的所以要自己從 Constructor 呼叫
    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }

        // 這邊會連帶調用一些自訂的方法
        desktopCfg = me.getDesktopConfig();

        // 桌面部件之後會作為其他應用的操作 handle, 先前在 require 內動態載入
        me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);

        // 簡單來說就是宣告一個 viewport, 這部分比較常用 xtype 的方式寫
        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [ me.desktop ]
        });

        // 事件監聽設定, 這一行寫法相當於 window.addEventListener 但是 callback 涵式 this 被換成此 app (即 Desktop App 的 Instance)
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

        // 會將 cfg 加上並被覆蓋從 me.desktopConfig 的屬性最後返回, 第二個參數為提取的屬性, 可以為 undefined 就不會有任何作用而已
        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },

    getModules: Ext.emptyFn,        // Ext.emptyFn 為 ExtJS 內建的 空Function 指向物, 你也可以直接寫 function(){}。

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
       衍生類可以複寫這些方法。
       class 可以繼承自其它的 class 的所有內容，包括 data members 和 functions，這樣的 class 稱為 derived class。
     */
    getTaskbarConfig: function () {
        var me = this, cfg = {
            app: me,
            startConfig: me.getStartConfig()
        };

        Ext.apply(cfg, me.taskbarConfig);
        return cfg;
    },

    // 將在 App 的 Constructor->init 被調用
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

    // ExtJS 內建的方法(Fired when Dom and Ext Classes is Loaded!), 似乎根本不會被調用 Test By Scott
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

        // 測試這個 Function 的執行時機
        debugger;
    },

    // 簡單來說就是取得桌面部件的 Handle
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
