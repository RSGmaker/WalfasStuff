
	var onlineusers = 0;
	var rid = "DEV";
	var channel = new DataChannel("CreateHtml_"+rid);
	channel.onopen = function(userid) {
		onlineusers = onlineusers + 1;
		/*init();
		if (me.role != "none")
		{
			announce = 30;
		}*/
    };
	channel.onclose = function (event) {
            //sysmsg = "connection lost\nplease restart";
        };

    channel.onerror = function (event) {
		//sysmsg = "error:"+event;
	}
	channel.onmessage = function(message, userid,latency) {
		//init();
				 
		/*var command = message;
		var data;
		if (message.indexOf("{\\}")){
			data = message.split("{\\}");
			command = data[0];
		}
		else{
			data = [message];
		}*/
		var data = JSON.parse(message);
		var user=1;//GetUser(userid);
		processcommand(data,user,latency);
    };
	
	channel.onleave = function(userid) {
		var msg = {command:"Leaving"};
		//processcommand(msg,GetUser(userid));
		onlineusers = onlineusers-1;
		if (onlineusers <= 0)
		{
			var oc = channel;
			channel = new DataChannel("Create.html_"+rid);
			channel.onopen = oc.onopen;
			channel.onmessage = oc.onmessage
			channel.onleave = oc.onleave;
			channel.onclose = oc.onclose;
			channel.onerror = oc.onerror;
			me.id = channel.userid;
		}
    };
	
	function processcommand(data,user,latency){
		if (user == 0 || ""+user == "undefined")
		{
			return;
		}
		if (data.command == "SetState")
		{
			setstate(JSON.parse(atob(data.state)));
		}
	}
	function collabpush(state)
	{
		var data = {command:"SetState",state:btoa(state)};
		channel.send(JSON.stringify(data));
	}
			/*channel.onopen = oc.onopen;
			channel.onmessage = oc.onmessage
			channel.onleave = oc.onleave;
			channel.onclose = oc.onclose;
			channel.onerror = oc.onerror;*/
