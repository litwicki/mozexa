/**
 *	Copyright 2009, 2010 Litwicki Media LLC
 *	@author:	jake@litwickimedia.com
 *	@SVN:		$Id$
 *
 *	This script is a collection of open source jQuery plugins, compiled by Litwicki Media for use within Mozexa.
 *	Each plugin is licensed individually under the MIT License: http://www.opensource.org/licenses/mit-license.php
 *	For details about a particular plugin, please contact: help@litwickimedia.com
 *
 */
 
/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $LastChangedDate: 2010-05-10 14:08:41 -0500 (Mon, 10 May 2010) $
 * $Rev: 19 $
 *
 * Version 2.1.1
 */
 
(function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&/6.0/.test(navigator.userAgent)){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var prop=function(n){return n&&n.constructor==Number?n+'px':n;},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild);});}return this;};})(jQuery);

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/*
 * jQuery Tooltip plugin 1.3
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 5741 2008-06-21 15:22:16Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * ----------------------------------------------------------------
 * 04/29/2010
 *	Modified tooltip HTML for theme-roller support.
 *	jake@litwickimedia.com, Litwicki Media LLC
 *
 */
 
;(function($) {
	
		// the tooltip element
	var helper = {},
		// the current tooltipped element
		current,
		// the title of the current element, used for restoring
		title,
		// timeout id for delayed tooltips
		tID,
		// IE 5.5 or 6
		IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		// flag for mouse tracking
		track = false;
	
	$.tooltip = {
		blocked: false,
		defaults: {
			delay: 200,
			fade: false,
			showURL: true,
			extraClass: "",
			top: 15,
			left: 15,
			id: "tooltip"
		},
		block: function() {
			$.tooltip.blocked = !$.tooltip.blocked;
		}
	};
	
	$.fn.extend({
		tooltip: function(settings) {
			settings = $.extend({}, $.tooltip.defaults, settings);
			createHelper(settings);
			return this.each(function() {
					$.data(this, "tooltip", settings);
					this.tOpacity = helper.parent.css("opacity");
					// copy tooltip into its own expando and remove the title
					this.tooltipText = this.title;
					$(this).removeAttr("title");
					// also remove alt attribute to prevent default tooltip in IE
					this.alt = "";
				})
				.mouseover(save)
				.mouseout(hide)
				.click(hide);
		},
		fixPNG: IE ? function() {
			return this.each(function () {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
					image = RegExp.$1;
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					}).each(function () {
						var position = $(this).css('position');
						if (position != 'absolute' && position != 'relative')
							$(this).css('position', 'relative');
					});
				}
			});
		} : function() { return this; },
		unfixPNG: IE ? function() {
			return this.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		} : function() { return this; },
		hideWhenEmpty: function() {
			return this.each(function() {
				$(this)[ $(this).html() ? "show" : "hide" ]();
			});
		},
		url: function() {
			return this.attr('href') || this.attr('src');
		}
	});
	
	function createHelper(settings) {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper, h3 for title, div for url
		helper.parent = $('<div id="' + settings.id + '" class=" ui-state-default ui-corner-all ui-helper-reset pad-light"><div class="tooltip-title pad"><div class="tooltip-body"></div><div class="tooltip-url"></div></div>')
			// add to document
			.appendTo(document.body)
			// hide it at first
			.hide();
			
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			helper.parent.bgiframe();
		
		// save references to title and url elements
		helper.title = $('div.tooltip-title', helper.parent);
		helper.body = $('div.tooltip-body', helper.parent);
		helper.url = $('div.tooltip-url', helper.parent);
	}
	
	function settings(element) {
		return $.data(element, "tooltip");
	}
	
	// main event handler to start showing tooltips
	function handle(event) {
		// show helper, either with timeout or on instant
		if( settings(this).delay )
			tID = setTimeout(show, settings(this).delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		track = !!settings(this).track;
		$(document.body).bind('mousemove', update);
			
		// update at least once
		update(event);
	}
	
	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( $.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler) )
			return;

		// save current
		current = this;
		title = this.tooltipText;
		
		if ( settings(this).bodyHandler ) {
			helper.title.hide();
			var bodyContent = settings(this).bodyHandler.call(this);
			if (bodyContent.nodeType || bodyContent.jquery) {
				helper.body.empty().append(bodyContent)
			} else {
				helper.body.html( bodyContent );
			}
			helper.body.show();
		} else if ( settings(this).showBody ) {
			var parts = title.split(settings(this).showBody);
			helper.title.html(parts.shift()).show();
			helper.body.empty();
			for(var i = 0, part; (part = parts[i]); i++) {
				if(i > 0)
					helper.body.append("<br/>");
				helper.body.append(part);
			}
			helper.body.hideWhenEmpty();
		} else {
			helper.title.html(title).show();
			helper.body.hide();
		}
		
		// if element has href or src, add and show it, otherwise hide it
		if( settings(this).showURL && $(this).url() )
			helper.url.html( $(this).url().replace('http://', '') ).show();
		else 
			helper.url.hide();
		
		// add an optional class for this tip
		helper.parent.addClass(settings(this).extraClass);

		// fix PNG background for IE
		if (settings(this).fixPNG )
			helper.parent.fixPNG();
			
		handle.apply(this, arguments);
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
			if (helper.parent.is(":animated"))
				helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
			else
				helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
		} else {
			helper.parent.show();
		}
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if($.tooltip.blocked)
			return;
		
		if (event && event.target.tagName == "OPTION") {
			return;
		}
		
		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$(document.body).unbind('mousemove', update)
		}
		
		// if no current element is available, remove this listener
		if( current == null ) {
			$(document.body).unbind('mousemove', update);
			return;	
		}
		
		// remove position helper classes
		helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
		
		var left = helper.parent[0].offsetLeft;
		var top = helper.parent[0].offsetTop;
		if (event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + settings(current).left;
			top = event.pageY + settings(current).top;
			var right='auto';
			if (settings(current).positionLeft) {
				right = $(window).width() - left;
				left = 'auto';
			}
			helper.parent.css({
				left: left,
				right: right,
				top: top
			});
		}
		
		var v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20 + settings(current).left;
			helper.parent.css({left: left + 'px'}).addClass("viewport-right");
		}
		// check vertical position
		if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20 + settings(current).top;
			helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
		}
	}
	
	function viewport() {
		return {
			x: $(window).scrollLeft(),
			y: $(window).scrollTop(),
			cx: $(window).width(),
			cy: $(window).height()
		};
	}
	
	// hide helper and restore added classes and the title
	function hide(event) {
		if($.tooltip.blocked)
			return;
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		
		var tsettings = settings(this);
		function complete() {
			helper.parent.removeClass( tsettings.extraClass ).hide().css("opacity", "");
		}
		if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
			if (helper.parent.is(':animated'))
				helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
			else
				helper.parent.stop().fadeOut(tsettings.fade, complete);
		} else
			complete();
		
		if( settings(this).fixPNG )
			helper.parent.unfixPNG();
	}
	
})(jQuery);

/*
 * jQuery MultiSelect Plugin 0.6
 * Copyright (c) 2010 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-multiselect-plugin-with-themeroller-support/
 * Inspired by Cory S.N. LaViska's implementation, A Beautiful Site (http://abeautifulsite.net/) 2009
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
*/
(function(f){f.fn.multiSelect=function(i){i=f.extend({},f.fn.multiSelect.defaults,i);return this.each(function(){return new w(this,i)})};var x=0,w=function(i,a){var g=$original=f(i),e,l,k,h=[],s=[];l=g.is(":disabled");var t=i.id||"ui-multiselect-"+x++;h.push('<a id="'+t+'" class="ui-multiselect ui-widget ui-state-default ui-corner-all'+(l||a.disabled?" ui-state-disabled":"")+'">');h.push('<input readonly="readonly" type="text" class="ui-state-default" value="'+a.noneSelectedText+'" title="'+i.title+
'" /><span class="ui-icon ui-icon-triangle-1-s"></span></a>');h.push('<div class="ui-multiselect-options'+(a.shadow?" ui-multiselect-shadow":"")+' ui-widget ui-widget-content ui-corner-all">');if(a.showHeader){h.push('<div class="ui-widget-header ui-helper-clearfix ui-corner-all ui-multiselect-header">');h.push('<ul class="ui-helper-reset">');h.push('<li><a class="ui-multiselect-all" href=""><span class="ui-icon ui-icon-check"></span>'+a.checkAllText+"</a></li>");h.push('<li><a class="ui-multiselect-none" href=""><span class="ui-icon ui-icon-closethick"></span>'+
a.unCheckAllText+"</a></li>");h.push('<li class="ui-multiselect-close"><a href="" class="ui-multiselect-close ui-icon ui-icon-circle-close"></a></li>');h.push("</ul>");h.push("</div>")}h.push('<ul class="ui-multiselect-checkboxes ui-helper-reset">');l&&g.removeAttr("disabled");g.find("option").each(function(b){var c=f(this),d=c.html(),m=this.value;b=this.id||"ui-multiselect-"+t+"-option-"+b;var j=c.parent(),n=j.is("optgroup"),o=c.is(":disabled"),u=["ui-corner-all"];if(n){j=j.attr("label");if(f.inArray(j,
s)===-1){h.push('<li class="ui-multiselect-optgroup-label"><a href="#">'+j+"</a></li>");s.push(j)}}if(m.length>0){o&&u.push("ui-state-disabled");h.push('<li class="'+(o?"ui-multiselect-disabled":"")+'">');h.push('<label for="'+b+'" class="'+u.join(" ")+'"><input id="'+b+'" type="'+(a.multiple?"checkbox":"radio")+'" name="'+i.name+'" value="'+m+'" title="'+d+'"');c.is(":selected")&&h.push(' checked="checked"');o&&h.push(' disabled="disabled"');h.push(" />"+d+"</label></li>")}});h.push("</ul></div>");
g=g.after(h.join("")).next("a.ui-multiselect");e=g.next("div.ui-multiselect-options");l=e.find("div.ui-multiselect-header");k=e.find("label").not(".ui-state-disabled");var v=g.find("span.ui-icon").outerWidth(),p=$original.outerWidth(),q=p+v;if(/\d/.test(a.minWidth)&&q<a.minWidth){p=a.minWidth-v;q=a.minWidth}g.width(q).find("input").width(p);a.showHeader&&l.find("a").click(function(b){var c=f(this);if(c.hasClass("ui-multiselect-close"))e.trigger("close");else{c=c.hasClass("ui-multiselect-all");e.trigger("toggleChecked",
[c?true:false]);a[c?"onCheckAll":"onUncheckAll"].call(this)}b.preventDefault()});var r=function(){var b=k.find("input"),c=b.filter(":checked"),d="";d=c.length;d=d===0?a.noneSelectedText:f.isFunction(a.selectedText)?a.selectedText.call(this,d,b.length,c.get()):/\d/.test(a.selectedList)&&a.selectedList>0&&d<=a.selectedList?c.map(function(){return this.title}).get().join(", "):a.selectedText.replace("#",d).replace("#",b.length);g.find("input").val(d);return d};g.bind({click:function(){e.trigger("toggle")},
keypress:function(b){switch(b.keyCode){case 27:case 38:e.trigger("close");break;case 40:case 0:e.trigger("toggle");break}},mouseenter:function(){g.hasClass("ui-state-disabled")||f(this).addClass("ui-state-hover")},mouseleave:function(){f(this).removeClass("ui-state-hover")},focus:function(){g.hasClass("ui-state-disabled")||f(this).addClass("ui-state-focus")},blur:function(){f(this).removeClass("ui-state-focus")}});e.bind({close:function(b,c){c=c||false;if(c===true)f("div.ui-multiselect-options").filter(":visible").fadeOut(a.fadeSpeed).prev("a.ui-multiselect").removeClass("ui-state-active").trigger("mouseout");
else{g.removeClass("ui-state-active").trigger("mouseout");e.fadeOut(a.fadeSpeed)}},open:function(b,c){if(!g.hasClass("ui-state-disabled")){var d=g.position(),m=e.find("ul:last"),j,n;g.addClass("ui-state-active");if(c||typeof c==="undefined")e.trigger("close",[true]);j=a.position==="middle"?d.top+g.height()/2-e.outerHeight()/2:a.position==="top"?d.top-e.outerHeight():d.top+g.outerHeight();n=g.width()-parseInt(e.css("padding-left"),10)-parseInt(e.css("padding-right"),10);k.filter("label:first").trigger("mouseenter").trigger("focus");
e.css({position:"absolute",top:j+"px",left:d.left+"px",width:n+"px"}).show();m.scrollTop(0);a.maxHeight&&m.css("height",a.maxHeight);a.onOpen.call(e[0])}},toggle:function(){e.trigger(f(this).is(":hidden")?"open":"close")},traverse:function(b,c,d){b=f(c);d=d===38||d===37?true:false;b=b.parent()[d?"prevAll":"nextAll"]("li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)")[d?"last":"first"]();if(b.length)b.find("label").trigger("mouseenter");else{b=e.find("ul:last");e.find("label")[d?"last":
"first"]().trigger("mouseover");b.scrollTop(d?b.height():0)}},toggleChecked:function(b,c,d){(d&&d.length?d:k.find("input")).not(":disabled").attr("checked",c?"checked":"");r()}}).find("li.ui-multiselect-optgroup-label a").click(function(b){var c=f(this).parent().nextUntil("li.ui-multiselect-optgroup-label").find("input");e.trigger("toggleChecked",[c.filter(":checked").length===c.length?false:true,c]);a.onOptgroupToggle.call(this,c.get());b.preventDefault()});k.bind({mouseenter:function(){k.removeClass("ui-state-hover");
f(this).addClass("ui-state-hover").find("input").focus()},keyup:function(b){switch(b.keyCode){case 27:e.trigger("close");break;case 38:case 40:case 37:case 39:e.trigger("traverse",[this,b.keyCode]);break;case 13:b.preventDefault();f(this).click();break}}}).find("input").bind("click",function(){a.onCheck.call(this);r()});$original.remove();f.fn.bgiframe&&e.bgiframe();a.state==="open"&&e.trigger("open",[false]);g.find("input")[0].defaultValue=r();return g};f(document).bind("click",function(i){i=f(i.target);
!i.closest("div.ui-multiselect-options").length&&!i.parent().hasClass("ui-multiselect")&&f("div.ui-multiselect-options").trigger("close",[true])});f.fn.multiSelect.defaults={showHeader:true,maxHeight:175,minWidth:215,checkAllText:"Check all",unCheckAllText:"Uncheck all",noneSelectedText:"Select options",selectedText:"# selected",selectedList:0,position:"bottom",shadow:false,fadeSpeed:200,disabled:false,state:"closed",multiple:true,onCheck:function(){},onOpen:function(){},onCheckAll:function(){},onUncheckAll:function(){},
onOptgroupToggle:function(){}}})(jQuery);

/*
 ### jQuery Multiple File Upload Plugin v1.46 - 2009-05-12 ###
 * Home: http://www.fyneworks.com/jquery/multiple-file-upload/
 * Code: http://code.google.com/p/jquery-multifile-plugin/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 ###
*/

