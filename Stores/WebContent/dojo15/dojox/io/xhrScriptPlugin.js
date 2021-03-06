/*
	Copyright (c) 2004-2013, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.io.xhrScriptPlugin"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.io.xhrScriptPlugin"] = true;
dojo.provide("dojox.io.xhrScriptPlugin");
dojo.require("dojox.io.xhrPlugins");
dojo.require("dojo.io.script");
dojo.require("dojox.io.scriptFrame");

dojox.io.xhrScriptPlugin = function(/*String*/url, /*String*/callbackParamName, /*Function?*/httpAdapter){
	// summary:
	//		Adds the script transport (JSONP) as an XHR plugin for the given site. See
	//		dojox.io.script for more information on the transport. Note, that JSONP
	//		is *not* a secure transport, by loading data from a third-party site using JSONP
	//		the site has full access to your JavaScript environment.
	//	url:
	//		Url prefix of the site which can handle JSONP requests.
	// 	httpAdapter: This allows for adapting HTTP requests that could not otherwise be 
	// 		sent with JSONP, so you can use a convention for headers and PUT/DELETE methods.
	dojox.io.xhrPlugins.register(
		"script",
		function(method,args){
			 return args.sync !== true && 
				(method == "GET" || httpAdapter) && 
				(args.url.substring(0,url.length) == url);
		},
		function(method,args,hasBody){
			var send = function(){
				args.callbackParamName = callbackParamName;
				if(dojo.body()){
					args.frameDoc = "frame" + Math.random();
				}
				return dojo.io.script.get(args);
			}
			return (httpAdapter ? httpAdapter(send, true) : send)(method, args, hasBody); // use the JSONP transport
		}
	);
};

}
