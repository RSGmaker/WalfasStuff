{
var scene = {name:"Untitled",next:null,prev:null,parts:[{stage:"",background:null,backgroundsize:"0px"}]};
var currentpart = 0;
//mouse behavior mode
var mode = 0;
//targeted object
var tobj = -1;
//last targeted object
var lobj = -1;
//original value, used in relation to how much the mouse has moved to determine new value.
var OV = 0;
//original x(x position of where the mouse clicked)
var ox = -1;
//original y(y position of where the mouse clicked)
var oy = -1;
//number of objects loaded
var count = 0;
//number of objects currently being loaded
var toload = 0;
var imgs = new Array();
var scenelist;
var bdy = document.getElementById('body');
document.body.style.backgroundColor = "white";
var stg = document.getElementById('stage');
var gui = document.getElementById('interface');
function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {
        // Old school method.
        obj['on'+evt] = handler;
    }
}
function sceneClear()
{
	ClearStage();
	bdy.style.backgroundImage = null;
}
function loadscene(scenename)
{
	scene=scenelist[scenename];
	currentpart = -1;
	loadpart(0);
}
/*function getsceneindex(scenename)
{
	var i = 0;
	while (i < scenelist.length)
	{
		if (scenelist[i].name == scenename)
		{
			return i;
		}
		i++;
	}
	return -1;
}*/
function newpart()
{
	//get current part data
	savepart();
	var part = scene.parts[currentpart];
	//this save part is to try to make a separate duplicate part.
	savepart();
	if (currentpart<scene.parts.length-1)
	{
		//insert
		scene.parts.splice(currentpart+1, 0, part);
	}
	else
	{
		//append
		scene.parts[currentpart] = part;
	}
	currentpart++;
	//a tad redundant but it keeps things simple
	saveScene();
	refreshSceneData();
	//alert("Created:"+scene.name + "-Part#"+(currentpart+1));
}
function saveScene()
{
	//alert("blargle");
	savepart();
	scenelist[scene.name] = scene;
	/*var ind = getsceneindex();
	if (ind > -1)
	{
		scenelist[ind] = scene;
	}
	else
	{
		if (scenelist.length == 0)
		{
			scenelist = [scene];
		}
		else
		{
			scenelist[scenelist.length] = scene;
		}
	}*/
	localStorage.scenes = JSON.stringify(scenelist);
	refreshSceneList();
}

function savepart()
{
	scene.parts[currentpart] = {stage:stg.innerHTML,background:bdy.style.backgroundImage,backgroundsize:bdy.style.backgroundSize};
}