/*# AVOID COLLISIONS #*/
;if(window.jQuery) (function($){
/*# AVOID COLLISIONS #*/
 
	// plugin initialization
	$.fn.MultiFile = function(options){
		if(this.length==0) return this; // quick fail
		
		// Handle API methods
		if(typeof arguments[0]=='string'){
			// Perform API methods on individual elements
			if(this.length>1){
				var args = arguments;
				return this.each(function(){
					$.fn.MultiFile.apply($(this), args);
    });
			};
			// Invoke API method handler
			$.fn.MultiFile[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
			// Quick exit...
			return this;
		};
		
		// Initialize options for this call
		var options = $.extend(
			{}/* new object */,
			$.fn.MultiFile.options/* default options */,
			options || {} /* just-in-time options */
		);
		
		// Empty Element Fix!!!
		// this code will automatically intercept native form submissions
		// and disable empty file elements
		$('form')
		.not('MultiFile-intercepted')
		.addClass('MultiFile-intercepted')
		.submit($.fn.MultiFile.disableEmpty);
		
		//### http://plugins.jquery.com/node/1363
		// utility method to integrate this plugin with others...
		if($.fn.MultiFile.options.autoIntercept){
			$.fn.MultiFile.intercept( $.fn.MultiFile.options.autoIntercept /* array of methods to intercept */ );
			$.fn.MultiFile.options.autoIntercept = null; /* only run this once */
		};
		
		// loop through each matched element
		this
		 .not('.MultiFile-applied')
			.addClass('MultiFile-applied')
		.each(function(){
			//#####################################################################
			// MAIN PLUGIN FUNCTIONALITY - START
			//#####################################################################
			
       // BUG 1251 FIX: http://plugins.jquery.com/project/comments/add/1251
       // variable group_count would repeat itself on multiple calls to the plugin.
       // this would cause a conflict with multiple elements
       // changes scope of variable to global so id will be unique over n calls
       window.MultiFile = (window.MultiFile || 0) + 1;
       var group_count = window.MultiFile;
       
       // Copy parent attributes - Thanks to Jonas Wagner
       // we will use this one to create new input elements
       var MultiFile = {e:this, E:$(this), clone:$(this).clone()};
       
       //===
       
       //# USE CONFIGURATION
       if(typeof options=='number') options = {max:options};
       var o = $.extend({},
        $.fn.MultiFile.options,
        options || {},
   					($.metadata? MultiFile.E.metadata(): ($.meta?MultiFile.E.data():null)) || {}, /* metadata options */
								{} /* internals */
       );
       // limit number of files that can be selected?
       if(!(o.max>0) /*IsNull(MultiFile.max)*/){
        o.max = MultiFile.E.attr('maxlength');
        if(!(o.max>0) /*IsNull(MultiFile.max)*/){
         o.max = (String(MultiFile.e.className.match(/\b(max|limit)\-([0-9]+)\b/gi) || ['']).match(/[0-9]+/gi) || [''])[0];
         if(!(o.max>0)) o.max = -1;
         else           o.max = String(o.max).match(/[0-9]+/gi)[0];
        }
       };
       o.max = new Number(o.max);
       // limit extensions?
       o.accept = o.accept || MultiFile.E.attr('accept') || '';
       if(!o.accept){
        o.accept = (MultiFile.e.className.match(/\b(accept\-[\w\|]+)\b/gi)) || '';
        o.accept = new String(o.accept).replace(/^(accept|ext)\-/i,'');
       };
       
       //===
       
       // APPLY CONFIGURATION
							$.extend(MultiFile, o || {});
       MultiFile.STRING = $.extend({},$.fn.MultiFile.options.STRING,MultiFile.STRING);
       
       //===
       
       //#########################################
       // PRIVATE PROPERTIES/METHODS
       $.extend(MultiFile, {
        n: 0, // How many elements are currently selected?
        slaves: [], files: [],
        instanceKey: MultiFile.e.id || 'MultiFile'+String(group_count), // Instance Key?
        generateID: function(z){ return MultiFile.instanceKey + (z>0 ?'_F'+String(z):''); },
        trigger: function(event, element){
         var handler = MultiFile[event], value = $(element).attr('value');
         if(handler){
          var returnValue = handler(element, value, MultiFile);
          if( returnValue!=null ) return returnValue;
         }
         return true;
        }
       });
       
       //===
       
       // Setup dynamic regular expression for extension validation
       // - thanks to John-Paul Bader: http://smyck.de/2006/08/11/javascript-dynamic-regular-expresions/
       if(String(MultiFile.accept).length>1){
								MultiFile.accept = MultiFile.accept.replace(/\W+/g,'|').replace(/^\W|\W$/g,'');
        MultiFile.rxAccept = new RegExp('\\.('+(MultiFile.accept?MultiFile.accept:'')+')$','gi');
       };
       
       //===
       
       // Create wrapper to hold our file list
       MultiFile.wrapID = MultiFile.instanceKey+'_wrap'; // Wrapper ID?
       MultiFile.E.wrap('<div class="MultiFile-wrap" id="'+MultiFile.wrapID+'"></div>');
       MultiFile.wrapper = $('#'+MultiFile.wrapID+'');
       
       //===
       
       // MultiFile MUST have a name - default: file1[], file2[], file3[]
       MultiFile.e.name = MultiFile.e.name || 'file'+ group_count +'[]';
       
       //===
       
							if(!MultiFile.list){
								// Create a wrapper for the list
								// * OPERA BUG: NO_MODIFICATION_ALLOWED_ERR ('list' is a read-only property)
								// this change allows us to keep the files in the order they were selected
								MultiFile.wrapper.append( '<div class="MultiFile-list" id="'+MultiFile.wrapID+'_list"></div>' );
								MultiFile.list = $('#'+MultiFile.wrapID+'_list');
							};
       MultiFile.list = $(MultiFile.list);
							
       //===
       
       // Bind a new element
       MultiFile.addSlave = function( slave, slave_count ){
								//if(window.console) console.log('MultiFile.addSlave',slave_count);
								
        // Keep track of how many elements have been displayed
        MultiFile.n++;
        // Add reference to master element
        slave.MultiFile = MultiFile;
								
								// BUG FIX: http://plugins.jquery.com/node/1495
								// Clear identifying properties from clones
								if(slave_count>0) slave.id = slave.name = '';
								
        // Define element's ID and name (upload components need this!)
        //slave.id = slave.id || MultiFile.generateID(slave_count);
								if(slave_count>0) slave.id = MultiFile.generateID(slave_count);
								//FIX for: http://code.google.com/p/jquery-multifile-plugin/issues/detail?id=23
        
        // 2008-Apr-29: New customizable naming convention (see url below)
        // http://groups.google.com/group/jquery-dev/browse_frm/thread/765c73e41b34f924#
        slave.name = String(MultiFile.namePattern
         /*master name*/.replace(/\$name/gi,$(MultiFile.clone).attr('name'))
         /*master id  */.replace(/\$id/gi,  $(MultiFile.clone).attr('id'))
         /*group count*/.replace(/\$g/gi,   group_count)//(group_count>0?group_count:''))
         /*slave count*/.replace(/\$i/gi,   slave_count)//(slave_count>0?slave_count:''))
        );
        
        // If we've reached maximum number, disable input slave
        if( (MultiFile.max > 0) && ((MultiFile.n-1) > (MultiFile.max)) )//{ // MultiFile.n Starts at 1, so subtract 1 to find true count
         slave.disabled = true;
        //};
        
        // Remember most recent slave
        MultiFile.current = MultiFile.slaves[slave_count] = slave;
        
								// We'll use jQuery from now on
								slave = $(slave);
        
        // Clear value
        slave.val('').attr('value','')[0].value = '';
        
								// Stop plugin initializing on slaves
								slave.addClass('MultiFile-applied');
								
        // Triggered when a file is selected
        slave.change(function(){
          //if(window.console) console.log('MultiFile.slave.change',slave_count);
 								 
          // Lose focus to stop IE7 firing onchange again
          $(this).blur();
          
          //# Trigger Event! onFileSelect
          if(!MultiFile.trigger('onFileSelect', this, MultiFile)) return false;
          //# End Event!
          
          //# Retrive value of selected file from element
          var ERROR = '', v = String(this.value || ''/*.attr('value)*/);
          
          // check extension
          if(MultiFile.accept && v && !v.match(MultiFile.rxAccept))//{
            ERROR = MultiFile.STRING.denied.replace('$ext', String(v.match(/\.\w{1,4}$/gi)));
           //}
          //};
          
          // Disallow duplicates
										for(var f in MultiFile.slaves)//{
           if(MultiFile.slaves[f] && MultiFile.slaves[f]!=this)//{
  										//console.log(MultiFile.slaves[f],MultiFile.slaves[f].value);
            if(MultiFile.slaves[f].value==v)//{
             ERROR = MultiFile.STRING.duplicate.replace('$file', v.match(/[^\/\\]+$/gi));
            //};
           //};
          //};
          
          // Create a new file input element
          var newEle = $(MultiFile.clone).clone();// Copy parent attributes - Thanks to Jonas Wagner
          //# Let's remember which input we've generated so
          // we can disable the empty ones before submission
          // See: http://plugins.jquery.com/node/1495
          newEle.addClass('MultiFile');
          
          // Handle error
          if(ERROR!=''){
            // Handle error
            MultiFile.error(ERROR);
												
            // 2007-06-24: BUG FIX - Thanks to Adrian Wróbel <adrian [dot] wrobel [at] gmail.com>
            // Ditch the trouble maker and add a fresh new element
            MultiFile.n--;
            MultiFile.addSlave(newEle[0], slave_count);
            slave.parent().prepend(newEle);
            slave.remove();
            return false;
          };
          
          // Hide this element (NB: display:none is evil!)
          $(this).css({ position:'absolute', top: '-3000px' });
          
          // Add new element to the form
          slave.after(newEle);
          
          // Update list
          MultiFile.addToList( this, slave_count );
          
          // Bind functionality
          MultiFile.addSlave( newEle[0], slave_count+1 );
          
          //# Trigger Event! afterFileSelect
          if(!MultiFile.trigger('afterFileSelect', this, MultiFile)) return false;
          //# End Event!
          
        }); // slave.change()
								
								// Save control to element
								$(slave).data('MultiFile', MultiFile);
								
       };// MultiFile.addSlave
       // Bind a new element
       
       // Add a new file to the list
       MultiFile.addToList = function( slave, slave_count ){
        //if(window.console) console.log('MultiFile.addToList',slave_count);
								
        //# Trigger Event! onFileAppend
        if(!MultiFile.trigger('onFileAppend', slave, MultiFile)) return false;
        //# End Event!

        // Create label elements
        var v = String(slave.value || ''/*.attr('value)*/);
		var r = $('<div class="MultiFile-file"></div>');
		var b = $('<a class="MultiFile-remove" href="#'+MultiFile.wrapID+'">'+MultiFile.STRING.remove+'<span class="MultiFile-title" title="'+MultiFile.STRING.selected.replace('$file', v)+'">'+MultiFile.STRING.file.replace('$file', v.match(/[^\/\\]+$/gi)[0])+'</span></a>');
        
        // Insert label
        MultiFile.list.append(r.append(b));

        b
								.click(function(){
         
          //# Trigger Event! onFileRemove
          if(!MultiFile.trigger('onFileRemove', slave, MultiFile)) return false;
          //# End Event!
          
          MultiFile.n--;
          MultiFile.current.disabled = false;
          
          // Remove element, remove label, point to current
										MultiFile.slaves[slave_count] = null;
										$(slave).remove();
										$(this).parent().remove();
										
          // Show most current element again (move into view) and clear selection
          $(MultiFile.current).css({ position:'', top: '' });
										$(MultiFile.current).reset().val('').attr('value', '')[0].value = '';
          
          //# Trigger Event! afterFileRemove
          if(!MultiFile.trigger('afterFileRemove', slave, MultiFile)) return false;
          //# End Event!
										
          return false;
        });
        
        //# Trigger Event! afterFileAppend
        if(!MultiFile.trigger('afterFileAppend', slave, MultiFile)) return false;
        //# End Event!
        
       }; // MultiFile.addToList
       // Add element to selected files list
       
       
       
       // Bind functionality to the first element
       if(!MultiFile.MultiFile) MultiFile.addSlave(MultiFile.e, 0);
       
       // Increment control count
       //MultiFile.I++; // using window.MultiFile
       MultiFile.n++;
							
							// Save control to element
							MultiFile.E.data('MultiFile', MultiFile);
							

			//#####################################################################
			// MAIN PLUGIN FUNCTIONALITY - END
			//#####################################################################
		}); // each element
	};
	
	/*--------------------------------------------------------*/
	
	/*
		### Core functionality and API ###
	*/
	$.extend($.fn.MultiFile, {
  /**
   * @name reset
   * @type jQuery
   * @cat Plugins/MultiFile
   * @author Diego A. (http://www.fyneworks.com/)
   */
  reset: function(){
			var settings = $(this).data('MultiFile');
			//if(settings) settings.wrapper.find('a.MultiFile-remove').click();
			if(settings) settings.list.find('a.MultiFile-remove').click();
   return $(this);
  },
  
  
  /**
   * @name disableEmpty
   * @type jQuery
   * @cat Plugins/MultiFile
   * @author Diego A. (http://www.fyneworks.com/)
   */
  disableEmpty: function(klass){ klass = (typeof(klass)=='string'?klass:'')||'mfD';
   var o = [];
   $('input:file.MultiFile').each(function(){ if($(this).val()=='') o[o.length] = this; });
   return $(o).each(function(){ this.disabled = true }).addClass(klass);
  },
  
  
		/**
			* This method re-enables 'empty' file elements that were disabled (and marked) with the $.fn.MultiFile.disableEmpty method.
			*
			* Returns a jQuery collection of all affected elements.
			*
			* @name reEnableEmpty
			* @type jQuery
			* @cat Plugins/MultiFile
			* @author Diego A. (http://www.fyneworks.com/)
			*
			* @example $.fn.MultiFile.reEnableEmpty();
			* @param String klass (optional) A string specifying the class that was used to mark affected elements - Default: 'mfD'.
			*/
  reEnableEmpty: function(klass){ klass = (typeof(klass)=='string'?klass:'')||'mfD';
   return $('input:file.'+klass).removeClass(klass).each(function(){ this.disabled = false });
  },
  
  
		/**
			* This method will intercept other jQuery plugins and disable empty file input elements prior to form submission
			*
	
			* @name intercept
			* @cat Plugins/MultiFile
			* @author Diego A. (http://www.fyneworks.com/)
			*
			* @example $.fn.MultiFile.intercept();
			* @param Array methods (optional) Array of method names to be intercepted
			*/
  intercepted: {},
  intercept: function(methods, context, args){
   var method, value; args = args || [];
   if(args.constructor.toString().indexOf("Array")<0) args = [ args ];
   if(typeof(methods)=='function'){
    $.fn.MultiFile.disableEmpty();
    value = methods.apply(context || window, args);
				//SEE-http://code.google.com/p/jquery-multifile-plugin/issues/detail?id=27
				setTimeout(function(){ $.fn.MultiFile.reEnableEmpty() },1000);
    return value;
   };
   if(methods.constructor.toString().indexOf("Array")<0) methods = [methods];
   for(var i=0;i<methods.length;i++){
    method = methods[i]+''; // make sure that we have a STRING
    if(method) (function(method){ // make sure that method is ISOLATED for the interception
     $.fn.MultiFile.intercepted[method] = $.fn[method] || function(){};
     $.fn[method] = function(){
      $.fn.MultiFile.disableEmpty();
      value = $.fn.MultiFile.intercepted[method].apply(this, arguments);
						//SEE-http://code.google.com/p/jquery-multifile-plugin/issues/detail?id=27
      setTimeout(function(){ $.fn.MultiFile.reEnableEmpty() },1000);
      return value;
     }; // interception
    })(method); // MAKE SURE THAT method IS ISOLATED for the interception
   };// for each method
  }
 });
	
	/*--------------------------------------------------------*/
	
	/*
		### Default Settings ###
		eg.: You can override default control like this:
		$.fn.MultiFile.options.accept = 'gif|jpg';
	*/
	$.fn.MultiFile.options = { //$.extend($.fn.MultiFile, { options: {
		accept: '', // accepted file extensions
		max: -1,    // maximum number of selectable files
		
		// name to use for newly created elements
		namePattern: '$name', // same name by default (which creates an array)
		
		// STRING: collection lets you show messages in different languages
		STRING: {
			remove:'<span class="delete ico">&nbsp;</span>',
			denied:'You cannot select a $ext file.\nTry again...',
			file:'$file',
			selected:'File selected: $file',
			duplicate:'This file has already been selected:\n$file'
		},
		
		// name of methods that should be automcatically intercepted so the plugin can disable
		// extra file elements that are empty before execution and automatically re-enable them afterwards
  autoIntercept: [ 'submit', 'ajaxSubmit', 'ajaxForm', 'validate' /* array of methods to intercept */ ],
		
		// error handling function
		error: function(s){
			/*
			ERROR! blockUI is not currently working in IE
			if($.blockUI){
				$.blockUI({
					message: s.replace(/\n/gi,'<br/>'),
					css: { 
						border:'none', padding:'15px', size:'12.0pt',
						backgroundColor:'#900', color:'#fff',
						opacity:'.8','-webkit-border-radius': '10px','-moz-border-radius': '10px'
					}
				});
				window.setTimeout($.unblockUI, 2000);
			}
			else//{// save a byte!
			*/
			 alert(s);
			//}// save a byte!
		}
 }; //} });
	
	/*--------------------------------------------------------*/
	
	/*
		### Additional Methods ###
		Required functionality outside the plugin's scope
	*/
	
	// Native input reset method - because this alone doesn't always work: $(element).val('').attr('value', '')[0].value = '';
	$.fn.reset = function(){ return this.each(function(){ try{ this.reset(); }catch(e){} }); };
	
	/*--------------------------------------------------------*/
	
	/*
		### Default implementation ###
		The plugin will attach itself to file inputs
		with the class 'multi' when the page loads
	*/
	$(function(){
  //$("input:file.multi").MultiFile();
  $("input[type=file].multi").MultiFile();
 });
	
	
	
/*# AVOID COLLISIONS #*/
})(jQuery);
/*# AVOID COLLISIONS #*/

/*
 * jQuery validation plug-in 1.5.5
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.validate.js 6403 2009-06-17 14:27:16Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}
		
		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator); 
		
		if ( validator.settings.onsubmit ) {
		
			// allow suppresing validation by adding a cancel class to the submit button
			this.find("input, button").filter(".cancel").click(function() {
				validator.cancelSubmit = true;
			});
			
			// when a submitHandler is used, capture the submitting button
			if (validator.settings.submitHandler) {
				this.find("input, button").filter(":submit").click(function() {
					validator.submitButton = this;
				});
			}
		
			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();
					
				function handle() {
					if ( validator.settings.submitHandler ) {
						if (validator.submitButton) {
							// insert a hidden input as a replacement for the missing submit button
							var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm );
						if (validator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}
					
				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}
		
		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
				valid &= validator.element(this);
            });
            return valid;
        }
    },
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];
		
		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages)
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}
		
		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);
		
		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}
		
		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim(a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim(a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function(source, params) {
	if ( arguments.length == 1 ) 
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.validator, {
	
	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: [],
		ignoreTitle: false,
		onfocusin: function(element) {
			this.lastActive = element;
				
			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				this.errorsFor(element).hide();
			}
		},
		onfocusout: function(element) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		onchange: function(element) {
		    if (element.name in this.submitted || element == this.lastElement) {
		        this.element(element);
		    }
		},
		onclick: function(element) {
			if ( element.name in this.submitted )
				this.element(element);
		},
		highlight: function( element, errorClass, validClass ) {
			$(element).addClass(errorClass).removeClass(validClass);
		},
		unhighlight: function( element, errorClass, validClass ) {
			$(element).removeClass(errorClass).addClass(validClass);
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		dateDE: "Bitte geben Sie ein gültiges Datum ein.",
		number: "Please enter a valid number.",
		numberDE: "Bitte geben Sie eine Nummer ein.",
		digits: "Please enter only digits",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},
	
	autoCreateRanges: false,
	
	prototype: {
		
		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();
			
			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.validator.normalizeRule(value);
			});
			
			function delegate(event) {
				var validator = $.data(this[0].form, "validator");
				validator.settings["on" + event.type] && validator.settings["on" + event.type].call(validator, this[0] );
			}
			$(this.currentForm)
				.delegate("focusin focusout keyup change", ":text, :password, :file, select, textarea", delegate)
				.delegate("click", ":radio, :checkbox", delegate);

			if (this.settings.invalidHandler)
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid())
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			this.showErrors();
			return this.valid();
		},
		
		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid(); 
		},
		
		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.clean( element );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element );
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},
		
		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm )
				$( this.currentForm ).resetForm();
			this.submitted = {};
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass );
		},
		
		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},
		
		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj )
				count++;
			return count;
		},
		
		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},
		
		valid: function() {
			return this.size() == 0;
		},
		
		size: function() {
			return this.errorList.length;
		},
		
		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus();
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},
		
		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},
		
		elements: function() {
			var validator = this,
				rulesCache = {};
			
			// select all valid inputs inside the form (no submit or reset buttons)
			// workaround $Query([]).add until http://dev.jquery.com/ticket/2114 is solved
			return $([]).add(this.currentForm.elements)
			.filter(":input")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);
			
				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
					return false;
				
				rulesCache[this.name] = true;
				return true;
			});
		},
		
		clean: function( selector ) {
			return $( selector )[0];
		},
		
		errors: function() {
			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},
		
		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.formSubmitted = false;
			this.currentElements = $([]);
		},
		
		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},
		
		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},
	
		check: function( element ) {
			element = this.clean( element );
			
			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name )[0];
			}
			
			var rules = $(element).rules();
			var dependencyMismatch = false;
			for( method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {
					var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );
					
					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result == "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;
					
					if ( result == "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}
					
					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method");
					throw e;
				}
			}
			if (dependencyMismatch)
				return;
			if ( this.objectLength(rules) )
				this.successList.push(element);
			return true;
		},
		
		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata)
				return;
			
			var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();
			
			return meta && meta.messages && meta.messages[method];
		},
		
		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},
		
		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},
		
		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},
		
		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method );
			if ( typeof message == "function" ) 
				message = message.call(this, rule.parameters, element);
			this.errorList.push({
				message: message,
				element: element
			});
			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},
		
		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			return toToggle;
		},
		
		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},
		
		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},
		
		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},
		
		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass().addClass( this.settings.errorClass );
			
				// check if we have a generated label, replace the message then
				label.attr("generated") && label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(label, $(element) )
						: label.insertAfter(element);
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.addClass( this.settings.success )
					: this.settings.success( label );
			}
			this.toShow = this.toShow.add(label);
		},
		
		errorsFor: function(element) {
			return this.errors().filter("[for='" + this.idOrName(element) + "']");
		},
		
		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},
		
		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element.name == name && element  || null;
			});
		},
		
		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},
	
		depend: function(param, element) {
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},
	
		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},
		
		optional: function(element) {
			return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
		},
		
		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},
		
		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0)
				this.pendingRequest = 0;
			delete this.pending[element.name];
			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
			} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
		},
		
		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", previous = {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}
		
	},
	
	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		dateDE: {dateDE: true},
		number: {number: true},
		numberDE: {numberDE: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},
	
	addClassRules: function(className, rules) {
		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},
	
	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		classes && $.each(classes.split(' '), function() {
			if (this in $.validator.classRuleSettings) {
				$.extend(rules, $.validator.classRuleSettings[this]);
			}
		});
		return rules;
	},
	
	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);
		
		for (method in $.validator.methods) {
			var value = $element.attr(method);
			if (value) {
				rules[method] = value;
			}
		}
		
		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}
		
		return rules;
	},
	
	metadataRules: function(element) {
		if (!$.metadata) return {};
		
		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},
	
	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},
	
	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});
		
		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});
		
		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});
		
		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}
		
		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages
		}
		
		return rules;
	},
	
	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},
	
	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message || $.validator.messages[name];
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				var options = $("option:selected", element);
				return options.length > 0 && ( element.type == "select-multiple" || ($.browser.msie && !(options[0].attributes['value'].specified) ? options[0].text : options[0].value).length > 0);
			case 'input':
				if ( this.checkable(element) )
					return this.getLength(value, element) > 0;
			default:
				return $.trim(value).length > 0;
			}
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return "dependency-mismatch";
			
			var previous = this.previousValue(element);
			
			if (!this.settings.messages[element.name] )
				this.settings.messages[element.name] = {};
			this.settings.messages[element.name].remote = typeof previous.message == "function" ? previous.message(value) : previous.message;
			
			param = typeof param == "string" && {url:param} || param; 
			
			if ( previous.old !== value ) {
				previous.old = value;
				var validator = this;
				this.startRequest(element);
				var data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					url: param,
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					success: function(response) {
						var valid = response === true;
						if ( valid ) {
							var submitted = validator.formSubmitted;
							validator.prepareElement(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							validator.showErrors();
						} else {
							var errors = {};
							errors[element.name] = previous.message = response || validator.defaultMessage( element, "remote" );
							validator.showErrors(errors);
						}
						previous.valid = valid;
						validator.stopRequest(element, valid);
					}
				}, param));
				return "pending";
			} else if( this.pending[element.name] ) {
				return "pending";
			}
			return previous.valid;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) >= param;
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) <= param;
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},
        
		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/dateDE
		dateDE: function(value, element) {
			return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},
	
		// http://docs.jquery.com/Plugins/Validation/Methods/numberDE
		numberDE: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function(value, element) {
			if ( this.optional(element) )
				return "dependency-mismatch";
			// accept only digits and dashes
			if (/[^0-9-]+/.test(value))
				return false;
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				var nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) == 0;
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i")); 
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			return value == $(param).val();
		}
		
	}
	
});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

})(jQuery);

//datecompare validation
jQuery.validator.addMethod("afterDate", function(value, element, params) {

	if (!/Invalid|NaN/.test(new Date(value))) {
		return new Date(value) > new Date($(params).val());
	}
	return isNaN(value) && isNaN($(params).val()) || (parseFloat(value) > parseFloat($(params).val())); 
},'Date must be after {0}.');

//validation methods for forms
jQuery.validator.addMethod("maxWords", function(value, element, params) { 
    return this.optional(element) || value.match(/\b\w+\b/g).length < params; 
}, jQuery.validator.format("Please enter {0} words or less.")); 
 
jQuery.validator.addMethod("minWords", function(value, element, params) { 
    return this.optional(element) || value.match(/\b\w+\b/g).length >= params; 
}, jQuery.validator.format("Please enter at least {0} words.")); 
 
jQuery.validator.addMethod("rangeWords", function(value, element, params) { 
    return this.optional(element) || value.match(/\b\w+\b/g).length >= params[0] && value.match(/bw+b/g).length < params[1]; 
}, jQuery.validator.format("Please enter between {0} and {1} words."));


jQuery.validator.addMethod("letterswithbasicpunc", function(value, element) {
	return this.optional(element) || /^[a-z-.,()'\"\s]+$/i.test(value);
}, "Letters or punctuation only please");  

jQuery.validator.addMethod("alphanumeric", function(value, element) {
	return this.optional(element) || /^\w+$/i.test(value);
}, "Letters, numbers, spaces or underscores only please");  

jQuery.validator.addMethod("lettersonly", function(value, element) {
	return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please"); 

jQuery.validator.addMethod("nowhitespace", function(value, element) {
	return this.optional(element) || /^\S+$/i.test(value);
}, "No white space please"); 

jQuery.validator.addMethod("ziprange", function(value, element) {
	return this.optional(element) || /^90[2-5]\d\{2}-\d{4}$/.test(value);
}, "Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx");

/**
* Return true, if the value is a valid vehicle identification number (VIN).
*
* Works with all kind of text inputs.
*
* @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
* @desc Declares a required input element whose value must be a valid vehicle identification number.
*
* @name jQuery.validator.methods.vinUS
* @type Boolean
* @cat Plugins/Validate/Methods
*/ 
jQuery.validator.addMethod(
	"vinUS",
	function(v){
		if (v.length != 17)
			return false;
		var i, n, d, f, cd, cdv;
		var LL    = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","U","V","W","X","Y","Z"];
		var VL    = [1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9];
		var FL    = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
		var rs    = 0;
		for(i = 0; i < 17; i++){
		    f = FL[i];
		    d = v.slice(i,i+1);
		    if(i == 8){
		        cdv = d;
		    }
		    if(!isNaN(d)){
		        d *= f;
		    }
		    else{
		        for(n = 0; n < LL.length; n++){
		            if(d.toUpperCase() === LL[n]){
		                d = VL[n];
		                d *= f;
		                if(isNaN(cdv) && n == 8){
		                    cdv = LL[n];
		                }
		                break;
		            }
		        }
		    }
		    rs += d;
		}
		cd = rs % 11;
		if(cd == 10){cd = "X";}
		if(cd == cdv){return true;}
		return false; 
	},
	"The specified vehicle identification number (VIN) is invalid."
);

/**
  * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
  *
  * @example jQuery.validator.methods.date("01/01/1900")
  * @result true
  *
  * @example jQuery.validator.methods.date("01/13/1990")
  * @result false
  *
  * @example jQuery.validator.methods.date("01.01.1900")
  * @result false
  *
  * @example <input name="pippo" class="{dateITA:true}" />
  * @desc Declares an optional input element whose value must be a valid date.
  *
  * @name jQuery.validator.methods.dateITA
  * @type Boolean
  * @cat Plugins/Validate/Methods
  */
jQuery.validator.addMethod(
	"dateITA",
	function(value, element) {
		var check = false;
		var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/
		if( re.test(value)){
			var adata = value.split('/');
			var gg = parseInt(adata[0],10);
			var mm = parseInt(adata[1],10);
			var aaaa = parseInt(adata[2],10);
			var xdata = new Date(aaaa,mm-1,gg);
			if ( ( xdata.getFullYear() == aaaa ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == gg ) )
				check = true;
			else
				check = false;
		} else
			check = false;
		return this.optional(element) || check;
	}, 
	"Please enter a correct date"
);

jQuery.validator.addMethod("dateNL", function(value, element) {
		return this.optional(element) || /^\d\d?[\.\/-]\d\d?[\.\/-]\d\d\d?\d?$/.test(value);
	}, "Vul hier een geldige datum in."
);

jQuery.validator.addMethod("time", function(value, element) {
		return this.optional(element) || /^([01][0-9])|(2[0123]):([0-5])([0-9])$/.test(value);
	}, "Please enter a valid time, between 00:00 and 23:59"
);

/**
 * matches US phone number format 
 * 
 * where the area code may not start with 1 and the prefix may not start with 1 
 * allows '-' or ' ' as a separator and allows parens around area code 
 * some people may want to put a '1' in front of their number 
 * 
 * 1(212)-999-2345
 * or
 * 212 999 2344
 * or
 * 212-999-0983
 * 
 * but not
 * 111-123-5434
 * and not
 * 212 123 4567
 */
jQuery.validator.addMethod("phone", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, ""); 
	return this.optional(element) || phone_number.length > 9 &&
		phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
}, "Invalid phone number");

