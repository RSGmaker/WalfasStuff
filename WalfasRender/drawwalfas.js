{
	walfasloader = null;
	// gets a value in between 2 strings
function slice2(str,start,end){
	var SI = str.indexOf(start);
	if (SI == -1)
	{
		return null;
	}
	SI = SI + start.length;
	return str.slice(SI,str.indexOf(end,SI+1));
}
// gets a value in between 2 strings and converts it to an integer
function Pslice2(str,start,end){
	var SI = str.indexOf(start);
	if (SI == -1)
	{
		return null;
	}
	SI = SI + start.length;
	return parseInt(str.slice(SI,str.indexOf(end,SI+1)));
}
// gets a value in between 2 strings and converts it to a float
function PFslice2(str,start,end){
	var SI = str.indexOf(start);
	if (SI == -1)
	{
		return null;
	}
	SI = SI + start.length;
	return parseFloat(str.slice(SI,str.indexOf(end,SI+1)));
}

//if  (ZipLoader != null && ZipLoader != undefined)
	//var walfasrepo = "https://cdn.rawgit.com/RSGmaker/WalfasStuff/master/WalfasRender/createswf2/"
var walfasrepo = "https://cdn.rawgit.com/RSGmaker/WalfasStuff/ea008702777f6353e40c0916e0c355855504da3f/WalfasRender/createswf2/"
{
	var T = document.title;
	document.title = "Loading assets...";
	try
	{
		try
		{
			walfasloader = new ZipLoader("createswf2.zip");
			walfasrepo="";
		}
		catch(err2)
		{
			walfasloader = new ZipLoader(walfasrepo+"createswf2.zip");
		}
		
	
	}
	catch(error)
	{
	}
	document.title = T;
}

	function drawwalfas()
	{
//drawable entities
this.DWentities = [];
//original this.outline color
this.Ooutline;
//original skin color
this.Oskincolor;
this.skincolor;
this.outline;
//whether to use this.drawsvg or the feature that comes with the browser.(disabling only effects backgrounds)
this.customrenderer = false;
//whether or not to randomize all this.colors, used in RSGmaker's seizure time animations
this.randomcols = false;
//list of colorchanges
this.colors = [];
//the walfasrepository of the create.swf vector files(in svg format).
this.OHairColor = null;
this.HairColor = null;

//var ZipLoader;
this.allowtransforms = false;

this.Openfile = function(req,type) {
	if (typeof req == "string")
	{
		req = this.Loadfile(req);
	}
	if (req != null)
	{
		//var svg = req.responseText;
		var svg = req;
		var i = 0;
		while (i<this.colors.length)
		{
			var nc = this.colors[i];
			if (nc.active && ((nc.filter == "All" || type == "All") || (type.toLowerCase().indexOf( nc.filter.toLowerCase())>-1)))
			{
				svg = svg.replace(nc.src,nc.dst);
			}
			i = i+1;
		}
		var E = {};
		E.svg = svg;
		E.x = 0;
		E.y = 0;
		E.type=type;
		E.content = "svg";
		E.scale = 0.85;
		this.DWentities[this.DWentities.length] = E;
		return E;
	}
	return null;
}

this.Loadfile = function(url,type){
	if (sessionStorage["walfas_"+url]) {
			//if we've loaded this file before just get the info from temp storage.
            return sessionStorage["walfas_"+url];
        } else {
	if (type == "" || type == null)
	{
		if (walfasloader != null)
		{
			var U = walfasrepo + "createswf2.zip://createswf2/" + url.substring(walfasrepo.length);
			try
			{
				var ret = walfasloader.load(U);
			}
			catch(error)
			{
				return null;
			}
			//sessionStorage["walfas_"+url] = ret;
			return ret;
		}
		try {
			var req = new XMLHttpRequest();
			req.open('GET', url, false);
			req.send();
			if (req.status === 200 || req.status === 304)
			{
				//sessionStorage["walfas_"+url] = req.responseText;
				sessionStorage["walfas_"+url] = req.response;
				return req.responseText;
			}
		}
		catch(err) {
			//document.getElementById("demo").innerHTML = err.message;
			sessionStorage["walfas_"+url] = "";
			return null;
		}
	}
	else
	{
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.responseType = "";
		req.send();
		req.onload = function(e) {
			sessionStorage["walfas_"+url]=req;
			this.Openfile(req,type);
		}
	}
		}
}
this.PartsLoad = function(feature,objs)
{
	var i = 0;
	var ret = [];
	if (objs != undefined)
	{
	while (i < objs.length)
	{
		if (objs[i] != undefined && objs[i] != null)
		{
		ret[i] = this.PartLoad(feature,objs[i]);
		}
		i++;
	}
	}
	return ret;
}
//function this.PartLoad(feature,index,side)
this.PartLoad = function(feature,obj)
{
	var ret = null;
	var ot = obj.type;
	if (ot == undefined)
	{
		//if (typeof obj.src == "number")
		if (!isNaN(obj.src))
		{
			ot = "normal";
		}
		else if (typeof obj.src == "string")
		{
			ot = "custom";
		}
	}
	if (ot == "normal")
	{
		var ind = parseInt(""+obj.src);
		var tmp = ["Wings","Accessories","body","Arms","Hats","Items","Mouth","Shoes"]
		if (tmp.indexOf(feature)>-1)
		{
			ind--;
		}
		//ret = this.LoadPart(feature,obj.src,side);
		ret = this.LoadPart(feature,ind,obj.side);
		if (ret != null)
		{
			ret.content = "svg";
		}
	}
	else if (ot == "custom" && feature != "Hair2")
	{
		//ret = this.LoadPart(feature,obj.src,side);
		var url = obj.src;
		/*
		ret = {};
		ret.src = new Image;
		ret.src.src = url;*/
		/*if (sessionStorage["walfas_"+url]) {
			//if we've loaded this file before just get the info from temp storage.
			ret = {};
			ret.src = new Image;
            ret.src.src = sessionStorage["walfas_"+url];
        } else */{
			try
			{
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		////req.responseType = "blob";
		//req.responseType = "arraybuffer";
		req.send();
		ret = {};
		//ret.src = new Image;
        //ret.src.src = URL.createObjectURL(req.response);
		//ret.src.src = 'data:image/png;base64,' +req.responseText;
		if (typeof req.responseText == "string" && req.responseText.indexOf("<?xml") == 0)
		{
			ret.svg = req.responseText;
		}
		/*if (req.status === 200 || req.status === 304)
		{
			ret.svg = req.responseText;
			
				//sessionStorage["walfas_"+url] = req.responseText;
			//sessionStorage["walfas_"+url] = req.response;
			//return req.responseText;
			/*alert(""+req.response)
			
			//ret.src.src = URL.createObjectURL(req.response);
			var blob = new Blob([req.response], {type: 'image/png'});
			ret.src.src = URL.createObjectURL(blob);*/
				
		//}*/
		if (ret != 0)
		{
			this.DWentities[this.DWentities.length] = ret;
		}
		if (ret != null)
		{
			ret.x = 0;
			ret.y = 0;
			ret.type = feature;
			//ret.content = "img";
			ret.content = "svg";
			ret.scale = 0.85;
			
			var i = 0;
			while (i<this.colors.length)
			{
				var nc = this.colors[i];
				if (nc.active && ((nc.filter == "All" || type == "All") || (feature.toLowerCase().indexOf( nc.filter.toLowerCase())>-1)))
				{
					ret.svg = ret.svg.replace(nc.src,nc.dst);
				}
				i = i+1;
			}
			
			ret.svg = this.sideSplit(ret.svg,feature,obj.side);
		}
		}
		catch(err)
		{
			ret = null;
			ret = {};
			ret.src = new Image;
			ret.src.src = url;
			ret.scale = 0.85;
		}
		}
	}
	else if (ot == "basic")
	{
		ret = this.Openfile(obj.src,"blarg");
		if (ret != null)
		{
			ret.content = "svg";
		}
	}
	
	//if this is a regular walfas prop then position it like the system would normally
	if (ret != null/* && (ot == "normal" || ot == "basic")*/)
	{
		//general offset value, changing this will change where it centers.
		//ret.content = "svg";
	var xo = -100;
	var yo = -220;
	
	//a value i used to make the body go into a more correct placement.
	var NX = -6;
	var NY = 2;
		
		if (feature == "body")
	{
		ret.x = 105+xo+NX;
		ret.y = 305+yo+NY;
	}
	if (feature == "Basichead")
	{
		ret.x = 38+xo+1;
		ret.y = 55+yo+3;
		/*if (isbacksprite==true)
		{
			ret.y +=1;
			H2.x = ret.x+6;
			H2.y = ret.y;
			ret.svg = ret.svg.replace("#fff1dd","#"+D[13]);
			
			H2.svg = H2.svg.replace("#fff1dd","#"+D[13]);
		}*/
	}
	if (feature == "this.outlinehead")
	{
		ret.x = 100+xo;
		ret.y = 305+yo+5+3;
		//this.outline head isnt that useful it looks like, so lets just move it off screen....
		//this.outlinehead.y = -10000;
	}
	
	if (feature == "Hats")
	{
		ret.x = 100+xo;
		ret.y = 310+yo-4;
	}
	if (feature == "Arms")
	{
		ret.x = 105+xo+NX;
		ret.y = 305+yo+NY;
	}
	if (feature == "Shoes")
	{
		ret.x = 102+xo+NX+2;
		ret.y = 305+yo+NY-1;
	}
	if (feature == "Mouth")
	{
		ret.x = 105+xo-5;
		ret.y = 305+yo+1;
	}
	if (feature == "Eyes")
	{
		ret.x = 100+xo-1;
		ret.y = 312+yo-5;
	}
	if (feature == "Hair" || feature == "Hair2")
	{
		ret.x = 100+xo;
		ret.y = 310+yo-3;//fill="#
		//var T = ret.svg.substr(ret.svg.indexOf("#"),7);
		//var T = "#"+slice2(ret.svg,'fill="#','"');
		//if (T != "#000000")
		var T = this.OHairColor;
		this.OHairColor = null;
		if (feature == "Hair")
		{
			T = slice2(ret.svg,'fill="','"');
		}
		//if (T != "#000000" && (T != null && T[0]=="#"))
		if (T != "#000000" && (T == null || T.toLowerCase()!="black"))
		{
			if (this.HairColor != null)
			{
				if (feature == "Hair")
				{
					this.OHairColor = T;
				}
				ret.svg = ret.svg.replace(T,"#"+this.HairColor)
			}
		}
		else if (feature == "Hair")
		{
			//if the first search for the haircolor failed, then make 1 more attempt.
			T = ret.svg.substr(ret.svg.indexOf('fill="')+5);
			T = slice2(T,'fill="','"');
			if (T != "#000000" && (T == null || T.toLowerCase()!="black"))
			{
				if (this.HairColor != null)
				{
					this.OHairColor = T;
					ret.svg = ret.svg.replace(T,"#"+this.HairColor)
				}
			}
		}
	}
	if (feature == "Accessories")
	{
		ret.x = 47+xo;
		ret.y = 63+yo+5;
		ret.y += 7;
		ret.x -= 2;
		ret.scale = 1;
	}
	if (feature == "Items")
	{
		ret.x = 68+xo+NX;
		ret.y = 180+yo+NY;
		ret.scale = 1;
	}
	//back
		if (feature == "Wings")
		{
			ret.x = -45+xo+NX;
			ret.y = -30+yo+NY;
		}
	}
	return ret;
}

this.LoadADVDNA = function(dna,sc,oc,isbacksprite){
	if (dna==null){
		dna = "3.39:Meiling:100:1:0:1:1:1:0:0:0:0:0:EB585A";
	}
	this.DWentities = [];
	this.colors = dna.colors;
	if (this.colors == null || this.colors == undefined)
	{
		this.colors = [];
	}
	this.skincolor = sc;
	this.outline = oc;
	this.Oskincolor = "#fff1dd";
	this.Ooutline = "#000000";
	if (this.skincolor == null){
		this.skincolor = this.Oskincolor;
	}
	if (this.outline==null){
		this.outline = this.Ooutline;
	}
	//Version#:Name:Scale:Hat:Hair:Body:Arm:Shoes:Eyes:Mouth:Item:Accessory:Back:this.HairColor
	
	var Back = null;
	var Back2 = null;
	var hasstubble = false;
	this.HairColor = dna.HairColor;
	//var hasstubble = (D[11] == 110);
	if (isbacksprite!=true)
	{
		Back = this.PartsLoad("Wings",dna.Back);
	}
	var Shoes = null;
	var Shoes2 = null;
	
	{
		Shoes = this.PartsLoad("Shoes",dna.Shoes);
	}
	var outlinehead;
	//this.outlinehead = this.Openfile(walfasrepo+"Basichead/1.svg","blarg");
	
	//basichead is the head prop that goes under the hair
	var basichead;
	var Accessory;
	if (isbacksprite!=true)
	{
		/*basichead = this.Openfile(walfasrepo+"Basichead/0.svg","blarg");
		var xo = -100;
	var yo = -220;
		basichead.x = 38+xo+1;
		basichead.y = 55+yo+3;*/
		basichead = this.PartsLoad("Basichead",dna.Head);
	}
	
	
	var Hair;
	var Hair2;
	var Mouth = this.PartsLoad("Mouth",dna.Mouth);
	if (isbacksprite!=true)
	{
		Hair = this.PartsLoad("Hair",dna.Hair);
		Hair2 = this.PartsLoad("Hair2",dna.Hair);
	}
	
	var Eyes = null;
	var Eyes2 = null;
	
	{
		Eyes = this.PartsLoad("Eyes",dna.Eyes);
	}
	/*if (hasstubble)
	{
		//the accessory is a stubble so let's place it before the mouth.
		Accessory = this.LoadPart("Accessories",this.dec(D[11]));
	}*/
	
	
	
	var Hat;
	if (isbacksprite!=true)
	{
		Hat	= this.PartsLoad("Hats",dna.Hats);
	}
	var Arms = null;
	var Arms2 = null;
	
	{
		Arms = this.PartsLoad("Arms",dna.Arms);
	}
	var Item = null;
	var Item2 = null;
	
	{
		Item = this.PartsLoad("Items",dna.Items);
	}
	//var Body = this.LoadPart("body",this.dec(D[5]));
	var Body = this.PartsLoad("body",dna.Body);
	if (isbacksprite!=true && !hasstubble) 
	{
		Accessory = this.PartsLoad("Accessories",dna.Accessory);
	}
	var H2;
	if (isbacksprite==true)
	{
		this.outlinehead = this.Openfile(walfasrepo+"Basichead/1.svg","basichead");
		if (this.outlinehead != null)
		{
			var xo = -100;
			var yo = -220;
			this.outlinehead.x = 100+xo;
			this.outlinehead.y = 305+yo+5+3;
			//this.outline head isnt that useful it looks like, so lets just move it off screen....
			//this.outlinehead.y = -10000;
		}
		//this.outlinehead = this.PartsLoad("Basichead",[{src:1}]);
		
		Hair = this.PartsLoad("Hair",dna.Hair);
		Hair2 = this.PartsLoad("Hair2",dna.Hair);
		//basichead = this.Openfile(walfasrepo+"Basichead/0.svg","basichead");
		basichead = this.PartsLoad("Basichead",dna.Head);
		//H2 is a duplicate that helps hide parts to try to make the backsprite cleaner
		//basichead[0].scale = 1;
		H2 = this.PartsLoad("Basichead",dna.Head);
		//H2[0].scale = 1;
		Hat	= this.PartsLoad("Hats",dna.Hats);
		
		//if (isbacksprite==true)
		{
			basichead[0].y +=1;
			H2[0].x = basichead[0].x+6;
			H2[0].y = basichead[0].y;
			basichead[0].svg = basichead[0].svg.replace("#fff1dd","#"+dna.HairColor);
			
			H2[0].svg = H2[0].svg.replace("#fff1dd","#"+dna.HairColor);
		}
	}

	if (isbacksprite==true)
	{
		Back = this.PartsLoad("Wings",dna.Back);
	}
	
	/*if (this.customrenderer)
	{
	//general offset value, changing this will change where it centers.
	var xo = -100;
	var yo = -220;
	
	//a value i used to make the body go into a more correct placement.
	var NX = -6;
	var NY = 2;
	if (Body != null)
	{
		Body.x = 105+xo+NX;
		Body.y = 305+yo+NY;
	}
	if (basichead != null)
	{
		basichead.x = 38+xo+1;
		basichead.y = 55+yo+3;
		if (isbacksprite==true)
		{
			basichead.y +=1;
			H2.x = basichead.x+6;
			H2.y = basichead.y;
			basichead.svg = basichead.svg.replace("#fff1dd","#"+D[13]);
			
			H2.svg = H2.svg.replace("#fff1dd","#"+D[13]);
		}
	}
	if (this.outlinehead != null)
	{
		this.outlinehead.x = 100+xo;
		this.outlinehead.y = 305+yo+5+3;
		//this.outline head isnt that useful it looks like, so lets just move it off screen....
		//this.outlinehead.y = -10000;
	}
	
	if (Hat != null)
	{
		Hat.x = 100+xo;
		Hat.y = 310+yo-4;
	}
	if (Arms != null)
	{
		Arms.x = 105+xo+NX;
		Arms.y = 305+yo+NY;
	}
	if (Arms2 != null)
	{
		Arms2.x = 105+xo+NX;
		Arms2.y = 305+yo+NY;
	}
	if (Shoes != null)
	{
		Shoes.x = 102+xo+NX+2;
		Shoes.y = 305+yo+NY-1;
	}
	if (Shoes2 != null)
	{
		Shoes2.x = 102+xo+NX;
		Shoes2.y = 305+yo+NY;
	}
	if (Mouth != null)
	{
		Mouth.x = 105+xo;
		Mouth.y = 305+yo;
	}
	if (Eyes != null)
	{
		Eyes.x = 100+xo-1;
		Eyes.y = 312+yo-5;
		
	}
	if (Eyes2 != null)
	{
		Eyes2.x = 100+xo;
		Eyes2.y = 312+yo;
	}
	if (Hair != null)
	{
		Hair.x = 100+xo;
		Hair.y = 310+yo-3;
		Hair.svg = Hair.svg.replace(Hair.svg.substr(Hair.svg.indexOf("#"),7),"#"+D[13])
	}
	if (Hair2 != null)
	{
		Hair2.x = 100+xo;
		Hair2.y = 310+yo-3;
	}
	if (Accessory != null)
	{
		Accessory.x = 47+xo;
		Accessory.y = 63+yo+5;
	}
	if (Item != null)
	{
		Item.x = 68+xo+NX;
		Item.y = 180+yo+NY;
		
		//non this.customrenderer
		//Item.x = 68+xo+NX+300;
		//Item.y = 180+yo+NY;
	}
	if (Item2 != null)
	{
		Item2.x = 68+xo+NX;
		Item2.y = 180+yo+NY;
	}
	if (Back != null)
	{
		Back.x = -45+xo+NX;
		Back.y = -30+yo+NY;
	}
	if (Back2 != null)
	{
		Back2.x = -45+xo+NX;
		Back2.y = -30+yo+NY;
	}
	}
	else
	{
		var xo = 100;
	var yo = 0;
	
	//a value i used to make the body go into a more correct placement.
	//var NX = -6;
	//var NY = 2;
	if (Body != null)
	{
		Body.x = 0+xo;
		Body.y = 50+yo;
	}
	if (basichead != null)
	{
		basichead.x = 0+xo;
		basichead.y = 30+yo;
		if (isbacksprite==true)
		{
			basichead.y +=1;
			H2.x = basichead.x+6;
			H2.y = basichead.y;
			basichead.svg = basichead.svg.replace("#fff1dd","#"+D[13]);
			
			H2.svg = H2.svg.replace("#fff1dd","#"+D[13]);
		}
	}
	
	if (Hat != null)
	{
		Hat.x = -8+xo;
		Hat.y = -120+yo;
	}
	if (Arms != null)
	{
		Arms.x = -4+xo;
		Arms.y = 110+yo;
	}
	if (Arms2 != null)
	{
		Arms2.x = -5+xo;
		Arms2.y = 130+yo;
	}
	if (Shoes != null)
	{
		Shoes.x = -40+xo;
		Shoes.y = 297+yo;
	}
	if (Shoes2 != null)
	{
		Shoes2.x = 0+xo;
		Shoes2.y = 290+yo;
	}
	if (Mouth != null)
	{
		Mouth.x = 55+xo;
		Mouth.y = 92+yo;
	}
	if (Eyes != null)
	{
		Eyes.x = 20+xo;
		Eyes.y = 50+yo;
		
	}
	if (Eyes2 != null)
	{
		Eyes2.x = 0+xo;
		Eyes2.y = 30+yo;
	}
	if (Hair != null)
	{
		Hair.x = 0+xo;
		Hair.y = 0+yo;
		Hair.svg = Hair.svg.replace(Hair.svg.substr(Hair.svg.indexOf("#"),7),"#"+D[13])
	}
	if (Hair2 != null)
	{
		Hair2.x = 0+xo;
		Hair2.y = -5+yo;
	}
	if (Accessory != null)
	{
		Accessory.x = 0+xo;
		Accessory.y = 0+yo;
	}
	if (Item != null)
	{
		Item.x = 0+xo;
		Item.y = 0+yo;
	}
	if (Item2 != null)
	{
		Item2.x = 0+xo;
		Item2.y = 0+yo;
	}
	if (Back != null)
	{
		Back.x = 125+xo;
		Back.y = 0+yo;
	}
	if (Back2 != null)
	{
		Back2.x = -10+xo;
		Back2.y = 0+yo;
	}
	}*/
}

this.LoadDNA = function(dna,sc,oc,isbacksprite){
	if (dna==null){
		dna = "3.39:Meiling:100:1:0:1:1:1:0:0:0:0:0:EB585A";
	}
	this.DWentities = [];
	var D = dna.split(":");
	this.colors = [];
	if (D.length>=15)
		{
			//process recolor information in dna
			var TT = D[14].split("/");
			i = 0;
			while (i< TT.length)
			{
				
				var TTT = TT[i].split(">");
				var nc = {};
				//source color
				nc.src = "#"+TTT[0];
				//destination color
				nc.dst = "#"+TTT[1];
				//filter(which props this color change applies to)
				nc.filter = TTT[2];
				nc.active = true;
				this.colors[i] = nc;
				i = i+1;
			}
			
		}
	this.skincolor = sc;
	this.outline = oc;
	this.Oskincolor = "#fff1dd";
	this.Ooutline = "#000000";
	if (this.skincolor == null){
		this.skincolor = this.Oskincolor;
	}
	if (this.outline==null){
		this.outline = this.Ooutline;
	}
	//Version#:Name:Scale:Hat:Hair:Body:Arm:Shoes:Eyes:Mouth:Item:Accessory:Back:this.HairColor
	
	var Back = null;
	var Back2 = null;
	var hasstubble = (D[11] == 110);
	if (isbacksprite!=true)
	{
	if (D[12].indexOf("S")>0)
	{
		var DS = D[12].split("S");
		Back = this.LoadPart("Wings",this.dec(DS[0]),"left");
		Back2 = this.LoadPart("Wings",this.dec(DS[1]),"right");
	}
	else
	{
		Back = this.LoadPart("Wings",this.dec(D[12]));
	}
	}
	var Shoes = null;
	var Shoes2 = null;
	if (D[7].indexOf("S")>0)
	{
		var DS = D[7].split("S");
		Shoes = this.LoadPart("Shoes",this.dec(DS[0]),"left");
		Shoes2 = this.LoadPart("Shoes",this.dec(DS[1]),"right");
	}
	else
	{
		Shoes = this.LoadPart("Shoes",this.dec(D[7]));
	}
	var outlinehead;
	//this.outlinehead = this.Openfile(walfasrepo+"Basichead/1.svg","blarg");
	
	//basichead is the head prop that goes under the hair
	var basichead;
	var Accessory;
	if (isbacksprite!=true)
	{
		basichead = this.Openfile(walfasrepo+"Basichead/0.svg","blarg");
	}
	
	
	var Hair;
	var Hair2;
	if (isbacksprite!=true)
	{
		Hair = this.LoadPart("Hair",D[4]);
		Hair2 = this.LoadPart("Hair2",D[4]);
	}
	
	var Eyes = null;
	var Eyes2 = null;
	if (D[8].indexOf("S")>0)
	{
		var DS = D[8].split("S");
		Eyes = this.LoadPart("Eyes",this.dec(DS[0]),"left");
		Eyes2 = this.LoadPart("Eyes",this.dec(DS[1]),"right");
	}
	else
	{
		Eyes = this.LoadPart("Eyes",D[8]);
	}
	if (hasstubble)
	{
		//the accessory is a stubble so let's place it before the mouth.
		Accessory = this.LoadPart("Accessories",this.dec(D[11]));
	}
	var Mouth = this.LoadPart("Mouth",this.dec(D[9]));
	
	var Hat;
	if (isbacksprite!=true)
	{
		Hat	= this.LoadPart("Hats",this.dec(D[3]));
	}
	var Arms = null;
	var Arms2 = null;
	if (D[6].indexOf("S")>0)
	{
		var DS = D[6].split("S");
		Arms = this.LoadPart("Arms",this.dec(DS[0]),"left");
		Arms2 = this.LoadPart("Arms",this.dec(DS[1]),"right");
	}
	else
	{
		Arms = this.LoadPart("Arms",this.dec(D[6]));
	}
	var Item = null;
	var Item2 = null;
	if (D[10].indexOf("S")>0)
	{
		var DS = D[10].split("S");
		Item = this.LoadPart("Items",this.dec(DS[0]),"left");
		Item2 = this.LoadPart("Items",this.dec(DS[1]),"right");
	}
	else
	{
		Item = this.LoadPart("Items",this.dec(D[10]));
	}
	var Body = this.LoadPart("body",this.dec(D[5]));
	if (isbacksprite!=true && !hasstubble) 
	{
		Accessory = this.LoadPart("Accessories",this.dec(D[11]));
	}
	var H2;
	if (isbacksprite==true)
	{
		this.outlinehead = this.Openfile(walfasrepo+"Basichead/1.svg","blarg");
		Hair2 = this.LoadPart("Hair2",D[4]);
		Hair = this.LoadPart("Hair",D[4]);
		
		basichead = this.Openfile(walfasrepo+"Basichead/0.svg","blarg");
		//H2 is a duplicate that helps hide parts to try to make the backsprite cleaner
		H2 = this.Openfile(walfasrepo+"Basichead/0.svg","blarg"); 
		Hat	= this.LoadPart("Hats",this.dec(D[3]));
		
		
	if (D[12].indexOf("S")>0)
	{
		var DS = D[12].split("S");
		Back = this.LoadPart("Wings",this.dec(DS[0]),"left");
		Back2 = this.LoadPart("Wings",this.dec(DS[1]),"right");
	}
	else
	{
		Back = this.LoadPart("Wings",this.dec(D[12]));
	}
	}
	if (this.customrenderer)
	{
	//general offset value, changing this will change where it centers.
	var xo = -100;
	var yo = -220;
	
	//a value i used to make the body go into a more correct placement.
	var NX = -6;
	var NY = 2;
	if (Body != null)
	{
		Body.x = 105+xo+NX;
		Body.y = 305+yo+NY;
	}
	if (basichead != null)
	{
		basichead.x = 38+xo+1;
		basichead.y = 55+yo+3;
		if (isbacksprite==true)
		{
			basichead.y +=1;
			H2.x = basichead.x+6;
			H2.y = basichead.y;
			basichead.svg = basichead.svg.replace("#fff1dd","#"+D[13]);
			
			H2.svg = H2.svg.replace("#fff1dd","#"+D[13]);
		}
	}
	if (this.outlinehead != null)
	{
		this.outlinehead.x = 100+xo;
		this.outlinehead.y = 305+yo+5+3;
		//this.outline head isnt that useful it looks like, so lets just move it off screen....
		//this.outlinehead.y = -10000;
	}
	
	if (Hat != null)
	{
		Hat.x = 100+xo;
		Hat.y = 310+yo-4;
	}
	if (Arms != null)
	{
		Arms.x = 105+xo+NX;
		Arms.y = 305+yo+NY;
	}
	if (Arms2 != null)
	{
		Arms2.x = 105+xo+NX;
		Arms2.y = 305+yo+NY;
	}
	if (Shoes != null)
	{
		Shoes.x = 102+xo+NX+2;
		Shoes.y = 305+yo+NY-1;
	}
	if (Shoes2 != null)
	{
		Shoes2.x = 102+xo+NX;
		Shoes2.y = 305+yo+NY;
	}
	if (Mouth != null)
	{
		Mouth.x = 105+xo;
		Mouth.y = 305+yo;
	}
	if (Eyes != null)
	{
		Eyes.x = 100+xo-1;
		Eyes.y = 312+yo-5;
		
	}
	if (Eyes2 != null)
	{
		Eyes2.x = 100+xo;
		Eyes2.y = 312+yo;
	}
	if (Hair != null)
	{
		Hair.x = 100+xo;
		Hair.y = 310+yo-3;
		Hair.svg = Hair.svg.replace(Hair.svg.substr(Hair.svg.indexOf("#"),7),"#"+D[13])
	}
	if (Hair2 != null)
	{
		Hair2.x = 100+xo;
		Hair2.y = 310+yo-3;
	}
	if (Accessory != null)
	{
		Accessory.x = 47+xo;
		Accessory.y = 63+yo+5;
	}
	if (Item != null)
	{
		Item.x = 68+xo+NX;
		Item.y = 180+yo+NY;
		
		//non this.customrenderer
		//Item.x = 68+xo+NX+300;
		//Item.y = 180+yo+NY;
	}
	if (Item2 != null)
	{
		Item2.x = 68+xo+NX;
		Item2.y = 180+yo+NY;
	}
	if (Back != null)
	{
		Back.x = -45+xo+NX;
		Back.y = -30+yo+NY;
	}
	if (Back2 != null)
	{
		Back2.x = -45+xo+NX;
		Back2.y = -30+yo+NY;
	}
	}
	else
	{
		var xo = 100;
	var yo = 0;
	
	//a value i used to make the body go into a more correct placement.
	//var NX = -6;
	//var NY = 2;
	if (Body != null)
	{
		Body.x = 0+xo;
		Body.y = 50+yo;
	}
	if (basichead != null)
	{
		basichead.x = 0+xo;
		basichead.y = 30+yo;
		if (isbacksprite==true)
		{
			basichead.y +=1;
			H2.x = basichead.x+6;
			H2.y = basichead.y;
			basichead.svg = basichead.svg.replace("#fff1dd","#"+D[13]);
			
			H2.svg = H2.svg.replace("#fff1dd","#"+D[13]);
		}
	}
	/*if (this.outlinehead != null)
	{
		this.outlinehead.x = 100+xo;
		this.outlinehead.y = 305+yo+5+3;
		//this.outline head isnt that useful it looks like, so lets just move it off screen....
		//this.outlinehead.y = -10000;
	}*/
	
	if (Hat != null)
	{
		Hat.x = -8+xo;
		Hat.y = -120+yo;
	}
	if (Arms != null)
	{
		Arms.x = -4+xo;
		Arms.y = 110+yo;
	}
	if (Arms2 != null)
	{
		Arms2.x = -5+xo;
		Arms2.y = 130+yo;
	}
	if (Shoes != null)
	{
		Shoes.x = -40+xo;
		Shoes.y = 297+yo;
	}
	if (Shoes2 != null)
	{
		Shoes2.x = 0+xo;
		Shoes2.y = 290+yo;
	}
	if (Mouth != null)
	{
		Mouth.x = 55+xo;
		Mouth.y = 92+yo;
	}
	if (Eyes != null)
	{
		Eyes.x = 20+xo;
		Eyes.y = 50+yo;
		
	}
	if (Eyes2 != null)
	{
		Eyes2.x = 0+xo;
		Eyes2.y = 30+yo;
	}
	if (Hair != null)
	{
		Hair.x = 0+xo;
		Hair.y = 0+yo;
		Hair.svg = Hair.svg.replace(Hair.svg.substr(Hair.svg.indexOf("#"),7),"#"+D[13])
	}
	if (Hair2 != null)
	{
		Hair2.x = 0+xo;
		Hair2.y = -5+yo;
	}
	if (Accessory != null)
	{
		Accessory.x = 0+xo;
		Accessory.y = 0+yo;
	}
	if (Item != null)
	{
		Item.x = 0+xo;
		Item.y = 0+yo;
	}
	if (Item2 != null)
	{
		Item2.x = 0+xo;
		Item2.y = 0+yo;
	}
	if (Back != null)
	{
		Back.x = 125+xo;
		Back.y = 0+yo;
	}
	if (Back2 != null)
	{
		Back2.x = -10+xo;
		Back2.y = 0+yo;
	}
	}
}
//used as a lazy way to fix indexes.
this.dec = function(strind)
{
	return parseInt(strind)-1;
}
this.sideSplit = function(svg,feature,side)
{
	if (typeof side != "string")
		{
			return svg;
		}
		side = side.toLowerCase(); 
		var sd = 0;
		if (side == "left")
		{
			sd = -1;
		}
		if (side == "right")
		{
			sd = 1;
		}
		if (sd==0)
		{
			return svg;
		}
	var text = svg.split("\n");
	var rtext = text[0];
	var i = 1;
	var D;
	while (i < text.length)
	{
		var S = text[i];
		var off = 0;
		if (feature == "Wings")
		{
			off = -140;
		}
		if ((S.indexOf("<path"))> -1){
			D = slice2(S," d=\"","\"");
			var DM = D.split("M");
			var DT = DM[0];
			var im = 1;
			while (im<DM.length)
			{
				var pd = DM[im].split(" ");
				if ((parseFloat(pd[0])+off)*sd>0)
				{
					DT = DT + "M" + DM[im];
				}
				im = im+1;
			}
			S = S.replace(D,DT);
		}
		{
			rtext = rtext + "\n" + S;
		}
		i = i + 1;
	}
	svg = rtext;
	return svg;
}
//this calls this.Openfile but does prop splitting features before returning an svg
this.LoadPart = function(feature,index,side)
{
	if (index >-1)
	{
		var U = walfasrepo+feature+"/"+index+".svg";
		var ret = this.Openfile(U,feature);
		if (ret != null)
		{
		ret.svg = this.sideSplit(ret.svg,feature,side);
		}
	return ret;
	}
	return null;
}
function fillarray(array,element)
{
	var i = 0;
	while (i < element.children.length)
	{
		array[array.length] = element.children[i];
		fillarray(array,element.children[i]);
		i++;
	}
}

//the xml version of this.drawsvg which will likely be more compatible
this.drawxml = function(context,xml,x,y){
	var i = 0;
	var trans = false;
	var data = {};
	var def = false;
	var Transforms = {};
	var trans = null;
	var Gradients = {};
	var G;
	grd = null;
	var svg = [];
	//flatten elements into 1 single array so it processes in the same order as the text parser
	fillarray(svg,xml.getElementsByTagName("svg")[0]);
	while (i < svg.length)
	{
		//this while loop loads all the gradients found in the svg.
		var S = svg[i];
		var D = -1;
		if (S.tagName == "radialGradient"){
		grd = {};
		grd.id = S.getAttribute("id");
		grd.r = parseInt(S.getAttribute("r"));
		
		grd.cx = parseFloat(S.getAttribute("cx"));
		grd.cy = parseFloat(S.getAttribute("cx"));
		grd.fx = parseFloat(S.getAttribute("fx"));
		grd.fy = parseFloat(S.getAttribute("fx"));
		if (grd.fx == null || isNaN(grd.fx))
		{
			grd.fx = grd.cx;
		}
		if (grd.fy == null || isNaN(grd.fy))
		{
			grd.fy = grd.cy;
		}
		grd.stops = [];
		var gradient = context.createRadialGradient(grd.fx,grd.fy,0,grd.cx,grd.cy,grd.r);
				var j = 0;
				G = gradient;
		Gradients[grd.id] = gradient;
		}
		if (S.tagName == "linearGradient")
		{
		grd = {};
		grd.id = S.getAttribute("id");
		grd.x1 = parseFloat(S.getAttribute("x1"));
		grd.y1 = parseFloat(S.getAttribute("y1"));
		grd.x2 = parseFloat(S.getAttribute("x2"));
		grd.y2 = parseFloat(S.getAttribute("y2"));
		if (grd.x1 == null || isNaN(grd.x1))
		{
			grd.x1 = 0;
		}
		if (grd.x2 == null || isNaN(grd.x2))
		{
			grd.x2 = 0;
		}
		if (grd.y1 == null || isNaN(grd.y1))
		{
			grd.y1 = 0;
		}
		if (grd.y2 == null || isNaN(grd.y2))
		{
			grd.y2 = 0;
		}
		grd.stops = [];
		var gradient = context.createLinearGradient(grd.x1,grd.y1,grd.x2,grd.y2);
				var j = 0;
				G = gradient;
		Gradients[grd.id] = gradient;
		}
		if (S.tagName == "stop" && grd != null){
		var stop = {offset:parseFloat(S.getAttribute("offset")),color:S.getAttribute("stop-color"),opacity:parseFloat(S.getAttribute("stop-opacity"))};//stop-color="
		lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="stop-color")
					{
						stop.color = SS[1];
					}
					else if (SS[0]=="stop-opacity")
					{
						stop.opacity = SS[1];
					}
					II = II + 1;
				}
			}
		if (stop.color != null)
		{
			G.addColorStop(stop.offset,stop.color);
		}
	}
	i = i+1;
	}
	i = 0;
	while (i < svg.length)
	{
		//this is the main while loop that does the actual draw functions
		var S = svg[i];
		
		var D = -1;
		if (S.getAttribute("transform"))
		{
			D = S.getAttribute("transform");
			D = D.slice(D.indexOf("matrix(")+7,D.indexOf(")"));
			D = D.split(",");
			var T = [parseFloat(D[0]),parseFloat(D[1]),parseFloat(D[2]),parseFloat(D[3]),parseFloat(D[4]),parseFloat(D[5])];
			D = S.getAttribute("xlink:href");
			if (D != null)
			{
				//although the transforms are loaded they are never used as i never figured out how to get them to behave.
				//alert("transformation "+D + " set as " + T);
				T[6] = 1 / T[0];
				T[7] = 1 / T[3];
				Transforms[D] = T;
			}
		}
		if (S.tagName == "line")
		{
			//var points = S.getAttribute("points");
			var X1 = S.getAttribute("x1");
			var Y1 = S.getAttribute("y1");
			var X2 = S.getAttribute("x2");
			var Y2 = S.getAttribute("y2");
			var fcolor = S.getAttribute("fill");
			var scolor = S.getAttribute("stroke");
			context.beginPath();
			context.moveTo(x1,y1);
			context.lineTo(x2,y2);
			
			lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
					}
					II = II + 1;
				}
			}
			
			if (scolor != null)
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					context.stroke();
				
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				
					context.stroke();
			}
			context.moveTo(0,0);
		}
		if (S.tagName == "polygon" || S.tagName == "polyline")
		{
			var points = S.getAttribute("points");
			var fcolor = S.getAttribute("fill");
			var scolor = S.getAttribute("stroke");
			var ib = 0;
			var pts = points.split(" ");
			context.beginPath();
			
			lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
					}
					II = II + 1;
				}
			}
			
			if (fcolor != null)
			{
				
				var OP;
				OP = S.getAttribute("fill-opacity");
				
				if (OP)
				{
					OP = parseFloat(OP);
					context.globalAlpha = OP;
				}
				if (fcolor.indexOf("url(#")==0)
				{
					fcolor = Gradients[slice2(fcolor,"url(#",")")];
				}
				context.fillStyle=fcolor;
				if (this.randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				ib = 0;
			while (ib < pts.length)
			{
				var vr = pts[ib].split(",");
				if (vr.length>1)
				{
				if (ib == 0)
				{
					context.moveTo(vr[0],vr[1]);
				}
				else
				{
					context.lineTo(vr[0],vr[1]);
				}
				}
				ib++;
			}
				context.fill();
				if (OP != -1)
				{
					//context.globalAlpha=1;
				}
			}
			if (scolor != null)
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					ib = 0;
			while (ib < pts.length)
			{
				var vr = pts[ib].split(",");
				if (vr.length>1)
				{
				if (ib == 0)
				{
					context.moveTo(vr[0],vr[1]);
				}
				else
				{
					context.lineTo(vr[0],vr[1]);
				}
				}
				ib++;
			}
					context.stroke();
				
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				ib = 0;
			while (ib < pts.length)
			{
				var vr = pts[ib].split(",");
				if (vr.length>1)
				{
				if (ib == 0)
				{
					context.moveTo(vr[0],vr[1]);
				}
				else
				{
					context.lineTo(vr[0],vr[1]);
				}
				}
				ib++;
			}
					context.stroke();
			}
			context.moveTo(0,0);
		}
		if (S.tagName == "ellipse")
		{
			var XX = S.getAttribute("cx");
			var YY = S.getAttribute("cy");
			var RX = S.getAttribute("rx");
			var RY = S.getAttribute("ry");
			var fcolor = S.getAttribute("fill");
			var scolor = S.getAttribute("stroke");
			
			lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
					}
					II = II + 1;
				}
			}
			
			if (fcolor != null)
			{
				
				var OP;
				OP = S.getAttribute("fill-opacity");
				
				if (OP)
				{
					OP = parseFloat(OP);
					context.globalAlpha = OP;
				}
				if (fcolor.indexOf("url(#")==0)
				{
					fcolor = Gradients[slice2(fcolor,"url(#",")")];
				}
				context.fillStyle=fcolor;
				if (this.randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				context.bezierCurveTo(XX-RX,YY,XX,YY-RY,XX+RX);
				context.bezierCurveTo(XX-RX,YY,XX,YY+RY,XX+RX);
				context.fill();
				if (OP != -1)
				{
					//context.globalAlpha=1;
				}
			}
			if (scolor != null)
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					context.bezierCurveTo(XX-RX,YY,XX,YY-RY,XX+RX);
					context.bezierCurveTo(XX-RX,YY,XX,YY+RY,XX+RX);
					context.stroke();
				
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				
					context.bezierCurveTo(XX-RX,YY,XX,YY-RY,XX+RX);
					context.bezierCurveTo(XX-RX,YY,XX,YY+RY,XX+RX);
					context.stroke();
			}
		}
		if (S.tagName == "circle")
		{
			var XX = S.getAttribute("cx");
			var YY = S.getAttribute("cy");
			var R = S.getAttribute("r");
			var fcolor = S.getAttribute("fill");
			var scolor = S.getAttribute("stroke");
			
			lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
					}
					II = II + 1;
				}
			}
			
			if (fcolor != null)
			{
				
				var OP;
				OP = S.getAttribute("fill-opacity");
				
				if (OP)
				{
					OP = parseFloat(OP);
					context.globalAlpha = OP;
				}
				if (fcolor.indexOf("url(#")==0)
				{
					fcolor = Gradients[slice2(fcolor,"url(#",")")];
				}
				context.fillStyle=fcolor;
				if (this.randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				context.arc(XX,YY,R,0,2*Math.PI);
				context.fill();
				if (OP != -1)
				{
					//context.globalAlpha=1;
				}
			}
			if (scolor != null)
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					context.arc(XX,YY,R,0,2*Math.PI);
					context.stroke();
				
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				
				context.arc(XX,YY,R,0,2*Math.PI);
					context.stroke();
			}
		}
		if (S.tagName == "rect")
		{
			var XX = S.getAttribute("x");
			var YY = S.getAttribute("y");
			var WW = S.getAttribute("width");
			var HH = S.getAttribute("height");
			var fcolor = S.getAttribute("fill");
			var scolor = S.getAttribute("stroke");
			var LW = S.getAttribute("rx");
			if (LW)
			{
				context.lineWidth = LW;
				context.lineCap="round";
			}
			lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
					}
					II = II + 1;
				}
			}
			
			if (fcolor != null)
			{
				
				var OP;
				OP = S.getAttribute("fill-opacity");
				
				if (OP)
				{
					OP = parseFloat(OP);
					context.globalAlpha = OP;
				}
				if (fcolor.indexOf("url(#")==0)
				{
					fcolor = Gradients[slice2(fcolor,"url(#",")")];
				}
				context.fillStyle=fcolor;
				if (this.randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				context.fillRect(XX,YY,WW,HH);
				if (OP != -1)
				{
					//context.globalAlpha=1;
				}
			}
			if (scolor != null)
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					context.rect(XX,YY,WW,HH);
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				
				context.rect(XX,YY,WW,HH);
			}
		}
		if (S.tagName == "g")
		{
			trans = S.getAttribute("id");
			if (trans != null)
			{
				//set what the current transformation should be
				
				//alert("loading transformation"+trans);
				trans = Transforms[trans];
			}
		}
		if (S.tagName == "path"){
			D = S.getAttribute("d");
			var lj = S.getAttribute("linejoin");
			if (lj)
			{
				context.lineJoin = lj;
			}
			else
			{
				//context.lineJoin = "miter";
			}
			lj = S.getAttribute("linecap");
			if (lj)
			{
				context.lineCap = lj;
			}
			else
			{
				//context.lineCap = "miter";
			}
			lj = S.getAttribute("stroke-width");
			if (lj)
			{
				context.lineWidth = lj;
			}
			else
			{
				//context.lineWidth = 1;
			}
			
			var path = new Path2D(D);
			var fcolor = S.getAttribute("fill");
			var scolor = S.getAttribute("stroke");
			lj = S.getAttribute("style");
			if (lj)
			{
				var STYLE = lj.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					SS[1] = SS[1].replace("px","")
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (SS[0] == "stroke-width")
					{
						context.lineWidth = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
					}
					II = II + 1;
				}
			}

			context.translate(x,y);
			if (trans != null)
			{
				//an old attempt at figuring out transform
				//context.transform(trans[0],0,0,trans[3],0,0);
			}
			
			//if (fcolor != null)
			//if (fcolor != null && (fcolor.charAt(0) == "#" || fcolor.indexOf("url(#")==0))
			if (fcolor != null && (fcolor != "none"))
			{
				var OP;
				OP = S.getAttribute("fill-opacity");
				
				if (OP)
				{
					OP = parseFloat(OP);
					context.globalAlpha = OP;
				}
				if (fcolor.indexOf("url(#")==0)
				{
					fcolor = Gradients[slice2(fcolor,"url(#",")")];
				}
				context.fillStyle=fcolor;
				if (this.randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				context.fill(path);
				if (OP != -1)
				{
					//context.globalAlpha=1;
				}
			}
			//if (scolor != null)
			if (scolor != null && (scolor != "none"))
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					context.stroke(path);
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				
				context.stroke(path);
			}
			if (trans != null)
			{
				//undo transform
				//context.transform(trans[6],0,0,trans[7],0,0);
			}
			context.translate(-x,-y);
				}
		context.globalAlpha=1;
		i = i + 1;
	}
}
	
 //the old text parsing version of the renderer
