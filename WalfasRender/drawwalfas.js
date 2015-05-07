{
//drawable entities
var DWentities = [];
//original outline color
var Ooutline;
//original skin color
var Oskincolor;
var skincolor;
var outline;
//whether to use drawsvg or the feature that comes with the browser.(disabling only effects backgrounds)
var customrenderer = false;
//whether or not to randomize all colors, used in RSGmaker's seizure time animations
var randomcols = false;
//list of colorchanges
var colors = [];
//the repository of the create.swf vector files(in svg format).
var repo = "https://cdn.rawgit.com/RSGmaker/WalfasStuff/master/WalfasRender/createswf2/"

var loader = null;
if  (ZipLoader)
{
	var T = document.title;
	document.title = "Loading assets...";
	try
	{
		try
		{
			loader = new ZipLoader("createswf2.zip");;
			repo="";
		}
		catch(err2)
		{
			loader = new ZipLoader(repo+"createswf2.zip");;
		}
		
	
	}
	catch(error)
	{
	}
	document.title = T;
}
var allowtransforms = false;
var Openfile = function(req,type) {
	if (typeof req == "string")
	{
		req = Loadfile(req);
	}
	if (req != null)
	{
		//var svg = req.responseText;
		var svg = req;
		var i = 0;
		while (i<colors.length)
		{
			var nc = colors[i];
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
		DWentities[DWentities.length] = E;
		return E;
	}
	return null;
}
function Loadfile(url,type){
	if (sessionStorage["walfas_"+url]) {
			//if we've loaded this file before just get the info from temp storage.
            return sessionStorage["walfas_"+url];
        } else {
	if (type == "" || type == null)
	{
		if (loader != null)
		{
			var U = repo + "createswf2.zip://createswf2/" + url.substring(repo.length);
			try
			{
				var ret = loader.load(U);
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
				sessionStorage["walfas_"+url] = req.responseText;
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
			Openfile(req,type);
		}
	}
		}
}

function LoadDNA(dna,sc,oc,isbacksprite){
	if (dna==null){
		dna = "3.39:Meiling:100:1:0:1:1:1:0:0:0:0:0:EB585A";
	}
	DWentities = [];
	var D = dna.split(":");
	colors = [];
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
				colors[i] = nc;
				i = i+1;
			}
			
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
	//Version#:Name:Scale:Hat:Hair:Body:Arm:Shoes:Eyes:Mouth:Item:Accessory:Back:HairColor
	
	var Back = null;
	var Back2 = null;
	var hasstubble = (D[11] == 110);
	if (isbacksprite!=true)
	{
	if (D[12].indexOf("S")>0)
	{
		var DS = D[12].split("S");
		Back = LoadPart("Wings",dec(DS[0]),"left");
		Back2 = LoadPart("Wings",dec(DS[1]),"right");
	}
	else
	{
		Back = LoadPart("Wings",dec(D[12]));
	}
	}
	var Shoes = null;
	var Shoes2 = null;
	if (D[7].indexOf("S")>0)
	{
		var DS = D[7].split("S");
		Shoes = LoadPart("Shoes",dec(DS[0]),"left");
		Shoes2 = LoadPart("Shoes",dec(DS[1]),"right");
	}
	else
	{
		Shoes = LoadPart("Shoes",dec(D[7]));
	}
	var outlinehead;
	//outlinehead = Openfile(repo+"Basichead/1.svg","blarg");
	
	//basichead is the head prop that goes under the hair
	var basichead;
	var Accessory;
	if (isbacksprite!=true)
	{
		basichead = Openfile(repo+"Basichead/0.svg","blarg");
	}
	
	
	var Hair;
	var Hair2;
	if (isbacksprite!=true)
	{
		Hair = LoadPart("Hair",D[4]);
		Hair2 = LoadPart("Hair2",D[4]);
	}
	
	var Eyes = null;
	var Eyes2 = null;
	if (D[8].indexOf("S")>0)
	{
		var DS = D[8].split("S");
		Eyes = LoadPart("Eyes",dec(DS[0]),"left");
		Eyes2 = LoadPart("Eyes",dec(DS[1]),"right");
	}
	else
	{
		Eyes = LoadPart("Eyes",D[8]);
	}
	if (hasstubble)
	{
		//the accessory is a stubble so let's place it before the mouth.
		Accessory = LoadPart("Accessories",dec(D[11]));
	}
	var Mouth = LoadPart("Mouth",dec(D[9]));
	
	var Hat;
	if (isbacksprite!=true)
	{
		Hat	= LoadPart("Hats",dec(D[3]));
	}
	var Arms = null;
	var Arms2 = null;
	if (D[6].indexOf("S")>0)
	{
		var DS = D[6].split("S");
		Arms = LoadPart("Arms",dec(DS[0]),"left");
		Arms2 = LoadPart("Arms",dec(DS[1]),"right");
	}
	else
	{
		Arms = LoadPart("Arms",dec(D[6]));
	}
	var Item = null;
	var Item2 = null;
	if (D[10].indexOf("S")>0)
	{
		var DS = D[10].split("S");
		Item = LoadPart("Items",dec(DS[0]),"left");
		Item2 = LoadPart("Items",dec(DS[1]),"right");
	}
	else
	{
		Item = LoadPart("Items",dec(D[10]));
	}
	var Body = LoadPart("body",dec(D[5]));
	if (isbacksprite!=true && !hasstubble) 
	{
		Accessory = LoadPart("Accessories",dec(D[11]));
	}
	var H2;
	if (isbacksprite==true)
	{
		outlinehead = Openfile(repo+"Basichead/1.svg","blarg");
		Hair2 = LoadPart("Hair2",D[4]);
		Hair = LoadPart("Hair",D[4]);
		
		basichead = Openfile(repo+"Basichead/0.svg","blarg");
		//H2 is a duplicate that helps hide parts to try to make the backsprite cleaner
		H2 = Openfile(repo+"Basichead/0.svg","blarg"); 
		Hat	= LoadPart("Hats",dec(D[3]));
		
		
	if (D[12].indexOf("S")>0)
	{
		var DS = D[12].split("S");
		Back = LoadPart("Wings",dec(DS[0]),"left");
		Back2 = LoadPart("Wings",dec(DS[1]),"right");
	}
	else
	{
		Back = LoadPart("Wings",dec(D[12]));
	}
	}
	if (customrenderer)
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
	if (outlinehead != null)
	{
		outlinehead.x = 100+xo;
		outlinehead.y = 305+yo+5+3;
		//outline head isnt that useful it looks like, so lets just move it off screen....
		//outlinehead.y = -10000;
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
		
		//non customrenderer
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
	/*if (outlinehead != null)
	{
		outlinehead.x = 100+xo;
		outlinehead.y = 305+yo+5+3;
		//outline head isnt that useful it looks like, so lets just move it off screen....
		//outlinehead.y = -10000;
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
function dec(strind)
{
	return parseInt(strind)-1;
}
//this calls openfile but does prop splitting features before returning an svg
function LoadPart(feature,index,side)
{
	if (index >-1)
	{
		var U = repo+feature+"/"+index+".svg";
		var ret = Openfile(U,feature);
		if (typeof side != "string")
		{
			return ret;
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
			return ret;
		}
	var text = ret.svg.split("\n");
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
	ret.svg = rtext;
	return ret;
	}
	return null;
}
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

//the xml version of drawsvg which will likely be more compatible
var drawxml = function(context,xml,x,y){
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
		G.addColorStop(stop.offset,stop.color);
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
				context.lineJoin = "miter";
			}
			lj = S.getAttribute("linecap");
			if (lj)
			{
				context.lineCap = lj;
			}
			else
			{
				context.lineCap = "miter";
			}
			lj = S.getAttribute("stroke-width");
			if (lj)
			{
				context.lineWidth = parseInt(lj);
			}
			else
			{
				context.lineWidth = 1;
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

			context.translate(x,y);
			if (trans != null)
			{
				//an old attempt at figuring out transform
				//context.transform(trans[0],0,0,trans[3],0,0);
			}
			
			if (fcolor != null && (fcolor.charAt(0) == "#" || fcolor.indexOf("url(#")==0))
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
				if (randomcols)
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
					gradient.addColorStop(grd.stops[j].offset,grd.stops[j].color);
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
				if (randomcols)
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
		context.globalAlpha=1;
		i = i + 1;
	}
}
//create an image object with a walfas dna render preset as its source
function imageFromObject(objindex,scale,cropped){
	var ret = new Image();
	ret.src = imageSrcFromObject(objindex,scale,cropped);
	return ret;
}
//render walfas dna and get the render as a dataurl
function imageSrcFromObject(objindex,scale,cropped){
	//LoadDNA(dna);
	//return repo+"Objects"+"/"+objindex+".svg";
	var CR = customrenderer;
	customrenderer = true;
	allowtransforms = false;
	var BG = LoadPart("Objects",objindex);
	var canvas = document.createElement('canvas');
	if (scale == null)
	{
		scale = 1;
	}
	canvas.width = 500*scale;
	canvas.height = 500*scale;
	var G = canvas.getContext("2d");
	G.save(); 
 
	// move to the middle of where we want to draw our image
	if (customrenderer)
	{
		G.translate(250*scale, 260*scale);
	}
	else
	{
		G.translate(0*scale, -140*scale);
	}
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	G.scale(0.85*scale,0.85*scale);
	var i = 0;
	//while (i < DWentities.length)
	{
		var E = BG;
		if (E != null && typeof E.svg != 'undefined')
		{
			if (customrenderer)
			{
			if (typeof E.xml == 'undefined')
			{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
			}
			//drawsvg(G,E.svg,E.x,E.y);
			drawxml(G,E.xml,E.x,E.y);
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
	customrenderer = CR;
	return ret;
}
//create an image object with a walfas dna render preset as its source
function imageFromBackground(bgindex,scale){
	var ret = new Image();
	ret.src = imageSrcFromBackground(bgindex,scale);
	return ret;
}
//just a dumb idea, it doesn't actually work as async data doesn't update while other data is running it looks like
function loadimg(img,src)
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
function imageSrcFromBackground(bgindex,scale){
	//LoadDNA(dna);
	allowtransforms = true;
	var BG = LoadPart("Background",bgindex);
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
	//while (i < DWentities.length)
	{
		var E = BG;
		if (E != null && typeof E.svg != 'undefined')
		{
			if (customrenderer)
			{
				if (typeof E.xml == 'undefined')
				{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
				}
				drawxml(G,E.xml,E.x,E.y);
			}
			else
			{
			/**/
			//drawsvg(G,E.svg,E.x,E.y);
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
//create an image object with a walfas dna render preset as its source
function imageFromDNA(dna,scale,cropped,isbacksprite){
	var ret = new Image();
	ret.src = imageSrcFromDNA(dna,scale,cropped,isbacksprite);
	return ret;
}
//render walfas dna and get the render as a dataurl
function imageSrcFromDNA(dna,scale,cropped,isbacksprite){
	var CR = customrenderer;
	customrenderer = true;
	allowtransforms = false;
	LoadDNA(dna,null,null,isbacksprite);
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
	if (customrenderer)
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
	while (i < DWentities.length)
	{
		var E = DWentities[i];
		if (E != null && typeof E.svg != 'undefined')
		{
			if (customrenderer/* && E.type != "Items"*/)
			{
			if (typeof E.xml == 'undefined')
			{
				parser=new DOMParser();
				E.xml=parser.parseFromString(E.svg,"text/xml");
			}
			//drawsvg(G,E.svg,E.x,E.y);
			drawxml(G,E.xml,E.x,E.y);
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
	customrenderer = CR;
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
}