// TODO check if value starts with <, otherwise don't try stripping anything
jQuery.validator.addMethod("strippedminlength", function(value, element, param) {
	return jQuery(value).text().length >= param;
}, jQuery.validator.format("Please enter at least {0} characters"));

// same as email, but TLD is optional
jQuery.validator.addMethod("email2", function(value, element, param) {
	return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value); 
}, jQuery.validator.messages.email);

// same as url, but TLD is optional
jQuery.validator.addMethod("url2", function(value, element, param) {
	return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value); 
}, jQuery.validator.messages.url);

// NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
// Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
// Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
jQuery.validator.addMethod("creditcardtypes", function(value, element, param) {

	if (/[^0-9-]+/.test(value)) 
		return false;
	
	value = value.replace(/\D/g, "");
	
	var validTypes = 0x0000;
	
	if (param.mastercard) 
		validTypes |= 0x0001;
	if (param.visa) 
		validTypes |= 0x0002;
	if (param.amex) 
		validTypes |= 0x0004;
	if (param.dinersclub) 
		validTypes |= 0x0008;
	if (param.enroute) 
		validTypes |= 0x0010;
	if (param.discover) 
		validTypes |= 0x0020;
	if (param.jcb) 
		validTypes |= 0x0040;
	if (param.unknown) 
		validTypes |= 0x0080;
	if (param.all) 
		validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;
	
	if (validTypes & 0x0001 && /^(51|52|53|54|55)/.test(value)) { //mastercard
		return value.length == 16;
	}
	if (validTypes & 0x0002 && /^(4)/.test(value)) { //visa
		return value.length == 16;
	}
	if (validTypes & 0x0004 && /^(34|37)/.test(value)) { //amex
		return value.length == 15;
	}
	if (validTypes & 0x0008 && /^(300|301|302|303|304|305|36|38)/.test(value)) { //dinersclub
		return value.length == 14;
	}
	if (validTypes & 0x0010 && /^(2014|2149)/.test(value)) { //enroute
		return value.length == 15;
	}
	if (validTypes & 0x0020 && /^(6011)/.test(value)) { //discover
		return value.length == 16;
	}
	if (validTypes & 0x0040 && /^(3)/.test(value)) { //jcb
		return value.length == 16;
	}
	if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) { //jcb
		return value.length == 15;
	}
	if (validTypes & 0x0080) { //unknown
		return true;
	}
	return false;
}, "Please enter a valid credit card number.");

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort() 
;(function($) {
	var ajax = $.ajax;
	var pendingRequests = {};
	$.ajax = function(settings) {
		// create settings for compatibility with ajaxSetup
		settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
		var port = settings.port;
		if (settings.mode == "abort") {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			return (pendingRequests[port] = ajax.apply(this, arguments));
		}
		return ajax.apply(this, arguments);
	};
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target 

// provides triggerEvent(type: String, target: Element) to trigger delegated events
;(function($) {
	$.each({
		focus: 'focusin',
		blur: 'focusout'	
	}, function( original, fix ){
		$.event.special[fix] = {
			setup:function() {
				if ( $.browser.msie ) return false;
				this.addEventListener( original, $.event.special[fix].handler, true );
			},
			teardown:function() {
				if ( $.browser.msie ) return false;
				this.removeEventListener( original,
				$.event.special[fix].handler, true );
			},
			handler: function(e) {
				arguments[0] = $.event.fix(e);
				arguments[0].type = fix;
				return $.event.handle.apply(this, arguments);
			}
		};
	});
	$.extend($.fn, {
		delegate: function(type, delegate, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		},
		triggerEvent: function(type, target) {
			return this.triggerHandler(type, [$.event.fix({ type: type, target: target })]);
		}
	})
})(jQuery);


/*�örn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.MetaData.js 16 2009-05-12 11:20:56Z diego.alto $
 *
 */

(function($) {

$.extend({
	metadata : {
		defaults : {
			type: 'class',
			name: 'metadata',
			cre: /({.*})/,
			single: 'metadata'
		},
		setType: function( type, name ){
			this.defaults.type = type;
			this.defaults.name = name;
		},
		get: function( elem, opts ){
			var settings = $.extend({},this.defaults,opts);
			// check for empty string in single property
			if ( !settings.single.length ) settings.single = 'metadata';
			
			var data = $.data(elem, settings.single);
			// returned cached data if it already exists
			if ( data ) return data;
			
			data = "{}";
			
			if ( settings.type == "class" ) {
				var m = settings.cre.exec( elem.className );
				if ( m )
					data = m[1];
			} else if ( settings.type == "elem" ) {
				if( !elem.getElementsByTagName )
					return undefined;
				var e = elem.getElementsByTagName(settings.name);
				if ( e.length )
					data = $.trim(e[0].innerHTML);
			} else if ( elem.getAttribute != undefined ) {
				var attr = elem.getAttribute( settings.name );
				if ( attr )
					data = attr;
			}
			
			if ( data.indexOf( '{' ) <0 )
			data = "{" + data + "}";
			
			data = eval("(" + data + ")");
			
			$.data( elem, settings.single, data );
			return data;
		}
	}
});

/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
	return $.metadata.get( this[0], opts );
};

})(jQuery);

/*
 * jQuery Form Plugin
 * version: 2.40 (26-FEB-2010)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/*
	Usage Note:
	-----------
	Do not use both ajaxSubmit and ajaxForm on the same form.  These
	functions are intended to be exclusive.  Use ajaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
		$('#myForm').bind('submit', function() {
			$(this).ajaxSubmit({
				target: '#output'
			});
			return false; // <-- important!
		});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
		$('#myForm').ajaxForm({
			target: '#output'
		});
	});

	When using ajaxForm, the ajaxSubmit function will be invoked for you
	at the appropriate time.
*/

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
	// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
	if (!this.length) {
		log('ajaxSubmit: skipping submit process - no element selected');
		return this;
	}

	if (typeof options == 'function')
		options = { success: options };

	var url = $.trim(this.attr('action'));
	if (url) {
		// clean url (don't include hash vaue)
		url = (url.match(/^([^#]+)/)||[])[1];
   	}
   	url = url || window.location.href || '';

	options = $.extend({
		url:  url,
		type: this.attr('method') || 'GET',
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
	}, options || {});

	// hook for manipulating the form data before it is extracted;
	// convenient for use with rich editors like tinyMCE or FCKEditor
	var veto = {};
	this.trigger('form-pre-serialize', [this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
		return this;
	}

	// provide opportunity to alter form data before it is serialized
	if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSerialize callback');
		return this;
	}

	var a = this.formToArray(options.semantic);
	if (options.data) {
		options.extraData = options.data;
		for (var n in options.data) {
		  if(options.data[n] instanceof Array) {
			for (var k in options.data[n])
			  a.push( { name: n, value: options.data[n][k] } );
		  }
		  else
			 a.push( { name: n, value: options.data[n] } );
		}
	}

	// give pre-submit callback an opportunity to abort the submit
	if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
		log('ajaxSubmit: submit aborted via beforeSubmit callback');
		return this;
	}

	// fire vetoable 'validate' event
	this.trigger('form-submit-validate', [a, this, options, veto]);
	if (veto.veto) {
		log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
		return this;
	}

	var q = $.param(a);

	if (options.type.toUpperCase() == 'GET') {
		options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
		options.data = null;  // data is null for 'get'
	}
	else
		options.data = q; // data is the query string for 'post'

	var $form = this, callbacks = [];
	if (options.resetForm) callbacks.push(function() { $form.resetForm(); });
	if (options.clearForm) callbacks.push(function() { $form.clearForm(); });

	// perform a load on the target only if dataType is not provided
	if (!options.dataType && options.target) {
		var oldSuccess = options.success || function(){};
		callbacks.push(function(data) {
			$(options.target).html(data).each(oldSuccess, arguments);
		});
	}
	else if (options.success)
		callbacks.push(options.success);

	options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
		for (var i=0, max=callbacks.length; i < max; i++)
			callbacks[i].apply(options, [data, status, xhr || $form, $form]);
	};

	// are there files to upload?
	var files = $('input:file', this).fieldValue();
	var found = false;
	for (var j=0; j < files.length; j++)
		if (files[j])
			found = true;

	var multipart = false;
//	var mp = 'multipart/form-data';
//	multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

	// options.iframe allows user to force iframe mode
	// 06-NOV-09: now defaulting to iframe mode if file input is detected
   if ((files.length && options.iframe !== false) || options.iframe || found || multipart) {
	   // hack to fix Safari hang (thanks to Tim Molendijk for this)
	   // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
	   if (options.closeKeepAlive)
		   $.get(options.closeKeepAlive, fileUpload);
	   else
		   fileUpload();
	   }
   else
	   $.ajax(options);

	// fire 'notify' event
	this.trigger('form-submit-notify', [this, options]);
	return this;


	// private function for handling file uploads (hat tip to YAHOO!)
	function fileUpload() {
		var form = $form[0];

		if ($(':input[name=submit]', form).length) {
			alert('Error: Form elements must not be named "submit".');
			return;
		}

		var opts = $.extend({}, $.ajaxSettings, options);
		var s = $.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);

		var id = 'jqFormIO' + (new Date().getTime());
		var $io = $('<iframe id="' + id + '" name="' + id + '" src="'+ opts.iframeSrc +'" onload="(jQuery(this).data(\'form-plugin-onload\'))()" />');
		var io = $io[0];

		$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

		var xhr = { // mock object
			aborted: 0,
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {},
			abort: function() {
				this.aborted = 1;
				$io.attr('src', opts.iframeSrc); // abort op in progress
			}
		};

		var g = opts.global;
		// trigger ajax global events so that activity/block indicators work like normal
		if (g && ! $.active++) $.event.trigger("ajaxStart");
		if (g) $.event.trigger("ajaxSend", [xhr, opts]);

		if (s.beforeSend && s.beforeSend(xhr, s) === false) {
			s.global && $.active--;
			return;
		}
		if (xhr.aborted)
			return;

		var cbInvoked = false;
		var timedOut = 0;

		// add submitting element to data if we know it
		var sub = form.clk;
		if (sub) {
			var n = sub.name;
			if (n && !sub.disabled) {
				opts.extraData = opts.extraData || {};
				opts.extraData[n] = sub.value;
				if (sub.type == "image") {
					opts.extraData[name+'.x'] = form.clk_x;
					opts.extraData[name+'.y'] = form.clk_y;
				}
			}
		}

		// take a breath so that pending repaints get some cpu time before the upload starts
		function doSubmit() {
			// make sure form attrs are set
			var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (form.getAttribute('method') != 'POST')
				form.setAttribute('method', 'POST');
			if (form.getAttribute('action') != opts.url)
				form.setAttribute('action', opts.url);

			// ie borks in some cases when setting encoding
			if (! opts.skipEncodingOverride) {
				$form.attr({
					encoding: 'multipart/form-data',
					enctype:  'multipart/form-data'
				});
			}

			// support timout
			if (opts.timeout)
				setTimeout(function() { timedOut = true; cb(); }, opts.timeout);

			// add "extra" data to form if provided in options
			var extraInputs = [];
			try {
				if (opts.extraData)
					for (var n in opts.extraData)
						extraInputs.push(
							$('<input type="hidden" name="'+n+'" value="'+opts.extraData[n]+'" />')
								.appendTo(form)[0]);

				// add iframe to doc and submit the form
				$io.appendTo('body');
				$io.data('form-plugin-onload', cb);
				form.submit();
			}
			finally {
				// reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
				t ? form.setAttribute('target', t) : $form.removeAttr('target');
				$(extraInputs).remove();
			}
		};

		if (opts.forceSync)
			doSubmit();
		else
			setTimeout(doSubmit, 10); // this lets dom updates render
	
		var domCheckCount = 100;

		function cb() {
			if (cbInvoked) 
				return;

			var ok = true;
			try {
				if (timedOut) throw 'timeout';
				// extract the server response from the iframe
				var data, doc;

				doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
				
				var isXml = opts.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
				log('isXml='+isXml);
				if (!isXml && (doc.body == null || doc.body.innerHTML == '')) {
				 	if (--domCheckCount) {
						// in some browsers (Opera) the iframe DOM is not always traversable when
						// the onload callback fires, so we loop a bit to accommodate
						setTimeout(cb, 250);
						return;
					}
					log('Could not access iframe DOM after 100 tries.');
					return;
				}

				cbInvoked = true;
				xhr.responseText = doc.body ? doc.body.innerHTML : null;
				xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
				xhr.getResponseHeader = function(header){
					var headers = {'content-type': opts.dataType};
					return headers[header];
				};

				if (opts.dataType == 'json' || opts.dataType == 'script') {
					// see if user embedded response in textarea
					var ta = doc.getElementsByTagName('textarea')[0];
					if (ta)
						xhr.responseText = ta.value;
					else {
						// account for browsers injecting pre around json response
						var pre = doc.getElementsByTagName('pre')[0];
						if (pre)
							xhr.responseText = pre.innerHTML;
					}			  
				}
				else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
					xhr.responseXML = toXml(xhr.responseText);
				}
				data = $.httpData(xhr, opts.dataType);
			}
			catch(e){
				ok = false;
				$.handleError(opts, xhr, 'error', e);
			}

			// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
			if (ok) {
				opts.success(data, 'success');
				if (g) $.event.trigger("ajaxSuccess", [xhr, opts]);
			}
			if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
			if (g && ! --$.active) $.event.trigger("ajaxStop");
			if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

			// clean up
			setTimeout(function() {
				$io.removeData('form-plugin-onload');
				$io.remove();
				xhr.responseXML = null;
			}, 100);
		};

		function toXml(s, doc) {
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
		};
	};
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *	is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *	used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
	return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
		e.preventDefault();
		$(this).ajaxSubmit(options);
	}).bind('click.form-plugin', function(e) {
		var target = e.target;
		var $el = $(target);
		if (!($el.is(":submit,input:image"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest(':submit');
			if (t.length == 0)
				return;
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX != undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
	});
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
	return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
	var a = [];
	if (this.length == 0) return a;

	var form = this[0];
	var els = semantic ? form.getElementsByTagName('*') : form.elements;
	if (!els) return a;
	for(var i=0, max=els.length; i < max; i++) {
		var el = els[i];
		var n = el.name;
		if (!n) continue;

		if (semantic && form.clk && el.type == "image") {
			// handle image inputs on the fly when semantic == true
			if(!el.disabled && form.clk == el) {
				a.push({name: n, value: $(el).val()});
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
			continue;
		}

		var v = $.fieldValue(el, true);
		if (v && v.constructor == Array) {
			for(var j=0, jmax=v.length; j < jmax; j++)
				a.push({name: n, value: v[j]});
		}
		else if (v !== null && typeof v != 'undefined')
			a.push({name: n, value: v});
	}

	if (!semantic && form.clk) {
		// input type=='image' are not found in elements array! handle it here
		var $input = $(form.clk), input = $input[0], n = input.name;
		if (n && !input.disabled && input.type == 'image') {
			a.push({name: n, value: $input.val()});
			a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
		}
	}
	return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
	//hand off to jQuery.param for proper encoding
	return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
	var a = [];
	this.each(function() {
		var n = this.name;
		if (!n) return;
		var v = $.fieldValue(this, successful);
		if (v && v.constructor == Array) {
			for (var i=0,max=v.length; i < max; i++)
				a.push({name: n, value: v[i]});
		}
		else if (v !== null && typeof v != 'undefined')
			a.push({name: this.name, value: v});
	});
	//hand off to jQuery.param for proper encoding
	return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *	  <input name="A" type="text" />
 *	  <input name="A" type="text" />
 *	  <input name="B" type="checkbox" value="B1" />
 *	  <input name="B" type="checkbox" value="B2"/>
 *	  <input name="C" type="radio" value="C1" />
 *	  <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *	   array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
	for (var val=[], i=0, max=this.length; i < max; i++) {
		var el = this[i];
		var v = $.fieldValue(el, successful);
		if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
			continue;
		v.constructor == Array ? $.merge(val, v) : val.push(v);
	}
	return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
	var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
	if (typeof successful == 'undefined') successful = true;

	if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1))
			return null;

	if (tag == 'select') {
		var index = el.selectedIndex;
		if (index < 0) return null;
		var a = [], ops = el.options;
		var one = (t == 'select-one');
		var max = (one ? index+1 : ops.length);
		for(var i=(one ? index : 0); i < max; i++) {
			var op = ops[i];
			if (op.selected) {
				var v = op.value;
				if (!v) // extra pain for IE...
					v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
				if (one) return v;
				a.push(v);
			}
		}
		return a;
	}
	return el.value;
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function() {
	return this.each(function() {
		$('input,select,textarea', this).clearFields();
	});
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function() {
	return this.each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (t == 'text' || t == 'password' || tag == 'textarea')
			this.value = '';
		else if (t == 'checkbox' || t == 'radio')
			this.checked = false;
		else if (tag == 'select')
			this.selectedIndex = -1;
	});
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
	return this.each(function() {
		// guard against an input with the name of 'reset'
		// note that IE reports the reset function as an 'object'
		if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
			this.reset();
	});
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
	if (b == undefined) b = true;
	return this.each(function() {
		this.disabled = !b;
	});
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
	if (select == undefined) select = true;
	return this.each(function() {
		var t = this.type;
		if (t == 'checkbox' || t == 'radio')
			this.checked = select;
		else if (this.tagName.toLowerCase() == 'option') {
			var $sel = $(this).parent('select');
			if (select && $sel[0] && $sel[0].type == 'select-one') {
				// deselect all other options
				$sel.find('option').selected(false);
			}
			this.selected = select;
		}
	});
};

// helper fn for console logging
// set $.fn.ajaxSubmit.debug to true to enable debug logging
function log() {
	if ($.fn.ajaxSubmit.debug && window.console && window.console.log)
		window.console.log('[jquery.form] ' + Array.prototype.join.call(arguments,''));
};

})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2009 M. Alsup
 * Version: 2.72 (09-SEP-2009)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.2.6 or later
 *
 * Originally based on the work of:
 *	1) Matt Oakes
 *	2) Torsten Baldes (http://medienfreunde.com/lab/innerfade/)
 *	3) Benjamin Sterling (http://www.benjaminsterling.com/experiments/jqShuffle/)
 */
;(function($) {

var ver = '2.72';

// if $.support is not defined (pre jQuery 1.3) add what I need
if ($.support == undefined) {
	$.support = {
		opacity: !($.browser.msie)
	};
}

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	if (window.console && window.console.log)
		window.console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
	//$('body').append('<div>'+Array.prototype.join.call(arguments,' ')+'</div>');
};

// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'stop', 'pause', 'resume', or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in conjunction with a options == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();
		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(opts2.currSlide, opts2.nextSlide, opts2, !opts2.rev);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts2.rev)}, startTime);
		}
	});
};

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop == undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'stop':
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			$(cont).removeData('cycle.opts');
			return false;
		case 'pause':
			cont.cyclePause = 1;
			return false;
		case 'resume':
			cont.cyclePause = 0;
			if (arg2 === true) { // resume now!
				options = $(cont).data('cycle.opts');
				if (!options) {
					log('options not found, can not resume');
					return false;
				}
				if (cont.cycleTimeout) {
					clearTimeout(cont.cycleTimeout);
					cont.cycleTimeout = 0;
				}
				go(options.elements, options, 1, 1);
			}
			return false;
		case 'prev':
		case 'next':
			var opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		};
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;
};

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
};

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];
	opts.after.unshift(function(){ opts.busy=0; });

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.rev); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide)
		opts.startingSlide = parseInt(opts.startingSlide);

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		opts.randomIndex = 0;
		opts.startingSlide = opts.randomMap[0];
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z)
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit && opts.width)
		$slides.width(opts.width);
	if (opts.fit && opts.height && opts.height != 'auto')
		$slides.height(opts.height);

	// stretch container
	var reshape = opts.containerResize && !$cont.innerHeight();
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth;
			if (!h) h = e.offsetHeight;
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
	}

	if (opts.pause)
		$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
		this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();

		if ( $el.is('img') ) {
			// sigh..  sniffing, hacking, shrugging...  this crappy hack tries to account for what browsers do when
			// an image is being downloaded and the markup did not include sizing info (height/width attributes);
			// there seems to be some "default" sizes used in this situation
			var loadingIE	= ($.browser.msie  && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
			var loadingFF	= ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
			var loadingOp	= ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
			var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loadingIE || loadingFF || loadingOp || loadingOther) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options)}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	if (opts.cssFirst)
		$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
		if (!opts.sync)
			opts.speed = opts.speed / 2;
		while((opts.timeout - opts.speed) < 250) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		opts.nextSlide = opts.currSlide;
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (opts.before.length)
		opts.before[0].apply(e0, [e0, e0, opts, true]);
	if (opts.after.length > 1)
		opts.after[1].apply(e0, [e0, e0, opts, true]);

	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?-1:1)});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?1:-1)});
	if (opts.pager)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
};

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
};

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (p in txs) {
			tx = txs[p];
			if (txs.hasOwnProperty(p) && $.isFunction(tx))
				opts.fxs.push(p);
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
};

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$slides.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		$(els).stop(true,true);
		opts.busy = false;
	}
	// don't begin another timeout-based transition if there is one active
	if (opts.busy)
		return;

	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	if (manual || !p.cyclePause) {
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length)
				opts.lastFx = 0;
			fx = opts.fxs[opts.lastFx];
			opts.currFx = fx;
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
		};

		if (opts.nextSlide != opts.currSlide) {
			// get ready to perform the transition
			opts.busy = 1;
			if (opts.fxFn) // fx function provided?
				opts.fxFn(curr, next, opts, after, fwd);
			else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
				$.fn.cycle[opts.fx](curr, next, opts, after);
			else
				$.fn.cycle.custom(curr, next, opts, after, manual && opts.fastOnEvent);
		}

		// calculate the next slide
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length)
				opts.randomIndex = 0;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		}
		else { // sequence
			var roll = (opts.nextSlide + 1) == els.length;
			opts.nextSlide = roll ? 0 : opts.nextSlide+1;
			opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
		}

		if (opts.pager)
			$.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
	}

	// stage the next transtion
	var ms = 0;
	if (opts.timeout && !opts.continuous)
		ms = getTimeout(curr, next, opts, fwd);
	else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
		ms = 10;
	if (ms > 0)
		p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.rev) }, ms);
};

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide) {
	$(pager).find('a').removeClass('activeSlide').filter('a:eq('+currSlide+')').addClass('activeSlide');
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn(curr,next,opts,fwd);
		while ((t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
};

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts, opts.rev?-1:1); };
$.fn.cycle.prev = function(opts) { advance(opts, opts.rev?1:-1);};

