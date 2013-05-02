(function() {
    
   window.DEBUG = true;
   window.console = {
        log: function() {
            var args = Array.prototype.slice.call(arguments),
            	msg = args.map(function(x) {
	            	try 	 { return JSON.stringify(x); } 
	            	catch(e) { return x; } 
	            }).join(", ");
	        arguments.callee.queue.push(msg);
	        setTimeout(arguments.callee.clear_queue);
        }
    };
    console.log.queue = [];
    console.log.clear_queue = function() {
		var q = console.log.queue;
			qs = "log=ipadStore",
			xhr = arguments.callee.xhr;
			
		if (!q.length) return;
		if (xhr && xhr.readyState < 4) {
			xhr.onreadystatechange = arguments.callee;
		}
		
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
 

})();
