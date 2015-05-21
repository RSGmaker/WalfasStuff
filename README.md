WalfasStuff
===========

Walfas projects and code particularly html5 applications.

the drawwalfas.js can render a walfas DNA in your web applications.
Walfas recolor is a webapp built on an edit of the engine.
you can try Walfas recolor here: https://rawgit.com/RSGmaker/WalfasStuff/master/WalfasRender/recolor.html

to use drawwalfas.js, you need to reference it:
```html
<script src="https://rawgit.com/RSGmaker/WalfasStuff/master/WalfasRender/drawwalfas.js"> </script>
```
and make a drawwalfas object:
var walfas = new drawwalfas();

then simply render the dna to an image by calling:
walfas.imageFromDNA(WalfasDNAstring,Scale,Cropping,isbacksprite) cropping is optional and the image might not be centered anymore if set to true,isbacksprite is optional setting it to true attempts to render the dna as a backsprite.
eg; 
```html
imageFromDNA("3.39:RSGmaker:100:0:192:324:232:24:0:0:0:1:0:321A00",1.0,false)//1.0 is the same as 100 scale in create.swf
```
you can also render backgrounds and object using imageFromBackground(background id,scale) and imageFromObject(object id,scale,cropping) respectively.

and thats all there is to it you can look at this if you want: http://jsfiddle.net/yp4n6m7r/11/ in two line of code we can adds an image of a character to an html document

touhou pong uses drawwalfas.js to replace the paddles with any walfas character this way you can try it here: https://rawgit.com/RSGmaker/WalfasStuff/master/WalfasApps/pong/pong.html (press F9 to input walfas dna)