// advance slide forward or back
function advance(opts, val) {
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	if ($.isFunction(opts.prevNextClick))
		opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, val>=0);
	return false;
};

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
   $.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
};

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder))
		a = opts.pagerAnchorBuilder(i,el);
	else
		a = '<a href="#">'+(i+1)+'</a>';
		
	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	$a.bind(opts.pagerEvent, function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		if ($.isFunction(opts.pagerClick))
			opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
		return false;
	});
	
	if (opts.pagerEvent != 'click')
		$a.click(function(){return false;}); // supress click
	
	if (opts.pauseOnPagerHover)
		$a.hover(function() { opts.$cont[0].cyclePause++; }, function() { opts.$cont[0].cyclePause--; } );
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	function hex(s) {
		s = parseInt(s).toString(16);
		return s.length < 2 ? '0'+s : s;
	};
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	};
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
};

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {$n.animate(opts.animIn, speedIn, easeIn, cb)};
	$l.animate(opts.animOut, speedOut, easeOut, function() {
		if (opts.cssAfter) $l.css(opts.cssAfter);
		if (!opts.sync) fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
	fx:			  'fade', // name of transition effect (or comma separated names, ex: fade,scrollUp,shuffle)
	timeout:	   4000,  // milliseconds between slide transitions (0 to disable auto advance)
	timeoutFn:	 null,  // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
	continuous:	   0,	  // true to start next transition immediately after current one completes
	speed:		   1000,  // speed of the transition (any valid fx speed value)
	speedIn:	   null,  // speed of the 'in' transition
	speedOut:	   null,  // speed of the 'out' transition
	next:		   null,  // selector for element to use as click trigger for next slide
	prev:		   null,  // selector for element to use as click trigger for previous slide
	prevNextClick: null,  // callback fn for prev/next clicks:	function(isNext, zeroBasedSlideIndex, slideElement)
	prevNextEvent:'click',// event which drives the manual transition to the previous or next slide
	pager:		   null,  // selector for element to use as pager container
	pagerClick:	   null,  // callback fn for pager clicks:	function(zeroBasedSlideIndex, slideElement)
	pagerEvent:	  'click', // name of event which drives the pager navigation
	pagerAnchorBuilder: null, // callback fn for building anchor links:  function(index, DOMelement)
	before:		   null,  // transition callback (scope set to element to be shown):	 function(currSlideElement, nextSlideElement, options, forwardFlag)
	after:		   null,  // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
	end:		   null,  // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
	easing:		   null,  // easing method for both in and out transitions
	easeIn:		   null,  // easing for "in" transition
	easeOut:	   null,  // easing for "out" transition
	shuffle:	   null,  // coords for shuffle animation, ex: { top:15, left: 200 }
	animIn:		   null,  // properties that define how the slide animates in
	animOut:	   null,  // properties that define how the slide animates out
	cssBefore:	   null,  // properties that define the initial state of the slide before transitioning in
	cssAfter:	   null,  // properties that defined the state of the slide after transitioning out
	fxFn:		   null,  // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
	height:		  'auto', // container height
	startingSlide: 0,	  // zero-based index of the first slide to be displayed
	sync:		   1,	  // true if in/out transitions should occur simultaneously
	random:		   0,	  // true for random, false for sequence (not applicable to shuffle fx)
	fit:		   0,	  // force slides to fit container
	containerResize: 1,	  // resize container to fit largest slide
	pause:		   0,	  // true to enable "pause on hover"
	pauseOnPagerHover: 0, // true to pause when hovering over pager link
	autostop:	   0,	  // true to end slideshow after X transitions (where X == slide count)
	autostopCount: 0,	  // number of transitions (optionally used with autostop to define X)
	delay:		   0,	  // additional delay (in ms) for first transition (hint: can be negative)
	slideExpr:	   null,  // expression for selecting slides (if something other than all children is required)
	cleartype:	   !$.support.opacity,  // true if clearType corrections should be applied (for IE)
	cleartypeNoBg: false, // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
	nowrap:		   0,	  // true to prevent slideshow from wrapping
	fastOnEvent:   0,	  // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
	randomizeEffects: 1,  // valid when multiple effects are used; true to make the effect sequence random
	rev:		   0,	 // causes animations to transition in reverse
	manualTrump:   true,  // causes manual transition to stop an active transition instead of being ignored
	requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
	requeueTimeout: 250   // ms delay for requeue
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2008 M. Alsup
 * Version:	 2.72
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {

//
// These functions define one-time slide initialization for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
}

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore ={ top: h, left: 0 };
	opts.cssFirst = { top: 0 };
	opts.animIn	  = { top: 0 };
	opts.animOut  = { top: -h };
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst = { top: 0 };
	opts.cssBefore= { top: -h, left: 0 };
	opts.animIn	  = { top: 0 };
	opts.animOut  = { top: h };
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { left: w, top: 0 };
	opts.animIn	  = { left: 0 };
	opts.animOut  = { left: 0-w };
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { left: -w, top: 0 };
	opts.animIn	  = { left: 0 };
	opts.animOut  = { left: w };
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst = { left: 0 };
	opts.cssBefore= { top: 0 };
	opts.animIn   = { left: 0 };
	opts.animOut  = { top: 0 };
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst = { top: 0 };
	opts.cssBefore= { left: 0 };
	opts.animIn   = { top: 0 };
	opts.animOut  = { left: 0 };
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore = { left: 0, top: 0, width: 0 };
	opts.animIn	 = { width: 'show' };
	opts.animOut = { width: 0 };
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore = { left: 0, top: 0, height: 0 };
	opts.animIn	 = { height: 'show' };
	opts.animOut = { height: 0 };
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++)
				fwd ? opts.els.push(opts.els.shift()) : opts.els.unshift(opts.els.pop());
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	opts.cssBefore = { display: 'block', opacity: 1, top: 0, left: 0 };
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
	});
	opts.cssFirst  = { top: 0 };
	opts.cssBefore = { left: 0, height: 0 };
	opts.animIn	   = { top: 0 };
	opts.animOut   = { height: 0 };
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst  = { top: 0 };
	opts.cssBefore = { left: 0, top: 0, height: 0 };
	opts.animOut   = { height: 0 };
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore = { top: 0, width: 0  };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { width: 0 };
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	opts.cssBefore = { top: 0, left: 0, width: 0 };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { width: 0 };
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn	   = { top: 0, left: 0, width: next.cycleW, height: next.cycleH };
		opts.animOut   = { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 };
	});
	opts.cssFirst = { top:0, left: 0 };
	opts.cssBefore = { width: 0, height: 0 };
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn	= { top: 0, left: 0, width: next.cycleW, height: next.cycleH };
	});
	opts.cssBefore = { width: 0, height: 0 };
	opts.animOut  = { opacity: 0 };
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore = { left: w, top: 0 };
	opts.animIn = { left: 0 };
	opts.animOut  = { left: w };
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore = { top: h, left: 0 };
	opts.animIn = { top: 0 };
	opts.animOut  = { top: h };
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore = { top: h, left: w };
	opts.animIn = { top: 0, left: 0 };
	opts.animOut  = { top: h, left: w };
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn = { left: 0, width: this.cycleW };
		opts.animOut = { left: 0 };
	});
	opts.cssBefore = { width: 0, top: 0 };
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn = { top: 0, height: this.cycleH };
		opts.animOut = { top: 0 };
	});
	opts.cssBefore = { height: 0, left: 0 };
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn = { left: 0, width: this.cycleW };
		opts.animOut = { left: curr.cycleW/2, width: 0 };
	});
	opts.cssBefore = { top: 0, width: 0 };
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn = { top: 0, height: next.cycleH };
		opts.animOut = { top: curr.cycleH/2, height: 0 };
	});
	opts.cssBefore = { left: 0, height: 0 };
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn = { left: 0, top: 0};
	opts.animOut = { opacity: 1 };
	opts.cssBefore = { top: 0, left: 0 };
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn = { left: 0, top: 0 };
	opts.animOut = { opacity: 1 };
	opts.cssBefore = { top: 0, left: 0 };
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			opts.animOut = { left: w*2, top: -h/2, opacity: 0 };
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore = { left: 0, top: 0 };
	opts.animIn = { left: 0 };
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2);
			var left = parseInt(w/2);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0]), r = parseInt(d[1]), b = parseInt(d[2]), l = parseInt(d[3]);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13)) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count)) : 0;
			var ll = l ? l - parseInt(step * (l/count)) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1)) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1)) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	opts.cssBefore = { display: 'block', opacity: 1, top: 0, left: 0 };
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);

