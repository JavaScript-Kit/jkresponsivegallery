# JK Responsive Youtube Video and Image Gallery #

*Description:* JK Responsive Gallery is a modern, lightbox style image and Youtube gallery that works perfectly on any screen size and device, big or small. Key features:

+ **Totally responsive:** Enlarged YouTube video player or image auto scales if necessary to always fit inside the user's screen and centered. 
+ **Rich HTML caption:** Add an optional caption to the enlarged image/ Youtube video, HTML supported!
+ **Keyboard and swipe navigation:** Left and right arrows to cycle through images/ Youtube videos, swipe on mobile devices to do the same. Esc key to dismiss gallery.
+ **Single or group of images/Youtube videos:** Enlarge a single thumbnail or group multiple thumbnail images or videos on the page together to turn them into a gallery. Alternatively, dynamically add additional images and videos to a single thumbnail on the page using JavaScript.
+ **Auto close gallery:** Option to automatically close the gallery after the user has cycled through all the images/ videos inside a collection. 
+ **Scalable Icon fonts:** All UI elements of the gallery such as the navigation buttons, loading image etc are icon fonts (from Icomoon) for pixel perfect scaling and easy color change.

## Directions ##

Add the following code to the HEAD of your page:

	<link rel="stylesheet" href="assets/jkresponsivegallery.css" />
	
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="assets/jquery.touchSwipe.min.js"></script>
	
	<script src="assets/jkresponsivegallery.js"></script>

Then call `$(selector).jkresponsivegallery()` on an image/ Youtube video or group of images/ videos:

	$('#gallery1').responsivegallery()

OR:

	$('#gallery2').responsivegallery({
		images:[
			["image2.jpg", "caption 2"],
			["youtube.url", "caption 3"],
			["image4.jpg", "caption 4"]
		] //<-- no comma after last setting
	})

OR

	$('#group1 > div.rthumbnail').responsivegallery()

## Thumbnail Markup ##

For Thumbnails with plain text captions or no caption at all, use:

	<a class="thumblink" href="images/waterdrop.jpg" title="This is a plain text caption">Waterdrop</a>

For Thumbnails with rich HTML captions:

	<div class="rthumbnail">
	<a href="images/fisherman.jpg">
	<img border="0" src="images/fisherman_thumb.jpg"></a>
	<div class="rcaption">Caption text <b>HTML</b> supported!</div>
	</div> 


## More info ##

Visit the script's project page for additional details on setup and documentation: <http://javascriptkit.com/script/script2/jkresponsivegallery/>
