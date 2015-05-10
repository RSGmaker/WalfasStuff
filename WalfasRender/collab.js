
	var onlineusers = 0;
	var rid = "DEV";
	var collabactive = false;
	var channel;
	function startcollab()
	{
		if (!collabactive)
		{
			collabactive = true;
		}
		else
		{
			alert("You are in room:"+rid);
			return;
		}
		rid = prompt("Enter a room name for your collab\r(Warning:this feature is experimental and may have odd behavior in some cases)");
		if (rid == "")
		{
			collabactive = false;
			alert("Collab connection was canceled.");
			return;
		}
	channel = new DataChannel("CreateHtml_"+rid);
	channel.onopen = function(userid) {
		onlineusers = onlineusers + 1;
		//prevent new users from blanking out others stages.
		if (stg.innerHTML != "")
		{
			collabpush(getstate());
		}
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
	}
	
	function processcommand(data,user,latency){
		if (user == 0 || ""+user == "undefined")
		{
			return;
		}
		if (data.command == "SetState")
		{
			setstate(JSON.parse(data.state));
		}
		if (data.command == "SetObject")
		{
			obj = document.getElementById(data.id);
			if (obj == undefined || obj == null)
			{
				var img = document.createElement(data.tagName); 
				//img.src = I;
				var obj = img;
		
				//img.alt = "";
				img.className = data.className;
		
	
				stg.appendChild(img);
				initobject(img);
				obj.style = data.style;
				img.id = data.id;
				
				
			obj.direction = 1;
			if (obj.scale<0)
			{
				obj.direction = -1;
			}
			
			}
			obj.setAttribute("style",data.style);
			obj.scale = PFslice2(data.style,"scaleX(",")");
			obj.rot = PFslice2(data.style,"rotate(",")");
			obj.innerHTML = data.html;
			
			if (obj.alt != data.alt && data.alt != undefined)
			{
				obj.alt = data.alt;
				resetobjectimage(obj);
			}
		}
		if (data.command == "SetBG")
		{
			ChangeBackground(data.id,data.pos,data.size);
		}
	}
	function send(msg)
	{
		if (collabactive)
		{
			channel.send(msg);
		}
	}
	function collabpush(state)
	{
		var data = {command:"SetState",state};
		send(JSON.stringify(data));
	}
	function collabchange(obj)
	{
		if (obj != null && obj != undefined)
		{
			if (obj.style != undefined && obj.style != null && obj.style != "")
			{
				var data = {command:"SetObject",id:obj.id,alt:obj.alt,style:obj.getAttribute("style"),className:obj.className,html:obj.innerHTML,tagName:obj.tagName};
				send(JSON.stringify(data));
			}
		}
	}
	function collabBG(index,position,size)
	{
		var data = {command:"SetBG",id:index,pos:position,size:size};
		send(JSON.stringify(data));
	}
			/*channel.onopen = oc.onopen;
			channel.onmessage = oc.onmessage
			channel.onleave = oc.onleave;
			channel.onclose = oc.onclose;
			channel.onerror = oc.onerror;*/
