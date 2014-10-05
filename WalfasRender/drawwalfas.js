var filetext,filedata,filetype;
filetext = "";
filetype = "";
var entities = [];
var Ooutline;
var Oskincolor;
var skincolor;
var outline;
var randomcols = false;
var repo = "https://cdn.rawgit.com/RSGmaker/WalfasStuff/master/WalfasRender/Ocreateswf/"
var Openfile = function(req) {
	if (typeof req == "string")
	{
		req = Loadfile(req);
	}
	if (req != null)
	{
		var svg = req.responseText.replace(Ooutline,outline).replace(Oskincolor,skincolor);;
		var E = {};
		E.svg = svg;
		E.x = 0;
		E.y = 0;
		entities[entities.length] = E;
		return E;
	}
	return null;
}
function Loadfile(url,type){
	if (type == "" || type == null)
	{
		try {
			var req = new XMLHttpRequest();
			req.open('GET', url, false);
			req.send();
			if (req.status === 200 || req.status === 304)
			{
				return req;
			}
		}
		catch(err) {
			//document.getElementById("demo").innerHTML = err.message;
			return null;
		}
	}
	else
	{
		var req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.responseType = filetype;
		req.send();
		req.onload = function(e) {
			Openfile(req);
		}
	}
}

function LoadDNA(dna,sc,oc){
	if (dna==null){
		dna = "3.39:Meiling:100:1:0:1:1:1:0:0:0:0:0:EB585A";
	}
	skincolor = sc;
	outline = oc;
	Oskincolor = "#fff1dd";
	Ooutline = "#000000";
	if (skincolor == null){
		skincolor = Oskincolor;
	}
	if (outline==null){
		outline = Ooutline;
	}
	//?.??:Name:Scale:Hat:Hair:Body:Arm:Shoes:Eyes:Mouth:Item:Accessory:Back:HairColor
	var D = dna.split(":");
	var Back = LoadPart("Wings",dec(D[12]));
	var Shoes = LoadPart("Shoes",dec(D[7]));
	var basichead = Openfile(repo+"Basichead/0.svg");
	
	var Hair = LoadPart("Hair",D[4]);
	var Hair2 = LoadPart("Hair2",D[4]);
	var outlinehead = Openfile(repo+"Basichead/1.svg");
	var Eyes = LoadPart("Eyes",D[8]);
	var Mouth = LoadPart("Mouth",dec(D[9]));
	var Hat = LoadPart("Hats",dec(D[3]));
	
	
	var Arms = LoadPart("Arms",dec(D[6]));
	var Item = LoadPart("Items",dec(D[10]));
	var Body = LoadPart("body",dec(D[5]));
	var Accessory = LoadPart("Accessories",dec(D[11]));
	var xo = -100;
	var yo = -220;
	
	if (Body != null)
	{
		Body.x = 105+xo;
		Body.y = 305+yo;
	}
	if (basichead != null)
	{
		basichead.x = 37+xo;
		basichead.y = 55+yo;
	}
	if (outlinehead != null)
	{
		outlinehead.x = 100+xo;
		outlinehead.y = 305+yo;
	}
	if (Hat != null)
	{
		Hat.x = 100+xo;
		Hat.y = 310+yo;
	}
	if (Arms != null)
	{
		Arms.x = 105+xo;
		Arms.y = 305+yo;
	}
	if (Shoes != null)
	{
		Shoes.x = 102+xo;
		Shoes.y = 305+yo;
	}
	if (Mouth != null)
	{
		Mouth.x = 105+xo;
		Mouth.y = 305+yo;
	}
	if (Eyes != null)
	{
		Eyes.x = 100+xo;
		Eyes.y = 312+yo;
	}
	if (Hair != null)
	{
		Hair.x = 100+xo;
		Hair.y = 310+yo;
		Hair.svg = Hair.svg.replace(Hair.svg.substr(Hair.svg.indexOf("#"),7),"#"+D[13])
	}
	if (Hair2 != null)
	{
		Hair2.x = 100+xo;
		Hair2.y = 310+yo;
		//Hair2.svg = Hair2.svg.replace(Hair2.svg.substr(Hair2.svg.indexOf("fill=\"#")+6,7),"#"+D[13])
	}
	if (Accessory != null)
	{
		Accessory.x = 47+xo;
		Accessory.y = 63+yo;
		//Accessory.y = 200;
	}
	if (Item != null)
	{
		//3.39:Aya:100:31:30:31:31:31:0:0:47:36:15:332B1A
		//3.39:Reimu (2 Blue):100:112:112:113:111:2:0:0:0:0:0:283960
		Item.x = 68+xo;
		Item.y = 180+yo;
	}
	if (Back != null)
	{
		Back.x = -45+xo;
		Back.y = -30+yo;
	}
}
function dec(strind)
{
	return parseInt(strind)-1;
}
function LoadPart(feature,index)
{
	if (index >-1)
	{
		var U = repo+feature+"/"+index+".svg";
		return Openfile(U);
	}
	return null;
}

function slice2(str,start,end){
	var SI = str.indexOf(start);
	if (SI == -1)
	{
		return null;
	}
	SI = SI + start.length;
	return str.slice(SI,str.indexOf(end,SI+1));
}
function Pslice2(str,start,end){
	var SI = str.indexOf(start);
	if (SI == -1)
	{
		return null;
	}
	SI = SI + start.length;
	return parseInt(str.slice(SI,str.indexOf(end,SI+1)));
}
function PFslice2(str,start,end){
	var SI = str.indexOf(start);
	if (SI == -1)
	{
		return null;
	}
	SI = SI + start.length;
	return parseFloat(str.slice(SI,str.indexOf(end,SI+1)));
}
 
var drawsvg = function(context,svg,x,y){
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
					gradient.addColorStop(grd.stops[j].offset,grd.stops[j].color);
					j = j+1;
				}*/
				//grd.grad = gradient
				G = gradient;
		Gradients[grd.id] = gradient;
		}
		if ((D = S.indexOf("<linearGradient"))> -1){
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
					gradient.addColorStop(grd.stops[j].offset,grd.stops[j].color);
					j = j+1;
				}*/
				//grd.grad = gradient
				G = gradient;
		Gradients[grd.id] = gradient;
		}
		//<stop <stop offset=\"
		if ((D = S.indexOf("<stop"))> -1 && grd != null){
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
		if ((S.indexOf("<path"))> -1){
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
				if (randomcols)
				{
					context.fillStyle=randomcolor2();
				}
				context.fill(path);
				if (OP != -1)
				{
					context.globalAlpha=1;
				}
			}
			if (scolor != null && (scolor.charAt(0) == "#"))
			{
				context.strokeStyle=scolor;
				if (randomcols)
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
		i = i + 1;
	}
}
function imageFromDNA(dna,scale){
	LoadDNA(dna);
	var canvas = document.createElement('canvas');
	if (scale == null)
	{
		scale = 1;
	}
	canvas.width = 280*scale;
	canvas.height = 280*scale;
	var G = canvas.getContext("2d");
	G.save(); 
 
	// move to the middle of where we want to draw our image
	G.translate(190*scale, 190*scale);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	G.scale(0.7*scale,0.7*scale);
	var i = 0;
	while (i < entities.length)
	{
		var E = entities[i];
		if (typeof E.svg != 'undefined')
		{
			drawsvg(G,E.svg,E.x,E.y);
		
		}
		i = i + 1;
	}
	// and restore the co-ords to how they were when we began
	G.restore(); 
	var ret = new Image();
	ret.src = canvas.toDataURL();
	return ret;
}