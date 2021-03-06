/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.xmpp.sasl"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.xmpp.sasl"] = true;
dojo.provide("dojox.xmpp.sasl");
dojo.require("dojox.xmpp.util");

dojox.xmpp.sasl.saslNS = "urn:ietf:params:xml:ns:xmpp-sasl";
dojox.xmpp.sasl.SunWebClientAuth = function(session){
	var attribs = {
		xmlns: dojox.xmpp.sasl.saslNS,
		mechanism: "SUN-COMMS-CLIENT-PROXY-AUTH"
	}

	var auth = dojox.xmpp.util.createElement("auth", attribs, true);
	session.dispatchPacket(auth);
}

dojox.xmpp.sasl.SaslPlain = function(session){
	var attribs = {
		xmlns: dojox.xmpp.sasl.saslNS,
		mechanism: "PLAIN"
	};

	var auth = new dojox.string.Builder(dojox.xmpp.util.createElement("auth", attribs, false));

	var id = session.jid;
	var index = session.jid.indexOf('@');
	if (index != -1){
		id = session.jid.substring(0, index);
	}	
	var token = '\0' + id + '\0' + session.password;
	token = dojox.xmpp.util.Base64.encode(token);

	auth.append(token);
	auth.append("</auth>");
	session.dispatchPacket(auth.toString());
}

}