this.drawsvg = function(context,svg,x,y){
	var text = svg.split("\n");
	var i = 0;
	var trans = false;
	var data = {};
	//3.39:Momizi (2):100:149:151:152:146:32:0:0:108:0:65:FBFBFB
	var def = false;
	var Transforms = {};
	var trans = null;
	var Gradients = {};
	var G;
	grd = null;
	//context.save();
	//trans = true;
	//<defs>
	//alert("drawing svg, "+text.length+" lines.");
	while (i < text.length)
	{
		var S = text[i];
		if (S.indexOf("<")>0 && S.indexOf(">")<0)
		{
			i = i+1;
			var ST = text[i];
			S = S + " " + ST;
			while (ST.indexOf(">")<0)
			{
				i = i+1;
				ST = text[i];
				S = S + " " + ST;
			}
			//alert(S);
			//combine multiline into a single line command
		}
		var D = -1;
		if ((D = S.indexOf("<radialGradient"))> -1){
		grd = {};
		grd.id = slice2(S,"id=\"","\"");
		grd.r = Pslice2(S,"r=\"","\"");
		grd.cx = PFslice2(S,"cx=\"","\"");
		grd.cy = PFslice2(S,"cx=\"","\"");
		grd.fx = PFslice2(S,"fx=\"","\"");
		grd.fy = PFslice2(S,"fx=\"","\"");
		if (grd.fx == null)
		{
			grd.fx = grd.cx;
		}
		if (grd.fy == null)
		{
			grd.fy = grd.cy;
		}
		grd.stops = [];
		var gradient = context.createRadialGradient(grd.fx,grd.fy,0,grd.cx,grd.cy,grd.r);
				var j = 0;
				//just implement the first as global since idk how to actually use it.
				//context.globalAlpha = grd.stops[0].opacity;
				/*while (j < grd.stops.length)
				{
					gradient.addthis.colorstop(grd.stops[j].offset,grd.stops[j].color);
					j = j+1;
				}*/
				//grd.grad = gradient
				G = gradient;
		Gradients[grd.id] = gradient;
		}
		if ((D = S.indexOf("<linearGradient"))> -1)
		{
		grd = {};
		grd.id = slice2(S,"id=\"","\"");
		grd.x1 = PFslice2(S,"x1=\"","\"");
		grd.y1 = PFslice2(S,"y1=\"","\"");
		grd.x2 = PFslice2(S,"x2=\"","\"");
		grd.y2 = PFslice2(S,"y2=\"","\"");
		if (grd.x1 == null)
		{
			grd.x1 = 0;
		}
		if (grd.x2 == null)
		{
			grd.x2 = 0;
		}
		if (grd.y1 == null)
		{
			grd.y1 = 0;
		}
		if (grd.y2 == null)
		{
			grd.y2 = 0;
		}
		grd.stops = [];
		var gradient = context.createLinearGradient(grd.x1,grd.y1,grd.x2,grd.y2);
				var j = 0;
				//just implement the first as global since idk how to actually use it.
				//context.globalAlpha = grd.stops[0].opacity;
				/*while (j < grd.stops.length)
				{
					gradient.addthis.colorstop(grd.stops[j].offset,grd.stops[j].color);
					j = j+1;
				}*/
				//grd.grad = gradient
				G = gradient;
		Gradients[grd.id] = gradient;
		}
		//<stop <stop offset=\"
		if ((D = S.indexOf("<stop"))> -1 && grd != null)
		{
		//grd.stops[grd.stops.length] = {offset:PFslice2(S,"offset=\"","\""),color:slice2(S,"stop-color=\"","\""),opacity:PFslice2(S,"stop-opacity=\"","\"")};//stop-color="
		var stop = {offset:PFslice2(S,"offset=\"","\""),color:slice2(S,"stop-color=\"","\""),opacity:PFslice2(S,"stop-opacity=\"","\"")};//stop-color="
		G.addColorStop(stop.offset,stop.color);
		}
	i = i+1;
	}
	i = 0;
	while (i < text.length)
	{
		var S = text[i];
		if (S.indexOf("<")>0 && S.indexOf(">")<0)
		{
			i = i+1;
			var ST = text[i];
			S = S + " " + ST;
			while (ST.indexOf(">")<0)
			{
				i = i+1;
				ST = text[i];
				S = S + " " + ST;
			}
			//alert(S);
			//combine multiline into a single line command
		}
		var D = -1;
		/*if (S.indexOf("<defs>") > -1)
		{
			def = true;
		}
		if (S.indexOf("matrix(") > -1)
		{
			//<g
			var D = S.slice(S.indexOf("matrix(")+7,S.indexOf(")"));
			D = D.split(",");
			if (!def)
			{
			if (S.indexOf("<g "))
			{
				data.maintransform = [parseInt(D[0]),parseInt(D[1]),parseInt(D[2]),parseInt(D[3]),parseInt(D[4]),parseInt(D[5])];
			}
			else if (S.indexOf("<use "))
			{
				var J = S.indexOf("href=\"#")+7;
				J = S.slice(J,S.indexOf(J+1));
				data["Trn"+J] = [parseInt(D[0]),parseInt(D[1]),parseInt(D[2]),parseInt(D[3]),parseInt(D[4]),parseInt(D[5])];
				//data[]
			}
			}
		}
		else if (S.indexOf("<path") > -1)*/
		if (S.indexOf("matrix(") > -1)
		{
			//<g
			D = S.slice(S.indexOf("matrix(")+7,S.indexOf(")"));
			D = D.split(",");
			var T = [parseFloat(D[0]),parseFloat(D[1]),parseFloat(D[2]),parseFloat(D[3]),parseFloat(D[4]),parseFloat(D[5])];
			D = slice2(S,"xlink:href=\"#","\"");
			if (D != null)
			{
				//alert("transformation "+D + " set as " + T);
				T[6] = 1 / T[0];
				T[7] = 1 / T[3];
				Transforms[D] = T;
			}
		}
		if (S.indexOf("<g id=\"") > -1)
		{
			trans = slice2(S,"<g id=\"","\"");
			if (trans != null)
			{
				//alert("loading transformation"+trans);
				trans = Transforms[trans];
			}
		}
		if ((S.indexOf("<path"))> -1)
		{
			//var D = S.slice(S.indexOf("<path d=\"")+9,S.indexOf("\" "));
			//D = S.slice(D+9,S.indexOf("\" "));
			D = slice2(S," d=\"","\"");
			//alert("path:"+D);
			var lj = S.indexOf("linejoin=\"");
			if (lj > -1)
			{
				lj = S.substr(lj+10,5);
				context.lineJoin = lj;
			}
			else
			{
				context.lineJoin = "miter";
			}
			lj = S.indexOf("linecap=\"");
			if (lj > -1)
			{
				lj = S.substr(lj+9,5);
				context.lineCap = lj;
			}
			else
			{
				context.lineCap = "miter";
			}
			lj = S.indexOf("stroke-width=\"");
			if (lj > -1)
			{
				lj = S.slice(lj+14,S.indexOf("\"",lj+15));
				context.lineWidth = parseInt(lj);
			}
			else
			{
				context.lineWidth = 1;
			}
			
			var path = new Path2D(D);
			//var fcolor = S.substr(S.indexOf("fill=\"")+6,7);
			
			//var scolor = S.substr(S.indexOf("stroke=\"")+8,7);
			var fcolor = slice2(S,"fill=\"","\"");
			var scolor = slice2(S,"stroke=\"","\"");
			lj = S.indexOf("style=\"");
			if (lj > -1)
			{
				//alert("styl'in");
				var Sty = slice2(S,"style=\"","\"");
				var STYLE = Sty.split(";");
				var II = 0;
				while (II<STYLE.length)
				{
					var SS = STYLE[II].split(":");
					if (SS[0]=="id")
					{
					}
					if (SS[0]=="fill")
					{
						fcolor = SS[1];
					}
					else if (SS[0]=="stroke")
					{
						scolor = SS[1];
					}
					else if (isNaN(SS[1]))
					{
						context[SS[0]] = SS[1];
						//alert(SS[0] + "=(string)" +SS[1]);
					}
					else
					{
						context[SS[0]] = parseFloat(SS[1]);
						//alert(SS[0] + "=(number)" +parseFloat(SS[1]));
					}
					II = II + 1;
				}
				/*if (Sty.indexOf("fill:")>-1)
				{
					fcolor = context.fill;
				}
				if (Sty.indexOf("stroke:")>-1)
				{
					scolor = context.stroke;
				}*/
			}

			context.translate(x,y);
			if (trans != null)
			{
				//context.transform(trans[0],0,0,trans[3],0,0);
			}
			
			if (fcolor != null && (fcolor.charAt(0) == "#" || fcolor.indexOf("url(#")==0))
			{
				
				var OP;
				OP = S.indexOf("fill-opacity=\"");
				if (OP > -1)
				{
					OP = OP+14;
					OP = parseFloat(S.slice(OP,S.indexOf("\"",OP+1)));
					context.globalAlpha = OP;
				}
				if (fcolor.indexOf("url(#")==0)
				{
					fcolor = Gradients[slice2(fcolor,"url(#",")")];
				}
				context.fillStyle=fcolor;
				if (this.randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				context.fill(path);
				if (OP != -1)
				{
					//context.globalAlpha=1;
				}
			}
			if (scolor != null && (scolor.charAt(0) == "#"))
			{
				context.strokeStyle=scolor;
				if (this.randomcols)
				{
					context.strokeStyle=randomcolor2();
				}
				//var sw = (data[scale] * 0.01) * context.lineWidth;
				//if (sw < 1.1)
				{
					context.stroke(path);
				}
			}
			else
			{
				context.strokeStyle = context.fillStyle;
				//scolor = fcolor;
				context.lineWidth = 1;
				
				context.stroke(path);
			}
			if (trans != null)
			{
				//context.transform(trans[6],0,0,trans[7],0,0);
			}
			context.translate(-x,-y);
		}
		context.globalAlpha=1;
		i = i + 1;
	}
}
//create an image object with a walfas dna render preset as its source
this.imageFromObject = function(objindex,scale,cropped){
	var ret = new Image();
	ret.src = this.imageSrcFromObject(objindex,scale,cropped);
	return ret;
}
//render walfas dna and get the render as a dataurl
this.imageSrcFromObject = function(objindex,scale,cropped){
	//this.LoadDNA(dna);
	//return walfasrepo+"Objects"+"/"+objindex+".svg";
	var CR = this.customrenderer;
	this.customrenderer = true;
	allowtransforms = false;
	var BG = this.LoadPart("Objects",objindex);
	var canvas = document.createElement('canvas');
	if (scale == null)
	{
		scale = 1;
	}
	canvas.width = 750*scale;
	canvas.height = 500*scale;
	var G = canvas.getContext("2d");
	G.save(); 
 
	// move to the middle of where we want to draw our image
	if (this.customrenderer)
	{
		G.translate(375*scale, 260*scale);
	}
	else
	{
		G.translate(0*scale, -140*scale);
	}
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	G.scale(0.85*scale,0.85*scale);
	var i = 0;
	//while (i < this.DWentities.length)
	{
		var E = BG;
		if (E != null && typeof E.svg != 'undefined')
		{
			if (this.customrenderer)
			{
			if (typeof E.xml == 'undefined')
			{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
			}
			//this.drawsvg(G,E.svg,E.x,E.y);
			this.drawxml(G,E.xml,E.x,E.y);
			}
			else
			{
			
			var url = 'data:image/svg+xml;base64,' + btoa(E.svg);
			img = new Image();
			img.src = url;
			G.drawImage(img,0,0);
			}
		}
		i = i + 1;
	}
	// and restore the co-ords to how they were when we began
	G.restore();
	var ret = canvas.toDataURL();
	if (cropped)
	{
		var imageData = G.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var tx = 0;
		var ty = 0;
		//start texture index at opacity data
		var tindex = 3;
		//var tindex = 0;
		//range of crop
		var mnx = null;
		var mny = null;
		var mxx = null;
		var mxy = null;
		while (ty < canvas.height)
		{
			while (tx < canvas.width)
			{
				//detect if pixel has any opacity
				if (data[tindex]>0/* || data[tindex+1]>0 || data[tindex+2]>0 || data[tindex+3]>0*/)
				{
					//adjust range to fit the pixel
					if (mnx != null)
					{
					mxx = Math.max(mxx,tx);
					mxy = Math.max(mxy,ty);
					
					mnx = Math.min(mnx,tx);
					mny = Math.min(mny,ty);
					}else{
						mxx = tx;
						mxy = ty;
						mnx = tx;
						mny = ty;
					}
				}
				tindex = tindex +4;
				tx = tx + 1;
			}
			ty = ty + 1;
			tx = 0;
		}
		//make a canvas for the new cropped image
		var cropped = document.createElement('canvas');
		//set its size to the crop ranges size
		cropped.width = (mxx - mnx)+1;
		cropped.height = (mxy - mny)+1;
		//alert("mnx:"+mnx+" mny:"+mny+" mxx:"+mxx+" mxy:"+mxy);
		var G2 = cropped.getContext("2d");
		var TI = new Image();
		TI.src = ret;
		//draw the image from the starting point of crop range
		G2.drawImage(TI,-mnx,-mny);
		//set return value to the newly cropped version
		ret = cropped.toDataURL();
	}
	this.customrenderer = CR;
	return ret;
}
//create an image object with a walfas dna render preset as its source
this.imageFromBackground = function(bgindex,scale){
	var ret = new Image();
	ret.src = this.imageSrcFromBackground(bgindex,scale);
	return ret;
}
//just a dumb idea, it doesn't actually work as async data doesn't update while other data is running it looks like
this.loadimg = function(img,src)
{
	var i = 0;
	var freeze=true;
	img.onload = function(e) {
			freeze = false;
		}
		img.src = src;
		while (!img.complete)
		{
			i++;
		}
}
//render walfas dna and get the render as a dataurl
this.imageSrcFromBackground = function(bgindex,scale){
	//this.LoadDNA(dna);
	allowtransforms = true;
	var BG = this.LoadPart("Background",bgindex);
	var canvas = document.createElement('canvas');
	if (scale == null)
	{
		scale = 1;
	}
	canvas.width = 500*scale;
	canvas.height = 400*scale;
	var G = canvas.getContext("2d");
	G.save(); 
 
	// move to the middle of where we want to draw our image
	G.translate(-410*scale, -286*scale);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	G.scale(1*scale,1*scale);
	var i = 0;
	//while (i < this.DWentities.length)
	{
		var E = BG;
		if (E != null && typeof E.svg != 'undefined')
		{
			if (this.customrenderer)
			{
				if (typeof E.xml == 'undefined')
				{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
				}
				this.drawxml(G,E.xml,E.x,E.y);
			}
			else
			{
			/**/
			//this.drawsvg(G,E.svg,E.x,E.y);
			//
			var url = 'data:image/svg+xml;base64,' + btoa(E.svg);
			img = new Image();
			img.src = url;
			G.drawImage(img,0,0);
			}
		}
		i = i + 1;
	}
	// and restore the co-ords to how they were when we began
	G.restore();
	var ret = canvas.toDataURL();
	return ret;
}
this.imageFromADVDNA = function(dna,scale,cropped,isbacksprite){
	var ret = new Image();
	ret.src = this.imageSrcFromADVDNA(dna,scale,cropped,isbacksprite);
	return ret;
}
//render walfas dna and get the render as a dataurl
this.imageSrcFromADVDNA = function(dna,scale,cropped,isbacksprite){
	var CR = this.customrenderer;
	this.customrenderer = true;
	allowtransforms = false;
	this.LoadADVDNA(dna,null,null,isbacksprite);
	var canvas = document.createElement('canvas');
	if (scale == null)
	{
		//scale = 1;
		scale = dna.scale * 0.01;
		//var D = dna.split(":");
		//scale = parseFloat(D[2])*0.01;
	}
	canvas.width = 500*scale;
	canvas.height = 500*scale;
	var G = canvas.getContext("2d");
	G.save(); 
	
 
	// move to the middle of where we want to draw our image
	var TX = 0;
	var TY = 0;
	if (this.customrenderer)
	{
		//G.translate(250*scale, 260*scale);
		TX = 250 * scale;
		TY = 260 * scale;
	}
	else
	{
		//G.translate(125*scale, 125*scale);
		TX = 125 * scale;
		TY = 125 * scale;
	}
	
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	//G.scale(0.85*scale,0.85*scale);
	//G.setTransform(1,0,0,1,250,260);
	var i = 0;
	while (i < this.DWentities.length)
	{
		var E = this.DWentities[i];
		if (E != null)
		{
			if (this.customrenderer)
			{
				G.setTransform(E.scale*scale,0,0,E.scale*scale,TX,TY);
			if (E.content == "svg" && typeof E.svg != 'undefined')
			{
			if (typeof E.xml == 'undefined')
			{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
			}
			//this.drawsvg(G,E.svg,E.x,E.y);
			this.drawxml(G,E.xml,E.x,E.y);
			}
			else if (E.content=="img" && typeof E.src != 'undefined')
			{
				//if (E.src.complete)
				{
					//G.drawImage(E.src,E.x - (E.src.width/2),E.y);
					G.drawImage(E.src,E.x,E.y);
				}
				//this.drawxml(G,E.src,E.x,E.y);
			}
			}
			else
			{
			var url = 'data:image/svg+xml;base64,' + btoa(E.svg);
			img = new Image();
			img.src = url;
			//G.drawImage(img,E.x,E.y);
			if (img.complete)
			{
				G.drawImage(img,E.x - (img.width/2),E.y);
			}
			}
		}
		i = i + 1;
	}
	// and restore the co-ords to how they were when we began
	G.restore();
	this.customrenderer = CR;
	var ret = canvas.toDataURL();
	if (cropped)
	{
		var imageData = G.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var tx = 0;
		var ty = 0;
		//start texture index at opacity data
		var tindex = 3;
		//var tindex = 0;
		//range of crop
		var mnx = null;
		var mny = null;
		var mxx = null;
		var mxy = null;
		while (ty < canvas.height)
		{
			while (tx < canvas.width)
			{
				//detect if pixel has any opacity
				if (data[tindex]>0)
				{
					//adjust range to fit the pixel
					if (mnx != null)
					{
					mxx = Math.max(mxx,tx);
					mxy = Math.max(mxy,ty);
					
					mnx = Math.min(mnx,tx);
					mny = Math.min(mny,ty);
					}else{
						mxx = tx;
						mxy = ty;
						mnx = tx;
						mny = ty;
					}
				}
				tindex = tindex +4;
				tx = tx + 1;
			}
			ty = ty + 1;
			tx = 0;
		}
		//make a canvas for the new cropped image
		var cropped = document.createElement('canvas');
		//if (false)
		//if (cropped)
			//if (true)
		if (false)
		{
		//set its size to the crop ranges size
		cropped.width = (mxx - mnx)+1;
		cropped.height = (mxy - mny)+1;
		//alert("mnx:"+mnx+" mny:"+mny+" mxx:"+mxx+" mxy:"+mxy);
		var G2 = cropped.getContext("2d");
		var TI = new Image();
		TI.src = ret;
		//draw the image from the starting point of crop range
		G2.drawImage(TI,-mnx,-mny);
		//set return value to the newly cropped version
		}
		else
		{
			//attempt at a cropping that retains centering
			var X = Math.min(mnx,canvas.width-mxx);
			var Y = Math.min(mny,canvas.height-mxy);
			
			cropped.width = canvas.width - (X*2);
			cropped.height = canvas.height - (Y*2);
			
			var G2 = cropped.getContext("2d");
			var TI = new Image();
			TI.src = ret;
			//draw the image from the starting point of crop range
			G2.drawImage(TI,-X,-Y);
		}
		ret = cropped.toDataURL();
	}
	return ret;
}
//create an image object with a walfas dna render preset as its source
this.imageFromDNA = function(dna,scale,cropped,isbacksprite){
	var ret = new Image();
	ret.src = this.imageSrcFromDNA(dna,scale,cropped,isbacksprite);
	return ret;
}

this.converttoadvancedDNA = function(dna)
{
	//Version#:Name:Scale:Hat:Hair:Body:Arm:Shoes:Eyes:Mouth:Item:Accessory:Back:this.HairColor
	//var D = {};
	var t = dna.split(":");
	colors = [];
	if (t.length>=15)
		{
			//process recolor information in dna
			var TT = t[14].split("/");
			i = 0;
			while (i< TT.length)
			{
				
				var TTT = TT[i].split(">");
				var nc = {};
				//source color
				nc.src = "#"+TTT[0];
				//destination color
				nc.dst = "#"+TTT[1];
				//filter(which props this color change applies to)
				nc.filter = TTT[2];
				nc.active = true;
				this.colors[i] = nc;
				i = i+1;
			}
			
		}
	
	var D = {scale:parseFloat(t[2]),
	Name:t[1],
	Body:this.splitdna(t[5]),
	Eyes:this.splitdna(t[8]),
	Mouth:this.splitdna(t[9]),
	Head:[{src:0}],
	Arms:this.splitdna(t[6]),
	Accessory:this.splitdna(t[11]),
	Hair:this.splitdna(t[4]),
	Hats:this.splitdna(t[3]),
	Items:this.splitdna(t[10]),
	Shoes:this.splitdna(t[7]),
	Back:this.splitdna(t[12]),
	HairColor:t[13],
	colors:colors};
	//
	
	//
	
	return D;
}
this.splitdna = function(data)
{
	if (data != undefined && data != null)
	{
		var ret = [{src:data}];
		if (data.indexOf("S")>-1)
		{
			var S = data.split("S");
			ret = [{src:S[0],side:"left"},{src:S[1],side:"right"}];
		}
		return ret;
	}
	return null;
}

//render walfas dna and get the render as a dataurl
this.imageSrcFromDNA = function(dna,scale,cropped,isbacksprite){
	
	return this.imageSrcFromADVDNA(this.converttoadvancedDNA(dna),scale,cropped,isbacksprite);
	/*var CR = this.customrenderer;
	this.customrenderer = true;
	allowtransforms = false;
	this.LoadDNA(dna,null,null,isbacksprite);
	var canvas = document.createElement('canvas');
	if (scale == null)
	{
		//scale = 1;
		var D = dna.split(":");
		scale = parseFloat(D[2])*0.01;
	}
	canvas.width = 500*scale;
	canvas.height = 500*scale;
	var G = canvas.getContext("2d");
	G.save(); 
	
 
	// move to the middle of where we want to draw our image
	if (this.customrenderer)
	{
		G.translate(250*scale, 260*scale);
	}
	else
	{
		G.translate(125*scale, 125*scale);
	}
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	G.scale(0.85*scale,0.85*scale);
	
	var i = 0;
	while (i < this.DWentities.length)
	{
		var E = this.DWentities[i];
		if (E != null && typeof E.svg != 'undefined')
		{
			if (this.customrenderer)
			{
			if (typeof E.xml == 'undefined')
			{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
			}
			//this.drawsvg(G,E.svg,E.x,E.y);
			this.drawxml(G,E.xml,E.x,E.y);
			}
			else
			{
			var url = 'data:image/svg+xml;base64,' + btoa(E.svg);
			img = new Image();
			img.src = url;
			//G.drawImage(img,E.x,E.y);
			if (img.complete)
			{
				G.drawImage(img,E.x - (img.width/2),E.y);
			}
			}
		}
		i = i + 1;
	}
	// and restore the co-ords to how they were when we began
	G.restore();
	this.customrenderer = CR;
	var ret = canvas.toDataURL();
	if (cropped)
	{
		var imageData = G.getImageData(0, 0, canvas.width, canvas.height);
		var data = imageData.data;
		var tx = 0;
		var ty = 0;
		//start texture index at opacity data
		var tindex = 3;
		//var tindex = 0;
		//range of crop
		var mnx = null;
		var mny = null;
		var mxx = null;
		var mxy = null;
		while (ty < canvas.height)
		{
			while (tx < canvas.width)
			{
				//detect if pixel has any opacity
				if (data[tindex]>0)
				{
					//adjust range to fit the pixel
					if (mnx != null)
					{
					mxx = Math.max(mxx,tx);
					mxy = Math.max(mxy,ty);
					
					mnx = Math.min(mnx,tx);
					mny = Math.min(mny,ty);
					}else{
						mxx = tx;
						mxy = ty;
						mnx = tx;
						mny = ty;
					}
				}
				tindex = tindex +4;
				tx = tx + 1;
			}
			ty = ty + 1;
			tx = 0;
		}
		//make a canvas for the new cropped image
		var cropped = document.createElement('canvas');
		//if (false)
		//if (cropped)
			//if (true)
		if (false)
		{
		//set its size to the crop ranges size
		cropped.width = (mxx - mnx)+1;
		cropped.height = (mxy - mny)+1;
		//alert("mnx:"+mnx+" mny:"+mny+" mxx:"+mxx+" mxy:"+mxy);
		var G2 = cropped.getContext("2d");
		var TI = new Image();
		TI.src = ret;
		//draw the image from the starting point of crop range
		G2.drawImage(TI,-mnx,-mny);
		//set return value to the newly cropped version
		}
		else
		{
			//attempt at a cropping that retains centering
			var X = Math.min(mnx,canvas.width-mxx);
			var Y = Math.min(mny,canvas.height-mxy);
			
			cropped.width = canvas.width - (X*2);
			cropped.height = canvas.height - (Y*2);
			
			var G2 = cropped.getContext("2d");
			var TI = new Image();
			TI.src = ret;
			//draw the image from the starting point of crop range
			G2.drawImage(TI,-X,-Y);
		}
		ret = cropped.toDataURL();
	}
	return ret;*/
}
	}
}