function loadpart(index)
{
	if (index == currentpart)
	{
		return;
	}
	var part = scene.parts[index];
	stg.innerHTML = part.stage;
	
	bdy.style.backgroundImage = part.background;
	bdy.style.backgroundPosition = "top";
	bdy.style.backgroundRepeat = "no-repeat";
	bdy.style.backgroundSize = part.backgroundsize;
	currentpart = index;
	refreshSceneData();
}
//set scene menu data and list of parts.
function refreshSceneList()
{
	//obsolete now we use the scene menu.
	/*
	var scenes = document.getElementById("scenelist");
	//clear scenes from list
	while (scenes.firstChild) {
		scenes.removeChild(scenes.firstChild);
	}
	var i = 0;
	var item;
	var keys = Object.keys(scenelist);
	for (obj in scenelist) {
		//var name = obj.name;
		var S = scenelist[obj];
		if (S.name != undefined)
		{
		item = document.createElement("li");
		item.innerHTML = '<p onclick="loadscene(\''+S.name+'\');">'+S.name+'</p>';
		scenes.appendChild(item);
		}
	}*/
}
//set scene menu data and list of parts.
function refreshSceneData()
{
	var title = document.getElementById("scenemenutitle");
	title.innerHTML = scene.name + " : Part " + (currentpart+1);
	var parts = document.getElementById("scenemenuparts");
	//clear parts from list
	while (parts.firstChild) {
		parts.removeChild(parts.firstChild);
	}
	var i = 1;
	//this is out of the loop to force a part 1 to always be visible.
	var part = document.createElement("li");
	part.innerHTML = '<p onclick="loadpart('+0+');">Part 1</p>';
	parts.appendChild(part);
	while (i < scene.parts.length)
	{
		part = document.createElement("li");
		part.innerHTML = '<p onclick="loadpart('+i+');">Part '+(i+1)+'</p>';
		parts.appendChild(part);
		i++;
	}
}
function SceneMenuUpdate()
{
	var L = document.getElementById("Scene Menu List");
	var name=L.options[L.selectedIndex].value;
	var S = scenelist[name];
	var P = document.getElementById("Scene Menu Parts");
	P.innerHTML = "Parts: " + S.parts.length;
	var D = document.getElementById("Scene Menu Preview");
	var part = S.parts[0];
	//D.innerHTML = part.stage;
	
	D.style.backgroundImage = part.background;
	D.style.backgroundPosition = "top";
	D.style.backgroundRepeat = "no-repeat";
	//D.style.backgroundSize = part.backgroundsize;
	D.style.backgroundSize = part.backgroundsize;
}
function SceneMenuDelete()
{
	var L = document.getElementById("Scene Menu List");
	var name=L.options[L.selectedIndex].value;
	if (confirm("Delete the scene:"+name+"?"))
	{
		delete scenelist[name];
		localStorage.scenes = JSON.stringify(scenelist);
		//update scene menu
		DisplaySceneMenu();
	}
}
var edittarget=null;
function ColorChange()
{
	var C = document.getElementById("Character Options Color").value;
	C = C.replace("#","");
	//dna[13] = C;
	dna = editdna(dna,13,C);
	UpdateCharacterOptions();
}
function UpdateCharacterOptions()
{
	var CO = document.getElementById("Character Options");
	CO.style.backgroundImage = "url("+imageSrcFromDNA(dna,null,false,false)+")";
}
function SceneMenuLoad()
{
	var L = document.getElementById("Scene Menu List");
	loadscene(L.options[L.selectedIndex].value);
}
function HideCharacterOptions()
{
	document.getElementById('dimmer').style.visibility = "hidden";
	document.getElementById("Character Options").style.visibility = "hidden";
}
function SetCharacterOptions()
{
	dna = editdna(dna,2,document.getElementById("charoptionsscale").value);
	dna = editdna(dna,1,document.getElementById("charoptionsname").value);
	edittarget.rot = parseFloat(document.getElementById("charoptionsRotation").value);
	edittarget.alt = dna;
	edittarget.style.left = document.getElementById("charoptionsX").value+"px";
	edittarget.style.top = document.getElementById("charoptionsY").value+"px";
	
	edittarget.src = imageSrcFromDNA(edittarget.alt,null,false,false);
	
	edittarget.style.WebkitTransform = "rotate("+edittarget.rot+"deg) scaleX("+(edittarget.scale*edittarget.direction)+") scaleY("+edittarget.scale+")";
	edittarget.style.transform = edittarget.style.WebkitTransform;
	edittarget.style.MozTransform = edittarget.style.WebkitTransform;
}
function DisplayCharacterOptions()
{
	var CO = document.getElementById("Character Options");
	document.getElementById('dimmer').style.visibility = "visible";
	CO.style.visibility = "visible";
	document.getElementById("charoptionsscale").value = getdnavalue(dna,2);
	document.getElementById("charoptionsRotation").value = edittarget.rot;
	document.getElementById("charoptionsX").value = edittarget.style.left.replace("px","");
	document.getElementById("charoptionsY").value = edittarget.style.top.replace("px","");
	document.getElementById("charoptionsname").value = getdnavalue(dna,1);
	document.getElementById("Character Options Color").value = "#"+getdnavalue(dna,13);
	
	
	CO.style.backgroundImage = "url("+edittarget.src+")";
		CO.style.backgroundPosition = "center";
		CO.style.backgroundRepeat = "no-repeat";
		CO.style.backgroundSize = 340+"px";
	//document.getElementById("Character Options preview").src = lobj.src;
}
function HideSceneMenu()
{
	document.getElementById('dimmer').style.visibility = "hidden";
	document.getElementById('Scene Menu').style.visibility = "hidden";
}
function DisplaySceneMenu()
{
	document.getElementById('dimmer').style.visibility = "visible";
	document.getElementById('Scene Menu').style.visibility = "visible";
	var L = document.getElementById("Scene Menu List");
	var i;
    for(i=L.options.length-1;i>=0;i--)
    {
        L.remove(i);
    }
	i = 0;
	for (obj in scenelist) {
		//var name = obj.name;
		var S = scenelist[obj];
		if (S.name != undefined)
		{
			var option = document.createElement("option");
			option.text = S.name;
			option.value = S.name;
			L.add(option);
			i++;
		}
	}
	if (i>0)
	{
		SceneMenuUpdate();
	}
}
function HideSceneInfo()
{
	document.getElementById('dimmer').style.visibility = "hidden";
	document.getElementById('Scene Info').style.visibility = "hidden";
	scene.name = document.getElementById("scenename").value;
	refreshSceneData();
}
function DisplaySceneInfo()
{
	document.getElementById('dimmer').style.visibility = "visible";
	document.getElementById('Scene Info').style.visibility = "visible";
	document.getElementById("scenename").value = scene.name;
}
function ImportImage()
{
	var temp = prompt("enter a url of image to import","");
		if (temp!="")
		{
			var img = document.createElement("img"); 
		img.src = temp;
		
		img.alt = ""+temp;
		img.className = "ImportedAsset";
    
		imgs[count]=new Image;
		imgs[count].src = temp;
	
		count = count+1;
		stg.appendChild(img);
		initobject(img);
		stg.removeChild(document.getElementById('dme'));
		}
}
function ImportDna()
{
	var d = prompt("enter a walfas or recolored walfas dna","3.39:Meiling:100:1:0:1:1:1:0:0:0:0:0:EB585A");
	AddCharacter(d);
}
function ClearStage()
{
	while (stg.firstChild) {
		stg.removeChild(stg.firstChild);
	}
}
function AddCharacter(dna,dble)
{
	if (dble==true)
	{
	//double the scale so scaling looks less bad.
	dna = editdna(dna,2,parseFloat(getdnavalue(dna,2)) * 2);
	}
	var I = imageSrcFromDNA(dna,null,false,false);
	if (false)
	{
	window.setTimeout(function(){I = imageSrcFromDNA(dna,null,false,false);
	var img = document.createElement("img"); 
		img.src = I;
		
		img.alt = dna;
		img.className = "Character";
		
	
		stg.appendChild(img);
		initobject(img);
		if (dble==true)
		{
		img.scale = 0.5;
		
		img.style.WebkitTransform = "rotate("+img.rot+"deg) scaleX("+(img.scale*img.direction)+") scaleY("+img.scale+")";
		img.style.transform = img.style.WebkitTransform;
		img.style.MozTransform = img.style.WebkitTransform;
		}
	count = count+1;}, 100);
	}
	else
	{
		var img = document.createElement("img"); 
		
		img.src = I;
		
		img.alt = dna;
		img.className = "Character";
		
		
		imgs[count]=new Image;
		imgs[count].src = I;
	
		stg.appendChild(img);
		count = count+1;
		initobject(img);
		if (dble==true)
		{
		img.scale = 0.5;
		
		img.style.WebkitTransform = "rotate("+img.rot+"deg) scaleX("+(img.scale*img.direction)+") scaleY("+img.scale+")";
		img.style.transform = img.style.WebkitTransform;
		img.style.MozTransform = img.style.WebkitTransform;
		}
	}
	document.activeElement.blur();
}

