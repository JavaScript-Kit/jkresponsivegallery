/**
 * JK Responsive Gallery Script
 * Copyright JavaScript Kit (www.javascriptkit.com)
 * Updated: Aug 26th, 15'
 * Visit JavaScript Kit at http://www.javascriptkit.com/ for full source code       
 */

(function($){

	document.createElement('figure') // for lesser IEs sake
	document.createElement('figcaption') // for lesser IEs sake

	var captionclass = 'rcaption'

	var KEYCODE_ESC = 27
			KEYCODE_LEFT = 37
			KEYCODE_RIGHT = 39

	var defaults = {
		autoclose: true,
		images: [], // leave this intact
		fxduration: 150
	}

	var galleryui = '<div class="responsivegallery">'
								+ '<div class="galleryinner">'
								+ '<div class="figurearea"></div>'
								+ '<div class="close"><span class="icon-cross"></span></div>'
								+ '<div class="leftnav"><span class="icon-arrow-left"></span></div><div class="rightnav"><span class="icon-arrow-right"></span></div>'
								+ '<div class="loadingdiv"><span class="icon-spinner"></span></div>'
								+ '<div class="errordiv"><span class="icon-cancel-circle"></span></div>'
								+ '</div>' // end galleryinner
								+ '</div>'

	function buildfigure(imagefigure, curimage, totalimages){
		var countermarkup = (totalimages>1)? '<span class="counter">' + (curimage+1) + '/' + totalimages + '</span>' : ''
		var figurehtml = '<figure>\n'
		figurehtml += '<img src="' + imagefigure[0] + '" />\n'
		figurehtml += '<figcaption><div class="captioninner">' + countermarkup + (imagefigure[1] || "") + '</div></figcaption>\n'
		figurehtml += '</figure>'
		return figurehtml
	}

	function preloadimage(imageurl, callback){
		var callback = callback || function(){}
		var preload = new Image()
		preload.onload = function(){
			callback()
		}
		preload.onerror = function(){
			callback('error')
		}
		preload.src= imageurl
	}

	var responsivegallery = {
		$galleryui: null,
		$galleryinner: null,
		$loadingdiv: null,
		loadingdivtimer: null,
		$errordiv: null,
		$galleryfigurearea: null,
		activesettings: null,
		activegallery: {images:[], curimage:0, imagesshown:[], startingimage:null},
		
		buildgalleryui: function(){
			this.$galleryui = $(galleryui).appendTo(document.body)
			this.$galleryinner = this.$galleryui.find('div.galleryinner')
			this.$loadingdiv = this.$galleryui.find('div.loadingdiv')
			this.$errordiv = this.$galleryui.find('div.errordiv')
			this.$galleryfigurearea = this.$galleryui.find('div.figurearea')
			var $closebutt = this.$galleryui.find('div.close')
			var $leftnav = this.$galleryui.find('div.leftnav')
			var $rightnav = this.$galleryui.find('div.rightnav')

			$(document).on('keyup', function(e){
				if (responsivegallery.$galleryui.css('display') == 'block'){
					if (e.keyCode == KEYCODE_ESC)
						responsivegallery.hidegallery()
					else if (e.keyCode == KEYCODE_LEFT && responsivegallery.activegallery.images.length > 1)
						responsivegallery.navigate('prev')
					else if (e.keyCode == KEYCODE_RIGHT && responsivegallery.activegallery.images.length > 1)
						responsivegallery.navigate('next')
				}
			})

			this.$galleryui.on('click', function(){
				responsivegallery.hidegallery()
			})

			this.$galleryfigurearea.on('click', function(e){
				e.stopPropagation()
			})

			$leftnav.on('click', function(e){
				responsivegallery.navigate('prev')
				e.stopPropagation()
			})

			$rightnav.on('click', function(e){
				responsivegallery.navigate('next')
				e.stopPropagation()
			})

			$(window).on('resize.adjustimageheight', function(){
				if (responsivegallery.$galleryui.css('display') == 'block'){
					responsivegallery.$galleryfigurearea.find('img:eq(0)').css('maxHeight', responsivegallery.$galleryinner.height()-30)
				}
			})

			var swipeOptions={ // swipe object variables
				triggerOnTouchEnd : true,
				triggerOnTouchLeave : true,
				fallbackToMouseEvents : false, // enable mouse emulation of swipe navigation in non touch devices?
				swipethreshold: 75,
				excludedElements:[]
			}
	
			swipeOptions.swipeStatus = function(event, phase, direction, distance){
				if (phase == 'end'){
					var navkeyword = /(right)/i.test(direction)? 'prev' : 'next'
					responsivegallery.navigate(navkeyword)
				}
			}

			if (this.$galleryfigurearea.swipe){
				this.$galleryinner.swipe(swipeOptions)
			}

		},

		showgallery: function(){
			var $navbuttons = this.$galleryui.find('div.leftnav, div.rightnav')
			$navbuttons.css('display', (this.activegallery.images.length > 1)? 'block' : 'none')
			this.$galleryui.fadeIn(this.activesettings.fxduration)
		},

		hidegallery:function(){
			this.$galleryfigurearea.empty()
			this.$galleryui.fadeOut(this.activesettings.fxduration)
		},

		populategallery: function(){
			var images = this.activegallery.images
			var curimage = this.activegallery.curimage
			var targetfigure = images[curimage]
			clearTimeout( this.loadingdivtimer )
			this.loadingdivtimer = setTimeout(function(){
				responsivegallery.$loadingdiv.css('display', 'block')
			}, 50)
			this.$errordiv.css('display', 'none')
			preloadimage(images[curimage][0], function(err){
				clearTimeout( responsivegallery.loadingdivtimer )
				responsivegallery.$loadingdiv.css('display', 'none')
				if (err){
					responsivegallery.$galleryfigurearea.empty()
					responsivegallery.$errordiv.css('display', 'block').attr('title', 'Error loading ' + images[curimage][0])
					var $galleryimage = responsivegallery.$galleryfigurearea.find('img:eq(0)')
					var $figcaptioninner = responsivegallery.$galleryfigurearea.find('figcaption div.captioninner')
				}
				else{				
					responsivegallery.$galleryfigurearea.empty().html( buildfigure(images[curimage], curimage, images.length) )
				}
				$(window).trigger('resize.adjustimageheight')
				responsivegallery.$galleryfigurearea.find('figure').css({transitionDuration: (responsivegallery.activesettings.fxduration/1000) + 's', opacity:1})
			})
			

		},

		navigate: function(keyword){
			var images = this.activegallery.images
			var curimage = this.activegallery.curimage
			var startingimage = this.activegallery.startingimage
			var imagesshown = this.activegallery.imagesshown

			var targetimage = (keyword == 'next')? ( (curimage < images.length-1)? curimage+1 : 0) :
												(keyword == 'prev')? ( (curimage > 0)? curimage-1 : images.length-1) :
												parseInt(keyword)

			if (this.activesettings.autoclose && imagesshown[imagesshown.length-1] == 'all' && targetimage == startingimage){
				this.hidegallery()
				return
			}

			if (jQuery.inArray(targetimage, imagesshown) == -1){
				imagesshown.push(targetimage)
			}
			this.activegallery.curimage = targetimage
			this.populategallery()
			if (images.length > 1 && imagesshown.length >= images.length && this.activesettings.autoclose){
				imagesshown.push('all')
			}
		}

	}

	$.fn.responsivegallery = function(settings){
		var matches = this.length
		var images = []
		return this.each(function(i){
			var s = $.extend({}, defaults, settings)
			var $t = $(this)
			var enlargedimage
			var $galleryui = $('div.responsivegallery')
			$t.data('pos', i)
			var enlargeimagesrc = $t.is('a')? $t.attr('href') : $t.find('a:eq(0)').attr('href')
			var caption = ($t.find('div.' + captionclass).length == 1)? $t.find('div.' + captionclass).html() : $t.attr('title')
			enlargedimage = [enlargeimagesrc, caption]
			images.push( enlargedimage ) // add enlargeimage to own collection of images[]
			if (matches == 1){ // if only one thumbnail in collection
				images = images.concat(s.images) // add enlargeimage as 1st element in s.images
			}
			$t.on('click', function(e){
				e.preventDefault()
				responsivegallery.activesettings = s
				responsivegallery.activegallery = {images: images, curimage: $(this).data('pos'), imagesshown: [$(this).data('pos')], startingimage: $(this).data('pos')}
				responsivegallery.populategallery()
				responsivegallery.showgallery()

			})

			if ($galleryui.length == 0){ // build gallery UI only once
				responsivegallery.buildgalleryui()
			}
			
		}) // end this.each()
	}

})(jQuery);