/*-------------------------------------------------------------------- 
 * jQuery plugin: customInput()
 * by Maggie Wachs and Scott Jehl, http://www.filamentgroup.com
 * Copyright (c) 2009 Filament Group
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 * Article: http://www.filamentgroup.com/lab/accessible_custom_designed_checkbox_radio_button_inputs_styled_css_jquery/  
 * Usage example below (see comment "Run the script...").
--------------------------------------------------------------------*/


jQuery.fn.customInput = function(){
	$(this).each(function(i){	
		if($(this).is('[type=checkbox],[type=radio]')){
			var input = $(this);
			
			// get the associated label using the input's id
			var label = $('label[for='+input.attr('id')+']');
			
			//get type, for classname suffix 
			var inputType = (input.is('[type=checkbox]')) ? 'checkbox' : 'radio';
			
			// wrap the input + label in a div 
			$('<div class="custom-'+ inputType +'"></div>').insertBefore(input).append(input, label);
			
			// find all inputs in this set using the shared name attribute
			var allInputs = $('input[name='+input.attr('name')+']');
			
			// necessary for browsers that don't support the :hover pseudo class on labels
			label.hover(
				function(){ 
					$(this).addClass('hover'); 
					if(inputType == 'checkbox' && input.is(':checked')){ 
						$(this).addClass('checkedHover'); 
					} 
				},
				function(){ $(this).removeClass('hover checkedHover'); }
			);
			
			//bind custom event, trigger it, bind click,focus,blur events					
			input.bind('updateState', function(){	
				if (input.is(':checked')) {
					if (input.is(':radio')) {				
						allInputs.each(function(){
							$('label[for='+$(this).attr('id')+']').removeClass('checked');
						});		
					};
					label.addClass('checked');
				}
				else { label.removeClass('checked checkedHover checkedFocus'); }
										
			})
			.trigger('updateState')
			.click(function(){ 
				$(this).trigger('updateState'); 
			})
			.focus(function(){ 
				label.addClass('focus'); 
				if(inputType == 'checkbox' && input.is(':checked')){ 
					$(this).addClass('checkedFocus'); 
				} 
			})
			.blur(function(){ label.removeClass('focus checkedFocus'); });
			
			input.change(function(){
				if (input.is(':checked')) {
					if (input.is(':radio')) {
						allInputs.each(function(){
							$('label[for='+$(this).attr('id')+']').removeClass('checked');
						});
					};
					label.addClass('checked');
				} else { 
					label.removeClass('checked checkedHover checkedFocus'); 
				}
			}); 
		}
	});
};

/*
 * 
 * TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.3
 * @requires jQuery v1.2.3
 * 
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
 
(function($){$.extend({tablesorter:new function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'.',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}var rows=table.tBodies[0].rows;if(table.tBodies[0].rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,cells[i]);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,node){var l=parsers.length;for(var i=1;i<l;i++){if(parsers[i].is($.trim(getElementText(table.config,node)),table,node)){return parsers[i];}}return parsers[0];}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=table.tBodies[0].rows[i],cols=[];cache.row.push($(c));for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c.cells[j]),table,c.cells[j]));}cols.push(i);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){if(!node)return"";var t="";if(config.textExtraction=="simple"){if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){t=node.childNodes[0].innerHTML;}else{t=node.innerHTML;}}else{if(typeof(config.textExtraction)=="function"){t=config.textExtraction(node);}else{t=$(node).text();}}return t;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){rows.push(r[n[i][checkCell]]);if(!table.config.appender){var o=r[n[i][checkCell]];var l=o.length;for(var j=0;j<l;j++){tableBody[0].appendChild(o[j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false,tableHeadersRows=[];for(var i=0;i<table.tHead.rows.length;i++){tableHeadersRows[i]=0;};$tableHeaders=$("thead th",table);$tableHeaders.each(function(index){this.count=0;this.column=index;this.order=formatSortingOrder(table.config.sortInitialOrder);if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(!this.sortDisabled){$(this).addClass(table.config.cssHeader);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){i=(v.toLowerCase()=="desc")?1:0;}else{i=(v==(0||1))?v:0;}return i;}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(getCachedSortType(table.config.parsers,c)=="text")?((order==0)?"sortText":"sortTextDesc"):((order==0)?"sortNumeric":"sortNumericDesc");var e="e"+i;dynamicExp+="var "+e+" = "+s+"(a["+c+"],b["+c+"]); ";dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function sortText(a,b){return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){$this.trigger("sortStart");var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){var $cell=$(this);var i=this.column;this.order=this.count++%2;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){var DECIMAL='\\'+config.decimal;var exp='/(^[+]?0('+DECIMAL+'0+)?$)|(^([-+]?[1-9][0-9]*)$)|(^([-+]?((0?|[1-9][0-9]*)'+DECIMAL+'(0*[1-9][0-9]*)))$)|(^[-+]?[1-9]+[0-9]*'+DECIMAL+'0+$)/';return RegExp(exp).test($.trim(s));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[Â£$â‚¬?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[^0-9.]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}$("tr:visible",table.tBodies[0]).filter(':even').removeClass(table.config.widgetZebra.css[1]).addClass(table.config.widgetZebra.css[0]).end().filter(':odd').removeClass(table.config.widgetZebra.css[0]).addClass(table.config.widgetZebra.css[1]);if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);

/*
 * 
 * TableSorter 2.0 - Client-side table sorting with ease!
 * Version 2.0.3
 * @requires jQuery v1.2.3
 *
 * @tablesorter.pager.js plugin: http://tablesorter.com/docs/example-pager.html
 * 
 * Copyright (c) 2007 Christian Bach
 * Examples and docs at: http://tablesorter.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */

(function($) {
	$.extend({
		tablesorterPager: new function() {
			
			function updatePageDisplay(c) {
				var s = $(c.cssPageDisplay,c.container).val((c.page+1) + c.seperator + c.totalPages);	
			}
			
			function setPageSize(table,size) {
				var c = table.config;
				c.size = size;
				c.totalPages = Math.ceil(c.totalRows / c.size);
				c.pagerPositionSet = false;
				moveToPage(table);
				fixPosition(table);
			}
			
			function fixPosition(table) {
				var c = table.config;
				if(!c.pagerPositionSet && c.positionFixed) {
					var c = table.config, o = $(table);
					if(o.offset) {
						c.container.css({
							top: o.offset().top + o.height() + 'px',
							position: 'absolute'
						});
					}
					c.pagerPositionSet = true;
				}
			}
			
			function moveToFirstPage(table) {
				var c = table.config;
				c.page = 0;
				moveToPage(table);
			}
			
			function moveToLastPage(table) {
				var c = table.config;
				c.page = (c.totalPages-1);
				moveToPage(table);
			}
			
			function moveToNextPage(table) {
				var c = table.config;
				c.page++;
				if(c.page >= (c.totalPages-1)) {
					c.page = (c.totalPages-1);
				}
				moveToPage(table);
			}
			
			function moveToPrevPage(table) {
				var c = table.config;
				c.page--;
				if(c.page <= 0) {
					c.page = 0;
				}
				moveToPage(table);
			}
						
			
			function moveToPage(table) {
				var c = table.config;
				if(c.page < 0 || c.page > (c.totalPages-1)) {
					c.page = 0;
				}
				
				renderTable(table,c.rowsCopy);
			}
			
			function renderTable(table,rows) {
				
				var c = table.config;
				var l = rows.length;
				var s = (c.page * c.size);
				var e = (s + c.size);
				if(e > rows.length ) {
					e = rows.length;
				}
				
				
				var tableBody = $(table.tBodies[0]);
				
				// clear the table body
				
				$.tablesorter.clearTableBody(table);
				
				for(var i = s; i < e; i++) {
					
					//tableBody.append(rows[i]);
					
					var o = rows[i];
					var l = o.length;
					for(var j=0; j < l; j++) {
						
						tableBody[0].appendChild(o[j]);

					}
				}
				
				fixPosition(table,tableBody);
				
				$(table).trigger("applyWidgets");
				
				if( c.page >= c.totalPages ) {
        			moveToLastPage(table);
				}
				
				updatePageDisplay(c);
			}
			
			this.appender = function(table,rows) {
				
				var c = table.config;
				
				c.rowsCopy = rows;
				c.totalRows = rows.length;
				c.totalPages = Math.ceil(c.totalRows / c.size);
				
				renderTable(table,rows);
			};
			
			this.defaults = {
				size: 10,
				offset: 0,
				page: 0,
				totalRows: 0,
				totalPages: 0,
				container: null,
				cssNext: '.next',
				cssPrev: '.prev',
				cssFirst: '.first',
				cssLast: '.last',
				cssPageDisplay: '.pagedisplay',
				cssPageSize: '.pagesize',
				seperator: " of ",
				positionFixed: false,
				appender: this.appender
			};
			
			this.construct = function(settings) {
				
				return this.each(function() {	
					
					config = $.extend(this.config, $.tablesorterPager.defaults, settings);
					
					var table = this, pager = config.container;
				
					$(this).trigger("appendCache");
					
					config.size = parseInt($(".pagesize",pager).val());
					
					$(config.cssFirst,pager).click(function() {
						moveToFirstPage(table);
						return false;
					});
					$(config.cssNext,pager).click(function() {
						moveToNextPage(table);
						return false;
					});
					$(config.cssPrev,pager).click(function() {
						moveToPrevPage(table);
						return false;
					});
					$(config.cssLast,pager).click(function() {
						moveToLastPage(table);
						return false;
					});
					$(config.cssPageSize,pager).change(function() {
						setPageSize(table,parseInt($(this).val()));
						return false;
					});
				});
			};
			
		}
	});
	// extend plugin scope
	$.fn.extend({
        tablesorterPager: $.tablesorterPager.construct
	});
	
})(jQuery);				

/*
 * jPicker 1.1.2
 *
 * jQuery Plugin for Photoshop style color picker
 *
 * Copyright (c) 2010 Christopher T. Tillman
 * Digital Magic Productions, Inc. (http://www.digitalmagicpro.com/)
 * MIT style license, FREE to use, alter, copy, sell, and especially ENHANCE
 *
 * Painstakingly ported from John Dyers' excellent work on his own color picker based on the Prototype framework.
 *
 * John Dyers' website: (http://johndyer.name)
 * Color Picker page:   (http://johndyer.name/post/2007/09/PhotoShop-like-JavaScript-Color-Picker.aspx)
 *
 */