function LoadObject()
{
	var elt = document.getElementById("objectchoice");
	var d = parseInt(elt.options[elt.selectedIndex].value)-1;
	var I = imageSrcFromObject(d,1.0,false);
	if (false)
	{
	window.setTimeout(function(){I = imageSrcFromObject(d,1.0,false);
	var img = document.createElement("img"); 
		img.src = I;
    
		img.alt = d+":"+elt.options[elt.selectedIndex].text;
		img.className = "ObjectProp";
	
		imgs[count]=new Image;
		imgs[count].src = I;
	
		stg.appendChild(img);
	count = count+1;}, 100);
	initobject(img);
	}
	else
	{
	var img = document.createElement("img"); 
		img.src = I;
    
		img.alt = d+":"+elt.options[elt.selectedIndex].text;
		img.className = "ObjectProp";
	
		imgs[count]=new Image;
		imgs[count].src = I;
	
		stg.appendChild(img);
	count = count+1;
	initobject(img)
	}
	document.activeElement.blur();
	//alert("loaded:" + d);
}
function LoadBackground()
{
	var elt = document.getElementById("backgroundchoice");
	var d = parseInt(elt.options[elt.selectedIndex].value)-1;
	var I;
	var H = Math.floor(window.innerHeight*1.25);
	if (d==-1)
	{
		I = null;
		d=-1000;
	}
	else if (d==-2)
	{
		d = rnd(217);
	}
	if (d > -1)
	{
	//the correct math is /400 but increasing the resolution will help reduce the "gray lines" issue
		//I = imageSrcFromBackground(d,H / 400);
		I = imageSrcFromBackground(d,H / 200);
	}
	if (true)
	{
	//timeout is required for new render style as it has an asnyc function, the new style only applies to backgrounds currently
	window.setTimeout(function(){
	if (d > -1)
	{
	I = imageSrcFromBackground(d,H / 200);
	}
	bdy.style.backgroundImage = "url("+I+")";
		bdy.style.backgroundPosition = "top";
		bdy.style.backgroundRepeat = "no-repeat";
		bdy.style.backgroundSize = H+"px";}, 100);
		}
		else
		{
		bdy.style.backgroundImage = "url("+I+")";
		bdy.style.backgroundPosition = "top";
		bdy.style.backgroundRepeat = "no-repeat";
		bdy.style.backgroundSize = H+"px";
		}
		//make sure to call document.activeElement.blur(); after using a text sensitive control to prevent accidental interaction after its use.
		document.activeElement.blur();
}
function rnd(I)
{
	return Math.floor(Math.random()*I);
}
function newcharacter()
{
	var d = "Null:Char"+count+":100:"+rnd(351)+":"+rnd(281)+":"+rnd(363)+":"+rnd(277)+":"+rnd(127)+":"+rnd(133)+":"+rnd(85)+":"+rnd(157)+":"+rnd(156)+":"+rnd(136)+":"+rnd(16777215).toString(16);
	AddCharacter(d);
	/*var I = imageSrcFromDNA(d,null,false,false);
	var img = document.createElement("img"); 
		img.src = I;
    
		imgs[count]=new Image;
		imgs[count].src = I;
	
		stg.appendChild(img);
	count = count+1;*/
}
function LoadPreset()
{
	var elt = document.getElementById("presetchoice");
	var d = "NULL:"+elt.options[elt.selectedIndex].value;
	AddCharacter(d,true);
	/*var I = imageSrcFromDNA(d,null,false,false);
	var img = document.createElement("img"); 
		img.src = I;
    
		imgs[count]=new Image;
		imgs[count].src = I;
	
		stg.appendChild(img);
	count = count+1;*/
	//alert("loaded:" + d);
}
//determines if the element is a valid object owned by the stage.
//make sure to check this before manipulating an object otherwise the user will be able to mess up menus and other things.
function isstageobject(obj)
{
	if (obj != null && obj.parentNode == stg || obj.parentNode.parentNode == stg)
	{
		return true;
	}
	return false;
}
function mo(e)
{
	return true;
	if (lobj.tagName=="DIV")
	{
		lobj.setAttribute("contentEditable","false");
	}
}
var dna="";
function doubleclick(e)
{

	if (isstageobject(lobj))
	{
		if (lobj.tagName=="DIV")
		{
		if (lobj.getAttribute("contentEditable")=="true")
		{
			lobj.setAttribute("contentEditable","false");
			lobj.style.border = "";
		}
		else
		{
			lobj.setAttribute("contentEditable","true");
			//let the user know the text box can now be editted
			lobj.style.border = "solid #000000";
		}
		}
		if (lobj.className == "Character")
		{
			edittarget = lobj;
			dna = lobj.alt;
			DisplayCharacterOptions();
		}
	}
}
document.onkeydown = function(evt) {
	var ret = false;
	try
	{
    evt = evt || window.event;
    var keyCode = evt.keyCode;
	
	if ((keyCode >= 33 && keyCode <= 40) || keyCode == 32) {
        ret = false;
    }
	if (document.activeElement.contentEditable && document.activeElement == lobj)
	{
		//alert(""+document.activeElement);
		//ret = true;
		return true;
	}
	if (!(keyCode >= 16 && keyCode <= 18))
	{
	//alert(""+keyCode);
	}
	//make sure the main controls still fire so the zindex commands will still work.
	keydown(evt);
	}
	catch(error)
	{
	}
	return ret;
};
/*document.addEventListener("keydown", dockeydown);

function dockeydown(e) {
var keyCode = e.keyCode;
  var ar=new Array(33,34,35,36,37,38,39,40);
	var ret = false;
	if (ar.indexOf(e.keyCode)>-1)
	{
	ret = true;
	}
	//alert("blarg"+ret+keyCode);
	return ret;
	
}*/

