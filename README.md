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

then simply render the dna to an image by calling:
imageFromDNA(WalfasDNAstring,Scale,Cropping) cropping is optional and the image might not be centered anymore if set to true
eg; 
```html
imageFromDNA("3.39:RSGmaker:100:0:192:324:232:24:0:0:0:1:0:321A00",1.0,false)//1.0 is the same as 100 scale in create.swf
```

and thats all there is to it you can look at this if you want: http://jsfiddle.net/yp4n6m7r/6/ just a single line of code and it adds the image to the html document

touhou pong uses drawwalfas.js to replace the paddles with any walfas character this way you can try it here: https://rawgit.com/RSGmaker/WalfasStuff/master/WalfasApps/pong/pong.html (press F9 to input walfas dna)