(function(e,a){var d=function(z,k){var o=this,j=z.find("img:first"),F=0,E=100,w=100,D=0,C=100,v=100,s=0,p=0,n,q,u=new Array(),l=function(y){for(var x=0;x<u.length;x++){u[x].call(o,o,y)}},H=function(x){var y=z.offset();n={l:y.left|0,t:y.top|0};clearTimeout(q);q=setTimeout(function(){A.call(o,x)},0);e(document).bind("mousemove",h).bind("mouseup",B);x.stopPropagation();x.preventDefault();return false},h=function(x){clearTimeout(q);q=setTimeout(function(){A.call(o,x)},0);x.stopPropagation();x.preventDefault();return false},B=function(x){e(document).unbind("mouseup",B).unbind("mousemove",h);x.stopPropagation();x.preventDefault();return false},A=function(M){var K=M.pageX-n.l,x=M.pageY-n.t,L=z.w,y=z.h;if(K<0){K=0}else{if(K>L){K=L}}if(x<0){x=0}else{if(x>y){x=y}}J.call(o,"xy",{x:((K/L)*w)+F,y:((x/y)*v)+D})},r=function(){var L=0,x=0,N=z.w,K=z.h,M=j.w,y=j.h;setTimeout(function(){if(w>0){if(s==E){L=N}else{L=((s/w)*N)|0}}if(v>0){if(p==C){x=K}else{x=((p/v)*K)|0}}if(M>=N){L=(N>>1)-(M>>1)}else{L-=M>>1}if(y>=K){x=(K>>1)-(y>>1)}else{x-=y>>1}j.css({left:L+"px",top:x+"px"})},0)},J=function(x,K,y){var O=K!==undefined;if(!O){if(x===undefined||x==null){x="xy"}switch(x.toLowerCase()){case"x":return s;case"y":return p;case"xy":default:return{x:s,y:p}}}if(y!=null&&y==o){return}var N=false,M,L;if(x==null){x="xy"}switch(x.toLowerCase()){case"x":M=K&&(K.x&&K.x|0||K|0)||0;break;case"y":L=K&&(K.y&&K.y|0||K|0)||0;break;case"xy":default:M=K&&K.x&&K.x|0||0;L=K&&K.y&&K.y|0||0;break}if(M!=null){if(M<F){M=F}else{if(M>E){M=E}}if(s!=M){s=M;N=true}}if(L!=null){if(L<D){L=D}else{if(L>C){L=C}}if(p!=L){p=L;N=true}}N&&l.call(o,y||o)},t=function(x,L){var P=L!==undefined;if(!P){if(x===undefined||x==null){x="all"}switch(x.toLowerCase()){case"minx":return F;case"maxx":return E;case"rangex":return{minX:F,maxX:E,rangeX:w};case"miny":return D;case"maxy":return C;case"rangey":return{minY:D,maxY:C,rangeY:v};case"all":default:return{minX:F,maxX:E,rangeX:w,minY:D,maxY:C,rangeY:v}}}var O=false,N,K,M,y;if(x==null){x="all"}switch(x.toLowerCase()){case"minx":N=L&&(L.minX&&L.minX|0||L|0)||0;break;case"maxx":K=L&&(L.maxX&&L.maxX|0||L|0)||0;break;case"rangex":N=L&&L.minX&&L.minX|0||0;K=L&&L.maxX&&L.maxX|0||0;break;case"miny":M=L&&(L.minY&&L.minY|0||L|0)||0;break;case"maxy":y=L&&(L.maxY&&L.maxY|0||L|0)||0;break;case"rangey":M=L&&L.minY&&L.minY|0||0;y=L&&L.maxY&&L.maxY|0||0;break;case"all":default:N=L&&L.minX&&L.minX|0||0;K=L&&L.maxX&&L.maxX|0||0;M=L&&L.minY&&L.minY|0||0;y=L&&L.maxY&&L.maxY|0||0;break}if(N!=null&&F!=N){F=N;w=E-F}if(K!=null&&E!=K){E=K;w=E-F}if(M!=null&&D!=M){D=M;v=C-D}if(y!=null&&C!=y){C=y;v=C-D}},I=function(x){if(e.isFunction(x)){u.push(x)}},m=function(y){if(!e.isFunction(y)){return}var x;while((x=e.inArray(y,u))!=-1){u.splice(x,1)}},G=function(){e(document).unbind("mouseup",B).unbind("mousemove",h);z.unbind("mousedown",H);z=null;j=null;u=null};e.extend(true,o,{val:J,range:t,bind:I,unbind:m,destroy:G});j.src=k.arrow&&k.arrow.image;j.w=k.arrow&&k.arrow.width||j.width();j.h=k.arrow&&k.arrow.height||j.height();z.w=k.map&&k.map.width||z.width();z.h=k.map&&k.map.height||z.height();z.bind("mousedown",H);I.call(o,r)},b=function(t,y,k){var q=this,l=t.find("td.Text input"),r=l.eq(3),v=l.eq(4),h=l.eq(5),o=l.length>7?l.eq(6):null,n=l.eq(0),p=l.eq(1),x=l.eq(2),s=l.eq(l.length>7?7:6),A=l.length>7?l.eq(8):null,w=function(C){if(C.target.value==""&&C.target!=s.get(0)&&(k!=null&&C.target!=k.get(0)||k==null)){return}if(!u(C)){return C}switch(C.target){case r.get(0):r.val(j.call(q,r.val(),0,255));y.val("r",r.val(),C.target);break;case v.get(0):v.val(j.call(q,v.val(),0,255));y.val("g",v.val(),C.target);break;case h.get(0):h.val(j.call(q,h.val(),0,255));y.val("b",h.val(),C.target);break;case o&&o.get(0):o.val(j.call(q,o.val(),0,100));y.val("a",o.val(),C.target);break;case n.get(0):n.val(j.call(q,n.val(),0,360));y.val("h",n.val(),C.target);break;case p.get(0):p.val(j.call(q,p.val(),0,100));y.val("s",p.val(),C.target);break;case x.get(0):x.val(j.call(q,x.val(),0,100));y.val("v",x.val(),C.target);break;case s.get(0):s.val(s.val().replace(/[^a-fA-F0-9]/g,"").toLowerCase().substring(0,6));k&&k.val(s.val());y.val("hex",s.val()!=""?s.val():null,C.target);break;case k&&k.get(0):k.val(k.val().replace(/[^a-fA-F0-9]/g,"").toLowerCase().substring(0,6));s.val(k.val());y.val("hex",k.val()!=""?k.val():null,C.target);break;case A&&A.get(0):A.val(A.val().replace(/[^a-fA-F0-9]/g,"").toLowerCase().substring(0,2));y.val("a",A.val()!=null?((parseInt(A.val(),16)*100)/255):null,C.target);break}},z=function(C){if(y.val()!=null){switch(C.target){case r.get(0):r.val(y.val("r"));break;case v.get(0):v.val(y.val("g"));break;case h.get(0):h.val(y.val("b"));break;case o&&o.get(0):o.val(y.val("a"));break;case n.get(0):n.val(y.val("h"));break;case p.get(0):p.val(y.val("s"));break;case x.get(0):x.val(y.val("v"));break;case s.get(0):case k&&k.get(0):s.val(y.val("hex"));k&&k.val(y.val("hex"));break;case A&&A.get(0):A.val(y.val("ahex").substring(6));break}}},u=function(C){switch(C.keyCode){case 9:case 16:case 29:case 37:case 38:case 40:return false;case"c".charCodeAt():case"v".charCodeAt():if(C.ctrlKey){return false}}return true},j=function(E,D,C){if(E==""||isNaN(E)){return D}if(E>C){return C}if(E<D){return D}return E},m=function(E,C){var D=E.val("all");if(C!=r.get(0)){r.val(D!=null?D.r:"")}if(C!=v.get(0)){v.val(D!=null?D.g:"")}if(C!=h.get(0)){h.val(D!=null?D.b:"")}if(o&&C!=o.get(0)){o.val(D!=null?D.a:"")}if(C!=n.get(0)){n.val(D!=null?D.h:"")}if(C!=p.get(0)){p.val(D!=null?D.s:"")}if(C!=x.get(0)){x.val(D!=null?D.v:"")}if(C!=s.get(0)&&(k&&C!=k.get(0)||!k)){s.val(D!=null?D.hex:"")}if(k&&C!=k.get(0)&&C!=s.get(0)){k.val(D!=null?D.hex:"")}if(A&&C!=A.get(0)){A.val(D!=null?D.ahex.substring(6):"")}},B=function(){r.add(v).add(h).add(o).add(n).add(p).add(x).add(s).add(k).add(A).unbind("keyup",w).unbind("blur",z);y.unbind(m);r=null;v=null;h=null;o=null;n=null;p=null;x=null;s=null;A=null};e.extend(true,q,{destroy:B});r.add(v).add(h).add(o).add(n).add(p).add(x).add(s).add(k).add(A).bind("keyup",w).bind("blur",z);y.bind(m)};e.jPicker={List:[],Color:function(z){var q=this,j,o,t,u,n,A,x,k=new Array(),m=function(r){for(var h=0;h<k.length;h++){k[h].call(q,q,r)}},l=function(h,G,r){var F=G!==undefined;if(!F){if(h===undefined||h==null||h==""){h="all"}switch(h.toLowerCase()){case"ahex":return j!=null?g.rgbaToHex({r:j,g:o,b:t,a:u}):null;case"hex":var D=l("ahex");return D&&D.substring(0,6)||null;case"all":return j!=null?{r:j,g:o,b:t,a:u,h:n,s:A,v:x,hex:l.call(q,"hex"),ahex:l.call(q,"ahex")}:null;default:var D={};for(var B=0;B<h.length;B++){switch(h.charAt(B)){case"r":if(h.length==1){D=j}else{D.r=j}break;case"g":if(h.length==1){D=o}else{D.g=o}break;case"b":if(h.length==1){D=t}else{D.b=t}break;case"a":if(h.length==1){D=u}else{D.a=u}break;case"h":if(h.length==1){D=n}else{D.h=n}break;case"s":if(h.length==1){D=A}else{D.s=A}break;case"v":if(h.length==1){D=x}else{D.v=x}break}}return D=={}?l.call(q,"all"):D;break}}if(r!=null&&r==q){return}var v=false;if(h==null){h=""}if(G==null){if(j!=null){j=null;v=true}if(o!=null){o=null;v=true}if(t!=null){t=null;v=true}if(u!=null){u=null;v=true}if(n!=null){n=null;v=true}if(A!=null){A=null;v=true}if(x!=null){x=null;v=true}v&&m.call(q,r||q);return}switch(h.toLowerCase()){case"ahex":case"hex":var D=g.hexToRgba(G&&(G.ahex||G.hex)||G||"00000000");l.call(q,"rgba",{r:D.r,g:D.g,b:D.b,a:h=="ahex"?D.a:u!=null?u:100},r);break;default:if(G&&(G.ahex!=null||G.hex!=null)){l.call(q,"ahex",G.ahex||G.hex||"00000000",r);return}var s={},E=false,C=false;if(G.r!==undefined&&!h.indexOf("r")==-1){h+="r"}if(G.g!==undefined&&!h.indexOf("g")==-1){h+="g"}if(G.b!==undefined&&!h.indexOf("b")==-1){h+="b"}if(G.a!==undefined&&!h.indexOf("a")==-1){h+="a"}if(G.h!==undefined&&!h.indexOf("h")==-1){h+="h"}if(G.s!==undefined&&!h.indexOf("s")==-1){h+="s"}if(G.v!==undefined&&!h.indexOf("v")==-1){h+="v"}for(var B=0;B<h.length;B++){switch(h.charAt(B)){case"r":if(C){continue}E=true;s.r=G&&G.r&&G.r|0||G&&G|0||0;if(s.r<0){s.r=0}else{if(s.r>255){s.r=255}}if(j!=s.r){j=s.r;v=true}break;case"g":if(C){continue}E=true;s.g=G&&G.g&&G.g|0||G&&G|0||0;if(s.g<0){s.g=0}else{if(s.g>255){s.g=255}}if(o!=s.g){o=s.g;v=true}break;case"b":if(C){continue}E=true;s.b=G&&G.b&&G.b|0||G&&G|0||0;if(s.b<0){s.b=0}else{if(s.b>255){s.b=255}}if(t!=s.b){t=s.b;v=true}break;case"a":s.a=G&&G.a!=null?G.a|0:G!=null?G|0:100;if(s.a<0){s.a=0}else{if(s.a>100){s.a=100}}if(u!=s.a){u=s.a;v=true}break;case"h":if(E){continue}C=true;s.h=G&&G.h&&G.h|0||G&&G|0||0;if(s.h<0){s.h=0}else{if(s.h>360){s.h=360}}if(n!=s.h){n=s.h;v=true}break;case"s":if(E){continue}C=true;s.s=G&&G.s!=null?G.s|0:G!=null?G|0:100;if(s.s<0){s.s=0}else{if(s.s>100){s.s=100}}if(A!=s.s){A=s.s;v=true}break;case"v":if(E){continue}C=true;s.v=G&&G.v!=null?G.v|0:G!=null?G|0:100;if(s.v<0){s.v=0}else{if(s.v>100){s.v=100}}if(x!=s.v){x=s.v;v=true}break}}if(v){if(E){j=j||0;o=o||0;t=t||0;var D=g.rgbToHsv({r:j,g:o,b:t});n=D.h;A=D.s;x=D.v}else{if(C){n=n||0;A=A!=null?A:100;x=x!=null?x:100;var D=g.hsvToRgb({h:n,s:A,v:x});j=D.r;o=D.g;t=D.b}}u=u!=null?u:100;m.call(q,r||q)}break}},p=function(h){if(e.isFunction(h)){k.push(h)}},y=function(r){if(!e.isFunction(r)){return}var h;while((h=e.inArray(r,k))!=-1){k.splice(h,1)}},w=function(){k=null};e.extend(true,q,{val:l,bind:p,unbind:y,destroy:w});if(z){if(z.hex!=null){l("hex",z)}else{if(z.ahex!=null){l("ahex",z)}else{if(z.r!=null&&z.g!=null&&z.b!=null){l("rgb",z)}else{if(z.h!=null&&z.s!=null&&z.v!=null){l("hsv",z)}}}}}},ColorMethods:{hexToRgba:function(m){m=this.validateHex(m);if(m==""){return{r:null,g:null,b:null,a:null}}var l="00",k="00",h="00",j="100";if(m.length==6){m+="ff"}if(m.length>6){l=m.substring(0,2);k=m.substring(2,4);h=m.substring(4,6);j=m.substring(6,m.length)}else{if(m.length>4){l=m.substring(4,m.length);m=m.substring(0,4)}if(m.length>2){k=m.substring(2,m.length);m=m.substring(0,2)}if(m.length>0){h=m.substring(0,m.length)}}return{r:this.hexToInt(l),g:this.hexToInt(k),b:this.hexToInt(h),a:((this.hexToInt(j)*100)/255)|0}},validateHex:function(h){h=h.toLowerCase().replace(/[^a-f0-9]/g,"");if(h.length>8){h=h.substring(0,8)}return h},rgbaToHex:function(h){return this.intToHex(h.r)+this.intToHex(h.g)+this.intToHex(h.b)+this.intToHex(((h.a*255)/100)|0)},intToHex:function(j){var h=(j|0).toString(16);if(h.length==1){h=("0"+h)}return h.toLowerCase()},hexToInt:function(h){return parseInt(h,16)},rgbToHsv:function(l){var o=l.r/255,n=l.g/255,j=l.b/255,k={h:0,s:0,v:0},m=0,h=0,p;if(o>=n&&o>=j){h=o;m=n>j?j:n}else{if(n>=j&&n>=o){h=n;m=o>j?j:o}else{h=j;m=n>o?o:n}}k.v=h;k.s=h?(h-m)/h:0;if(!k.s){k.h=0}else{p=h-m;if(o==h){k.h=(n-j)/p}else{if(n==h){k.h=2+(j-o)/p}else{k.h=4+(o-n)/p}}k.h=parseInt(k.h*60);if(k.h<0){k.h+=360}}k.s=(k.s*100)|0;k.v=(k.v*100)|0;return k},hsvToRgb:function(n){var r={r:0,g:0,b:0,a:100},m=n.h,x=n.s,u=n.v;if(x==0){if(u==0){r.r=r.g=r.b=0}else{r.r=r.g=r.b=(u*255/100)|0}}else{if(m==360){m=0}m/=60;x=x/100;u=u/100;var l=m|0,o=m-l,k=u*(1-x),j=u*(1-(x*o)),w=u*(1-(x*(1-o)));switch(l){case 0:r.r=u;r.g=w;r.b=k;break;case 1:r.r=j;r.g=u;r.b=k;break;case 2:r.r=k;r.g=u;r.b=w;break;case 3:r.r=k;r.g=j;r.b=u;break;case 4:r.r=w;r.g=k;r.b=u;break;case 5:r.r=u;r.g=k;r.b=j;break}r.r=(r.r*255)|0;r.g=(r.g*255)|0;r.b=(r.b*255)|0}return r}}};var f=e.jPicker.Color,c=e.jPicker.List,g=e.jPicker.ColorMethods;e.fn.jPicker=function(j){var h=arguments;return this.each(function(){var w=this,av=e.extend(true,{},e.fn.jPicker.defaults,j);if(e(w).get(0).nodeName.toLowerCase()=="input"){e.extend(true,av,{window:{bindToInput:true,expandable:true,input:e(w)}});if(g.validateHex(e(w).val())){av.color.active=new f({hex:e(w).val(),a:av.color.active.val("a")});av.color.current=new f({hex:e(w).val(),a:av.color.active.val("a")})}}if(av.window.expandable){e(w).after('<span class="jPicker"><span class="Icon"><span class="Color">&nbsp;</span><span class="Alpha">&nbsp;</span><span class="Image" title="Click To Open Color Picker">&nbsp;</span><span class="Container">&nbsp;</span></span></span>')}else{av.window.liveUpdate=false}var Q=parseFloat(navigator.appVersion.split("MSIE")[1])<7&&document.body.filters,R=null,l=null,s=null,au=null,at=null,ar=null,P=null,O=null,N=null,M=null,L=null,K=null,D=null,U=null,aw=null,J=null,I=null,am=null,ai=null,E=null,an=null,ah=null,X=null,ab=null,aq=null,r=null,C=null,u=null,ag=function(aB){var aD=G.active,aE=n.clientPath,aA=aD.val("hex"),aC,az;av.color.mode=aB;switch(aB){case"h":setTimeout(function(){y.call(w,l,"transparent");x.call(w,au,0);Y.call(w,au,100);x.call(w,at,260);Y.call(w,at,100);y.call(w,s,"transparent");x.call(w,P,0);Y.call(w,P,100);x.call(w,O,260);Y.call(w,O,100);x.call(w,N,260);Y.call(w,N,100);x.call(w,M,260);Y.call(w,M,100);x.call(w,K,260);Y.call(w,K,100)},0);D.range("all",{minX:0,maxX:100,minY:0,maxY:100});U.range("rangeY",{minY:0,maxY:360});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("s"),y:100-aD.val("v")},D);U.val("y",360-aD.val("h"),U);break;case"s":setTimeout(function(){y.call(w,l,"transparent");x.call(w,au,-260);x.call(w,at,-520);x.call(w,P,-260);x.call(w,O,-520);x.call(w,K,260);Y.call(w,K,100)},0);D.range("all",{minX:0,maxX:360,minY:0,maxY:100});U.range("rangeY",{minY:0,maxY:100});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("h"),y:100-aD.val("v")},D);U.val("y",100-aD.val("s"),U);break;case"v":setTimeout(function(){y.call(w,l,"000000");x.call(w,au,-780);x.call(w,at,260);y.call(w,s,aA);x.call(w,P,-520);x.call(w,O,260);Y.call(w,O,100);x.call(w,K,260);Y.call(w,K,100)},0);D.range("all",{minX:0,maxX:360,minY:0,maxY:100});U.range("rangeY",{minY:0,maxY:100});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("h"),y:100-aD.val("s")},D);U.val("y",100-aD.val("v"),U);break;case"r":aC=-1040;az=-780;D.range("all",{minX:0,maxX:255,minY:0,maxY:255});U.range("rangeY",{minY:0,maxY:255});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("b"),y:255-aD.val("g")},D);U.val("y",255-aD.val("r"),U);break;case"g":aC=-1560;az=-1820;D.range("all",{minX:0,maxX:255,minY:0,maxY:255});U.range("rangeY",{minY:0,maxY:255});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("b"),y:255-aD.val("r")},D);U.val("y",255-aD.val("g"),U);break;case"b":aC=-2080;az=-2860;D.range("all",{minX:0,maxX:255,minY:0,maxY:255});U.range("rangeY",{minY:0,maxY:255});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("r"),y:255-aD.val("g")},D);U.val("y",255-aD.val("b"),U);break;case"a":setTimeout(function(){y.call(w,l,"transparent");x.call(w,au,-260);x.call(w,at,-520);x.call(w,P,260);x.call(w,O,260);Y.call(w,O,100);x.call(w,K,0);Y.call(w,K,100)},0);D.range("all",{minX:0,maxX:360,minY:0,maxY:100});U.range("rangeY",{minY:0,maxY:100});if(aD.val("ahex")==null){break}D.val("xy",{x:aD.val("h"),y:100-aD.val("v")},D);U.val("y",100-aD.val("a"),U);break;default:throw ("Invalid Mode");break}switch(aB){case"h":break;case"s":case"v":case"a":setTimeout(function(){Y.call(w,au,100);Y.call(w,P,100);x.call(w,N,260);Y.call(w,N,100);x.call(w,M,260);Y.call(w,M,100)},0);break;case"r":case"g":case"b":setTimeout(function(){y.call(w,l,"transparent");y.call(w,s,"transparent");Y.call(w,P,100);Y.call(w,au,100);x.call(w,au,aC);x.call(w,at,aC-260);x.call(w,P,az-780);x.call(w,O,az-520);x.call(w,N,az);x.call(w,M,az-260);x.call(w,K,260);Y.call(w,K,100)},0);break}if(aD.val("ahex")==null){return}aj.call(w,aD)},aj=function(aA,az){if(az==null||(az!=U&&az!=D)){v.call(w,aA,az)}setTimeout(function(){ay.call(w,aA);al.call(w,aA);W.call(w,aA)},0)},z=function(aA,az){var aC=G.active;if(az!=D&&aC.val()==null){return}var aB=aA.val("all");switch(av.color.mode){case"h":aC.val("sv",{s:aB.x,v:100-aB.y},az);break;case"s":case"a":aC.val("hv",{h:aB.x,v:100-aB.y},az);break;case"v":aC.val("hs",{h:aB.x,s:100-aB.y},az);break;case"r":aC.val("gb",{g:255-aB.y,b:aB.x},az);break;case"g":aC.val("rb",{r:255-aB.y,b:aB.x},az);break;case"b":aC.val("rg",{r:aB.x,g:255-aB.y},az);break}},ac=function(aA,az){var aB=G.active;if(az!=U&&aB.val()==null){return}switch(av.color.mode){case"h":aB.val("h",{h:360-aA.val("y")},az);break;case"s":aB.val("s",{s:100-aA.val("y")},az);break;case"v":aB.val("v",{v:100-aA.val("y")},az);break;case"r":aB.val("r",{r:255-aA.val("y")},az);break;case"g":aB.val("g",{g:255-aA.val("y")},az);break;case"b":aB.val("b",{b:255-aA.val("y")},az);break;case"a":aB.val("a",100-aA.val("y"),az);break}},v=function(aC,az){if(az!=D){switch(av.color.mode){case"h":var aH=aC.val("sv");D.val("xy",{x:aH!=null?aH.s:100,y:100-(aH!=null?aH.v:100)},az);break;case"s":case"a":var aB=aC.val("hv");D.val("xy",{x:aB&&aB.h||0,y:100-(aB!=null?aB.v:100)},az);break;case"v":var aE=aC.val("hs");D.val("xy",{x:aE&&aE.h||0,y:100-(aE!=null?aE.s:100)},az);break;case"r":var aA=aC.val("bg");D.val("xy",{x:aA&&aA.b||0,y:255-(aA&&aA.g||0)},az);break;case"g":var aI=aC.val("br");D.val("xy",{x:aI&&aI.b||0,y:255-(aI&&aI.r||0)},az);break;case"b":var aG=aC.val("rg");D.val("xy",{x:aG&&aG.r||0,y:255-(aG&&aG.g||0)},az);break}}if(az!=U){switch(av.color.mode){case"h":U.val("y",360-(aC.val("h")||0),az);break;case"s":var aJ=aC.val("s");U.val("y",100-(aJ!=null?aJ:100),az);break;case"v":var aF=aC.val("v");U.val("y",100-(aF!=null?aF:100),az);break;case"r":U.val("y",255-(aC.val("r")||0),az);break;case"g":U.val("y",255-(aC.val("g")||0),az);break;case"b":U.val("y",255-(aC.val("b")||0),az);break;case"a":var aD=aC.val("a");U.val("y",100-(aD!=null?aD:100),az);break}}},ay=function(aA){try{var az=aA.val("all");E.css({backgroundColor:az&&"#"+az.hex||"transparent"});Y.call(w,E,az&&az.a||0)}catch(aB){}},al=function(aC){switch(av.color.mode){case"h":y.call(w,l,new f({h:aC.val("h")||0,s:100,v:100}).val("hex"));break;case"s":case"a":var aB=aC.val("s");Y.call(w,at,100-(aB!=null?aB:100));break;case"v":var aA=aC.val("v");Y.call(w,au,aA!=null?aA:100);break;case"r":Y.call(w,at,(aC.val("r")||0)/255*100);break;case"g":Y.call(w,at,(aC.val("g")||0)/255*100);break;case"b":Y.call(w,at,(aC.val("b")||0)/255*100);break}var az=aC.val("a");Y.call(w,ar,100-(az||0))},W=function(aF){switch(av.color.mode){case"h":var aH=aF.val("a");Y.call(w,L,100-(aH||0));break;case"s":var aA=aF.val("hva"),aB=new f({h:aA&&aA.h||0,s:100,v:aA!=null?aA.v:100});y.call(w,s,aB.val("hex"));Y.call(w,O,100-(aA!=null?aA.v:100));Y.call(w,L,100-(aA&&aA.a||0));break;case"v":var aC=aF.val("hsa"),aE=new f({h:aC&&aC.h||0,s:aC!=null?aC.s:100,v:100});y.call(w,s,aE.val("hex"));Y.call(w,L,100-(aC&&aC.a||0));break;case"r":case"g":case"b":var aD=0,aG=0,az=aF.val("rgba");if(av.color.mode=="r"){aD=az&&az.b||0;aG=az&&az.g||0}else{if(av.color.mode=="g"){aD=az&&az.b||0;aG=az&&az.r||0}else{if(av.color.mode=="b"){aD=az&&az.r||0;aG=az&&az.g||0}}}var aI=aG>aD?aD:aG;Y.call(w,O,aD>aG?((aD-aG)/(255-aG))*100:0);Y.call(w,N,aG>aD?((aG-aD)/(255-aD))*100:0);Y.call(w,M,aI/255*100);Y.call(w,L,100-(az&&az.a||0));break;case"a":var aH=aF.val("a");y.call(w,s,aF.val("hex")||"000000");Y.call(w,L,aH!=null?0:100);Y.call(w,K,aH!=null?100:0);break}},y=function(az,aA){az.css({backgroundColor:aA&&aA.length==6&&"#"+aA||"transparent"})},t=function(az,aA){if(Q&&(aA.indexOf("AlphaBar.png")!=-1||aA.indexOf("Bars.png")!=-1||aA.indexOf("Maps.png")!=-1)){az.attr("pngSrc",aA);az.css({backgroundImage:"none",filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+aA+"', sizingMethod='scale')"})}else{az.css({backgroundImage:"url("+aA+")"})}},x=function(az,aA){az.css({top:aA+"px"})},Y=function(aA,az){aA.css({visibility:az>0?"visible":"hidden"});if(az>0&&az<100){if(Q){var aB=aA.attr("pngSrc");if(aB!=null&&(aB.indexOf("AlphaBar.png")!=-1||aB.indexOf("Bars.png")!=-1||aB.indexOf("Maps.png")!=-1)){aA.css({filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+aB+"', sizingMethod='scale') progid:DXImageTransform.Microsoft.Alpha(opacity="+az+")"})}else{aA.css({opacity:az/100})}}else{aA.css({opacity:az/100})}}else{if(az==0||az==100){if(Q){var aB=aA.attr("pngSrc");if(aB!=null&&(aB.indexOf("AlphaBar.png")!=-1||aB.indexOf("Bars.png")!=-1||aB.indexOf("Maps.png")!=-1)){aA.css({filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+aB+"', sizingMethod='scale')"})}else{aA.css({opacity:""})}}else{aA.css({opacity:""})}}}},B=function(){G.active.val("ahex",G.current.val("ahex"))},T=function(){G.current.val("ahex",G.active.val("ahex"))},A=function(az){ag.call(w,az.target.value)},Z=function(){B.call(w)},q=function(){B.call(w);av.window.expandable&&ao.call(w);e.isFunction(ax)&&ax.call(w,G.active,X)},m=function(){T.call(w);av.window.expandable&&ao.call(w);e.isFunction(ae)&&ae.call(w,G.active,ah)},af=function(){V.call(w)},ap=function(aB,az){var aA=aB.val("hex");an.css({backgroundColor:aA&&"#"+aA||"transparent"});Y.call(w,an,aB.val("a")||0)},H=function(aC,az){var aB=aC.val("hex");var aA=aC.val("va");aq.css({backgroundColor:aB&&"#"+aB||"transparent"});Y.call(w,r,100-(aA&&aA.a||0));if(av.window.bindToInput){av.window.input.css({backgroundColor:aB&&"#"+aB||"transparent",color:aA&&aA.v>75?"#000000":"#ffffff"})}},S=function(aB){var az=av.window.element,aA=av.window.page;J=parseInt(R.css("left"));I=parseInt(R.css("top"));am=aB.pageX;ai=aB.pageY;e(document).bind("mousemove",k).bind("mouseup",p);aB.stopPropagation();aB.preventDefault();return false},k=function(az){R.css({left:J-(am-az.pageX)+"px",top:I-(ai-az.pageY)+"px"});az.stopPropagation();az.preventDefault();return false},p=function(az){e(document).unbind("mousemove",k).unbind("mouseup",p);az.stopPropagation();az.preventDefault();return false},F=function(az){az.preventDefault();az.stopPropagation();G.active.val("ahex",e(this).attr("title")||null,az.target);return false},ae=e.isFunction(h[1])&&h[1]||null,ad=e.isFunction(h[2])&&h[2]||null,ax=e.isFunction(h[3])&&h[3]||null,V=function(){if(document.all){var az=false;for(i=0;i<c.length;i++){if(az){c[i].icon.css({display:"none"})}if(c[i]==w){az=true}}}G.current.val("ahex",G.active.val("ahex"));switch(av.window.effects.type){case"fade":R.fadeIn(av.window.effects.speed.show);break;case"slide":R.slideDown(av.window.effects.speed.show);break;case"show":default:R.show(av.window.effects.speed.show);break}},ao=function(){if(document.all){var az=false;for(i=0;i<c.length;i++){if(az){c[i].icon.css({display:"inline-block"})}if(c[i]==w){az=true}}}switch(av.window.effects.type){case"fade":R.fadeOut(av.window.effects.speed.hide);break;case"slide":R.slideUp(av.window.effects.speed.hide);break;case"show":default:R.hide(av.window.effects.speed.hide);break}},o=function(){var aF=av.window;R=aF.expandable?e(w).next().find(".Container:first"):e(w);if(aF.expandable){R.css({left:aF.position.x=="left"?(0-520-(aF.position.y=="center"?25:0))+"px":aF.position.x=="center"?"-249px":aF.position.x=="right"?(0+(aF.position.y=="center"?25:0))+"px":aF.position.x=="screenCenter"?((e(document).width()>>1)-249)-e(w).next().offset().left+"px":aF.position.x,position:"absolute",top:aF.position.y=="top"?"-312px":aF.position.y=="center"?"-156px":aF.position.y=="bottom"?"25px":aF.position.y})}if((typeof(G.active)).toString().toLowerCase()=="string"){G.active=new f({ahex:G.active})}R.html('<table class="jPicker" cellpadding="0" cellspacing="0"><tbody>'+(aF.expandable?'<tr><td class="Move" colspan="6">&nbsp;</td></tr>':"")+'<tr><td rowspan="9"><h2 class="Title">'+(aF.title||aa.text.title)+'</h2><div class="Map"><span class="Map1">&nbsp;</span><span class="Map2">&nbsp;</span><span class="Map3">&nbsp;</span><img src="'+n.clientPath+n.colorMap.arrow.file+'" class="Arrow"/></div></td><td rowspan="9"><div class="Bar"><span class="Map1">&nbsp;</span><span class="Map2">&nbsp;</span><span class="Map3">&nbsp;</span><span class="Map4">&nbsp;</span><span class="Map5">&nbsp;</span><span class="Map6">&nbsp;</span><img src="'+n.clientPath+n.colorBar.arrow.file+'" class="Arrow"/></div></td><td colspan="3" class="Preview">'+aa.text.newColor+'<div><span class="Active" title="'+aa.tooltips.colors.newColor+'">&nbsp;</span><span class="Current" title="'+aa.tooltips.colors.currentColor+'">&nbsp;</span></div>'+aa.text.currentColor+'</td><td rowspan="9" class="Button"><input type="button" class="Ok" value="'+aa.text.ok+'" title="'+aa.tooltips.buttons.ok+'"/><input type="button" class="Cancel" value="'+aa.text.cancel+'" title="'+aa.tooltips.buttons.cancel+'"/><hr/><div class="Grid">&nbsp;</div></td></tr><tr class="Hue"><td class="Radio"><input type="radio" id="jPicker_Hue_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="h" title="'+aa.tooltips.hue.radio+'"'+(av.color.mode=="h"?' checked="checked"':"")+'/></td><td class="Label"><label for="jPicker_Hue_'+c.length+'" title="'+aa.tooltips.hue.radio+'">H:</label></td><td class="Text"><input type="text" maxlength="3" value="'+G.active.val("h")+'" title="'+aa.tooltips.hue.textbox+'"/>&nbsp;&deg;</td></tr><tr class="Saturation"><td class="Radio"><input type="radio" id="jPicker_Saturation_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="s" title="'+aa.tooltips.saturation.radio+'"'+(av.color.mode=="s"?' checked="checked"':"")+'/></td><td class="Label"><label for="jPicker_Saturation_'+c.length+'" title="'+aa.tooltips.saturation.radio+'">S:</label></td><td class="Text"><input type="text" maxlength="3" value="'+G.active.val("s")+'" title="'+aa.tooltips.saturation.textbox+'"/>&nbsp;%</td></tr><tr class="Value"><td class="Radio"><input type="radio" id="jPicker_Value_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="v" title="'+aa.tooltips.value.radio+'"'+(av.color.mode=="v"?' checked="checked"':"")+'/><br/><br/></td><td class="Label"><label for="jPicker_Value_'+c.length+'" title="'+aa.tooltips.value.radio+'">V:</label><br/><br/></td><td class="Text"><input type="text" maxlength="3" value="'+G.active.val("v")+'" title="'+aa.tooltips.value.textbox+'"/>&nbsp;%<br/><br/></td></tr><tr class="Red"><td class="Radio"><input type="radio" id="jPicker_Red_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="r" title="'+aa.tooltips.red.radio+'"'+(av.color.mode=="r"?' checked="checked"':"")+'/></td><td class="Label"><label for="jPicker_Red_'+c.length+'" title="'+aa.tooltips.red.radio+'">R:</label></td><td class="Text"><input type="text" maxlength="3" value="'+G.active.val("r")+'" title="'+aa.tooltips.red.textbox+'"/></td></tr><tr class="Green"><td class="Radio"><input type="radio" id="jPicker_Green_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="g" title="'+aa.tooltips.green.radio+'"'+(av.color.mode=="g"?' checked="checked"':"")+'/></td><td class="Label"><label for="jPicker_Green_'+c.length+'" title="'+aa.tooltips.green.radio+'">G:</label></td><td class="Text"><input type="text" maxlength="3" value="'+G.active.val("g")+'" title="'+aa.tooltips.green.textbox+'"/></td></tr><tr class="Blue"><td class="Radio"><input type="radio" id="jPicker_Blue_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="b" title="'+aa.tooltips.blue.radio+'"'+(av.color.mode=="b"?' checked="checked"':"")+'/></td><td class="Label"><label for="jPicker_Blue_'+c.length+'" title="'+aa.tooltips.blue.radio+'">B:</label></td><td class="Text"><input type="text" maxlength="3" value="'+G.active.val("b")+'" title="'+aa.tooltips.blue.textbox+'"/></td></tr><tr class="Alpha"><td class="Radio">'+(aF.alphaSupport?'<input type="radio" id="jPicker_Alpha_'+c.length+'" name="jPicker_Mode_'+c.length+'" value="a" title="'+aa.tooltips.alpha.radio+'"'+(av.color.mode=="a"?' checked="checked"':"")+"/>":"&nbsp;")+'</td><td class="Label">'+(aF.alphaSupport?'<label for="jPicker_Alpha_'+c.length+'" title="'+aa.tooltips.alpha.radio+'">A:</label>':"&nbsp;")+'</td><td class="Text">'+(aF.alphaSupport?'<input type="text" maxlength="3" value="'+G.active.val("a")+'" title="'+aa.tooltips.alpha.textbox+'"/>&nbsp;%':"&nbsp;")+'</td></tr><tr class="Hex"><td colspan="3" class="Text"><label for="jPicker_Hex_'+c.length+'" title="'+aa.tooltips.hex.textbox+'">#:</label><input type="text" maxlength="6" class="Hex" id="jPicker_Hex_'+c.length+'" value="'+G.active.val("hex")+'" title="'+aa.tooltips.hex.textbox+'"/>'+(aF.alphaSupport?'<input type="text" maxlength="2" class="AHex" value="'+G.active.val("ahex").substring(6)+'" title="'+aa.tooltips.hex.alpha+'"/></td>':"&nbsp;")+"</tr></tbody></table>");var aC=R.find("tbody:first");l=aC.find("div.Map:first");s=aC.find("div.Bar:first");var aI=l.find("span"),aH=s.find("span");au=aI.filter(".Map1:first");at=aI.filter(".Map2:first");ar=aI.filter(".Map3:first");P=aH.filter(".Map1:first");O=aH.filter(".Map2:first");N=aH.filter(".Map3:first");M=aH.filter(".Map4:first");L=aH.filter(".Map5:first");K=aH.filter(".Map6:first");D=new d(l,{map:{width:n.colorMap.width,height:n.colorMap.height},arrow:{image:n.clientPath+n.colorMap.arrow.file,width:n.colorMap.arrow.width,height:n.colorMap.arrow.height}});D.bind(z);U=new d(s,{map:{width:n.colorBar.width,height:n.colorBar.height},arrow:{image:n.clientPath+n.colorBar.arrow.file,width:n.colorBar.arrow.width,height:n.colorBar.arrow.height}});U.bind(ac);aw=new b(aC,G.active,aF.expandable&&aF.bindToInput?aF.input:null);var aA=G.active.val("hex"),aG=aC.find(".Preview"),aD=aC.find(".Button");E=aG.find(".Active:first").css({backgroundColor:aA&&"#"+aA||"transparent"});an=aG.find(".Current:first").css({backgroundColor:aA&&"#"+aA||"transparent"}).bind("click",Z);ah=aD.find(".Ok:first").bind("click",m);X=aD.find(".Cancel:first").bind("click",q);ab=aD.find(".Grid:first");setTimeout(function(){t.call(w,au,n.clientPath+"Maps.png");t.call(w,at,n.clientPath+"Maps.png");t.call(w,ar,n.clientPath+"map-opacity.png");t.call(w,P,n.clientPath+"Bars.png");t.call(w,O,n.clientPath+"Bars.png");t.call(w,N,n.clientPath+"Bars.png");t.call(w,M,n.clientPath+"Bars.png");t.call(w,L,n.clientPath+"bar-opacity.png");t.call(w,K,n.clientPath+"AlphaBar.png");t.call(w,aG.find("div:first"),n.clientPath+"preview-opacity.png")},0);aC.find("td.Radio input").bind("click",A);if(G.quickList&&G.quickList.length>0){var aE="";for(i=0;i<G.quickList.length;i++){if((typeof(G.quickList[i])).toString().toLowerCase()=="string"){G.quickList[i]=new f({hex:G.quickList[i]})}var aB=G.quickList[i].val("ahex");var az=G.quickList[i].val("hex");aE+='<span class="QuickColor" title="'+(aB&&"#"+aB||"")+'" style="background-color: '+(az&&"#"+az||"transparent")+";"+(az?"":" background-image: url("+n.clientPath+"NoColor.png);")+'">&nbsp;</span>'}ab.html(aE);ab.find(".QuickColor").click(F)}ag.call(w,av.color.mode);G.active.bind(aj);e.isFunction(ad)&&G.active.bind(ad);G.current.bind(ap);if(aF.expandable){w.icon=R.parents(".Icon:first");aq=w.icon.find(".Color:first").css({backgroundColor:aA&&"#"+aA||"transparent"});r=w.icon.find(".Alpha:first");t.call(w,r,n.clientPath+"bar-opacity.png");Y.call(w,r,100-G.active.val("a"));C=w.icon.find(".Image:first").css({backgroundImage:"url("+n.clientPath+n.picker.file+")"}).bind("click",af);if(aF.bindToInput){aF.input.css({backgroundColor:aA&&"#"+aA||"transparent",color:G.active.val("v")>75?"#000000":"#ffffff"})}u=aC.find(".Move:first").bind("mousedown",S);G.active.bind(H)}else{V.call(w)}c.push(w)},ak=function(){R.find("td.Radio input").unbind("click",A);an.unbind("click",Z);X.unbind("click",q);ah.unbind("click",m);if(av.window.expandable){C.unbind("click",af);u.unbind("mousedown",S);w.icon=null}R.find(".QuickColor").unbind("click",F);l=null;s=null;au=null;at=null;ar=null;P=null;O=null;N=null;M=null;L=null;K=null;D.destroy();D=null;U.destroy();U=null;aw.destroy();aw=null;E=null;an=null;ah=null;X=null;ab=null;ae=null;ax=null;ad=null;R.html("");for(i=0;i<c.length;i++){if(c[i]==w){c.splice(i,1)}}},n=av.images,aa=av.localization,G={active:(typeof(av.color.active)).toString().toLowerCase()=="string"?new f({ahex:av.color.active}):new f({ahex:av.color.active.val("ahex")}),current:(typeof(av.color.active)).toString().toLowerCase()=="string"?new f({ahex:av.color.active}):new f({ahex:av.color.active.val("ahex")}),quickList:av.color.quickList};e.extend(true,w,{commitCallback:ae,liveCallback:ad,cancelCallback:ax,color:G,show:V,hide:ao,destroy:ak});setTimeout(function(){o.call(w)},0)})};e.fn.jPicker.defaults={window:{title:null,effects:{type:"slide",speed:{show:"slow",hide:"fast"}},position:{x:"screenCenter",y:"top"},expandable:false,liveUpdate:true,alphaSupport:false},color:{mode:"h",active:new f({ahex:"#ffcc00ff"}),quickList:[new f({h:360,s:33,v:100}),new f({h:360,s:66,v:100}),new f({h:360,s:100,v:100}),new f({h:360,s:100,v:75}),new f({h:360,s:100,v:50}),new f({h:180,s:0,v:100}),new f({h:30,s:33,v:100}),new f({h:30,s:66,v:100}),new f({h:30,s:100,v:100}),new f({h:30,s:100,v:75}),new f({h:30,s:100,v:50}),new f({h:180,s:0,v:90}),new f({h:60,s:33,v:100}),new f({h:60,s:66,v:100}),new f({h:60,s:100,v:100}),new f({h:60,s:100,v:75}),new f({h:60,s:100,v:50}),new f({h:180,s:0,v:80}),new f({h:90,s:33,v:100}),new f({h:90,s:66,v:100}),new f({h:90,s:100,v:100}),new f({h:90,s:100,v:75}),new f({h:90,s:100,v:50}),new f({h:180,s:0,v:70}),new f({h:120,s:33,v:100}),new f({h:120,s:66,v:100}),new f({h:120,s:100,v:100}),new f({h:120,s:100,v:75}),new f({h:120,s:100,v:50}),new f({h:180,s:0,v:60}),new f({h:150,s:33,v:100}),new f({h:150,s:66,v:100}),new f({h:150,s:100,v:100}),new f({h:150,s:100,v:75}),new f({h:150,s:100,v:50}),new f({h:180,s:0,v:50}),new f({h:180,s:33,v:100}),new f({h:180,s:66,v:100}),new f({h:180,s:100,v:100}),new f({h:180,s:100,v:75}),new f({h:180,s:100,v:50}),new f({h:180,s:0,v:40}),new f({h:210,s:33,v:100}),new f({h:210,s:66,v:100}),new f({h:210,s:100,v:100}),new f({h:210,s:100,v:75}),new f({h:210,s:100,v:50}),new f({h:180,s:0,v:30}),new f({h:240,s:33,v:100}),new f({h:240,s:66,v:100}),new f({h:240,s:100,v:100}),new f({h:240,s:100,v:75}),new f({h:240,s:100,v:50}),new f({h:180,s:0,v:20}),new f({h:270,s:33,v:100}),new f({h:270,s:66,v:100}),new f({h:270,s:100,v:100}),new f({h:270,s:100,v:75}),new f({h:270,s:100,v:50}),new f({h:180,s:0,v:10}),new f({h:300,s:33,v:100}),new f({h:300,s:66,v:100}),new f({h:300,s:100,v:100}),new f({h:300,s:100,v:75}),new f({h:300,s:100,v:50}),new f({h:180,s:0,v:0}),new f({h:330,s:33,v:100}),new f({h:330,s:66,v:100}),new f({h:330,s:100,v:100}),new f({h:330,s:100,v:75}),new f({h:330,s:100,v:50}),new f()]},images:{clientPath:"/images/colorpicker/",colorMap:{width:256,height:256,arrow:{file:"mappoint.gif",width:15,height:15}},colorBar:{width:20,height:256,arrow:{file:"rangearrows.gif",width:20,height:7}},picker:{file:"picker.gif",width:25,height:24}},localization:{text:{title:"Drag Markers To Pick A Color",newColor:"new",currentColor:"current",ok:"OK",cancel:"Cancel"},tooltips:{colors:{newColor:"New Color - Press &ldquo;OK&rdquo; To Commit",currentColor:"Click To Revert To Original Color"},buttons:{ok:"Commit To This Color Selection",cancel:"Cancel And Revert To Original Color"},hue:{radio:"Set To &ldquo;Hue&rdquo; Color Mode",textbox:"Enter A &ldquo;Hue&rdquo; Value (0-360&deg;)"},saturation:{radio:"Set To &ldquo;Saturation&rdquo; Color Mode",textbox:"Enter A &ldquo;Saturation&rdquo; Value (0-100%)"},value:{radio:"Set To &ldquo;Value&rdquo; Color Mode",textbox:"Enter A &ldquo;Value&rdquo; Value (0-100%)"},red:{radio:"Set To &ldquo;Red&rdquo; Color Mode",textbox:"Enter A &ldquo;Red&rdquo; Value (0-255)"},green:{radio:"Set To &ldquo;Green&rdquo; Color Mode",textbox:"Enter A &ldquo;Green&rdquo; Value (0-255)"},blue:{radio:"Set To &ldquo;Blue&rdquo; Color Mode",textbox:"Enter A &ldquo;Blue&rdquo; Value (0-255)"},alpha:{radio:"Set To &ldquo;Alpha&rdquo; Color Mode",textbox:"Enter A &ldquo;Alpha&rdquo; Value (0-100)"},hex:{textbox:"Enter A &ldquo;Hex&rdquo; Color Value (#000000-#ffffff)",alpha:"Enter A &ldquo;Alpha&rdquo; Value (#00-#ff)"}}}}})(jQuery,"1.1.2");	
/**
 *	Plugin initialization for throughout Mozexa Dashboard
 *	This MUST be the very last section of code as it calls upon plugins above.
 *	Copyright (c) 2010 Litwicki Media - http://www.litwickimedia.com
 */