function keydown(e)
{
	var ar=new Array(32,33,34,35,36,37,38,39,40);
	var ret = true;
	if (ar.indexOf(e.keyCode))
	{
	ret = false;
	}
	//space
	var T = document.getElementById("stgmenu");
	if (e.keyCode == 32)
	{
		//alert("pressed space!");
		//document.getElementById("stgmenu_nav").style.visibility = !document.getElementById("stgmenu_nav").style.visibility;
		//document.getElementById("stgmenu_nav").style.visibility = "hidden";
		
		if (T.style.visibility != "hidden")
		{
			T.style.visibility = "hidden";
		}
		else
		{
			T.style.visibility = "visible";
		}
		
		document.getElementById("scenemenu").style.visibility = T.style.visibility;
	}
	//theater mode
	if (T.style.visibility == "hidden")
	{
		//left key
		if (e.keyCode==37)
		{
			if (currentpart>0)
			{
				loadpart(currentpart-1);
			}
		}
		//right key
		if (e.keyCode==39)
		{
			if (currentpart<scene.parts.length-1)
			{
				loadpart(currentpart+1);
			}
		}
	}
	if (!isstageobject(lobj))
	{
		return ret;
	}
	if (lobj.tagName=="DIV")
	{
		if (lobj.getAttribute("contentEditable")=="true")
		{
			//return true seems to messup firefox from editing these
			//return true;
			return;
		}
	}
	//delete key
	if (e.keyCode == 46)
	{
		if (lobj.parentNode.parentNode == stg)
		{
			stg.removeChild(lobj.parentNode);
			count--;
		}
		else
		{
			stg.removeChild(lobj);
			count--;
		}
	}
	if (e.shiftKey==1)
	{
	//up key
	if (e.keyCode == 38)
	{
		if (lobj.style.zIndex<-1000+count)
		{
			lobj.style.zIndex++;
		}
		else
		{
			if (lobj.style.zIndex!=-1000+count)
			{
				lobj.style.zIndex=-1000+count;
			}
		}
		gui.style.zIndex++;
	}
	//down key
	if (e.keyCode == 40)
	{
		if (lobj.style.zIndex>-1000)
		{
			lobj.style.zIndex--;
		}
		else
		{
			if (lobj.style.zIndex!=-1000)
			{
				lobj.style.zIndex=-1000;
			}
		}
		gui.style.zIndex++;
	}
	}
	//A key
	if (e.keyCode == 65)
	{
		ImportImage();
	}
	//B key
	if (e.keyCode == 66)
	{
		if (lobj.className=="Character" && e.shiftKey)
		{
			if (lobj.backsprite!=true)
			{
				lobj.src = imageSrcFromDNA(lobj.alt,null,false,true);
				lobj.backsprite=true
			}
			else
			{
				lobj.src = imageSrcFromDNA(lobj.alt,null,false,false);
				lobj.backsprite=false;
			}
		}
		else
		{
		var temp = prompt("enter a background color",""+document.body.style.backgroundColor);
		
		document.body.style.backgroundColor = temp;
		}
	}
	//C key
	if (e.keyCode == 67 && lobj.tagName=="DIV")
	{
		var temp = prompt("enter a color",""+lobj.style.color);
		
		lobj.style.color = temp;
	}
	//V key
	if (e.keyCode == 86 && lobj.tagName=="DIV")
	{
		var temp = prompt("enter a font name",""+lobj.style.fontFamily);
		
		lobj.style.fontFamily = temp;
	}
	//F key
	if (e.keyCode == 70)
	{
		//if (typeof lobj.dir === "undefined")
		if (lobj.direction == 1)
		{
			lobj.direction = -1;
		}
		else
		{
			lobj.direction = 1;
		}
		//lobj.dir = lobj.dir*-1;
		lobj.style.WebkitTransform = "rotate("+lobj.rot+"deg) scaleX("+(lobj.scale*lobj.direction)+") scaleY("+lobj.scale+")";
		lobj.style.transform = lobj.style.WebkitTransform;
		lobj.style.MozTransform = lobj.style.WebkitTransform;
	}
	//T key
	if (e.keyCode == 84)
	{
		var NT = document.createElement("DIV");
		NT.innerHTML="Double-click to edit Me!";
		NT.setAttribute("contentEditable","false");
		stg.appendChild(NT);
		initobject(NT);
	}
	//+ key
	if (e.keyCode == 107)
	{
		//this behaves oddly if you do lobj.style.opacity+=0.04, so instead i do a sort of inverse addition, it's weird...
	
		//lobj.style.opacity = 1;
		var W = 1 - (lobj.style.opacity);
		W -= 0.04;
		lobj.style.opacity = 1;
		lobj.style.opacity -= W;
		//lobj.style.opacity = lobj.style.opacity + 0.05;
		//lobj.style.opacity = lobj.style.opacity + 0.05;
		if (lobj.style.opacity > 1)
		{
			lobj.style.opacity = 1;
		}
	}
	//- key
	if (e.keyCode == 109)
	{
		lobj.style.opacity-=0.04;
		if (lobj.style.opacity<0.04)
		{
			lobj.style.opacity = 0.04;
		}
	}
	return ret;
}
function initobject(obj)
{
	obj.scale = 1;
	obj.rot = 0;
	obj.style.position="absolute";
	obj.style.left = Math.floor(window.innerWidth/4);
	obj.style.top = Math.floor(window.innerHeight/8);
	obj.style.opacity=1;
	obj.direction = 1;
	obj.id = "stgObj:"+Math.random();
	obj.zIndex = -1000+count;
}
function mousedown(e)
{
if (!isstageobject(e.target))
	{
		lobj=null;
		return;
	}
x=e.clientX;
y=e.clientY;
mode = 1;
//alert(""+e.target.tagName)
ox = 0;
oy = 0;
if (typeof e.target === "undefined" || e.target == stg || e.target == bdy)
{
}
else
{
tobj = e.target;
lobj = tobj;
if (typeof tobj.scale === "undefined")
{
	//initobject(tobj);
	//these variables are made up so i have to remake them up when they're missing(basicly they just don't save)
	tobj.scale = PFslice2(tobj.style.transform,"scaleX(",")");
	tobj.direction = 1;
	if (tobj.scale<0)
	{
		tobj.direction = -1;
	}
	tobj.rot = PFslice2(tobj.style.transform,"rotate(",")");
}
ox = parseInt(tobj.style.left,10) - x;
oy = parseInt(tobj.style.top,10) - y;
//alert("left:"+ tobj.style.left + " offset:" + ox);
//ox = 30;
//oy = 5;
//blb = frg;
}

if (e.ctrlKey==1)
{
	//rotate mode
	mode = 2;
	OV = tobj.rot;
	ox = x;
	oy = y;
}
if (e.shiftKey==1)
{
	//scale
	mode = 3;
	OV = tobj.scale;
	ox = x;
	oy = y;
}
if (e.ctrlKey==1 && e.shiftKey==1)
{
	mode = 4;
	//OV = tobj.scale;
	ox = x;
	oy = y;
}

//e.target.style.left = x-(e.target.width / 2 );
//e.target.style.top = y-(e.target.height / 2);
return e.target.tagName!='IMG';
//return false;
}
function mousemove(e)
{
if (!isstageobject(e.target))
	{
		return;
	}
x=e.clientX;
y=e.clientY;
//tobj = document.getElementById('dme');
if (mode==2)
{
	//tobj.style.transform = "rotate(" + (x-ox) + "deg)";
	tobj.rot = OV+((x-ox) / 2);
}
if (mode==3)
{
	tobj.scale = OV+(((x-ox) / 100));
	if (tobj.scale<0.01)
	{
		tobj.scale=0.01;
	}
}
if (mode==4)
{
	//tobj.scale = OV+(((x-ox) / 100));
	var nx = 1+((x-ox) / 100);
	var ny = 1+((y-oy) / 100);
	tobj.style.WebkitTransform = "rotate("+tobj.rot+"deg) scaleX("+(nx*tobj.direction)+") scaleY("+ny+")";
	tobj.style.transform = tobj.style.WebkitTransform;
	tobj.style.MozTransform = tobj.style.WebkitTransform;
	//tobj.width = tobj.naturalWidth * nx;
	//tobj.height = tobj.naturalHeight * ny;
	//tobj.style.scaleX = nx;
	//tobj.style.scaleY = ny;
}
if (mode==1)
{
//clientWidth
tobj.style.position="absolute";
//tobj.style.left = x-(tobj.clientWidth / 2 );
//tobj.style.top = y-(tobj.clientHeight / 2);
tobj.style.left = x + ox;
tobj.style.top = y + oy;
}
else
{
	if (mode != 0 && mode!=4)
	{
		tobj.style.WebkitTransform = "rotate("+tobj.rot+"deg) scaleX("+(tobj.scale*tobj.direction)+") scaleY("+tobj.scale+")";
		tobj.style.transform = tobj.style.WebkitTransform;
		tobj.style.MozTransform = tobj.style.WebkitTransform;
	}
}

}
function getdnavalue(dna,index)
{
	return dna.split(":")[index];
}
//add value to character options dna(used in arrow buttons)
function moddna(index,add)
{
	dna = editdna(dna,index,""+(parseInt(getdnavalue(dna,index))+add));
	UpdateCharacterOptions();
}
function editdna(dna,index,value)
{
	var D = dna.split(":");
	D[index] = value;
	return compiledna(D);
}
function compiledna(dna)
{
	var i = 0;
	var ret="";
	while (i<dna.length)
	{
		if (ret=="")
		{
			ret = dna[i];
		}
		else
		{
			ret = ret + ":" + dna[i];
		}
		i++;
	}
	return ret;
}
function mouseup(e)
{
	if (mode==3)
	{
		if (tobj.className=="Character")
		{
			//if scaling a character, reset the scaling property but get an actual scaled graphic instead.
			/*var D = tobj.alt.split(":");
			//scale = parseFloat(D[2])*0.01;
			scale = parseFloat(D[2]);
			var W = tobj.naturalWidth;
			scale *= tobj.scale;
			
			var dist = (W - (W * (scale*0.01)))/2;
			D[2] = Math.floor(scale);
			tobj.scale = 1;
			D = compiledna(D);
			
			if (Math.abs(dist)>500)
			{
				dist = 0;
			}
			
			tobj.style.WebkitTransform = "rotate("+tobj.rot+"deg) scaleX("+(tobj.scale*tobj.direction)+") scaleY("+tobj.scale+")";
			tobj.style.transform = tobj.style.WebkitTransform;
			tobj.style.MozTransform = tobj.style.WebkitTransform;
			
			if (dist != 0)
			{
			tobj.style.top = parseFloat(tobj.style.top) + dist;
			tobj.style.left = parseFloat(tobj.style.left) + dist;
			}
			tobj.src = imageSrcFromDNA(D,null,false,false);
			//alert(""+dist);
			tobj.alt = D;*/
		}
	}
	mode=0;
	tobj=-1;
}
function myFunction(e)
{
x=e.clientX;
y=e.clientY;
coor="Coordinates: (" + x + "," + y + ")";
document.getElementById("demo").innerHTML=coor
S = document.getElementById("svg");
S.style.left = x-(S.width / 2 );
S.style.top = y-(S.height / 2);
}

