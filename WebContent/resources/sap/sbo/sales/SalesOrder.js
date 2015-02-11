package sap.sbo.sales;

import sap.sbo.biz.BizObject;
import sap.sbo.core.logging.Logger;


class SalesOrder extends BizObject {
    
    var log = new Logger(SalesOrder);
    
    
    function init() {
        super();
        // TODO:
    }
    
    function close() {
        log.info("close");
    }
    
    function cancel() {
        log.info("close");
    }
}


declare("sap.sbo.sales.SalesOrder", ["sap.sbo.biz.BizObject", "sap.sbo.core.logging.Logger"], function() {
    
    var MAX_COUNT = 100;//private static
    
    this._super.extends(this.BizObject, {
    
        init: function () {
            this.log = new Logger(SalesOrder);
            this._super.init.apply(arguments);
            // TODO:
        },
        
        close: function () {
            this.log.info("close");
        },
        
        cancel: function () {
            this.log.info("close");
        }
    });
});


declare("sap.sbo.ui.Controller", null, ["sap.sbo.ui.Controller", "sap.sbo.core.logging.Logger"], function() {
    
    var MAX_COUNT = 100;//private static
    var log = new Logger(sap.sbo.ui.Controller);
    
    return {
    
        init: function () {
            
            this._super.init.apply(arguments);
            // TODO:
            
            
            log.info("I'm super");
        }
     
    };
});

declare("sap.sbo.sales.ui.SalesOrderController", "my.parent", ["sap.sbo.ui.Controller", "sap.sbo.core.logging.Logger"], function() {
    
    var MAX_COUNT = 100;//private static
    
    this._super.extends(this.Controller, {
    
        init: function (message) {
            this.log = new Logger(this);
            this._super.init.apply(arguments);
            // TODO:
            
            
            this.log.info("I'm child");
        },
        
        close: function () {
            this.log.info("close");
        },
        
        cancel: function () {
            this.log.info("close");
        }
    });
//    sap.sbo.sales.ui.SalesOrderCont
});