$().ready(function(){

	//allow validation to pickup inline validation calls
	$.metadata.setType("attr", "validate");

	/**
	 *	Submit HTML Editor data before the editor is loaded
	 *	and inadvertently blanks out the .text of the editor init();
	 *	Source: http://maestric.com/doc/javascript/tinymce_jquery_ajax_form
	 */
	
	var editorCount = $('.wysiwyg').length + $('.wysiwyg_simple').length + $('.wysiwyg_plain');
	
	if(editorCount > 0){
		$('form').bind('form-pre-serialize', function(e) {
			tinyMCE.triggerSave();
		});
	}

	var WYSIWYG_OPTIONS = {
		script_url : '/js/tiny_mce/tiny_mce.js',
		theme : "advanced",
		entity_encoding : "raw",
		plugins : "paste,fullscreen,xhtmlxtras",

		theme_advanced_buttons1: "fullscreen,|,undo,redo,|,link,unlink,|,bold,italic,underline,|,paste,pasteword,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,justifyfull,|,code",
		theme_advanced_buttons2: "",
		theme_advanced_buttons3: "",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resize_horizontal : false,
		theme_advanced_resizing : true
	};

	$(".wysiwyg_simple, .wysiwyg").tinymce(WYSIWYG_OPTIONS);
	
	//all input.date-pick should be date selectors
	$(function() {
		$(".date-pick").datepicker({
			minDate: 0,
			numberOfMonths: 2,
			showOn: 'button', 
			buttonImage: '/images/icons/fugue/calendar-blue.png', 
			buttonImageOnly: false
		});
	});
	
	$(function() {
		$(".inline-date-pick").datepicker({
			minDate: -30,
			numberOfMonths: 2
		});
	});
	
	//tooltip Settings
	$('img, a, .ico').tooltip({ 
		track: true, 
		showURL: false, 
		showBody: " - ", 
		fade: 1000
	});
	
	$('label.error').tooltip({
		track: false,
		showURL: false,
		fade: 500
	});
	
	/**
	 *	Get the modal popup window for any .prompt
	 */
	$(".prompt").click(function(){
		var id = $(this).attr('rel');
		$(id).dialog('open');
	});

	$(function() {
		$(".modal, .dialog").dialog({
			autoOpen: false,
			show: 'blind',
			hide: 'explode',
			modal: true,
			overlay: { backgroundColor: '#000', opacity: 0.5 },
			width: 500,
			minWidth: 500,
			resizable: false
		});
	});
	
	$(".dialog-wysiwyg").dialog({
		bgiframe:true,
		autoOpen: false,
		show: 'blind',
		hide: 'explode',
		modal: true,
		resizable: false,
		width: 650,
		open: function(event, id){
			$(".wysiwyg_plain").tinymce(WYSIWYG_OPTIONS);
		},
		beforeClose:function(event, id) {
			tinyMCE.triggerSave();
			var i, t = tinyMCE.editors;
			for (i in t){
				if (t.hasOwnProperty(i)){
					t[i].remove();
				}
			}
		}
	});

	$(".multiselect").multiSelect({ 
		fadeSpeed: 500,
		selectedList: 5,
		minWidth: 600,
		noneSelectedText: "Select From Below"
	});
		
	$(".radiodropdown, .singleselect").multiSelect({
		multiple: false,
		showHeader: false,
		minWidth: 600,
		noneSelectedText: "Select One",
		selectedText: function(numChecked, numTotal, checkedItem){
			return $(checkedItem).attr("title");
		}
	});

	//set default jqueryui speeds
	$.fx.speeds._default = 1000;
	
	//make popups draggable around the window
	$(function() {
		$(".ui-dialog").draggable({ handle: ".ui-dialog-titlebar" });
	});

	/* make buttons pretty */
	$(function() {
		$("button, .button").button();
	});
	
	//any radio inputs within .radiobuttons will 
	//be wrapped in jqueryui button elements
	$(function() {
		$(".radiobuttons, .checkboxlist").buttonset();
	});
	
	$('#dashboard-menu li').hover(function() {
	  $(this).addClass('ui-state-hover');
	}, function() {
		if($(this).attr('id') != 'ui-selected'){
			$(this).removeClass('ui-state-hover');
		}
	});

	//custom input checkboxes/radios
	$(function(){
		$('.custominput input, .ui-custom-input').customInput();
	});
	
	//make table sorttable
	$(".sortable").tablesorter({widgets: ['zebra']}).tablesorterPager({container: $(".pager")});
	
	$('.colorpicker').jPicker();
	
});