if(window.FileReader) { 
 var body;
 addEventHandler(window, 'load', function() {
    body   = document.getElementById('body');
  	
    function cancel(e) {
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }
	function bodyitem (e) {
  e = e || window.event; // get window.event if e argument missing (in IE)   
  if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

  var dt    = e.dataTransfer;
  var files = dt.files;
  toload = toload + files.length;
  var IU = e.dataTransfer.getData('Text');
  //alert(IU);
  if (IU != null && ((IU.indexOf("data")==0 && IU.indexOf(";base64,")>-1)) || IU.indexOf("http://")==0)
  {
	var I = new Image();
	I.src = IU;
	
	stg.appendChild(I);
  }
  for (var i=0; i<files.length; i++) {
    var file = files[i];
    var reader = new FileReader();
      
    //attach event handlers here...
   
    reader.readAsDataURL(file);
addEventHandler(reader, 'loadend', function(e, file) {
    var bin           = this.result; 
    var newFile       = document.createElement('div');
    //list.appendChild(newFile);  
    //var fileNumber = list.getElementsByTagName('div').length;
	var fileNumber = count;

    var img = document.createElement("img"); 
    img.file = file;   
    img.src = bin;
    
    imgs[count]=new Image;
	imgs[count].src = bin;

    count = count+1;
	toload = toload - 1;
	stg.appendChild(img);
	initobject(img);
	body.removeChild(document.getElementById('dme'));
}.bindToEventHandler(file));

  }
  
  return false;
};
  
    // Tells the browser that we *can* body on this target
    addEventHandler(body, 'dragover', cancel);
    addEventHandler(body, 'dragenter', cancel);

addEventHandler(body, 'drop', bodyitem);

addEventHandler(stage, 'dragover', cancel);
    addEventHandler(stage, 'dragenter', cancel);

addEventHandler(stage, 'drop', bodyitem);
Function.prototype.bindToEventHandler = function bindToEventHandler() {
  var handler = this;
  var boundParameters = Array.prototype.slice.call(arguments);
  //create closure
  return function(e) {
      e = e || window.event; // get window.event if e argument missing (in IE)   
      boundParameters.unshift(e);
      handler.apply(this, boundParameters);
  }
};
  });
} else { 
  document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}
//scenelist = [];
//scenelist = {};
if (localStorage.scenes == undefined)
{
	//localStorage.scenes = new Array();
	scenelist = {};
}
else
{
	scenelist = JSON.parse(localStorage.scenes);
}
//scenelist = {};
//scenelist = [];
refreshSceneList();
}