(function() {
    
   window.DEBUG = true;
   window.console = {
      log: function() {
        var args = Array.prototype.slice.call(arguments),
            msg = args.map(function(x) {
              try 	 { return JSON.stringify(x, null, "  "); } 
              catch(e) { return x; } 
            }).join(", ");
        arguments.callee.queue.push(msg);
        setTimeout(arguments.callee.clear_queue);
      }
    };
    console.log.queue = [];
    console.log.clear_queue = function() {
      var q = console.log.queue,
          xhr = arguments.callee.xhr,
          qs;
        
      if (!q.length) return;
      if (xhr && xhr.readyState < 4) {
        xhr.onreadystatechange = arguments.callee;
        return;
      }
      
      qs = "log=";
      try {
        qs += settings.brandCode + "-";
      } catch(e) {}
      qs += "iPad-v25";
      if (typeof adobeDPS == "undefined") qs += "-MockAPI";

      qs += "&t=" + new Date().getTime();
      while (q.length) {
        qs += "&msg=" + encodeURIComponent(q.shift());
      }
        
      arguments.callee.xhr = xhr = new XMLHttpRequest();
      xhr.open("POST", "http://ecom-dev01-app.usdlls2.savvis.net:10400/cgi-bin/mobileLogs/log.py", true, 'subtester', 'bgpplny2009');
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xhr.send(qs);
    }
    
    window.onerror = function(err, lineNo, fileName) {
      console.log("window.onerror()", err, lineNo, fileName);
    }
    
    window.REPL = Backbone.View.extend({
      className: "dev-api-repl",
      events: {
        "click button": "start",
        "click .exit": "exit",
      },
      initialize: function() {
        this.logs = [];
        return this;
      },
      render: function() {
        var logs = this.logs.join("\n");
        this.$el.html("<pre>"+logs+"</pre><button>start</button><div class='exit'>x</div>");
        this.$("pre")[0].scrollTop = 999999;
        return this;
      },
      start: function() {
        var that = this;
        var api = this.options.api;
        var input = prompt("REPL input (blank to exit REPL):");
        if (!input) return;
        
        this.logs.push(">>> " + input); 
        var output;
        try {
          output = eval(input);
          try { output = JSON.stringify(output, null, "  ") } catch(e){}
        }
        catch(e) { 
          output = "error"; 
        }
        this.logs.push(output+"\n");
        this.render();
        setTimeout(function() { that.start() }, 100);
      },
      exit: function() {
        this.remove();
      }
      
    })

})();
