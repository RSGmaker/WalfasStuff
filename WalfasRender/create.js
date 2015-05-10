{
var scene = {name:"Untitled",next:null,prev:null,parts:[{stage:"",background:-1,backgroundsize:0,backgroundPosition:"50% 0px"}]};
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
var dnalist;
var bdy = document.getElementById('body');
document.body.style.backgroundColor = "white";
var stg = document.getElementById('stage');
var gui = document.getElementById('interface');
var current_background = -1;
var current_backgroundsize = 0;
var current_backgroundPosition = "50% 0px";
var offlinemode = false;
var currentDNA = -1;
var laststate="";
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
function formatsize(sz)
{
	if (sz<1024)
	{
		sz = ""+sz;
		sz = sz.substring(0,sz.indexOf('.')+3)+"B";
	}
	else if (sz < 1048576)
	{
		sz = sz / 1024;
		sz = ""+sz;
		sz = sz.substring(0,sz.indexOf('.')+3)+"KB";
	}
	else
	{
		sz = sz / 1048576.0;
		sz = ""+sz;
		sz = sz.substring(0,sz.indexOf('.')+3)+"MB";
	}
	return sz;
}
function getsize(O)
{
	var sz = 0;
	if (isNaN(O))
	{
	if (O == undefined || O == null)
	{
		for(var x in localStorage)
		{sz+= x.length;};
	}
	else
	{
		sz = localStorage[O].length;
	}
	}
	else
	{
		sz = O;
	}
	/*if (sz<1024)
	{
		sz = ""+sz;
		sz = sz.substring(0,sz.indexOf('.')+3)+"B";
	}
	else if (sz < 1048576)
	{
		sz = sz / 1024;
		sz = ""+sz;
		sz = sz.substring(0,sz.indexOf('.')+3)+"KB";
	}
	else
	{
		sz = sz / 1048576.0;
		sz = ""+sz;
		sz = sz.substring(0,sz.indexOf('.')+3)+"MB";
	}*/
	return sz;
}
function encodestage()
{
	//why am i doing this and not just a simple string replace method?
	//because firefox can't do simple text operations on large strings :( it's pretty stupid.
	var C = stg.childNodes;
	var i = 0;
	var ret = "";
	//this rebuilds the entire innerHTML of the stage but leaves out the src attributes so images can't bloat up the savefiles.
	while (i < C.length)
	{
		if (!(""+C[i].tagName == "undefined"))
		{
		if (ret == "")
		{
			ret = "<"+C[i].tagName;
		}
		else
		{
			ret = ret + "\r<"+C[i].tagName +" ";
		}
		var j = 0;
		if (C[i].attributes != undefined)
		{
		while (j < C[i].attributes.length)
		{
			var A = C[i].attributes[j];
			if (A.name!="src")
			{
				ret = ret + " "+A.name+'="' + A.value + '"';
			}
			j++;
		}
		}
		ret = ret+">\r"+C[i].innerHTML + "\r</"+C[i].tagName+">";
		}
		i++;
	}
	return ret;
	/*var ST = ' data:image/png;base64,';
	var T = S.split('"')
	var ret = "";
	var i = 0;
	while (i< T.length)
	{
		var s = T[i];
		if (s.indexOf(ST)>-1)
		{
			ret = ret + '"';
		}
		else
		{
			if (ret == "")
			{
				ret = T[i] + '"';
			}
			else
			{
				ret = ret + '"' + T[i];
			}
		}
		i++;
	}*/
	return ret;
}
function loadstage(S)
{
	/*parser=new DOMParser();
	xml=parser.parseFromString(S,"text/xml");
	//var C = stg.childNodes;
	var i = 0;
	
	i = 0;
	//detect removed elements.
	while (i < stg.childNodes)
	{
		var C = xml.getElementById(stg.childNodes[i].id)
		if (C == undefined || C == null)
		{
			stg.removeChild(stg.childNodes[i]);
			i--;
		}
		i++;
	}
	i = 0;
	while (i < xml.childNodes.length)
	{
		var T = xml.childNodes[i];
		if (T.attributes != null && T.attributes.length>0)
		{
		var C = document.getElementById(T.id);
		if (C == undefined || C == null)
		{
			C = document.createElement(T.tagName);
			stg.appendChild(C);
		}
		{
			var j = 0;
			while (j < T.attributes.length)
			{
				C.setAttribute(T.attributes[j].name,T.attributes[j].value);
				j++;
			}
		}
		}
		i++;
	}*/
	
				
	stg.innerHTML = S;
	window.setTimeout(function(){

	var C = stg.childNodes;
	var i = 0;
	while (i < C.length)
	{
		resetobjectimage(C[i]);
		/*if (C[i].tagName == "IMG")
		{
			//if (C[i].getAttribute("className" == "Character"))
			var CN = C[i].className;
			if (CN == "Character")
			{
				C[i].setAttribute("src",imageSrcFromDNA(C[i].getAttribute("alt")));
			}
			else if (CN == "ObjectProp")
			{
				C[i].setAttribute("src",imageSrcFromObject(parseInt(C[i].getAttribute("alt")),1.0,false));
			}
			else if (CN == "ImportedAsset")
			{
				C[i].setAttribute("src",C[i].getAttribute("alt"));
			}
		}*/
		i++;
	}}, 50);
}
function resetobjectimage(obj)
{
	var CN = obj.className;
			if (CN == "Character")
			{
				obj.setAttribute("src",imageSrcFromDNA(obj.getAttribute("alt")));
			}
			else if (CN == "ObjectProp")
			{
				obj.setAttribute("src",imageSrcFromObject(parseInt(obj.getAttribute("alt")),1.0,false));
			}
			else if (CN == "ImportedAsset")
			{
				obj.setAttribute("src",obj.getAttribute("alt"));
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
	//scene.parts[currentpart] = {stage:stg.innerHTML,background:bdy.style.backgroundImage,backgroundsize:bdy.style.backgroundSize};
	scene.parts[currentpart] = {stage:encodestage(),background:current_background,backgroundsize:current_backgroundsize,backgroundPosition:current_backgroundPosition};
}

function loadpart(index)
{
	if (index == currentpart)
	{
		return;
	}
	var part = scene.parts[index];
	current_background = index;
	current_backgroundsize = part.backgroundsize;
	current_backgroundPosition = part.backgroundPosition;
	
	
	//stg.innerHTML = part.stage;
	loadstage(part.stage);
	var I = null;
	try
	{
		
	var I = imageSrcFromBackground(part.background,part.backgroundsize / 200);
	window.setTimeout(function(){
	if (part.background > -1)
	{
	I = imageSrcFromBackground(part.background,part.backgroundsize / 200);
	}
	bdy.style.backgroundImage = "url("+I+")";
		bdy.style.backgroundPosition = part.backgroundPosition;
		bdy.style.backgroundRepeat = "no-repeat";
		bdy.style.backgroundSize = part.backgroundsize+"px";}, 100);
	}
	catch(error)
	{
		bdy.style.backgroundImage = "";
	}
		/*
	bdy.style.backgroundImage = part.background;
	bdy.style.backgroundPosition = "top";
	bdy.style.backgroundRepeat = "no-repeat";
	bdy.style.backgroundSize = part.backgroundsize;*/
	currentpart = index;
	refreshSceneData();
	pushstate();
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
function ChangeBackground(index,position,size)
{
	current_background = index;
	current_backgroundsize = size;
	current_backgroundPosition = position;
	var I = null;
	if (index > -1)
	{
	 I = imageSrcFromBackground(index,size / 300);
	}
	window.setTimeout(function(){
	if (index > -1)
	{
	I = imageSrcFromBackground(index,size/300);
	}
		bdy.style.backgroundPosition = position;
		bdy.style.backgroundRepeat = "no-repeat";
		bdy.style.backgroundImage = "url("+I+")";
		bdy.style.backgroundSize = (size)+"px";
		pushstate();
		}, 50
		);
		
}
function DisplayBackgroundMenu()
{
	document.getElementById("Background Menu").style.visibility = "visible";
	document.getElementById("dimmer").style.visibility = "visible";
}
function SetBGOptions()
{
	var SC = parseFloat(document.getElementById("BGscale").value);
	var X = document.getElementById("BGxpos").value;
	if (X.indexOf("%")<0 && X.indexOf("px")<0)
	{
		X = X+"px";
	}
	var Y = document.getElementById("BGypos").value;
	if (Y.indexOf("%")<0 && Y.indexOf("px")<0)
	{
		Y = Y+"px";
	}
	var pos = X+" "+Y;
	ChangeBackground(BG_menuSelection,pos,SC * 400);
		
}
function HideBGOptions()
{
	document.getElementById("Background Menu").style.visibility = "hidden";
	document.getElementById("dimmer").style.visibility = "hidden";
}
var BG_menuSelection=-1;
function BGChangeBG(index,scale)
{
	var B = document.getElementById("Background Preview");
	var I=null;
	BG_menuSelection = index;
	if (index > -1)
	{
	index--;
	BG_menuSelection--;
	I = imageSrcFromBackground(index,scale);
	}
	window.setTimeout(function(){
	if (index > 0)
	{
		I = imageSrcFromBackground(index,scale);
	}
	B.src = I;}, 50);
}
function SceneMenuUpdate()
{
	var L = document.getElementById("Scene Menu List");
	var name=L.options[L.selectedIndex].value;
	var S = scenelist[name];
	var P = document.getElementById("Scene Menu Parts");
	//P.innerHTML = "Parts: " + S.parts.length +"<br/>" + "Total usage:"+getsize("scenes")+" of " + getsize(localStorage.maxstorage);
	P.innerHTML = "Parts: " + S.parts.length +"<br/>" + "Remaining space:"+formatsize(localStorage.maxstorage-getsize());
	var D = document.getElementById("Scene Menu Preview");
	var part = S.parts[0];
	//D.innerHTML = part.stage;
	
	var I = imageSrcFromBackground(part.background,part.backgroundsize / 200);
	window.setTimeout(function(){
	if (part.background > -1)
	{
	I = imageSrcFromBackground(part.background,part.backgroundsize / 200);
	}
	D.style.backgroundImage = "url("+I+")";
		D.style.backgroundPosition = "top";
		D.style.backgroundRepeat = "no-repeat";
		D.style.backgroundSize = part.backgroundsize+"px";}, 50);
		
	/*D.style.backgroundImage = part.background;
	D.style.backgroundPosition = "top";
	D.style.backgroundRepeat = "no-repeat";
	//D.style.backgroundSize = part.backgroundsize;
	D.style.backgroundSize = part.backgroundsize;*/
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
function SaveCharacterOptions()
{
	dna = editdna(dna,2,document.getElementById("charoptionsscale").value);
	dna = editdna(dna,1,document.getElementById("charoptionsname").value);
	
	dnalist[dnalist.length] = dna;
	localStorage.dnas = JSON.stringify(dnalist);
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
	pushstate();
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
	if (temp[1] == ':' && temp[2] == '/' && temp[3] != '/')
	{
		//if (offlinemode)
		{
			temp = "file://"+temp;
		}
	}
	if (!offlinemode && temp.indexOf("file://")==0)
	{
		alert("You cannot import files saved onto your computer when using this program online.\nTry uploading the file to a site that allows hotlinking and import it from there.\n\nor download create.html to your computer.")
		return;
	}
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
		//stg.removeChild(document.getElementById('dme'));
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
function AddTextBubble(type)
{
	var NT = document.createElement('DIV');
	NT.innerHTML='Double-click to edit Me!';
	NT.setAttribute('contenteditable','false');
	NT.style.backgroundSize = "100% 100%";
	//NT.style.margin = "60px";
	
	if (type == 1)
	{
		NT.style.backgroundImage = "url('speech.png')"
	}
	if (type == 2)
	{
		NT.style.backgroundImage = "url('thought.png')"
	}
	if (type == 3)
	{
		NT.style.backgroundImage = "url('box.png')"
	}
	if (type != 4)
	{
		NT.style.padding = "30px" 
		NT.style.paddingBottom = "40px";
	}
	if (type == 5)
	{
		NT.style.backgroundImage = "url('action.png')"
	}
	stg.appendChild(NT);initobject(NT);
	
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
    
		//img.alt = d+":"+elt.options[elt.selectedIndex].text;
		img.alt = ""+d;
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
    
		img.alt = d;
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
/*function LoadBackground()
{
	var elt = document.getElementById("backgroundchoice");
	var d = parseInt(elt.options[elt.selectedIndex].value)-1;
	
	var I;
	var H = Math.floor(window.innerHeight*1.25);
	current_background = d;
	current_backgroundsize = H;
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
		pushstate();
}*/
function rnd(I)
{
	return Math.floor(Math.random()*I);
}
function DNAMenuImport()
{
	if (currentDNA>-1)
	{
		var d = dnalist[currentDNA];
		AddCharacter(d);
	}
}
function DeleteDNA()
{
	if (currentDNA>-1)
	{
	var d = dnalist[currentDNA];
	if (confirm("Delete the DNA:"+d+"?"))
	{
		dnalist.splice(currentDNA,1);
		localStorage.dnas = JSON.stringify(dnalist);
		DisplayDNAMenu();
	}
	}
}
function DNAChangeDNA(i)
{
	//var d = i;
	var d = dnalist[i];
	currentDNA = i;
	//alert("DNA "+d);
	//var img = document.getElementById("DNA Preview");
	//img.src = imageSrcFromDNA(d,null,false,false);
	var I = imageSrcFromDNA(d,null,false,false);
	var m = document.getElementById("DNA Menu");
	m.style.backgroundImage = "url("+I+")";
	m.style.backgroundSize = 250+"px"
	m.style.backgroundPosition = "80% 100%";
	m.style.backgroundRepeat = "no-repeat";
	
	document.getElementById("DNA Strand").innerHTML = "<center>"+d+"</center>"
}
function HideDNAMenu()
{
	document.getElementById("DNA Menu").style.visibility = "hidden";
	document.getElementById("dimmer").style.visibility = "hidden";
}
//calling this instead of adding it directly makes the indexes have the correct references stored
function adddnaclick(e,i)
{
	e.addEventListener("click", function(){DNAChangeDNA(i);});
}
function DisplayDNAMenu()
{
	var m =document.getElementById("DNA Menu");
	m.style.visibility = "visible";
	document.getElementById("dimmer").style.visibility = "visible";
	m.style.backgroundImage = null;
	currentDNA = -1;
	var list = document.getElementById("DNA List");
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
	var i = 0;
	while (i < dnalist.length)
	{
		var p = document.createElement("a");
		var d = dnalist[i];
		
		p.innerHTML = getdnavalue(d,1)+"<br/>";
		//var t = i;
		//p.addEventListener("click", function(){DNAChangeDNA(t);});
		adddnaclick(p,i);
		list.appendChild(p);
		i++;
	}
	document.getElementById("DNA Strand").innerHTML = "<center>[DNA strand]</center>";
}
function AddNewDNA()
{
	var d = prompt("Input a DNA strand");
	if (d.split(":").length>12)
	{
		dnalist[dnalist.length] = d;
		localStorage.dnas = JSON.stringify(dnalist);
		DisplayDNAMenu();
	}
	else
	{
		alert("Invalid dna");
	}
}
function RandomizeAll()
{
	var i = 0;
	var C = stg.childNodes;
	while (i < C.length)
	{
		if (C[i].className == "Character")
		{
			var d = randomDNA();
			d = editdna(d,2,parseInt(getdnavalue(d,2)) * 2);
			C[i].alt = d;
			C[i].src = imageSrcFromDNA(d,null,false,false);
		}
		i++;
	}
}
function randomDNA()
{
	return "Null:Char"+count+":100:"+rnd(351)+":"+rnd(281)+":"+rnd(363)+":"+rnd(277)+":"+rnd(127)+":"+rnd(133)+":"+rnd(85)+":"+rnd(157)+":"+rnd(156)+":"+rnd(136)+":"+rnd(16777215).toString(16);
}
function newcharacter()
{
	AddCharacter(randomDNA());
}
function LoadPreset()
{
	var elt = document.getElementById("presetchoice");
	var d = "NULL:"+elt.options[elt.selectedIndex].value;
	AddCharacter(d,true);
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
//a counter used to reduce typed message update spamming.
var typecount=0;
document.onkeyup = function(evt) {
	if (lobj != null && lobj != undefined)
	{
		if (!lobj.contentEditable || typecount & 2>0)
		{
			pushstate();
		}
		typecount++;
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
	if ((document.activeElement.contentEditable && document.activeElement == lobj) || document.activeElement.tagName == "INPUT")
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
	if (T.style.visibility != "hidden")
	{
		//var X = parseFloat(lobj.style.left);
		//var Y = parseFloat(lobj.style.top);
		var X = 0;
		var Y = 0;
		//left
		if (e.keyCode == 37)
		{
			X=-1;
		}
		//up
		if (e.keyCode == 38)
		{
			Y=-1;
		}
		//right
		if (e.keyCode == 39)
		{
			X=1;
		}
		if (e.keyCode == 40)
		{
			Y=1;
		}
		if (X != 0 || Y != 0)
		{
		if (e.shiftKey && !e.ctrlKey)
		{
			lobj.scale = lobj.scale * (1 + (X*0.1));
			lobj.style.WebkitTransform = "rotate("+lobj.rot+"deg) scaleX("+(lobj.scale*lobj.direction)+") scaleY("+lobj.scale+")";
			lobj.style.transform = lobj.style.WebkitTransform;
			lobj.style.MozTransform = lobj.style.WebkitTransform;
		}
		else if (!e.shiftKey && e.ctrlKey)
		{
			lobj.rot += X;
			lobj.style.WebkitTransform = "rotate("+lobj.rot+"deg) scaleX("+(lobj.scale*lobj.direction)+") scaleY("+lobj.scale+")";
			lobj.style.transform = lobj.style.WebkitTransform;
			lobj.style.MozTransform = lobj.style.WebkitTransform;
		}
		else
		{
			lobj.style.left = ""+(parseFloat(lobj.style.left)+X);
			lobj.style.top = ""+(parseFloat(lobj.style.top)+Y);
		}
		}
		//lobj.style.left = 
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
			pushstate();
		}
		else
		{
			stg.removeChild(lobj);
			count--;
			pushstate();
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
		pushstate();
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
				pushstate();
			}
			else
			{
				lobj.src = imageSrcFromDNA(lobj.alt,null,false,false);
				lobj.backsprite=false;
				pushstate();
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
		pushstate();
	}
	//V key
	if (e.keyCode == 86 && lobj.tagName=="DIV")
	{
		var temp = prompt("enter a font name",""+lobj.style.fontFamily);
		lobj.style.fontFamily = temp;
		pushstate();
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
		pushstate();
	}
	//T key
	if (e.keyCode == 84)
	{
		var NT = document.createElement("DIV");
		NT.innerHTML="Double-click to edit Me!";
		NT.setAttribute("contentEditable","false");
		NT.backgroundImage = "url(speech.png)";
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
	pushstate();
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
	var nx = 1+((x-ox) / 100);
	var ny = 1+((y-oy) / 100);
	tobj.style.WebkitTransform = "rotate("+tobj.rot+"deg) scaleX("+(nx*tobj.direction)+") scaleY("+ny+")";
	tobj.style.transform = tobj.style.WebkitTransform;
	tobj.style.MozTransform = tobj.style.WebkitTransform;
}
if (mode==1)
{
tobj.style.position="absolute";
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
function getstate()
{
	var state = {scene:scene,currentpart:currentpart,BGsize:current_backgroundsize,current:encodestage(),BGImage:current_background,BGpos:current_backgroundPosition};
	state = JSON.stringify(state);
	return state;
}
function pushstate()
{
	/*var state = {scene:scene,currentpart:currentpart,BGsize:current_backgroundsize,current:encodestage(),BGImage:current_background,BGpos:current_backgroundPosition};
	state = JSON.stringify(state);*/
	var state = getstate();
	/*var id = "state:"+window.history.length;
	var str = ""+state;
	var size = state.length;*/
	//sessionStorage[id] = state;
	if (state != laststate)
	{
		//add undo state
		history.pushState(state,"Create.html","");
		
		//collab features
		if (collabpush)
		{
		if (laststate != "")
		{
			var LS = JSON.parse(laststate);
			if (LS.BGImage != current_background || LS.BGpos != current_backgroundPosition || LS.BGsize != current_backgroundsize)
			{
				//update background data
				collabBG(current_background,current_backgroundPosition,current_backgroundsize);
			}
			else if (LS.scene.name != scene.name || LS.currentpart != currentpart)
			{
				//update background and the entire scene & stage
				collabpush(state);
			}
			else
			{
				//update selected object
				collabchange(lobj);
			}
		}
		
		}
		laststate = state;
	}
}
function setstate(state)
{
	if (state.scene != undefined)
	{
		scene = state.scene;
		currentpart = -1;
		loadpart(state.currentpart);
		//bdy.style.backgroundImage = state.BGImage;
		
		var I = imageSrcFromBackground(state.BGImage,state.BGsize / 200);
	window.setTimeout(function(){
	if (state.BGImage > -1)
	{
	I = imageSrcFromBackground(state.BGImage,state.BGsize / 200);
	}
	bdy.style.backgroundImage = "url("+I+")";
		bdy.style.backgroundPosition = state.BGpos;
		bdy.style.backgroundRepeat = "no-repeat";
		bdy.style.backgroundSize = state.BGsize+"px";}, 50);
		
		//bdy.style = state.bodystyle;
		loadstage(state.current);
		//stg.innerHTML = state.current;
	}
}
window.onpopstate = function(event) {
	var state = JSON.parse(event.state);
	setstate(state);
};
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
	if (mode != 0 && lobj != null && isstageobject(lobj))
	{
		pushstate();
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

//html drag and drop feature
/*if(window.FileReader) { 
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
}*/
//scenelist = [];
//scenelist = {};
if (localStorage.maxstorage == undefined)
{
	localStorage.clear();
	var i = 0;
	var s = "0000000000000000000000000";
	s = s + s + s + s + s;
	s = s+s;
	s = s+s;
	s = s+s;
	s = s+s;
	s = s+s;
	var ok = true;
	try
	{
	while (ok)
	{
		localStorage["memtest:"+i] =s;
		i++;
	}
	}
	catch(error)
	{
	}
	localStorage.clear();
	localStorage.maxstorage = i * 1000;
	alert("maxstorage:"+localStorage.maxstorage);
	//scenelist = {};
}
if (localStorage.scenes == undefined)
{
	//localStorage.scenes = new Array();
	scenelist = {};
}
else
{
	scenelist = JSON.parse(localStorage.scenes);
}
if (localStorage.dnas == undefined)
{
	dnalist = [];
}
else
{
	dnalist = JSON.parse(localStorage.dnas);
}
document.getElementById("BGscale").value = "" +((window.innerHeight*1.25) / 400);
if (window.location.href.indexOf("file://")==0)
{
	offlinemode = true;
}

//scenelist = {};
//scenelist = []
//for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");;

refreshSceneList();
}