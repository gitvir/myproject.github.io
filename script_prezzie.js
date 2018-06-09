
(function() {
    "use strict";

    // custom scrollbar

    $("html").niceScroll({styler:"fb",cursorcolor:"#ff0000", cursorwidth: '6', cursorborderradius: '10px', background: '#FFFFFF', spacebarenabled:false, cursorborder: '0',  zindex: '1000'});

    $(".scrollbar1").niceScroll({styler:"fb",cursorcolor:"#ff0000", cursorwidth: '6', cursorborderradius: '0',autohidemode: 'false', background: '#FFFFFF', spacebarenabled:false, cursorborder: '0'});

	
	
    $(".scrollbar1").getNiceScroll();
    if ($('nav.gn-menu-wrapper').hasClass('scrollbar1-collapsed')) {
        $(".scrollbar1").getNiceScroll().hide();
    }

})(jQuery);

(function ($) {

    $.fn.flexisel = function (options) {

        var defaults = $.extend({
            visibleItems: 4,
            animationSpeed: 200,
            autoPlay: false,
            autoPlaySpeed: 3000,            
            pauseOnHover: true,
            setMaxWidthAndHeight: false,
            enableResponsiveBreakpoints: false,
            responsiveBreakpoints: { 
                portrait: { 
                    changePoint:480,
                    visibleItems: 1
                }, 
                landscape: { 
                    changePoint:640,
                    visibleItems: 2
                },
                tablet: { 
                    changePoint:768,
                    visibleItems: 3
                }
            }
        }, options);
        
        /******************************
        Private Variables
        *******************************/         
        
        var object = $(this);
        var settings = $.extend(defaults, options);        
        var itemsWidth; // Declare the global width of each item in carousel
        var canNavigate = true; 
        var itemsVisible = settings.visibleItems; 
        
        /******************************
        Public Methods
        *******************************/        
        
        var methods = {
                
            init: function() {
                
                return this.each(function () {
                    methods.appendHTML();
                    methods.setEventHandlers();                 
                    methods.initializeItems();
                });
            },

            /******************************
            Initialize Items
            *******************************/            
            
            initializeItems: function() {
                
                var listParent = object.parent();
                var innerHeight = listParent.height(); 
                var childSet = object.children();
                
                var innerWidth = listParent.width(); // Set widths
                itemsWidth = (innerWidth)/itemsVisible;
                childSet.width(itemsWidth);
                childSet.last().insertBefore(childSet.first());
                childSet.last().insertBefore(childSet.first());
                object.css({'left' : -itemsWidth}); 

                object.fadeIn();
                $(window).trigger("resize"); // needed to position arrows correctly

            },
            
            
            /******************************
            Append HTML
            *******************************/            
            
            appendHTML: function() {
                
                object.addClass("nbs-flexisel-ul");
                object.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner'></div></div>");
                object.find("li").addClass("nbs-flexisel-item");
 
                if(settings.setMaxWidthAndHeight) {
                    var baseWidth = $(".nbs-flexisel-item > img").width();
                    var baseHeight = $(".nbs-flexisel-item > img").height();
                    $(".nbs-flexisel-item > img").css("max-width", baseWidth);
                    $(".nbs-flexisel-item > img").css("max-height", baseHeight);
                }
 
                $("<div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div>").insertAfter(object);
                var cloneContent = object.children().clone();
                object.append(cloneContent);
            },
                    
            
            /******************************
            Set Event Handlers
            *******************************/
            setEventHandlers: function() {
                
                var listParent = object.parent();
                var childSet = object.children();
                var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
                var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));
                
                $(window).on("resize", function(event){
                    
                    methods.setResponsiveEvents();
                    
                    var innerWidth = $(listParent).width();
                    var innerHeight = $(listParent).height(); 
                    
                    itemsWidth = (innerWidth)/itemsVisible;
                    
                    childSet.width(itemsWidth);
                    object.css({'left' : -itemsWidth});
                    
                    var halfArrowHeight = (leftArrow.height())/2;
                    var arrowMargin = (innerHeight/2) - halfArrowHeight;
                    leftArrow.css("top", arrowMargin + "px");
                    rightArrow.css("top", arrowMargin + "px");
                    
                });                 
                
                $(leftArrow).on("click", function (event) {
                    methods.scrollLeft();
                });
                
                $(rightArrow).on("click", function (event) {
                    methods.scrollRight();
                });
                
                if(settings.pauseOnHover == true) {
                    $(".nbs-flexisel-item").on({
                        mouseenter: function () {
                            canNavigate = false;
                        }, 
                        mouseleave: function () {
                            canNavigate = true;
                        }
                     });
                }

                if(settings.autoPlay == true) {
                    
                    setInterval(function () {
                        if(canNavigate == true)
                            methods.scrollRight();
                    }, settings.autoPlaySpeed);
                }
                
            },
            
            /******************************
            Set Responsive Events
            *******************************/            
            
            setResponsiveEvents: function() {
                var contentWidth = $('html').width();
                
                if(settings.enableResponsiveBreakpoints == true) {
                    if(contentWidth < settings.responsiveBreakpoints.portrait.changePoint) {
                        itemsVisible = settings.responsiveBreakpoints.portrait.visibleItems;
                    }
                    else if(contentWidth > settings.responsiveBreakpoints.portrait.changePoint && contentWidth < settings.responsiveBreakpoints.landscape.changePoint) {
                        itemsVisible = settings.responsiveBreakpoints.landscape.visibleItems;
                    }
                    else if(contentWidth > settings.responsiveBreakpoints.landscape.changePoint && contentWidth < settings.responsiveBreakpoints.tablet.changePoint) {
                        itemsVisible = settings.responsiveBreakpoints.tablet.visibleItems;
                    }
                    else {
                        itemsVisible = settings.visibleItems;
                    }
                }
            },          
            
            /******************************
            Scroll Left
            *******************************/                
            
            scrollLeft:function() {

                if(canNavigate == true) {
                    canNavigate = false;
                    
                    var listParent = object.parent();
                    var innerWidth = listParent.width();
                    
                    itemsWidth = (innerWidth)/itemsVisible;
                    
                    var childSet = object.children();
                    
                    object.animate({
                            'left' : "+=" + itemsWidth
                        },
                        {
                            queue:false, 
                            duration:settings.animationSpeed,
                            easing: "linear",
                            complete: function() {  
                                childSet.last().insertBefore(childSet.first()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                
                                methods.adjustScroll();
                                canNavigate = true; 
                            }
                        }
                    );
                }
            },
            
            /******************************
            Scroll Right
            *******************************/                
            
            scrollRight:function() {
                
                if(canNavigate == true) {
                    canNavigate = false;
                    
                    var listParent = object.parent();
                    var innerWidth = listParent.width();
                    
                    itemsWidth = (innerWidth)/itemsVisible;
                    
                    var childSet = object.children();
                    
                    object.animate({
                            'left' : "-=" + itemsWidth
                        },
                        {
                            queue:false, 
                            duration:settings.animationSpeed,
                            easing: "linear",
                            complete: function() {  
                                childSet.first().insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)   
                                methods.adjustScroll();
                                canNavigate = true; 
                            }
                        }
                    );
                }
            },
            
            /******************************
            Adjust Scroll 
            *******************************/
            
            adjustScroll: function() {
                
                var listParent = object.parent();
                var childSet = object.children();               
                
                var innerWidth = listParent.width(); 
                itemsWidth = (innerWidth)/itemsVisible;
                childSet.width(itemsWidth);
                object.css({'left' : -itemsWidth});     
            }           
        
        };
        
        if (methods[options]) {     // $("#element").pluginName('methodName', 'arg1', 'arg2');
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {   // $("#element").pluginName({ option: 1, option:2 });
            return methods.init.apply(this);  
        } else {
            $.error( 'Method "' +  method + '" does not exist in flexisel plugin!');
        }        
};

})(jQuery);

/* jquery.nicescroll 3.5.0 InuYaksa*2013 MIT http://areaaperta.com/nicescroll */(function(e){var z=!1,E=!1,L=5E3,M=2E3,y=0,N=function(){var e=document.getElementsByTagName("script"),e=e[e.length-1].src.split("?")[0];return 0<e.split("/").length?e.split("/").slice(0,-1).join("/")+"/":""}(),H=["ms","moz","webkit","o"],v=window.requestAnimationFrame||!1,w=window.cancelAnimationFrame||!1;if(!v)for(var O in H){var F=H[O];v||(v=window[F+"RequestAnimationFrame"]);w||(w=window[F+"CancelAnimationFrame"]||window[F+"CancelRequestAnimationFrame"])}var A=window.MutationObserver||window.WebKitMutationObserver||
    !1,I={zindex:"auto",cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"5px",cursorborder:"1px solid #fff",cursorborderradius:"5px",scrollspeed:60,mousescrollstep:24,touchbehavior:!1,hwacceleration:!0,usetransition:!0,boxzoom:!1,dblclickzoom:!0,gesturezoom:!0,grabcursorenabled:!0,autohidemode:!0,background:"",iframeautoresize:!0,cursorminheight:32,preservenativescrolling:!0,railoffset:!1,bouncescroll:!0,spacebarenabled:!0,railpadding:{top:0,right:0,left:0,bottom:0},disableoutline:!0,
    horizrailenabled:!0,railalign:"right",railvalign:"bottom",enabletranslate3d:!0,enablemousewheel:!0,enablekeyboard:!0,smoothscroll:!0,sensitiverail:!0,enablemouselockapi:!0,cursorfixedheight:!1,directionlockdeadzone:6,hidecursordelay:400,nativeparentscrolling:!0,enablescrollonselection:!0,overflowx:!0,overflowy:!0,cursordragspeed:0.3,rtlmode:!1,cursordragontouch:!1,oneaxismousemode:"auto"},G=!1,P=function(){if(G)return G;var e=document.createElement("DIV"),c={haspointerlock:"pointerLockElement"in document||
    "mozPointerLockElement"in document||"webkitPointerLockElement"in document};c.isopera="opera"in window;c.isopera12=c.isopera&&"getUserMedia"in navigator;c.isoperamini="[object OperaMini]"===Object.prototype.toString.call(window.operamini);c.isie="all"in document&&"attachEvent"in e&&!c.isopera;c.isieold=c.isie&&!("msInterpolationMode"in e.style);c.isie7=c.isie&&!c.isieold&&(!("documentMode"in document)||7==document.documentMode);c.isie8=c.isie&&"documentMode"in document&&8==document.documentMode;c.isie9=
    c.isie&&"performance"in window&&9<=document.documentMode;c.isie10=c.isie&&"performance"in window&&10<=document.documentMode;c.isie9mobile=/iemobile.9/i.test(navigator.userAgent);c.isie9mobile&&(c.isie9=!1);c.isie7mobile=!c.isie9mobile&&c.isie7&&/iemobile/i.test(navigator.userAgent);c.ismozilla="MozAppearance"in e.style;c.iswebkit="WebkitAppearance"in e.style;c.ischrome="chrome"in window;c.ischrome22=c.ischrome&&c.haspointerlock;c.ischrome26=c.ischrome&&"transition"in e.style;c.cantouch="ontouchstart"in
    document.documentElement||"ontouchstart"in window;c.hasmstouch=window.navigator.msPointerEnabled||!1;c.ismac=/^mac$/i.test(navigator.platform);c.isios=c.cantouch&&/iphone|ipad|ipod/i.test(navigator.platform);c.isios4=c.isios&&!("seal"in Object);c.isandroid=/android/i.test(navigator.userAgent);c.trstyle=!1;c.hastransform=!1;c.hastranslate3d=!1;c.transitionstyle=!1;c.hastransition=!1;c.transitionend=!1;for(var k=["transform","msTransform","webkitTransform","MozTransform","OTransform"],l=0;l<k.length;l++)if("undefined"!=
    typeof e.style[k[l]]){c.trstyle=k[l];break}c.hastransform=!1!=c.trstyle;c.hastransform&&(e.style[c.trstyle]="translate3d(1px,2px,3px)",c.hastranslate3d=/translate3d/.test(e.style[c.trstyle]));c.transitionstyle=!1;c.prefixstyle="";c.transitionend=!1;for(var k="transition webkitTransition MozTransition OTransition OTransition msTransition KhtmlTransition".split(" "),q=" -webkit- -moz- -o- -o -ms- -khtml-".split(" "),t="transitionend webkitTransitionEnd transitionend otransitionend oTransitionEnd msTransitionEnd KhtmlTransitionEnd".split(" "),
                                                                                                                                                                                                                                                                     l=0;l<k.length;l++)if(k[l]in e.style){c.transitionstyle=k[l];c.prefixstyle=q[l];c.transitionend=t[l];break}c.ischrome26&&(c.prefixstyle=q[1]);c.hastransition=c.transitionstyle;a:{k=["-moz-grab","-webkit-grab","grab"];if(c.ischrome&&!c.ischrome22||c.isie)k=[];for(l=0;l<k.length;l++)if(q=k[l],e.style.cursor=q,e.style.cursor==q){k=q;break a}k="url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize"}c.cursorgrabvalue=k;c.hasmousecapture="setCapture"in e;c.hasMutationObserver=!1!==A;return G=
    c},Q=function(h,c){function k(){var d=b.win;if("zIndex"in d)return d.zIndex();for(;0<d.length&&9!=d[0].nodeType;){var c=d.css("zIndex");if(!isNaN(c)&&0!=c)return parseInt(c);d=d.parent()}return!1}function l(d,c,f){c=d.css(c);d=parseFloat(c);return isNaN(d)?(d=u[c]||0,f=3==d?f?b.win.outerHeight()-b.win.innerHeight():b.win.outerWidth()-b.win.innerWidth():1,b.isie8&&d&&(d+=1),f?d:0):d}function q(d,c,f,g){b._bind(d,c,function(b){b=b?b:window.event;var g={original:b,target:b.target||b.srcElement,type:"wheel",
    deltaMode:"MozMousePixelScroll"==b.type?0:1,deltaX:0,deltaZ:0,preventDefault:function(){b.preventDefault?b.preventDefault():b.returnValue=!1;return!1},stopImmediatePropagation:function(){b.stopImmediatePropagation?b.stopImmediatePropagation():b.cancelBubble=!0}};"mousewheel"==c?(g.deltaY=-0.025*b.wheelDelta,b.wheelDeltaX&&(g.deltaX=-0.025*b.wheelDeltaX)):g.deltaY=b.detail;return f.call(d,g)},g)}function t(d,c,f){var g,e;0==d.deltaMode?(g=-Math.floor(d.deltaX*(b.opt.mousescrollstep/54)),e=-Math.floor(d.deltaY*
    (b.opt.mousescrollstep/54))):1==d.deltaMode&&(g=-Math.floor(d.deltaX*b.opt.mousescrollstep),e=-Math.floor(d.deltaY*b.opt.mousescrollstep));c&&(b.opt.oneaxismousemode&&0==g&&e)&&(g=e,e=0);g&&(b.scrollmom&&b.scrollmom.stop(),b.lastdeltax+=g,b.debounced("mousewheelx",function(){var d=b.lastdeltax;b.lastdeltax=0;b.rail.drag||b.doScrollLeftBy(d)},120));if(e){if(b.opt.nativeparentscrolling&&f&&!b.ispage&&!b.zoomactive)if(0>e){if(b.getScrollTop()>=b.page.maxh)return!0}else if(0>=b.getScrollTop())return!0;
    b.scrollmom&&b.scrollmom.stop();b.lastdeltay+=e;b.debounced("mousewheely",function(){var d=b.lastdeltay;b.lastdeltay=0;b.rail.drag||b.doScrollBy(d)},120)}d.stopImmediatePropagation();return d.preventDefault()}var b=this;this.version="3.5.0";this.name="nicescroll";this.me=c;this.opt={doc:e("body"),win:!1};e.extend(this.opt,I);this.opt.snapbackspeed=80;if(h)for(var p in b.opt)"undefined"!=typeof h[p]&&(b.opt[p]=h[p]);this.iddoc=(this.doc=b.opt.doc)&&this.doc[0]?this.doc[0].id||"":"";this.ispage=/BODY|HTML/.test(b.opt.win?
    b.opt.win[0].nodeName:this.doc[0].nodeName);this.haswrapper=!1!==b.opt.win;this.win=b.opt.win||(this.ispage?e(window):this.doc);this.docscroll=this.ispage&&!this.haswrapper?e(window):this.win;this.body=e("body");this.iframe=this.isfixed=this.viewport=!1;this.isiframe="IFRAME"==this.doc[0].nodeName&&"IFRAME"==this.win[0].nodeName;this.istextarea="TEXTAREA"==this.win[0].nodeName;this.forcescreen=!1;this.canshowonmouseevent="scroll"!=b.opt.autohidemode;this.page=this.view=this.onzoomout=this.onzoomin=
    this.onscrollcancel=this.onscrollend=this.onscrollstart=this.onclick=this.ongesturezoom=this.onkeypress=this.onmousewheel=this.onmousemove=this.onmouseup=this.onmousedown=!1;this.scroll={x:0,y:0};this.scrollratio={x:0,y:0};this.cursorheight=20;this.scrollvaluemax=0;this.observerremover=this.observer=this.scrollmom=this.scrollrunning=this.checkrtlmode=!1;do this.id="ascrail"+M++;while(document.getElementById(this.id));this.hasmousefocus=this.hasfocus=this.zoomactive=this.zoom=this.selectiondrag=this.cursorfreezed=
    this.cursor=this.rail=!1;this.visibility=!0;this.hidden=this.locked=!1;this.cursoractive=!0;this.overflowx=b.opt.overflowx;this.overflowy=b.opt.overflowy;this.nativescrollingarea=!1;this.checkarea=0;this.events=[];this.saved={};this.delaylist={};this.synclist={};this.lastdeltay=this.lastdeltax=0;this.detected=P();var g=e.extend({},this.detected);this.ishwscroll=(this.canhwscroll=g.hastransform&&b.opt.hwacceleration)&&b.haswrapper;this.istouchcapable=!1;g.cantouch&&(g.ischrome&&!g.isios&&!g.isandroid)&&
(this.istouchcapable=!0,g.cantouch=!1);g.cantouch&&(g.ismozilla&&!g.isios&&!g.isandroid)&&(this.istouchcapable=!0,g.cantouch=!1);b.opt.enablemouselockapi||(g.hasmousecapture=!1,g.haspointerlock=!1);this.delayed=function(d,c,f,g){var e=b.delaylist[d],k=(new Date).getTime();if(!g&&e&&e.tt)return!1;e&&e.tt&&clearTimeout(e.tt);if(e&&e.last+f>k&&!e.tt)b.delaylist[d]={last:k+f,tt:setTimeout(function(){b.delaylist[d].tt=0;c.call()},f)};else if(!e||!e.tt)b.delaylist[d]={last:k,tt:0},setTimeout(function(){c.call()},
    0)};this.debounced=function(d,c,f){var g=b.delaylist[d];(new Date).getTime();b.delaylist[d]=c;g||setTimeout(function(){var c=b.delaylist[d];b.delaylist[d]=!1;c.call()},f)};this.synched=function(d,c){b.synclist[d]=c;(function(){b.onsync||(v(function(){b.onsync=!1;for(d in b.synclist){var c=b.synclist[d];c&&c.call(b);b.synclist[d]=!1}}),b.onsync=!0)})();return d};this.unsynched=function(d){b.synclist[d]&&(b.synclist[d]=!1)};this.css=function(d,c){for(var f in c)b.saved.css.push([d,f,d.css(f)]),d.css(f,
    c[f])};this.scrollTop=function(d){return"undefined"==typeof d?b.getScrollTop():b.setScrollTop(d)};this.scrollLeft=function(d){return"undefined"==typeof d?b.getScrollLeft():b.setScrollLeft(d)};BezierClass=function(b,c,f,g,e,k,l){this.st=b;this.ed=c;this.spd=f;this.p1=g||0;this.p2=e||1;this.p3=k||0;this.p4=l||1;this.ts=(new Date).getTime();this.df=this.ed-this.st};BezierClass.prototype={B2:function(b){return 3*b*b*(1-b)},B3:function(b){return 3*b*(1-b)*(1-b)},B4:function(b){return(1-b)*(1-b)*(1-b)},
    getNow:function(){var b=1-((new Date).getTime()-this.ts)/this.spd,c=this.B2(b)+this.B3(b)+this.B4(b);return 0>b?this.ed:this.st+Math.round(this.df*c)},update:function(b,c){this.st=this.getNow();this.ed=b;this.spd=c;this.ts=(new Date).getTime();this.df=this.ed-this.st;return this}};if(this.ishwscroll){this.doc.translate={x:0,y:0,tx:"0px",ty:"0px"};g.hastranslate3d&&g.isios&&this.doc.css("-webkit-backface-visibility","hidden");var s=function(){var d=b.doc.css(g.trstyle);return d&&"matrix"==d.substr(0,
    6)?d.replace(/^.*\((.*)\)$/g,"$1").replace(/px/g,"").split(/, +/):!1};this.getScrollTop=function(d){if(!d){if(d=s())return 16==d.length?-d[13]:-d[5];if(b.timerscroll&&b.timerscroll.bz)return b.timerscroll.bz.getNow()}return b.doc.translate.y};this.getScrollLeft=function(d){if(!d){if(d=s())return 16==d.length?-d[12]:-d[4];if(b.timerscroll&&b.timerscroll.bh)return b.timerscroll.bh.getNow()}return b.doc.translate.x};this.notifyScrollEvent=document.createEvent?function(b){var c=document.createEvent("UIEvents");
    c.initUIEvent("scroll",!1,!0,window,1);b.dispatchEvent(c)}:document.fireEvent?function(b){var c=document.createEventObject();b.fireEvent("onscroll");c.cancelBubble=!0}:function(b,c){};g.hastranslate3d&&b.opt.enabletranslate3d?(this.setScrollTop=function(d,c){b.doc.translate.y=d;b.doc.translate.ty=-1*d+"px";b.doc.css(g.trstyle,"translate3d("+b.doc.translate.tx+","+b.doc.translate.ty+",0px)");c||b.notifyScrollEvent(b.win[0])},this.setScrollLeft=function(d,c){b.doc.translate.x=d;b.doc.translate.tx=-1*
    d+"px";b.doc.css(g.trstyle,"translate3d("+b.doc.translate.tx+","+b.doc.translate.ty+",0px)");c||b.notifyScrollEvent(b.win[0])}):(this.setScrollTop=function(d,c){b.doc.translate.y=d;b.doc.translate.ty=-1*d+"px";b.doc.css(g.trstyle,"translate("+b.doc.translate.tx+","+b.doc.translate.ty+")");c||b.notifyScrollEvent(b.win[0])},this.setScrollLeft=function(d,c){b.doc.translate.x=d;b.doc.translate.tx=-1*d+"px";b.doc.css(g.trstyle,"translate("+b.doc.translate.tx+","+b.doc.translate.ty+")");c||b.notifyScrollEvent(b.win[0])})}else this.getScrollTop=
    function(){return b.docscroll.scrollTop()},this.setScrollTop=function(d){return b.docscroll.scrollTop(d)},this.getScrollLeft=function(){return b.docscroll.scrollLeft()},this.setScrollLeft=function(d){return b.docscroll.scrollLeft(d)};this.getTarget=function(b){return!b?!1:b.target?b.target:b.srcElement?b.srcElement:!1};this.hasParent=function(b,c){if(!b)return!1;for(var f=b.target||b.srcElement||b||!1;f&&f.id!=c;)f=f.parentNode||!1;return!1!==f};var u={thin:1,medium:3,thick:5};this.getOffset=function(){if(b.isfixed)return{top:parseFloat(b.win.css("top")),
    left:parseFloat(b.win.css("left"))};if(!b.viewport)return b.win.offset();var d=b.win.offset(),c=b.viewport.offset();return{top:d.top-c.top+b.viewport.scrollTop(),left:d.left-c.left+b.viewport.scrollLeft()}};this.updateScrollBar=function(d){if(b.ishwscroll)b.rail.css({height:b.win.innerHeight()}),b.railh&&b.railh.css({width:b.win.innerWidth()});else{var c=b.getOffset(),f=c.top,g=c.left,f=f+l(b.win,"border-top-width",!0);b.win.outerWidth();b.win.innerWidth();var g=g+(b.rail.align?b.win.outerWidth()-
    l(b.win,"border-right-width")-b.rail.width:l(b.win,"border-left-width")),e=b.opt.railoffset;e&&(e.top&&(f+=e.top),b.rail.align&&e.left&&(g+=e.left));b.locked||b.rail.css({top:f,left:g,height:d?d.h:b.win.innerHeight()});b.zoom&&b.zoom.css({top:f+1,left:1==b.rail.align?g-20:g+b.rail.width+4});b.railh&&!b.locked&&(f=c.top,g=c.left,d=b.railh.align?f+l(b.win,"border-top-width",!0)+b.win.innerHeight()-b.railh.height:f+l(b.win,"border-top-width",!0),g+=l(b.win,"border-left-width"),b.railh.css({top:d,left:g,
    width:b.railh.width}))}};this.doRailClick=function(d,c,f){var g;b.locked||(b.cancelEvent(d),c?(c=f?b.doScrollLeft:b.doScrollTop,g=f?(d.pageX-b.railh.offset().left-b.cursorwidth/2)*b.scrollratio.x:(d.pageY-b.rail.offset().top-b.cursorheight/2)*b.scrollratio.y,c(g)):(c=f?b.doScrollLeftBy:b.doScrollBy,g=f?b.scroll.x:b.scroll.y,d=f?d.pageX-b.railh.offset().left:d.pageY-b.rail.offset().top,f=f?b.view.w:b.view.h,g>=d?c(f):c(-f)))};b.hasanimationframe=v;b.hascancelanimationframe=w;b.hasanimationframe?b.hascancelanimationframe||
    (w=function(){b.cancelAnimationFrame=!0}):(v=function(b){return setTimeout(b,15-Math.floor(+new Date/1E3)%16)},w=clearInterval);this.init=function(){b.saved.css=[];if(g.isie7mobile||g.isoperamini)return!0;g.hasmstouch&&b.css(b.ispage?e("html"):b.win,{"-ms-touch-action":"none"});b.zindex="auto";b.zindex=!b.ispage&&"auto"==b.opt.zindex?k()||"auto":b.opt.zindex;!b.ispage&&"auto"!=b.zindex&&b.zindex>y&&(y=b.zindex);b.isie&&(0==b.zindex&&"auto"==b.opt.zindex)&&(b.zindex="auto");if(!b.ispage||!g.cantouch&&
    !g.isieold&&!g.isie9mobile){var d=b.docscroll;b.ispage&&(d=b.haswrapper?b.win:b.doc);g.isie9mobile||b.css(d,{"overflow-y":"hidden"});b.ispage&&g.isie7&&("BODY"==b.doc[0].nodeName?b.css(e("html"),{"overflow-y":"hidden"}):"HTML"==b.doc[0].nodeName&&b.css(e("body"),{"overflow-y":"hidden"}));g.isios&&(!b.ispage&&!b.haswrapper)&&b.css(e("body"),{"-webkit-overflow-scrolling":"touch"});var c=e(document.createElement("div"));c.css({position:"relative",top:0,"float":"right",width:b.opt.cursorwidth,height:"0px",
    "background-color":b.opt.cursorcolor,border:b.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":b.opt.cursorborderradius,"-moz-border-radius":b.opt.cursorborderradius,"border-radius":b.opt.cursorborderradius});c.hborder=parseFloat(c.outerHeight()-c.innerHeight());b.cursor=c;var f=e(document.createElement("div"));f.attr("id",b.id);f.addClass("nicescroll-rails");var l,h,x=["left","right"],q;for(q in x)h=x[q],(l=b.opt.railpadding[h])?f.css("padding-"+h,l+"px"):b.opt.railpadding[h]=
    0;f.append(c);f.width=Math.max(parseFloat(b.opt.cursorwidth),c.outerWidth())+b.opt.railpadding.left+b.opt.railpadding.right;f.css({width:f.width+"px",zIndex:b.zindex,background:b.opt.background,cursor:"default"});f.visibility=!0;f.scrollable=!0;f.align="left"==b.opt.railalign?0:1;b.rail=f;c=b.rail.drag=!1;b.opt.boxzoom&&(!b.ispage&&!g.isieold)&&(c=document.createElement("div"),b.bind(c,"click",b.doZoom),b.zoom=e(c),b.zoom.css({cursor:"pointer","z-index":b.zindex,backgroundImage:"url("+N+"zoomico.png)",
    height:18,width:18,backgroundPosition:"0px 0px"}),b.opt.dblclickzoom&&b.bind(b.win,"dblclick",b.doZoom),g.cantouch&&b.opt.gesturezoom&&(b.ongesturezoom=function(d){1.5<d.scale&&b.doZoomIn(d);0.8>d.scale&&b.doZoomOut(d);return b.cancelEvent(d)},b.bind(b.win,"gestureend",b.ongesturezoom)));b.railh=!1;if(b.opt.horizrailenabled){b.css(d,{"overflow-x":"hidden"});c=e(document.createElement("div"));c.css({position:"relative",top:0,height:b.opt.cursorwidth,width:"0px","background-color":b.opt.cursorcolor,
    border:b.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":b.opt.cursorborderradius,"-moz-border-radius":b.opt.cursorborderradius,"border-radius":b.opt.cursorborderradius});c.wborder=parseFloat(c.outerWidth()-c.innerWidth());b.cursorh=c;var m=e(document.createElement("div"));m.attr("id",b.id+"-hr");m.addClass("nicescroll-rails");m.height=Math.max(parseFloat(b.opt.cursorwidth),c.outerHeight());m.css({height:m.height+"px",zIndex:b.zindex,background:b.opt.background});m.append(c);
    m.visibility=!0;m.scrollable=!0;m.align="top"==b.opt.railvalign?0:1;b.railh=m;b.railh.drag=!1}b.ispage?(f.css({position:"fixed",top:"0px",height:"100%"}),f.align?f.css({right:"0px"}):f.css({left:"0px"}),b.body.append(f),b.railh&&(m.css({position:"fixed",left:"0px",width:"100%"}),m.align?m.css({bottom:"0px"}):m.css({top:"0px"}),b.body.append(m))):(b.ishwscroll?("static"==b.win.css("position")&&b.css(b.win,{position:"relative"}),d="HTML"==b.win[0].nodeName?b.body:b.win,b.zoom&&(b.zoom.css({position:"absolute",
    top:1,right:0,"margin-right":f.width+4}),d.append(b.zoom)),f.css({position:"absolute",top:0}),f.align?f.css({right:0}):f.css({left:0}),d.append(f),m&&(m.css({position:"absolute",left:0,bottom:0}),m.align?m.css({bottom:0}):m.css({top:0}),d.append(m))):(b.isfixed="fixed"==b.win.css("position"),d=b.isfixed?"fixed":"absolute",b.isfixed||(b.viewport=b.getViewport(b.win[0])),b.viewport&&(b.body=b.viewport,!1==/fixed|relative|absolute/.test(b.viewport.css("position"))&&b.css(b.viewport,{position:"relative"})),
    f.css({position:d}),b.zoom&&b.zoom.css({position:d}),b.updateScrollBar(),b.body.append(f),b.zoom&&b.body.append(b.zoom),b.railh&&(m.css({position:d}),b.body.append(m))),g.isios&&b.css(b.win,{"-webkit-tap-highlight-color":"rgba(0,0,0,0)","-webkit-touch-callout":"none"}),g.isie&&b.opt.disableoutline&&b.win.attr("hideFocus","true"),g.iswebkit&&b.opt.disableoutline&&b.win.css({outline:"none"}));!1===b.opt.autohidemode?(b.autohidedom=!1,b.rail.css({opacity:b.opt.cursoropacitymax}),b.railh&&b.railh.css({opacity:b.opt.cursoropacitymax})):
    !0===b.opt.autohidemode||"leave"===b.opt.autohidemode?(b.autohidedom=e().add(b.rail),g.isie8&&(b.autohidedom=b.autohidedom.add(b.cursor)),b.railh&&(b.autohidedom=b.autohidedom.add(b.railh)),b.railh&&g.isie8&&(b.autohidedom=b.autohidedom.add(b.cursorh))):"scroll"==b.opt.autohidemode?(b.autohidedom=e().add(b.rail),b.railh&&(b.autohidedom=b.autohidedom.add(b.railh))):"cursor"==b.opt.autohidemode?(b.autohidedom=e().add(b.cursor),b.railh&&(b.autohidedom=b.autohidedom.add(b.cursorh))):"hidden"==b.opt.autohidemode&&
        (b.autohidedom=!1,b.hide(),b.locked=!1);if(g.isie9mobile)b.scrollmom=new J(b),b.onmangotouch=function(d){d=b.getScrollTop();var c=b.getScrollLeft();if(d==b.scrollmom.lastscrolly&&c==b.scrollmom.lastscrollx)return!0;var f=d-b.mangotouch.sy,g=c-b.mangotouch.sx;if(0!=Math.round(Math.sqrt(Math.pow(g,2)+Math.pow(f,2)))){var n=0>f?-1:1,e=0>g?-1:1,k=+new Date;b.mangotouch.lazy&&clearTimeout(b.mangotouch.lazy);80<k-b.mangotouch.tm||b.mangotouch.dry!=n||b.mangotouch.drx!=e?(b.scrollmom.stop(),b.scrollmom.reset(c,
    d),b.mangotouch.sy=d,b.mangotouch.ly=d,b.mangotouch.sx=c,b.mangotouch.lx=c,b.mangotouch.dry=n,b.mangotouch.drx=e,b.mangotouch.tm=k):(b.scrollmom.stop(),b.scrollmom.update(b.mangotouch.sx-g,b.mangotouch.sy-f),b.mangotouch.tm=k,f=Math.max(Math.abs(b.mangotouch.ly-d),Math.abs(b.mangotouch.lx-c)),b.mangotouch.ly=d,b.mangotouch.lx=c,2<f&&(b.mangotouch.lazy=setTimeout(function(){b.mangotouch.lazy=!1;b.mangotouch.dry=0;b.mangotouch.drx=0;b.mangotouch.tm=0;b.scrollmom.doMomentum(30)},100)))}},f=b.getScrollTop(),
    m=b.getScrollLeft(),b.mangotouch={sy:f,ly:f,dry:0,sx:m,lx:m,drx:0,lazy:!1,tm:0},b.bind(b.docscroll,"scroll",b.onmangotouch);else{if(g.cantouch||b.istouchcapable||b.opt.touchbehavior||g.hasmstouch){b.scrollmom=new J(b);b.ontouchstart=function(d){if(d.pointerType&&2!=d.pointerType)return!1;if(!b.locked){if(g.hasmstouch)for(var c=d.target?d.target:!1;c;){var f=e(c).getNiceScroll();if(0<f.length&&f[0].me==b.me)break;if(0<f.length)return!1;if("DIV"==c.nodeName&&c.id==b.id)break;c=c.parentNode?c.parentNode:
    !1}b.cancelScroll();if((c=b.getTarget(d))&&/INPUT/i.test(c.nodeName)&&/range/i.test(c.type))return b.stopPropagation(d);!("clientX"in d)&&"changedTouches"in d&&(d.clientX=d.changedTouches[0].clientX,d.clientY=d.changedTouches[0].clientY);b.forcescreen&&(f=d,d={original:d.original?d.original:d},d.clientX=f.screenX,d.clientY=f.screenY);b.rail.drag={x:d.clientX,y:d.clientY,sx:b.scroll.x,sy:b.scroll.y,st:b.getScrollTop(),sl:b.getScrollLeft(),pt:2,dl:!1};if(b.ispage||!b.opt.directionlockdeadzone)b.rail.drag.dl=
    "f";else{var f=e(window).width(),n=e(window).height(),k=Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),l=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),n=Math.max(0,l-n),f=Math.max(0,k-f);b.rail.drag.ck=!b.rail.scrollable&&b.railh.scrollable?0<n?"v":!1:b.rail.scrollable&&!b.railh.scrollable?0<f?"h":!1:!1;b.rail.drag.ck||(b.rail.drag.dl="f")}b.opt.touchbehavior&&(b.isiframe&&g.isie)&&(f=b.win.position(),b.rail.drag.x+=f.left,b.rail.drag.y+=f.top);
    b.hasmoving=!1;b.lastmouseup=!1;b.scrollmom.reset(d.clientX,d.clientY);if(!g.cantouch&&!this.istouchcapable&&!g.hasmstouch){if(!c||!/INPUT|SELECT|TEXTAREA/i.test(c.nodeName))return!b.ispage&&g.hasmousecapture&&c.setCapture(),b.opt.touchbehavior?b.cancelEvent(d):b.stopPropagation(d);/SUBMIT|CANCEL|BUTTON/i.test(e(c).attr("type"))&&(pc={tg:c,click:!1},b.preventclick=pc)}}};b.ontouchend=function(d){if(d.pointerType&&2!=d.pointerType)return!1;if(b.rail.drag&&2==b.rail.drag.pt&&(b.scrollmom.doMomentum(),
    b.rail.drag=!1,b.hasmoving&&(b.hasmoving=!1,b.lastmouseup=!0,b.hideCursor(),g.hasmousecapture&&document.releaseCapture(),!g.cantouch)))return b.cancelEvent(d)};var t=b.opt.touchbehavior&&b.isiframe&&!g.hasmousecapture;b.ontouchmove=function(d,c){if(d.pointerType&&2!=d.pointerType)return!1;if(b.rail.drag&&2==b.rail.drag.pt){if(g.cantouch&&"undefined"==typeof d.original)return!0;b.hasmoving=!0;b.preventclick&&!b.preventclick.click&&(b.preventclick.click=b.preventclick.tg.onclick||!1,b.preventclick.tg.onclick=
    b.onpreventclick);d=e.extend({original:d},d);"changedTouches"in d&&(d.clientX=d.changedTouches[0].clientX,d.clientY=d.changedTouches[0].clientY);if(b.forcescreen){var f=d;d={original:d.original?d.original:d};d.clientX=f.screenX;d.clientY=f.screenY}f=ofy=0;if(t&&!c){var n=b.win.position(),f=-n.left;ofy=-n.top}var k=d.clientY+ofy,n=k-b.rail.drag.y,l=d.clientX+f,h=l-b.rail.drag.x,r=b.rail.drag.st-n;b.ishwscroll&&b.opt.bouncescroll?0>r?r=Math.round(r/2):r>b.page.maxh&&(r=b.page.maxh+Math.round((r-b.page.maxh)/
    2)):(0>r&&(k=r=0),r>b.page.maxh&&(r=b.page.maxh,k=0));if(b.railh&&b.railh.scrollable){var m=b.rail.drag.sl-h;b.ishwscroll&&b.opt.bouncescroll?0>m?m=Math.round(m/2):m>b.page.maxw&&(m=b.page.maxw+Math.round((m-b.page.maxw)/2)):(0>m&&(l=m=0),m>b.page.maxw&&(m=b.page.maxw,l=0))}f=!1;if(b.rail.drag.dl)f=!0,"v"==b.rail.drag.dl?m=b.rail.drag.sl:"h"==b.rail.drag.dl&&(r=b.rail.drag.st);else{var n=Math.abs(n),h=Math.abs(h),x=b.opt.directionlockdeadzone;if("v"==b.rail.drag.ck){if(n>x&&h<=0.3*n)return b.rail.drag=
    !1,!0;h>x&&(b.rail.drag.dl="f",e("body").scrollTop(e("body").scrollTop()))}else if("h"==b.rail.drag.ck){if(h>x&&n<=0.3*h)return b.rail.drag=!1,!0;n>x&&(b.rail.drag.dl="f",e("body").scrollLeft(e("body").scrollLeft()))}}b.synched("touchmove",function(){b.rail.drag&&2==b.rail.drag.pt&&(b.prepareTransition&&b.prepareTransition(0),b.rail.scrollable&&b.setScrollTop(r),b.scrollmom.update(l,k),b.railh&&b.railh.scrollable?(b.setScrollLeft(m),b.showCursor(r,m)):b.showCursor(r),g.isie10&&document.selection.clear())});
    g.ischrome&&b.istouchcapable&&(f=!1);if(f)return b.cancelEvent(d)}}}b.onmousedown=function(d,c){if(!(b.rail.drag&&1!=b.rail.drag.pt)){if(b.locked)return b.cancelEvent(d);b.cancelScroll();b.rail.drag={x:d.clientX,y:d.clientY,sx:b.scroll.x,sy:b.scroll.y,pt:1,hr:!!c};var f=b.getTarget(d);!b.ispage&&g.hasmousecapture&&f.setCapture();b.isiframe&&!g.hasmousecapture&&(b.saved.csspointerevents=b.doc.css("pointer-events"),b.css(b.doc,{"pointer-events":"none"}));return b.cancelEvent(d)}};b.onmouseup=function(d){if(b.rail.drag&&
    (g.hasmousecapture&&document.releaseCapture(),b.isiframe&&!g.hasmousecapture&&b.doc.css("pointer-events",b.saved.csspointerevents),1==b.rail.drag.pt))return b.rail.drag=!1,b.cancelEvent(d)};b.onmousemove=function(d){if(b.rail.drag&&1==b.rail.drag.pt){if(g.ischrome&&0==d.which)return b.onmouseup(d);b.cursorfreezed=!0;if(b.rail.drag.hr){b.scroll.x=b.rail.drag.sx+(d.clientX-b.rail.drag.x);0>b.scroll.x&&(b.scroll.x=0);var c=b.scrollvaluemaxw;b.scroll.x>c&&(b.scroll.x=c)}else b.scroll.y=b.rail.drag.sy+
    (d.clientY-b.rail.drag.y),0>b.scroll.y&&(b.scroll.y=0),c=b.scrollvaluemax,b.scroll.y>c&&(b.scroll.y=c);b.synched("mousemove",function(){b.rail.drag&&1==b.rail.drag.pt&&(b.showCursor(),b.rail.drag.hr?b.doScrollLeft(Math.round(b.scroll.x*b.scrollratio.x),b.opt.cursordragspeed):b.doScrollTop(Math.round(b.scroll.y*b.scrollratio.y),b.opt.cursordragspeed))});return b.cancelEvent(d)}};if(g.cantouch||b.opt.touchbehavior)b.onpreventclick=function(d){if(b.preventclick)return b.preventclick.tg.onclick=b.preventclick.click,
    b.preventclick=!1,b.cancelEvent(d)},b.bind(b.win,"mousedown",b.ontouchstart),b.onclick=g.isios?!1:function(d){return b.lastmouseup?(b.lastmouseup=!1,b.cancelEvent(d)):!0},b.opt.grabcursorenabled&&g.cursorgrabvalue&&(b.css(b.ispage?b.doc:b.win,{cursor:g.cursorgrabvalue}),b.css(b.rail,{cursor:g.cursorgrabvalue}));else{var p=function(d){if(b.selectiondrag){if(d){var c=b.win.outerHeight();d=d.pageY-b.selectiondrag.top;0<d&&d<c&&(d=0);d>=c&&(d-=c);b.selectiondrag.df=d}0!=b.selectiondrag.df&&(b.doScrollBy(2*
    -Math.floor(b.selectiondrag.df/6)),b.debounced("doselectionscroll",function(){p()},50))}};b.hasTextSelected="getSelection"in document?function(){return 0<document.getSelection().rangeCount}:"selection"in document?function(){return"None"!=document.selection.type}:function(){return!1};b.onselectionstart=function(d){b.ispage||(b.selectiondrag=b.win.offset())};b.onselectionend=function(d){b.selectiondrag=!1};b.onselectiondrag=function(d){b.selectiondrag&&b.hasTextSelected()&&b.debounced("selectionscroll",
    function(){p(d)},250)}}g.hasmstouch&&(b.css(b.rail,{"-ms-touch-action":"none"}),b.css(b.cursor,{"-ms-touch-action":"none"}),b.bind(b.win,"MSPointerDown",b.ontouchstart),b.bind(document,"MSPointerUp",b.ontouchend),b.bind(document,"MSPointerMove",b.ontouchmove),b.bind(b.cursor,"MSGestureHold",function(b){b.preventDefault()}),b.bind(b.cursor,"contextmenu",function(b){b.preventDefault()}));this.istouchcapable&&(b.bind(b.win,"touchstart",b.ontouchstart),b.bind(document,"touchend",b.ontouchend),b.bind(document,
    "touchcancel",b.ontouchend),b.bind(document,"touchmove",b.ontouchmove));b.bind(b.cursor,"mousedown",b.onmousedown);b.bind(b.cursor,"mouseup",b.onmouseup);b.railh&&(b.bind(b.cursorh,"mousedown",function(d){b.onmousedown(d,!0)}),b.bind(b.cursorh,"mouseup",function(d){if(!(b.rail.drag&&2==b.rail.drag.pt))return b.rail.drag=!1,b.hasmoving=!1,b.hideCursor(),g.hasmousecapture&&document.releaseCapture(),b.cancelEvent(d)}));if(b.opt.cursordragontouch||!g.cantouch&&!b.opt.touchbehavior)b.rail.css({cursor:"default"}),
    b.railh&&b.railh.css({cursor:"default"}),b.jqbind(b.rail,"mouseenter",function(){b.canshowonmouseevent&&b.showCursor();b.rail.active=!0}),b.jqbind(b.rail,"mouseleave",function(){b.rail.active=!1;b.rail.drag||b.hideCursor()}),b.opt.sensitiverail&&(b.bind(b.rail,"click",function(d){b.doRailClick(d,!1,!1)}),b.bind(b.rail,"dblclick",function(d){b.doRailClick(d,!0,!1)}),b.bind(b.cursor,"click",function(d){b.cancelEvent(d)}),b.bind(b.cursor,"dblclick",function(d){b.cancelEvent(d)})),b.railh&&(b.jqbind(b.railh,
    "mouseenter",function(){b.canshowonmouseevent&&b.showCursor();b.rail.active=!0}),b.jqbind(b.railh,"mouseleave",function(){b.rail.active=!1;b.rail.drag||b.hideCursor()}),b.opt.sensitiverail&&(b.bind(b.railh,"click",function(d){b.doRailClick(d,!1,!0)}),b.bind(b.railh,"dblclick",function(d){b.doRailClick(d,!0,!0)}),b.bind(b.cursorh,"click",function(d){b.cancelEvent(d)}),b.bind(b.cursorh,"dblclick",function(d){b.cancelEvent(d)})));!g.cantouch&&!b.opt.touchbehavior?(b.bind(g.hasmousecapture?b.win:document,
    "mouseup",b.onmouseup),b.bind(document,"mousemove",b.onmousemove),b.onclick&&b.bind(document,"click",b.onclick),!b.ispage&&b.opt.enablescrollonselection&&(b.bind(b.win[0],"mousedown",b.onselectionstart),b.bind(document,"mouseup",b.onselectionend),b.bind(b.cursor,"mouseup",b.onselectionend),b.cursorh&&b.bind(b.cursorh,"mouseup",b.onselectionend),b.bind(document,"mousemove",b.onselectiondrag)),b.zoom&&(b.jqbind(b.zoom,"mouseenter",function(){b.canshowonmouseevent&&b.showCursor();b.rail.active=!0}),
    b.jqbind(b.zoom,"mouseleave",function(){b.rail.active=!1;b.rail.drag||b.hideCursor()}))):(b.bind(g.hasmousecapture?b.win:document,"mouseup",b.ontouchend),b.bind(document,"mousemove",b.ontouchmove),b.onclick&&b.bind(document,"click",b.onclick),b.opt.cursordragontouch&&(b.bind(b.cursor,"mousedown",b.onmousedown),b.bind(b.cursor,"mousemove",b.onmousemove),b.cursorh&&b.bind(b.cursorh,"mousedown",function(d){b.onmousedown(d,!0)}),b.cursorh&&b.bind(b.cursorh,"mousemove",b.onmousemove)));b.opt.enablemousewheel&&
(b.isiframe||b.bind(g.isie&&b.ispage?document:b.win,"mousewheel",b.onmousewheel),b.bind(b.rail,"mousewheel",b.onmousewheel),b.railh&&b.bind(b.railh,"mousewheel",b.onmousewheelhr));!b.ispage&&(!g.cantouch&&!/HTML|BODY/.test(b.win[0].nodeName))&&(b.win.attr("tabindex")||b.win.attr({tabindex:L++}),b.jqbind(b.win,"focus",function(d){z=b.getTarget(d).id||!0;b.hasfocus=!0;b.canshowonmouseevent&&b.noticeCursor()}),b.jqbind(b.win,"blur",function(d){z=!1;b.hasfocus=!1}),b.jqbind(b.win,"mouseenter",function(d){E=
    b.getTarget(d).id||!0;b.hasmousefocus=!0;b.canshowonmouseevent&&b.noticeCursor()}),b.jqbind(b.win,"mouseleave",function(){E=!1;b.hasmousefocus=!1;b.rail.drag||b.hideCursor()}))}b.onkeypress=function(d){if(b.locked&&0==b.page.maxh)return!0;d=d?d:window.e;var c=b.getTarget(d);if(c&&/INPUT|TEXTAREA|SELECT|OPTION/.test(c.nodeName)&&(!c.getAttribute("type")&&!c.type||!/submit|button|cancel/i.tp))return!0;if(b.hasfocus||b.hasmousefocus&&!z||b.ispage&&!z&&!E){c=d.keyCode;if(b.locked&&27!=c)return b.cancelEvent(d);
    var f=d.ctrlKey||!1,n=d.shiftKey||!1,g=!1;switch(c){case 38:case 63233:b.doScrollBy(72);g=!0;break;case 40:case 63235:b.doScrollBy(-72);g=!0;break;case 37:case 63232:b.railh&&(f?b.doScrollLeft(0):b.doScrollLeftBy(72),g=!0);break;case 39:case 63234:b.railh&&(f?b.doScrollLeft(b.page.maxw):b.doScrollLeftBy(-72),g=!0);break;case 33:case 63276:b.doScrollBy(b.view.h);g=!0;break;case 34:case 63277:b.doScrollBy(-b.view.h);g=!0;break;case 36:case 63273:b.railh&&f?b.doScrollPos(0,0):b.doScrollTo(0);g=!0;break;
        case 35:case 63275:b.railh&&f?b.doScrollPos(b.page.maxw,b.page.maxh):b.doScrollTo(b.page.maxh);g=!0;break;case 32:b.opt.spacebarenabled&&(n?b.doScrollBy(b.view.h):b.doScrollBy(-b.view.h),g=!0);break;case 27:b.zoomactive&&(b.doZoom(),g=!0)}if(g)return b.cancelEvent(d)}};b.opt.enablekeyboard&&b.bind(document,g.isopera&&!g.isopera12?"keypress":"keydown",b.onkeypress);b.bind(window,"resize",b.lazyResize);b.bind(window,"orientationchange",b.lazyResize);b.bind(window,"load",b.lazyResize);if(g.ischrome&&
    !b.ispage&&!b.haswrapper){var s=b.win.attr("style"),f=parseFloat(b.win.css("width"))+1;b.win.css("width",f);b.synched("chromefix",function(){b.win.attr("style",s)})}b.onAttributeChange=function(d){b.lazyResize(250)};!b.ispage&&!b.haswrapper&&(!1!==A?(b.observer=new A(function(d){d.forEach(b.onAttributeChange)}),b.observer.observe(b.win[0],{childList:!0,characterData:!1,attributes:!0,subtree:!1}),b.observerremover=new A(function(d){d.forEach(function(d){if(0<d.removedNodes.length)for(var c in d.removedNodes)if(d.removedNodes[c]==
    b.win[0])return b.remove()})}),b.observerremover.observe(b.win[0].parentNode,{childList:!0,characterData:!1,attributes:!1,subtree:!1})):(b.bind(b.win,g.isie&&!g.isie9?"propertychange":"DOMAttrModified",b.onAttributeChange),g.isie9&&b.win[0].attachEvent("onpropertychange",b.onAttributeChange),b.bind(b.win,"DOMNodeRemoved",function(d){d.target==b.win[0]&&b.remove()})));!b.ispage&&b.opt.boxzoom&&b.bind(window,"resize",b.resizeZoom);b.istextarea&&b.bind(b.win,"mouseup",b.lazyResize);b.checkrtlmode=!0;
    b.lazyResize(30)}if("IFRAME"==this.doc[0].nodeName){var K=function(d){b.iframexd=!1;try{var c="contentDocument"in this?this.contentDocument:this.contentWindow.document}catch(f){b.iframexd=!0,c=!1}if(b.iframexd)return"console"in window&&console.log("NiceScroll error: policy restriced iframe"),!0;b.forcescreen=!0;b.isiframe&&(b.iframe={doc:e(c),html:b.doc.contents().find("html")[0],body:b.doc.contents().find("body")[0]},b.getContentSize=function(){return{w:Math.max(b.iframe.html.scrollWidth,b.iframe.body.scrollWidth),
    h:Math.max(b.iframe.html.scrollHeight,b.iframe.body.scrollHeight)}},b.docscroll=e(b.iframe.body));!g.isios&&(b.opt.iframeautoresize&&!b.isiframe)&&(b.win.scrollTop(0),b.doc.height(""),d=Math.max(c.getElementsByTagName("html")[0].scrollHeight,c.body.scrollHeight),b.doc.height(d));b.lazyResize(30);g.isie7&&b.css(e(b.iframe.html),{"overflow-y":"hidden"});b.css(e(b.iframe.body),{"overflow-y":"hidden"});g.isios&&b.haswrapper&&b.css(e(c.body),{"-webkit-transform":"translate3d(0,0,0)"});"contentWindow"in
    this?b.bind(this.contentWindow,"scroll",b.onscroll):b.bind(c,"scroll",b.onscroll);b.opt.enablemousewheel&&b.bind(c,"mousewheel",b.onmousewheel);b.opt.enablekeyboard&&b.bind(c,g.isopera?"keypress":"keydown",b.onkeypress);if(g.cantouch||b.opt.touchbehavior)b.bind(c,"mousedown",b.ontouchstart),b.bind(c,"mousemove",function(d){b.ontouchmove(d,!0)}),b.opt.grabcursorenabled&&g.cursorgrabvalue&&b.css(e(c.body),{cursor:g.cursorgrabvalue});b.bind(c,"mouseup",b.ontouchend);b.zoom&&(b.opt.dblclickzoom&&b.bind(c,
    "dblclick",b.doZoom),b.ongesturezoom&&b.bind(c,"gestureend",b.ongesturezoom))};this.doc[0].readyState&&"complete"==this.doc[0].readyState&&setTimeout(function(){K.call(b.doc[0],!1)},500);b.bind(this.doc,"load",K)}};this.showCursor=function(d,c){b.cursortimeout&&(clearTimeout(b.cursortimeout),b.cursortimeout=0);if(b.rail){b.autohidedom&&(b.autohidedom.stop().css({opacity:b.opt.cursoropacitymax}),b.cursoractive=!0);if(!b.rail.drag||1!=b.rail.drag.pt)"undefined"!=typeof d&&!1!==d&&(b.scroll.y=Math.round(1*
    d/b.scrollratio.y)),"undefined"!=typeof c&&(b.scroll.x=Math.round(1*c/b.scrollratio.x));b.cursor.css({height:b.cursorheight,top:b.scroll.y});b.cursorh&&(!b.rail.align&&b.rail.visibility?b.cursorh.css({width:b.cursorwidth,left:b.scroll.x+b.rail.width}):b.cursorh.css({width:b.cursorwidth,left:b.scroll.x}),b.cursoractive=!0);b.zoom&&b.zoom.stop().css({opacity:b.opt.cursoropacitymax})}};this.hideCursor=function(d){!b.cursortimeout&&(b.rail&&b.autohidedom&&!(b.hasmousefocus&&"leave"==b.opt.autohidemode))&&
(b.cursortimeout=setTimeout(function(){if(!b.rail.active||!b.showonmouseevent)b.autohidedom.stop().animate({opacity:b.opt.cursoropacitymin}),b.zoom&&b.zoom.stop().animate({opacity:b.opt.cursoropacitymin}),b.cursoractive=!1;b.cursortimeout=0},d||b.opt.hidecursordelay))};this.noticeCursor=function(d,c,f){b.showCursor(c,f);b.rail.active||b.hideCursor(d)};this.getContentSize=b.ispage?function(){return{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,
    document.documentElement.scrollHeight)}}:b.haswrapper?function(){return{w:b.doc.outerWidth()+parseInt(b.win.css("paddingLeft"))+parseInt(b.win.css("paddingRight")),h:b.doc.outerHeight()+parseInt(b.win.css("paddingTop"))+parseInt(b.win.css("paddingBottom"))}}:function(){return{w:b.docscroll[0].scrollWidth,h:b.docscroll[0].scrollHeight}};this.onResize=function(d,c){if(!b.win)return!1;if(!b.haswrapper&&!b.ispage){if("none"==b.win.css("display"))return b.visibility&&b.hideRail().hideRailHr(),!1;!b.hidden&&
    !b.visibility&&b.showRail().showRailHr()}var f=b.page.maxh,g=b.page.maxw,e=b.view.w;b.view={w:b.ispage?b.win.width():parseInt(b.win[0].clientWidth),h:b.ispage?b.win.height():parseInt(b.win[0].clientHeight)};b.page=c?c:b.getContentSize();b.page.maxh=Math.max(0,b.page.h-b.view.h);b.page.maxw=Math.max(0,b.page.w-b.view.w);if(b.page.maxh==f&&b.page.maxw==g&&b.view.w==e){if(b.ispage)return b;f=b.win.offset();if(b.lastposition&&(g=b.lastposition,g.top==f.top&&g.left==f.left))return b;b.lastposition=f}0==
    b.page.maxh?(b.hideRail(),b.scrollvaluemax=0,b.scroll.y=0,b.scrollratio.y=0,b.cursorheight=0,b.setScrollTop(0),b.rail.scrollable=!1):b.rail.scrollable=!0;0==b.page.maxw?(b.hideRailHr(),b.scrollvaluemaxw=0,b.scroll.x=0,b.scrollratio.x=0,b.cursorwidth=0,b.setScrollLeft(0),b.railh.scrollable=!1):b.railh.scrollable=!0;b.locked=0==b.page.maxh&&0==b.page.maxw;if(b.locked)return b.ispage||b.updateScrollBar(b.view),!1;!b.hidden&&!b.visibility?b.showRail().showRailHr():!b.hidden&&!b.railh.visibility&&b.showRailHr();
    b.istextarea&&(b.win.css("resize")&&"none"!=b.win.css("resize"))&&(b.view.h-=20);b.cursorheight=Math.min(b.view.h,Math.round(b.view.h*(b.view.h/b.page.h)));b.cursorheight=b.opt.cursorfixedheight?b.opt.cursorfixedheight:Math.max(b.opt.cursorminheight,b.cursorheight);b.cursorwidth=Math.min(b.view.w,Math.round(b.view.w*(b.view.w/b.page.w)));b.cursorwidth=b.opt.cursorfixedheight?b.opt.cursorfixedheight:Math.max(b.opt.cursorminheight,b.cursorwidth);b.scrollvaluemax=b.view.h-b.cursorheight-b.cursor.hborder;
    b.railh&&(b.railh.width=0<b.page.maxh?b.view.w-b.rail.width:b.view.w,b.scrollvaluemaxw=b.railh.width-b.cursorwidth-b.cursorh.wborder);b.checkrtlmode&&b.railh&&(b.checkrtlmode=!1,b.opt.rtlmode&&0==b.scroll.x&&b.setScrollLeft(b.page.maxw));b.ispage||b.updateScrollBar(b.view);b.scrollratio={x:b.page.maxw/b.scrollvaluemaxw,y:b.page.maxh/b.scrollvaluemax};b.getScrollTop()>b.page.maxh?b.doScrollTop(b.page.maxh):(b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y)),b.scroll.x=Math.round(b.getScrollLeft()*
        (1/b.scrollratio.x)),b.cursoractive&&b.noticeCursor());b.scroll.y&&0==b.getScrollTop()&&b.doScrollTo(Math.floor(b.scroll.y*b.scrollratio.y));return b};this.resize=b.onResize;this.lazyResize=function(d){d=isNaN(d)?30:d;b.delayed("resize",b.resize,d);return b};this._bind=function(d,c,f,g){b.events.push({e:d,n:c,f:f,b:g,q:!1});d.addEventListener?d.addEventListener(c,f,g||!1):d.attachEvent?d.attachEvent("on"+c,f):d["on"+c]=f};this.jqbind=function(d,c,f){b.events.push({e:d,n:c,f:f,q:!0});e(d).bind(c,f)};
    this.bind=function(d,c,f,e){var k="jquery"in d?d[0]:d;"mousewheel"==c?"onwheel"in b.win?b._bind(k,"wheel",f,e||!1):(d="undefined"!=typeof document.onmousewheel?"mousewheel":"DOMMouseScroll",q(k,d,f,e||!1),"DOMMouseScroll"==d&&q(k,"MozMousePixelScroll",f,e||!1)):k.addEventListener?(g.cantouch&&/mouseup|mousedown|mousemove/.test(c)&&b._bind(k,"mousedown"==c?"touchstart":"mouseup"==c?"touchend":"touchmove",function(b){if(b.touches){if(2>b.touches.length){var d=b.touches.length?b.touches[0]:b;d.original=
        b;f.call(this,d)}}else b.changedTouches&&(d=b.changedTouches[0],d.original=b,f.call(this,d))},e||!1),b._bind(k,c,f,e||!1),g.cantouch&&"mouseup"==c&&b._bind(k,"touchcancel",f,e||!1)):b._bind(k,c,function(d){if((d=d||window.event||!1)&&d.srcElement)d.target=d.srcElement;"pageY"in d||(d.pageX=d.clientX+document.documentElement.scrollLeft,d.pageY=d.clientY+document.documentElement.scrollTop);return!1===f.call(k,d)||!1===e?b.cancelEvent(d):!0})};this._unbind=function(b,c,f,g){b.removeEventListener?b.removeEventListener(c,
        f,g):b.detachEvent?b.detachEvent("on"+c,f):b["on"+c]=!1};this.unbindAll=function(){for(var d=0;d<b.events.length;d++){var c=b.events[d];c.q?c.e.unbind(c.n,c.f):b._unbind(c.e,c.n,c.f,c.b)}};this.cancelEvent=function(b){b=b.original?b.original:b?b:window.event||!1;if(!b)return!1;b.preventDefault&&b.preventDefault();b.stopPropagation&&b.stopPropagation();b.preventManipulation&&b.preventManipulation();b.cancelBubble=!0;b.cancel=!0;return b.returnValue=!1};this.stopPropagation=function(b){b=b.original?
        b.original:b?b:window.event||!1;if(!b)return!1;if(b.stopPropagation)return b.stopPropagation();b.cancelBubble&&(b.cancelBubble=!0);return!1};this.showRail=function(){if(0!=b.page.maxh&&(b.ispage||"none"!=b.win.css("display")))b.visibility=!0,b.rail.visibility=!0,b.rail.css("display","block");return b};this.showRailHr=function(){if(!b.railh)return b;if(0!=b.page.maxw&&(b.ispage||"none"!=b.win.css("display")))b.railh.visibility=!0,b.railh.css("display","block");return b};this.hideRail=function(){b.visibility=
        !1;b.rail.visibility=!1;b.rail.css("display","none");return b};this.hideRailHr=function(){if(!b.railh)return b;b.railh.visibility=!1;b.railh.css("display","none");return b};this.show=function(){b.hidden=!1;b.locked=!1;return b.showRail().showRailHr()};this.hide=function(){b.hidden=!0;b.locked=!0;return b.hideRail().hideRailHr()};this.toggle=function(){return b.hidden?b.show():b.hide()};this.remove=function(){b.stop();b.cursortimeout&&clearTimeout(b.cursortimeout);b.doZoomOut();b.unbindAll();g.isie9&&
    b.win[0].detachEvent("onpropertychange",b.onAttributeChange);!1!==b.observer&&b.observer.disconnect();!1!==b.observerremover&&b.observerremover.disconnect();b.events=null;b.cursor&&b.cursor.remove();b.cursorh&&b.cursorh.remove();b.rail&&b.rail.remove();b.railh&&b.railh.remove();b.zoom&&b.zoom.remove();for(var d=0;d<b.saved.css.length;d++){var c=b.saved.css[d];c[0].css(c[1],"undefined"==typeof c[2]?"":c[2])}b.saved=!1;b.me.data("__nicescroll","");var f=e.nicescroll;f.each(function(d){if(this&&this.id===
        b.id){delete f[d];for(var c=++d;c<f.length;c++,d++)f[d]=f[c];f.length--;f.length&&delete f[f.length]}});for(var k in b)b[k]=null,delete b[k];b=null};this.scrollstart=function(d){this.onscrollstart=d;return b};this.scrollend=function(d){this.onscrollend=d;return b};this.scrollcancel=function(d){this.onscrollcancel=d;return b};this.zoomin=function(d){this.onzoomin=d;return b};this.zoomout=function(d){this.onzoomout=d;return b};this.isScrollable=function(b){b=b.target?b.target:b;if("OPTION"==b.nodeName)return!0;
        for(;b&&1==b.nodeType&&!/BODY|HTML/.test(b.nodeName);){var c=e(b),c=c.css("overflowY")||c.css("overflowX")||c.css("overflow")||"";if(/scroll|auto/.test(c))return b.clientHeight!=b.scrollHeight;b=b.parentNode?b.parentNode:!1}return!1};this.getViewport=function(b){for(b=b&&b.parentNode?b.parentNode:!1;b&&1==b.nodeType&&!/BODY|HTML/.test(b.nodeName);){var c=e(b);if(/fixed|absolute/.test(c.css("position")))return c;var f=c.css("overflowY")||c.css("overflowX")||c.css("overflow")||"";if(/scroll|auto/.test(f)&&
        b.clientHeight!=b.scrollHeight||0<c.getNiceScroll().length)return c;b=b.parentNode?b.parentNode:!1}return!1};this.onmousewheel=function(d){if(b.locked)return b.debounced("checkunlock",b.resize,250),!0;if(b.rail.drag)return b.cancelEvent(d);"auto"==b.opt.oneaxismousemode&&0!=d.deltaX&&(b.opt.oneaxismousemode=!1);if(b.opt.oneaxismousemode&&0==d.deltaX&&!b.rail.scrollable)return b.railh&&b.railh.scrollable?b.onmousewheelhr(d):!0;var c=+new Date,f=!1;b.opt.preservenativescrolling&&b.checkarea+600<c&&
    (b.nativescrollingarea=b.isScrollable(d),f=!0);b.checkarea=c;if(b.nativescrollingarea)return!0;if(d=t(d,!1,f))b.checkarea=0;return d};this.onmousewheelhr=function(d){if(b.locked||!b.railh.scrollable)return!0;if(b.rail.drag)return b.cancelEvent(d);var c=+new Date,f=!1;b.opt.preservenativescrolling&&b.checkarea+600<c&&(b.nativescrollingarea=b.isScrollable(d),f=!0);b.checkarea=c;return b.nativescrollingarea?!0:b.locked?b.cancelEvent(d):t(d,!0,f)};this.stop=function(){b.cancelScroll();b.scrollmon&&b.scrollmon.stop();
        b.cursorfreezed=!1;b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y));b.noticeCursor();return b};this.getTransitionSpeed=function(d){var c=Math.round(10*b.opt.scrollspeed);d=Math.min(c,Math.round(d/20*b.opt.scrollspeed));return 20<d?d:0};b.opt.smoothscroll?b.ishwscroll&&g.hastransition&&b.opt.usetransition?(this.prepareTransition=function(d,c){var f=c?20<d?d:0:b.getTransitionSpeed(d),e=f?g.prefixstyle+"transform "+f+"ms ease-out":"";if(!b.lasttransitionstyle||b.lasttransitionstyle!=e)b.lasttransitionstyle=
        e,b.doc.css(g.transitionstyle,e);return f},this.doScrollLeft=function(c,g){var f=b.scrollrunning?b.newscrolly:b.getScrollTop();b.doScrollPos(c,f,g)},this.doScrollTop=function(c,g){var f=b.scrollrunning?b.newscrollx:b.getScrollLeft();b.doScrollPos(f,c,g)},this.doScrollPos=function(c,e,f){var k=b.getScrollTop(),l=b.getScrollLeft();(0>(b.newscrolly-k)*(e-k)||0>(b.newscrollx-l)*(c-l))&&b.cancelScroll();!1==b.opt.bouncescroll&&(0>e?e=0:e>b.page.maxh&&(e=b.page.maxh),0>c?c=0:c>b.page.maxw&&(c=b.page.maxw));
        if(b.scrollrunning&&c==b.newscrollx&&e==b.newscrolly)return!1;b.newscrolly=e;b.newscrollx=c;b.newscrollspeed=f||!1;if(b.timer)return!1;b.timer=setTimeout(function(){var f=b.getScrollTop(),k=b.getScrollLeft(),l,h;l=c-k;h=e-f;l=Math.round(Math.sqrt(Math.pow(l,2)+Math.pow(h,2)));l=b.newscrollspeed&&1<b.newscrollspeed?b.newscrollspeed:b.getTransitionSpeed(l);b.newscrollspeed&&1>=b.newscrollspeed&&(l*=b.newscrollspeed);b.prepareTransition(l,!0);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);
            0<l&&(!b.scrollrunning&&b.onscrollstart&&b.onscrollstart.call(b,{type:"scrollstart",current:{x:k,y:f},request:{x:c,y:e},end:{x:b.newscrollx,y:b.newscrolly},speed:l}),g.transitionend?b.scrollendtrapped||(b.scrollendtrapped=!0,b.bind(b.doc,g.transitionend,b.onScrollEnd,!1)):(b.scrollendtrapped&&clearTimeout(b.scrollendtrapped),b.scrollendtrapped=setTimeout(b.onScrollEnd,l)),b.timerscroll={bz:new BezierClass(f,b.newscrolly,l,0,0,0.58,1),bh:new BezierClass(k,b.newscrollx,l,0,0,0.58,1)},b.cursorfreezed||
                (b.timerscroll.tm=setInterval(function(){b.showCursor(b.getScrollTop(),b.getScrollLeft())},60)));b.synched("doScroll-set",function(){b.timer=0;b.scrollendtrapped&&(b.scrollrunning=!0);b.setScrollTop(b.newscrolly);b.setScrollLeft(b.newscrollx);if(!b.scrollendtrapped)b.onScrollEnd()})},50)},this.cancelScroll=function(){if(!b.scrollendtrapped)return!0;var c=b.getScrollTop(),e=b.getScrollLeft();b.scrollrunning=!1;g.transitionend||clearTimeout(g.transitionend);b.scrollendtrapped=!1;b._unbind(b.doc,g.transitionend,
        b.onScrollEnd);b.prepareTransition(0);b.setScrollTop(c);b.railh&&b.setScrollLeft(e);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);b.timerscroll=!1;b.cursorfreezed=!1;b.showCursor(c,e);return b},this.onScrollEnd=function(){b.scrollendtrapped&&b._unbind(b.doc,g.transitionend,b.onScrollEnd);b.scrollendtrapped=!1;b.prepareTransition(0);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);b.timerscroll=!1;var c=b.getScrollTop(),e=b.getScrollLeft();b.setScrollTop(c);b.railh&&
    b.setScrollLeft(e);b.noticeCursor(!1,c,e);b.cursorfreezed=!1;0>c?c=0:c>b.page.maxh&&(c=b.page.maxh);0>e?e=0:e>b.page.maxw&&(e=b.page.maxw);if(c!=b.newscrolly||e!=b.newscrollx)return b.doScrollPos(e,c,b.opt.snapbackspeed);b.onscrollend&&b.scrollrunning&&b.onscrollend.call(b,{type:"scrollend",current:{x:e,y:c},end:{x:b.newscrollx,y:b.newscrolly}});b.scrollrunning=!1}):(this.doScrollLeft=function(c,g){var f=b.scrollrunning?b.newscrolly:b.getScrollTop();b.doScrollPos(c,f,g)},this.doScrollTop=function(c,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          g){var f=b.scrollrunning?b.newscrollx:b.getScrollLeft();b.doScrollPos(f,c,g)},this.doScrollPos=function(c,g,f){function e(){if(b.cancelAnimationFrame)return!0;b.scrollrunning=!0;if(p=1-p)return b.timer=v(e)||1;var c=0,d=sy=b.getScrollTop();if(b.dst.ay){var d=b.bzscroll?b.dst.py+b.bzscroll.getNow()*b.dst.ay:b.newscrolly,f=d-sy;if(0>f&&d<b.newscrolly||0<f&&d>b.newscrolly)d=b.newscrolly;b.setScrollTop(d);d==b.newscrolly&&(c=1)}else c=1;var g=sx=b.getScrollLeft();if(b.dst.ax){g=b.bzscroll?b.dst.px+b.bzscroll.getNow()*
        b.dst.ax:b.newscrollx;f=g-sx;if(0>f&&g<b.newscrollx||0<f&&g>b.newscrollx)g=b.newscrollx;b.setScrollLeft(g);g==b.newscrollx&&(c+=1)}else c+=1;2==c?(b.timer=0,b.cursorfreezed=!1,b.bzscroll=!1,b.scrollrunning=!1,0>d?d=0:d>b.page.maxh&&(d=b.page.maxh),0>g?g=0:g>b.page.maxw&&(g=b.page.maxw),g!=b.newscrollx||d!=b.newscrolly?b.doScrollPos(g,d):b.onscrollend&&b.onscrollend.call(b,{type:"scrollend",current:{x:sx,y:sy},end:{x:b.newscrollx,y:b.newscrolly}})):b.timer=v(e)||1}g="undefined"==typeof g||!1===g?b.getScrollTop(!0):
        g;if(b.timer&&b.newscrolly==g&&b.newscrollx==c)return!0;b.timer&&w(b.timer);b.timer=0;var k=b.getScrollTop(),l=b.getScrollLeft();(0>(b.newscrolly-k)*(g-k)||0>(b.newscrollx-l)*(c-l))&&b.cancelScroll();b.newscrolly=g;b.newscrollx=c;if(!b.bouncescroll||!b.rail.visibility)0>b.newscrolly?b.newscrolly=0:b.newscrolly>b.page.maxh&&(b.newscrolly=b.page.maxh);if(!b.bouncescroll||!b.railh.visibility)0>b.newscrollx?b.newscrollx=0:b.newscrollx>b.page.maxw&&(b.newscrollx=b.page.maxw);b.dst={};b.dst.x=c-l;b.dst.y=
        g-k;b.dst.px=l;b.dst.py=k;var h=Math.round(Math.sqrt(Math.pow(b.dst.x,2)+Math.pow(b.dst.y,2)));b.dst.ax=b.dst.x/h;b.dst.ay=b.dst.y/h;var m=0,q=h;0==b.dst.x?(m=k,q=g,b.dst.ay=1,b.dst.py=0):0==b.dst.y&&(m=l,q=c,b.dst.ax=1,b.dst.px=0);h=b.getTransitionSpeed(h);f&&1>=f&&(h*=f);b.bzscroll=0<h?b.bzscroll?b.bzscroll.update(q,h):new BezierClass(m,q,h,0,1,0,1):!1;if(!b.timer){(k==b.page.maxh&&g>=b.page.maxh||l==b.page.maxw&&c>=b.page.maxw)&&b.checkContentSize();var p=1;b.cancelAnimationFrame=!1;b.timer=1;
        b.onscrollstart&&!b.scrollrunning&&b.onscrollstart.call(b,{type:"scrollstart",current:{x:l,y:k},request:{x:c,y:g},end:{x:b.newscrollx,y:b.newscrolly},speed:h});e();(k==b.page.maxh&&g>=k||l==b.page.maxw&&c>=l)&&b.checkContentSize();b.noticeCursor()}},this.cancelScroll=function(){b.timer&&w(b.timer);b.timer=0;b.bzscroll=!1;b.scrollrunning=!1;return b}):(this.doScrollLeft=function(c,g){var f=b.getScrollTop();b.doScrollPos(c,f,g)},this.doScrollTop=function(c,g){var f=b.getScrollLeft();b.doScrollPos(f,
        c,g)},this.doScrollPos=function(c,g,f){var e=c>b.page.maxw?b.page.maxw:c;0>e&&(e=0);var k=g>b.page.maxh?b.page.maxh:g;0>k&&(k=0);b.synched("scroll",function(){b.setScrollTop(k);b.setScrollLeft(e)})},this.cancelScroll=function(){});this.doScrollBy=function(c,g){var f=0,f=g?Math.floor((b.scroll.y-c)*b.scrollratio.y):(b.timer?b.newscrolly:b.getScrollTop(!0))-c;if(b.bouncescroll){var e=Math.round(b.view.h/2);f<-e?f=-e:f>b.page.maxh+e&&(f=b.page.maxh+e)}b.cursorfreezed=!1;py=b.getScrollTop(!0);if(0>f&&
        0>=py)return b.noticeCursor();if(f>b.page.maxh&&py>=b.page.maxh)return b.checkContentSize(),b.noticeCursor();b.doScrollTop(f)};this.doScrollLeftBy=function(c,g){var f=0,f=g?Math.floor((b.scroll.x-c)*b.scrollratio.x):(b.timer?b.newscrollx:b.getScrollLeft(!0))-c;if(b.bouncescroll){var e=Math.round(b.view.w/2);f<-e?f=-e:f>b.page.maxw+e&&(f=b.page.maxw+e)}b.cursorfreezed=!1;px=b.getScrollLeft(!0);if(0>f&&0>=px||f>b.page.maxw&&px>=b.page.maxw)return b.noticeCursor();b.doScrollLeft(f)};this.doScrollTo=
        function(c,g){g&&Math.round(c*b.scrollratio.y);b.cursorfreezed=!1;b.doScrollTop(c)};this.checkContentSize=function(){var c=b.getContentSize();(c.h!=b.page.h||c.w!=b.page.w)&&b.resize(!1,c)};b.onscroll=function(c){b.rail.drag||b.cursorfreezed||b.synched("scroll",function(){b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y));b.railh&&(b.scroll.x=Math.round(b.getScrollLeft()*(1/b.scrollratio.x)));b.noticeCursor()})};b.bind(b.docscroll,"scroll",b.onscroll);this.doZoomIn=function(c){if(!b.zoomactive){b.zoomactive=
        !0;b.zoomrestore={style:{}};var k="position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight".split(" "),f=b.win[0].style,l;for(l in k){var h=k[l];b.zoomrestore.style[h]="undefined"!=typeof f[h]?f[h]:""}b.zoomrestore.style.width=b.win.css("width");b.zoomrestore.style.height=b.win.css("height");b.zoomrestore.padding={w:b.win.outerWidth()-b.win.width(),h:b.win.outerHeight()-b.win.height()};g.isios4&&(b.zoomrestore.scrollTop=e(window).scrollTop(),e(window).scrollTop(0));
        b.win.css({position:g.isios4?"absolute":"fixed",top:0,left:0,"z-index":y+100,margin:"0px"});k=b.win.css("backgroundColor");(""==k||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(k))&&b.win.css("backgroundColor","#fff");b.rail.css({"z-index":y+101});b.zoom.css({"z-index":y+102});b.zoom.css("backgroundPosition","0px -18px");b.resizeZoom();b.onzoomin&&b.onzoomin.call(b);return b.cancelEvent(c)}};this.doZoomOut=function(c){if(b.zoomactive)return b.zoomactive=!1,b.win.css("margin",""),b.win.css(b.zoomrestore.style),
        g.isios4&&e(window).scrollTop(b.zoomrestore.scrollTop),b.rail.css({"z-index":b.zindex}),b.zoom.css({"z-index":b.zindex}),b.zoomrestore=!1,b.zoom.css("backgroundPosition","0px 0px"),b.onResize(),b.onzoomout&&b.onzoomout.call(b),b.cancelEvent(c)};this.doZoom=function(c){return b.zoomactive?b.doZoomOut(c):b.doZoomIn(c)};this.resizeZoom=function(){if(b.zoomactive){var c=b.getScrollTop();b.win.css({width:e(window).width()-b.zoomrestore.padding.w+"px",height:e(window).height()-b.zoomrestore.padding.h+"px"});
        b.onResize();b.setScrollTop(Math.min(b.page.maxh,c))}};this.init();e.nicescroll.push(this)},J=function(e){var c=this;this.nc=e;this.steptime=this.lasttime=this.speedy=this.speedx=this.lasty=this.lastx=0;this.snapy=this.snapx=!1;this.demuly=this.demulx=0;this.lastscrolly=this.lastscrollx=-1;this.timer=this.chky=this.chkx=0;this.time=function(){return+new Date};this.reset=function(e,l){c.stop();var h=c.time();c.steptime=0;c.lasttime=h;c.speedx=0;c.speedy=0;c.lastx=e;c.lasty=l;c.lastscrollx=-1;c.lastscrolly=
    -1};this.update=function(e,l){var h=c.time();c.steptime=h-c.lasttime;c.lasttime=h;var h=l-c.lasty,t=e-c.lastx,b=c.nc.getScrollTop(),p=c.nc.getScrollLeft(),b=b+h,p=p+t;c.snapx=0>p||p>c.nc.page.maxw;c.snapy=0>b||b>c.nc.page.maxh;c.speedx=t;c.speedy=h;c.lastx=e;c.lasty=l};this.stop=function(){c.nc.unsynched("domomentum2d");c.timer&&clearTimeout(c.timer);c.timer=0;c.lastscrollx=-1;c.lastscrolly=-1};this.doSnapy=function(e,l){var h=!1;0>l?(l=0,h=!0):l>c.nc.page.maxh&&(l=c.nc.page.maxh,h=!0);0>e?(e=0,h=
    !0):e>c.nc.page.maxw&&(e=c.nc.page.maxw,h=!0);h&&c.nc.doScrollPos(e,l,c.nc.opt.snapbackspeed)};this.doMomentum=function(e){var l=c.time(),h=e?l+e:c.lasttime;e=c.nc.getScrollLeft();var t=c.nc.getScrollTop(),b=c.nc.page.maxh,p=c.nc.page.maxw;c.speedx=0<p?Math.min(60,c.speedx):0;c.speedy=0<b?Math.min(60,c.speedy):0;h=h&&60>=l-h;if(0>t||t>b||0>e||e>p)h=!1;e=c.speedx&&h?c.speedx:!1;if(c.speedy&&h&&c.speedy||e){var g=Math.max(16,c.steptime);50<g&&(e=g/50,c.speedx*=e,c.speedy*=e,g=50);c.demulxy=0;c.lastscrollx=
    c.nc.getScrollLeft();c.chkx=c.lastscrollx;c.lastscrolly=c.nc.getScrollTop();c.chky=c.lastscrolly;var s=c.lastscrollx,u=c.lastscrolly,d=function(){var e=600<c.time()-l?0.04:0.02;if(c.speedx&&(s=Math.floor(c.lastscrollx-c.speedx*(1-c.demulxy)),c.lastscrollx=s,0>s||s>p))e=0.1;if(c.speedy&&(u=Math.floor(c.lastscrolly-c.speedy*(1-c.demulxy)),c.lastscrolly=u,0>u||u>b))e=0.1;c.demulxy=Math.min(1,c.demulxy+e);c.nc.synched("domomentum2d",function(){c.speedx&&(c.nc.getScrollLeft()!=c.chkx&&c.stop(),c.chkx=
    s,c.nc.setScrollLeft(s));c.speedy&&(c.nc.getScrollTop()!=c.chky&&c.stop(),c.chky=u,c.nc.setScrollTop(u));c.timer||(c.nc.hideCursor(),c.doSnapy(s,u))});1>c.demulxy?c.timer=setTimeout(d,g):(c.stop(),c.nc.hideCursor(),c.doSnapy(s,u))};d()}else c.doSnapy(c.nc.getScrollLeft(),c.nc.getScrollTop())}},B=e.fn.scrollTop;e.cssHooks.pageYOffset={get:function(h,c,k){return(c=e.data(h,"__nicescroll")||!1)&&c.ishwscroll?c.getScrollTop():B.call(h)},set:function(h,c){var k=e.data(h,"__nicescroll")||!1;k&&k.ishwscroll?
    k.setScrollTop(parseInt(c)):B.call(h,c);return this}};e.fn.scrollTop=function(h){if("undefined"==typeof h){var c=this[0]?e.data(this[0],"__nicescroll")||!1:!1;return c&&c.ishwscroll?c.getScrollTop():B.call(this)}return this.each(function(){var c=e.data(this,"__nicescroll")||!1;c&&c.ishwscroll?c.setScrollTop(parseInt(h)):B.call(e(this),h)})};var C=e.fn.scrollLeft;e.cssHooks.pageXOffset={get:function(h,c,k){return(c=e.data(h,"__nicescroll")||!1)&&c.ishwscroll?c.getScrollLeft():C.call(h)},set:function(h,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c){var k=e.data(h,"__nicescroll")||!1;k&&k.ishwscroll?k.setScrollLeft(parseInt(c)):C.call(h,c);return this}};e.fn.scrollLeft=function(h){if("undefined"==typeof h){var c=this[0]?e.data(this[0],"__nicescroll")||!1:!1;return c&&c.ishwscroll?c.getScrollLeft():C.call(this)}return this.each(function(){var c=e.data(this,"__nicescroll")||!1;c&&c.ishwscroll?c.setScrollLeft(parseInt(h)):C.call(e(this),h)})};var D=function(h){var c=this;this.length=0;this.name="nicescrollarray";this.each=function(e){for(var h=
    0,k=0;h<c.length;h++)e.call(c[h],k++);return c};this.push=function(e){c[c.length]=e;c.length++};this.eq=function(e){return c[e]};if(h)for(a=0;a<h.length;a++){var k=e.data(h[a],"__nicescroll")||!1;k&&(this[this.length]=k,this.length++)}return this};(function(e,c,k){for(var l=0;l<c.length;l++)k(e,c[l])})(D.prototype,"show hide toggle onResize resize remove stop doScrollPos".split(" "),function(e,c){e[c]=function(){var e=arguments;return this.each(function(){this[c].apply(this,e)})}});e.fn.getNiceScroll=
    function(h){return"undefined"==typeof h?new D(this):this[h]&&e.data(this[h],"__nicescroll")||!1};e.extend(e.expr[":"],{nicescroll:function(h){return e.data(h,"__nicescroll")?!0:!1}});e.fn.niceScroll=function(h,c){"undefined"==typeof c&&("object"==typeof h&&!("jquery"in h))&&(c=h,h=!1);var k=new D;"undefined"==typeof c&&(c={});h&&(c.doc=e(h),c.win=e(this));var l=!("doc"in c);!l&&!("win"in c)&&(c.win=e(this));this.each(function(){var h=e(this).data("__nicescroll")||!1;h||(c.doc=l?e(this):c.doc,h=new Q(c,
    e(this)),e(this).data("__nicescroll",h));k.push(h)});return 1==k.length?k[0]:k};window.NiceScroll={getjQuery:function(){return e}};e.nicescroll||(e.nicescroll=new D,e.nicescroll.options=I)})(jQuery);
/*
@author       Constantin Saguin - @brutaldesign
@link            http://bsign.co
@github        http://github.com/brutaldesign/swipebox
@version     1.0
@license      MIT License
*/
(function(e,t,n,r){n.swipebox=function(i,s){var o={useCSS:true,hideBarsDelay:3e3},u=this,a=n(i),i=i,f=i.selector,l=n(f),c=t.createTouch!==r||"ontouchstart"in e||"onmsgesturechange"in e||navigator.msMaxTouchPoints,h=!!e.SVGSVGElement,p='<div id="swipebox-overlay">                 <div id="swipebox-slider"></div>                    <div id="swipebox-caption"></div>                   <div id="swipebox-action">                      <a id="swipebox-close"></a>                     <a id="swipebox-prev"></a>                      <a id="swipebox-next"></a>                  </div>          </div>';u.settings={};u.init=function(){u.settings=n.extend({},o,s);l.click(function(e){e.preventDefault();e.stopPropagation();index=a.index(n(this));d.init(index)})};var d={init:function(e){this.build();this.openSlide(e);this.openImg(e);this.preloadImg(e+1);this.preloadImg(e-1)},build:function(){var t=this;n("body").append(p);if(t.doCssTrans()){n("#swipebox-slider").css({"-webkit-transition":"left 0.4s ease","-moz-transition":"left 0.4s ease","-o-transition":"left 0.4s ease","-khtml-transition":"left 0.4s ease",transition:"left 0.4s ease"});n("#swipebox-overlay").css({"-webkit-transition":"opacity 1s ease","-moz-transition":"opacity 1s ease","-o-transition":"opacity 1s ease","-khtml-transition":"opacity 1s ease",transition:"opacity 1s ease"});n("#swipebox-action, #swipebox-caption").css({"-webkit-transition":"0.5s","-moz-transition":"0.5s","-o-transition":"0.5s","-khtml-transition":"0.5s",transition:"0.5s"})}if(h){var r=n("#swipebox-action #swipebox-close").css("background-image");r=r.replace("png","svg");n("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({"background-image":r})}a.each(function(){n("#swipebox-slider").append('<div class="slide"></div>')});t.setDim();t.actions();t.keyboard();t.gesture();t.animBars();n(e).resize(function(){t.setDim()}).resize()},setDim:function(){var t={width:n(e).width(),height:e.innerHeight?e.innerHeight:n(e).height()};n("#swipebox-overlay").css(t)},supportTransition:function(){var e="transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");for(var n=0;n<e.length;n++){if(t.createElement("div").style[e[n]]!==r){return e[n]}}return false},doCssTrans:function(){if(u.settings.useCSS&&this.supportTransition()){return true}},gesture:function(){if(c){var e=this,t=null,r=10,i={},s={};var o=n("#swipebox-caption, #swipebox-action");o.addClass("visible-bars");e.setTimeout();n("body").bind("touchstart",function(e){n(this).addClass("touching");s=e.originalEvent.targetTouches[0];i.pageX=e.originalEvent.targetTouches[0].pageX;n(".touching").bind("touchmove",function(e){e.preventDefault();e.stopPropagation();s=e.originalEvent.targetTouches[0]});return false}).bind("touchend",function(u){u.preventDefault();u.stopPropagation();t=s.pageX-i.pageX;if(t>=r){e.getPrev()}else if(t<=-r){e.getNext()}else{if(!o.hasClass("visible-bars")){e.showBars();e.setTimeout()}else{e.clearTimeout();e.hideBars()}}n(".touching").off("touchmove").removeClass("touching")})}},setTimeout:function(){if(u.settings.hideBarsDelay>0){var t=this;t.clearTimeout();t.timeout=e.setTimeout(function(){t.hideBars()},u.settings.hideBarsDelay)}},clearTimeout:function(){e.clearTimeout(this.timeout);this.timeout=null},showBars:function(){var e=n("#swipebox-caption, #swipebox-action");if(this.doCssTrans()){e.addClass("visible-bars")}else{n("#swipebox-caption").animate({top:0},500);n("#swipebox-action").animate({bottom:0},500);setTimeout(function(){e.addClass("visible-bars")},1e3)}},hideBars:function(){var e=n("#swipebox-caption, #swipebox-action");if(this.doCssTrans()){e.removeClass("visible-bars")}else{n("#swipebox-caption").animate({top:"-50px"},500);n("#swipebox-action").animate({bottom:"-50px"},500);setTimeout(function(){e.removeClass("visible-bars")},1e3)}},animBars:function(){var e=this;var t=n("#swipebox-caption, #swipebox-action");if(!c){t.addClass("visible-bars");e.setTimeout();n("#swipebox-slider").click(function(n){if(!t.hasClass("visible-bars")){e.showBars();e.setTimeout()}});n("#swipebox-action").hover(function(){e.showBars();t.addClass("force-visible-bars");e.clearTimeout()},function(){t.removeClass("force-visible-bars");e.setTimeout()})}},keyboard:function(){if(!c){var t=this;n(e).bind("keyup",function(e){e.preventDefault();e.stopPropagation();if(e.keyCode==37){t.getPrev()}else if(e.keyCode==39){t.getNext()}else if(e.keyCode==27){t.closeSlide()}})}},actions:function(){var e=this;if(a.length<2){n("#swipebox-prev, #swipebox-next").hide()}else{n("#swipebox-prev").bind("click touchend",function(t){t.preventDefault();t.stopPropagation();e.getPrev();e.setTimeout()});n("#swipebox-next").bind("click touchend",function(t){t.preventDefault();t.stopPropagation();e.getNext();e.setTimeout()})}n("#swipebox-close").bind("click touchstart",function(t){e.closeSlide()})},setSlide:function(e){var t=n("#swipebox-slider");if(this.doCssTrans()){t.css({left:-e*100+"%"})}else{t.animate({left:-e*100+"%"})}n("#swipebox-slider .slide").removeClass("current");n("#swipebox-slider .slide").eq(e).addClass("current");this.setTitle(e);n("#swipebox-prev, #swipebox-next").removeClass("disabled");if(e==0){n("#swipebox-prev").addClass("disabled")}else if(e==a.length-1){n("#swipebox-next").addClass("disabled")}},openSlide:function(e){n("#swipebox-overlay").show().stop().animate({opacity:1},"slow").addClass("visible");setTimeout(function(){n("body").addClass("swipebox-overflow-hidden")},1500);this.setSlide(e)},preloadImg:function(e){var t=this;setTimeout(function(){t.openImg(e)},1e3)},openImg:function(e){var t=this;if(e<0||e>=a.length){return false}t.loadImg(a.eq(e).attr("href"),function(){n("#swipebox-slider .slide").eq(e).html(this)})},setTitle:function(e){var t=null;if(a.eq(e).attr("title")){n("#swipebox-caption").empty().append(a.eq(e).attr("title"))}},loadImg:function(e,t){var r=n("<img>").on("load",function(){t.call(r)});r.attr("src",e)},getNext:function(){var e=this;index=n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));if(index+1<a.length){index++;e.setSlide(index);e.preloadImg(index+1)}else{n("#swipebox-slider").addClass("rightSpring");setTimeout(function(){n("#swipebox-slider").removeClass("rightSpring")},500)}},getPrev:function(){var e=this;index=n("#swipebox-slider .slide").index(n("#swipebox-slider .slide.current"));if(index>0){index--;e.setSlide(index);e.preloadImg(index-1)}else{n("#swipebox-slider").addClass("leftSpring");setTimeout(function(){n("#swipebox-slider").removeClass("leftSpring")},500)}},closeSlide:function(){var e=this;n("body").removeClass("swipebox-overflow-hidden");n("#swipebox-overlay").animate({opacity:0},"fast");setTimeout(function(){n("#swipebox-overlay").removeClass("visible");e.destroy()},1e3)},destroy:function(){var t=this;n(e).unbind("keyup");n(e).unbind("resize");n("body").unbind();n("#swipebox-slider").unbind();n("#swipebox-overlay").remove();a.removeData("_swipebox")}};u.init()};n.fn.swipebox=function(e){if(!n.data(this,"_swipebox")){var t=new n.swipebox(this,e);this.data("_swipebox",t)}}})(window,document,jQuery)
/*
 *  Vide - v0.3.5
 *  Easy as hell jQuery plugin for video backgrounds.
 *  http://vodkabears.github.io/vide/
 *
 *  Made by Ilya Makarov
 *  Under MIT License
 */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],b):b("object"==typeof exports?require("jquery"):a.jQuery)}(this,function(a){"use strict";function b(a){var b,c,d,e,f,g,h,i={};for(f=a.replace(/\s*:\s*/g,":").replace(/\s*,\s*/g,",").split(","),h=0,g=f.length;g>h&&(c=f[h],-1===c.search(/^(http|https|ftp):\/\//)&&-1!==c.search(":"));h++)b=c.indexOf(":"),d=c.substring(0,b),e=c.substring(b+1),e||(e=void 0),"string"==typeof e&&(e="true"===e||("false"===e?!1:e)),"string"==typeof e&&(e=isNaN(e)?e:+e),i[d]=e;return null==d&&null==e?a:i}function c(a){a=""+a;var b,c,d,e=a.split(/\s+/),f="50%",g="50%";for(d=0,b=e.length;b>d;d++)c=e[d],"left"===c?f="0%":"right"===c?f="100%":"top"===c?g="0%":"bottom"===c?g="100%":"center"===c?0===d?f="50%":g="50%":0===d?f=c:g=c;return{x:f,y:g}}function d(b,c){var d=function(){c(this.src)};a('<img src="'+b+'.gif">').load(d),a('<img src="'+b+'.jpg">').load(d),a('<img src="'+b+'.jpeg">').load(d),a('<img src="'+b+'.png">').load(d)}function e(c,d,e){if(this.$element=a(c),"string"==typeof d&&(d=b(d)),e?"string"==typeof e&&(e=b(e)):e={},"string"==typeof d)d=d.replace(/\.\w*$/,"");else if("object"==typeof d)for(var f in d)d.hasOwnProperty(f)&&(d[f]=d[f].replace(/\.\w*$/,""));this.settings=a.extend({},g,e),this.path=d,this.init()}var f="vide",g={volume:1,playbackRate:1,muted:!0,loop:!0,autoplay:!0,position:"50% 50%",posterType:"detect",resizing:!0};e.prototype.init=function(){var b,e=this,g=c(e.settings.position),h="";e.$wrapper=a("<div>").css({position:"absolute","z-index":-1,top:0,left:0,bottom:0,right:0,overflow:"hidden","-webkit-background-size":"cover","-moz-background-size":"cover","-o-background-size":"cover","background-size":"cover","background-repeat":"no-repeat","background-position":g.x+" "+g.y}),b=e.path,"object"==typeof e.path&&(e.path.poster?b=e.path.poster:e.path.mp4?b=e.path.mp4:e.path.webm?b=e.path.webm:e.path.ogv&&(b=e.path.ogv)),"detect"===e.settings.posterType?d(b,function(a){e.$wrapper.css("background-image","url("+a+")")}):"none"!==e.settings.posterType&&e.$wrapper.css("background-image","url("+b+"."+e.settings.posterType+")"),"static"===e.$element.css("position")&&e.$element.css("position","relative"),e.$element.prepend(e.$wrapper),"object"==typeof e.path?(e.path.mp4&&(h+='<source src="https://res.cloudinary.com/imageuploadcloud/video/upload/v1528552813/prezzie/gift-packs.mp4" type="video/mp4">'),e.path.webm&&(h+='<source src="https://res.cloudinary.com/imageuploadcloud/video/upload/v1528552813/prezzie/gift-packs.mp4" type="video/webm">'),e.path.ogv&&(h+='<source src="https://res.cloudinary.com/imageuploadcloud/video/upload/v1528552813/prezzie/gift-packs.mp4" type="video/mp4">'),e.$video=a("<video>"+h+"</video>")):e.$video=a('<video><source src="'+e.path+'.mp4" type="video/mp4"><source src="'+e.path+'.webm" type="video/webm"><source src="'+e.path+'.ogv" type="video/ogg"></video>'),e.$video.prop({autoplay:e.settings.autoplay,loop:e.settings.loop,volume:e.settings.volume,muted:e.settings.muted,defaultMuted:e.settings.muted,playbackRate:e.settings.playbackRate,defaultPlaybackRate:e.settings.playbackRate}).css({margin:"auto",position:"absolute","z-index":-1,top:g.y,left:g.x,"-webkit-transform":"translate(-"+g.x+", -"+g.y+")","-ms-transform":"translate(-"+g.x+", -"+g.y+")","-moz-transform":"translate(-"+g.x+", -"+g.y+")",transform:"translate(-"+g.x+", -"+g.y+")",visibility:"hidden"}).one("canplaythrough."+f,function(){e.resize()}).one("playing."+f,function(){e.$video.css("visibility","visible"),e.$wrapper.css("background-image","none")}),e.$element.on("resize."+f,function(){e.settings.resizing&&e.resize()}),e.$wrapper.append(e.$video)},e.prototype.getVideoObject=function(){return this.$video[0]},e.prototype.resize=function(){if(this.$video){var a=this.$video[0].videoHeight,b=this.$video[0].videoWidth,c=this.$wrapper.height(),d=this.$wrapper.width();this.$video.css(d/b>c/a?{width:d+2,height:"auto"}:{width:"auto",height:c+2})}},e.prototype.destroy=function(){this.$element.off(f),this.$video&&this.$video.off(f),delete a[f].lookup[this.index],this.$element.removeData(f),this.$wrapper.remove()},a[f]={lookup:[]},a.fn[f]=function(b,c){var d;return this.each(function(){d=a.data(this,f),d&&d.destroy(),d=new e(this,b,c),d.index=a[f].lookup.push(d)-1,a.data(this,f,d)}),this},a(document).ready(function(){var b=a(window);b.on("resize."+f,function(){for(var b,c=a[f].lookup.length,d=0;c>d;d++)b=a[f].lookup[d],b&&b.settings.resizing&&b.resize()}),b.on("unload."+f,function(){return!1}),a(document).find("[data-"+f+"-bg]").each(function(b,c){var d=a(c),e=d.data(f+"-options"),g=d.data(f+"-bg");d[f](g,e)})})});
/*!
 * minicart
 * The Mini Cart is a great way to improve your PayPal shopping cart integration.
 *
 * @version 3.0.6
 * @author Jeff Harrell <https://github.com/jeffharrell/>
 * @url http://www.minicartjs.com/
 * @license MIT <https://github.com/jeffharrell/minicart/raw/master/LICENSE.md>
 */

!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function d(a){return"[object Array]"===j.call(a)}function e(a,b){var c;if(null===a)c={__proto__:null};else{if("object"!=typeof a)throw new TypeError("typeof prototype["+typeof a+"] != 'object'");var d=function(){};d.prototype=a,c=new d,c.__proto__=a}return"undefined"!=typeof b&&Object.defineProperties&&Object.defineProperties(c,b),c}function f(a){return"object"!=typeof a&&"function"!=typeof a||null===a}function g(a){if(f(a))throw new TypeError("Object.keys called on a non-object");var b=[];for(var c in a)k.call(a,c)&&b.push(c);return b}function h(a){if(f(a))throw new TypeError("Object.getOwnPropertyNames called on a non-object");var b=g(a);return c.isArray(a)&&-1===c.indexOf(a,"length")&&b.push("length"),b}function i(a,b){return{value:a[b]}}var j=Object.prototype.toString,k=Object.prototype.hasOwnProperty;c.isArray="function"==typeof Array.isArray?Array.isArray:d,c.indexOf=function(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c++)if(b===a[c])return c;return-1},c.filter=function(a,b){if(a.filter)return a.filter(b);for(var c=[],d=0;d<a.length;d++)b(a[d],d,a)&&c.push(a[d]);return c},c.forEach=function(a,b,c){if(a.forEach)return a.forEach(b,c);for(var d=0;d<a.length;d++)b.call(c,a[d],d,a)},c.map=function(a,b){if(a.map)return a.map(b);for(var c=new Array(a.length),d=0;d<a.length;d++)c[d]=b(a[d],d,a);return c},c.reduce=function(a,b,c){if(a.reduce)return a.reduce(b,c);var d,e=!1;2<arguments.length&&(d=c,e=!0);for(var f=0,g=a.length;g>f;++f)a.hasOwnProperty(f)&&(e?d=b(d,a[f],f,a):(d=a[f],e=!0));return d},c.substr="b"!=="ab".substr(-1)?function(a,b,c){return 0>b&&(b=a.length+b),a.substr(b,c)}:function(a,b,c){return a.substr(b,c)},c.trim=function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},c.bind=function(){var a=Array.prototype.slice.call(arguments),b=a.shift();if(b.bind)return b.bind.apply(b,a);var c=a.shift();return function(){b.apply(c,a.concat([Array.prototype.slice.call(arguments)]))}},c.create="function"==typeof Object.create?Object.create:e;var l="function"==typeof Object.keys?Object.keys:g,m="function"==typeof Object.getOwnPropertyNames?Object.getOwnPropertyNames:h;if((new Error).hasOwnProperty("description")){var n=function(a,b){return"[object Error]"===j.call(a)&&(b=c.filter(b,function(a){return"description"!==a&&"number"!==a&&"message"!==a})),b};c.keys=function(a){return n(a,l(a))},c.getOwnPropertyNames=function(a){return n(a,m(a))}}else c.keys=l,c.getOwnPropertyNames=m;if("function"==typeof Object.getOwnPropertyDescriptor)try{Object.getOwnPropertyDescriptor({a:1},"a"),c.getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor}catch(o){c.getOwnPropertyDescriptor=function(a,b){try{return Object.getOwnPropertyDescriptor(a,b)}catch(c){return i(a,b)}}}else c.getOwnPropertyDescriptor=i},{}],2:[function(){},{}],3:[function(a,b,c){function d(a,b){for(var c=0,d=a.length-1;d>=0;d--){var e=a[d];"."===e?a.splice(d,1):".."===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}var e=a("__browserify_process"),f=a("util"),g=a("_shims"),h=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,i=function(a){return h.exec(a).slice(1)};c.resolve=function(){for(var a="",b=!1,c=arguments.length-1;c>=-1&&!b;c--){var h=c>=0?arguments[c]:e.cwd();if(!f.isString(h))throw new TypeError("Arguments to path.resolve must be strings");h&&(a=h+"/"+a,b="/"===h.charAt(0))}return a=d(g.filter(a.split("/"),function(a){return!!a}),!b).join("/"),(b?"/":"")+a||"."},c.normalize=function(a){var b=c.isAbsolute(a),e="/"===g.substr(a,-1);return a=d(g.filter(a.split("/"),function(a){return!!a}),!b).join("/"),a||b||(a="."),a&&e&&(a+="/"),(b?"/":"")+a},c.isAbsolute=function(a){return"/"===a.charAt(0)},c.join=function(){var a=Array.prototype.slice.call(arguments,0);return c.normalize(g.filter(a,function(a){if(!f.isString(a))throw new TypeError("Arguments to path.join must be strings");return a}).join("/"))},c.relative=function(a,b){function d(a){for(var b=0;b<a.length&&""===a[b];b++);for(var c=a.length-1;c>=0&&""===a[c];c--);return b>c?[]:a.slice(b,c-b+1)}a=c.resolve(a).substr(1),b=c.resolve(b).substr(1);for(var e=d(a.split("/")),f=d(b.split("/")),g=Math.min(e.length,f.length),h=g,i=0;g>i;i++)if(e[i]!==f[i]){h=i;break}for(var j=[],i=h;i<e.length;i++)j.push("..");return j=j.concat(f.slice(h)),j.join("/")},c.sep="/",c.delimiter=":",c.dirname=function(a){var b=i(a),c=b[0],d=b[1];return c||d?(d&&(d=d.substr(0,d.length-1)),c+d):"."},c.basename=function(a,b){var c=i(a)[2];return b&&c.substr(-1*b.length)===b&&(c=c.substr(0,c.length-b.length)),c},c.extname=function(a){return i(a)[3]}},{__browserify_process:5,_shims:1,util:4}],4:[function(a,b,c){function d(a,b){var d={seen:[],stylize:f};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),o(b)?d.showHidden=b:b&&c._extend(d,b),u(d.showHidden)&&(d.showHidden=!1),u(d.depth)&&(d.depth=2),u(d.colors)&&(d.colors=!1),u(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=e),h(d,a,d.depth)}function e(a,b){var c=d.styles[b];return c?"["+d.colors[c][0]+"m"+a+"["+d.colors[c][1]+"m":a}function f(a){return a}function g(a){var b={};return G.forEach(a,function(a){b[a]=!0}),b}function h(a,b,d){if(a.customInspect&&b&&z(b.inspect)&&b.inspect!==c.inspect&&(!b.constructor||b.constructor.prototype!==b)){var e=b.inspect(d);return s(e)||(e=h(a,e,d)),e}var f=i(a,b);if(f)return f;var o=G.keys(b),p=g(o);if(a.showHidden&&(o=G.getOwnPropertyNames(b)),0===o.length){if(z(b)){var q=b.name?": "+b.name:"";return a.stylize("[Function"+q+"]","special")}if(v(b))return a.stylize(RegExp.prototype.toString.call(b),"regexp");if(x(b))return a.stylize(Date.prototype.toString.call(b),"date");if(y(b))return j(b)}var r="",t=!1,u=["{","}"];if(n(b)&&(t=!0,u=["[","]"]),z(b)){var w=b.name?": "+b.name:"";r=" [Function"+w+"]"}if(v(b)&&(r=" "+RegExp.prototype.toString.call(b)),x(b)&&(r=" "+Date.prototype.toUTCString.call(b)),y(b)&&(r=" "+j(b)),0===o.length&&(!t||0==b.length))return u[0]+r+u[1];if(0>d)return v(b)?a.stylize(RegExp.prototype.toString.call(b),"regexp"):a.stylize("[Object]","special");a.seen.push(b);var A;return A=t?k(a,b,d,p,o):o.map(function(c){return l(a,b,d,p,c,t)}),a.seen.pop(),m(A,r,u)}function i(a,b){if(u(b))return a.stylize("undefined","undefined");if(s(b)){var c="'"+JSON.stringify(b).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return a.stylize(c,"string")}return r(b)?a.stylize(""+b,"number"):o(b)?a.stylize(""+b,"boolean"):p(b)?a.stylize("null","null"):void 0}function j(a){return"["+Error.prototype.toString.call(a)+"]"}function k(a,b,c,d,e){for(var f=[],g=0,h=b.length;h>g;++g)f.push(F(b,String(g))?l(a,b,c,d,String(g),!0):"");return G.forEach(e,function(e){e.match(/^\d+$/)||f.push(l(a,b,c,d,e,!0))}),f}function l(a,b,c,d,e,f){var g,i,j;if(j=G.getOwnPropertyDescriptor(b,e)||{value:b[e]},j.get?i=j.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):j.set&&(i=a.stylize("[Setter]","special")),F(d,e)||(g="["+e+"]"),i||(G.indexOf(a.seen,j.value)<0?(i=p(c)?h(a,j.value,null):h(a,j.value,c-1),i.indexOf("\n")>-1&&(i=f?i.split("\n").map(function(a){return"  "+a}).join("\n").substr(2):"\n"+i.split("\n").map(function(a){return"   "+a}).join("\n"))):i=a.stylize("[Circular]","special")),u(g)){if(f&&e.match(/^\d+$/))return i;g=JSON.stringify(""+e),g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),g=a.stylize(g,"string"))}return g+": "+i}function m(a,b,c){var d=0,e=G.reduce(a,function(a,b){return d++,b.indexOf("\n")>=0&&d++,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0);return e>60?c[0]+(""===b?"":b+"\n ")+" "+a.join(",\n  ")+" "+c[1]:c[0]+b+" "+a.join(", ")+" "+c[1]}function n(a){return G.isArray(a)}function o(a){return"boolean"==typeof a}function p(a){return null===a}function q(a){return null==a}function r(a){return"number"==typeof a}function s(a){return"string"==typeof a}function t(a){return"symbol"==typeof a}function u(a){return void 0===a}function v(a){return w(a)&&"[object RegExp]"===C(a)}function w(a){return"object"==typeof a&&a}function x(a){return w(a)&&"[object Date]"===C(a)}function y(a){return w(a)&&"[object Error]"===C(a)}function z(a){return"function"==typeof a}function A(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||"undefined"==typeof a}function B(a){return a&&"object"==typeof a&&"function"==typeof a.copy&&"function"==typeof a.fill&&"function"==typeof a.binarySlice}function C(a){return Object.prototype.toString.call(a)}function D(a){return 10>a?"0"+a.toString(10):a.toString(10)}function E(){var a=new Date,b=[D(a.getHours()),D(a.getMinutes()),D(a.getSeconds())].join(":");return[a.getDate(),I[a.getMonth()],b].join(" ")}function F(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var G=a("_shims"),H=/%[sdj%]/g;c.format=function(a){if(!s(a)){for(var b=[],c=0;c<arguments.length;c++)b.push(d(arguments[c]));return b.join(" ")}for(var c=1,e=arguments,f=e.length,g=String(a).replace(H,function(a){if("%%"===a)return"%";if(c>=f)return a;switch(a){case"%s":return String(e[c++]);case"%d":return Number(e[c++]);case"%j":try{return JSON.stringify(e[c++])}catch(b){return"[Circular]"}default:return a}}),h=e[c];f>c;h=e[++c])g+=p(h)||!w(h)?" "+h:" "+d(h);return g},c.inspect=d,d.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},d.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},c.isArray=n,c.isBoolean=o,c.isNull=p,c.isNullOrUndefined=q,c.isNumber=r,c.isString=s,c.isSymbol=t,c.isUndefined=u,c.isRegExp=v,c.isObject=w,c.isDate=x,c.isError=y,c.isFunction=z,c.isPrimitive=A,c.isBuffer=B;var I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];c.log=function(){console.log("%s - %s",E(),c.format.apply(c,arguments))},c.inherits=function(a,b){a.super_=b,a.prototype=G.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})},c._extend=function(a,b){if(!b||!w(b))return a;for(var c=G.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}},{_shims:1}],5:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],6:[function(a,b,c){function d(a){return a.substr(1).split("|").reduce(function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"filters."+d+"("+a+e+")"})}function e(a,b,c,d){var e=b.split("\n"),f=Math.max(d-3,0),g=Math.min(e.length,d+3),h=e.slice(f,g).map(function(a,b){var c=b+f+1;return(c==d?" >> ":"    ")+c+"| "+a}).join("\n");throw a.path=c,a.message=(c||"ejs")+":"+d+"\n"+h+"\n\n"+a.message,a}function f(a,b){var c=k(i(b),a),d=j(a);return d||(c+=".ejs"),c}var g=a("./utils"),h=a("path"),i=h.dirname,j=h.extname,k=h.join,l=a("fs"),m=l.readFileSync,n=c.filters=a("./filters"),o={};c.clearCache=function(){o={}};var p=(c.parse=function(a,b){var b=b||{},e=b.open||c.open||"<%",g=b.close||c.close||"%>",h=b.filename,i=b.compileDebug!==!1,j="";j+="var buf = [];",!1!==b._with&&(j+="\nwith (locals || {}) { (function(){ "),j+="\n buf.push('";for(var k=1,l=!1,n=0,o=a.length;o>n;++n){var p=a[n];if(a.slice(n,e.length+n)==e){n+=e.length;var q,r,s=(i?"__stack.lineno=":"")+k;switch(a[n]){case"=":q="', escape(("+s+", ",r=")), '",++n;break;case"-":q="', ("+s+", ",r="), '",++n;break;default:q="');"+s+";",r="; buf.push('"}var t=a.indexOf(g,n),u=a.substring(n,t),v=n,w=null,x=0;if("-"==u[u.length-1]&&(u=u.substring(0,u.length-2),l=!0),0==u.trim().indexOf("include")){var y=u.trim().slice(7).trim();if(!h)throw new Error("filename option is required for includes");var z=f(y,h);w=m(z,"utf8"),w=c.parse(w,{filename:z,_with:!1,open:e,close:g,compileDebug:i}),j+="' + (function(){"+w+"})() + '",u=""}for(;~(x=u.indexOf("\n",x));)x++,k++;":"==u.substr(0,1)&&(u=d(u)),u&&(u.lastIndexOf("//")>u.lastIndexOf("\n")&&(u+="\n"),j+=q,j+=u,j+=r),n+=t-v+g.length-1}else"\\"==p?j+="\\\\":"'"==p?j+="\\'":"\r"==p||("\n"==p?l?l=!1:(j+="\\n",k++):j+=p)}return j+=!1!==b._with?"'); })();\n} \nreturn buf.join('');":"');\nreturn buf.join('');"},c.compile=function(a,b){b=b||{};var d=b.escape||g.escape,f=JSON.stringify(a),h=b.compileDebug!==!1,i=b.client,j=b.filename?JSON.stringify(b.filename):"undefined";a=h?["var __stack = { lineno: 1, input: "+f+", filename: "+j+" };",e.toString(),"try {",c.parse(a,b),"} catch (err) {","  rethrow(err, __stack.input, __stack.filename, __stack.lineno);","}"].join("\n"):c.parse(a,b),b.debug&&console.log(a),i&&(a="escape = escape || "+d.toString()+";\n"+a);try{var k=new Function("locals, filters, escape, rethrow",a)}catch(l){throw"SyntaxError"==l.name&&(l.message+=b.filename?" in "+j:" while compiling ejs"),l}return i?k:function(a){return k.call(this,a,n,d,e)}});c.render=function(a,b){var c,b=b||{};if(b.cache){if(!b.filename)throw new Error('"cache" option requires "filename".');c=o[b.filename]||(o[b.filename]=p(a,b))}else c=p(a,b);return b.__proto__=b.locals,c.call(b.scope,b)},c.renderFile=function(a,b,d){var e=a+":string";"function"==typeof b&&(d=b,b={}),b.filename=a;var f;try{f=b.cache?o[e]||(o[e]=m(a,"utf8")):m(a,"utf8")}catch(g){return void d(g)}d(null,c.render(f,b))},c.__express=c.renderFile,a.extensions?a.extensions[".ejs"]=function(a,b){b=b||a.filename;var c={filename:b,client:!0},d=l.readFileSync(b).toString(),e=p(d,c);a._compile("module.exports = "+e.toString()+";",b)}:a.registerExtension&&a.registerExtension(".ejs",function(a){return p(a,{})})},{"./filters":7,"./utils":8,fs:2,path:3}],7:[function(a,b,c){c.first=function(a){return a[0]},c.last=function(a){return a[a.length-1]},c.capitalize=function(a){return a=String(a),a[0].toUpperCase()+a.substr(1,a.length)},c.downcase=function(a){return String(a).toLowerCase()},c.upcase=function(a){return String(a).toUpperCase()},c.sort=function(a){return Object.create(a).sort()},c.sort_by=function(a,b){return Object.create(a).sort(function(a,c){return a=a[b],c=c[b],a>c?1:c>a?-1:0})},c.size=c.length=function(a){return a.length},c.plus=function(a,b){return Number(a)+Number(b)},c.minus=function(a,b){return Number(a)-Number(b)},c.times=function(a,b){return Number(a)*Number(b)},c.divided_by=function(a,b){return Number(a)/Number(b)},c.join=function(a,b){return a.join(b||", ")},c.truncate=function(a,b,c){return a=String(a),a.length>b&&(a=a.slice(0,b),c&&(a+=c)),a},c.truncate_words=function(a,b){var a=String(a),c=a.split(/ +/);return c.slice(0,b).join(" ")},c.replace=function(a,b,c){return String(a).replace(b,c||"")},c.prepend=function(a,b){return Array.isArray(a)?[b].concat(a):b+a},c.append=function(a,b){return Array.isArray(a)?a.concat(b):a+b},c.map=function(a,b){return a.map(function(a){return a[b]})},c.reverse=function(a){return Array.isArray(a)?a.reverse():String(a).split("").reverse().join("")},c.get=function(a,b){return a[b]},c.json=function(a){return JSON.stringify(a)}},{}],8:[function(a,b,c){c.escape=function(a){return String(a).replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")}},{}],9:[function(a,b){"use strict";function c(a,b){var c,d,h,i,j;if(this._items=[],this._settings={bn:g.BN},e.call(this),f.call(this,a,b),(c=this.load())&&(d=c.items,h=c.settings,h&&(this._settings=h),d))for(j=0,i=d.length;i>j;j++)this.add(d[j])}var d=a("./product"),e=a("./util/pubsub"),f=a("./util/storage"),g=a("./constants"),h=a("./util/currency"),i=a("./util/mixin");i(c.prototype,e.prototype),i(c.prototype,f.prototype),c.prototype.add=function(a){var b,c,e,f,h=this,i=this.items(),j=!1,k=!1;for(c in a)g.SETTINGS.test(c)&&(this._settings[c]=a[c],delete a[c]);for(f=0,e=i.length;e>f;f++)if(i[f].isEqual(a)){b=i[f],b.set("quantity",b.get("quantity")+(parseInt(a.quantity,10)||1)),j=f,k=!0;break}return b||(b=new d(a),b.isValid()&&(j=this._items.push(b)-1,b.on("change",function(a,b){h.save(),h.fire("change",j,a,b)}),this.save())),b&&this.fire("add",j,b,k),j},c.prototype.items=function(a){return"number"==typeof a?this._items[a]:this._items},c.prototype.settings=function(a){return a?this._settings[a]:this._settings},c.prototype.discount=function(a){var b=parseFloat(this.settings("discount_amount_cart"))||0;return b||(b=(parseFloat(this.settings("discount_rate_cart"))||0)*this.subtotal()/100),a=a||{},a.currency=this.settings("currency_code"),h(b,a)},c.prototype.subtotal=function(a){var b,c,d=this.items(),e=0;for(b=0,c=d.length;c>b;b++)e+=d[b].total();return a=a||{},a.currency=this.settings("currency_code"),h(e,a)},c.prototype.total=function(a){var b=0;return b+=this.subtotal(),b-=this.discount(),a=a||{},a.currency=this.settings("currency_code"),h(b,a)},c.prototype.remove=function(a){var b=this._items.splice(a,1);return 0===this._items.length&&this.destroy(),b&&(this.save(),this.fire("remove",a,b[0])),!!b.length},c.prototype.save=function(){var a,b,c=this.items(),d=this.settings(),e=[];for(a=0,b=c.length;b>a;a++)e.push(c[a].get());f.prototype.save.call(this,{items:e,settings:d})},c.prototype.checkout=function(a){this.fire("checkout",a)},c.prototype.destroy=function(){f.prototype.destroy.call(this),this._items=[],this._settings={bn:g.BN},this.fire("destroy")},b.exports=c},{"./constants":11,"./product":13,"./util/currency":15,"./util/mixin":18,"./util/pubsub":19,"./util/storage":20}],10:[function(a,b){"use strict";var c=a("./util/mixin"),d=b.exports={name:"PPMiniCart",parent:"undefined"!=typeof document?document.body:null,action:"https://www.paypal.com/cgi-bin/webscr",target:"",duration:30,template:'<%var items = cart.items();var settings = cart.settings();var hasItems = !!items.length;var priceFormat = { format: true, currency: cart.settings("currency_code") };var totalFormat = { format: true, showCode: true };%><form method="post" class="<% if (!hasItems) { %>minicart-empty<% } %>" action="<%= config.action %>" target="<%= config.target %>">    <button type="button" class="minicart-closer">&times;</button>    <ul>        <% for (var i= 0, idx = i + 1, len = items.length; i < len; i++, idx++) { %>        <li class="minicart-item">            <div class="minicart-details-name">                <a class="minicart-name" href="<%= items[i].get("href") %>"><%= items[i].get("item_name") %></a>                <ul class="minicart-attributes">                    <% if (items[i].get("item_number")) { %>                    <li>                        <%= items[i].get("item_number") %>                        <input type="hidden" name="item_number_<%= idx %>" value="<%= items[i].get("item_number") %>" />                    </li>                    <% } %>                    <% if (items[i].discount()) { %>                    <li>                        <%= config.strings.discount %> <%= items[i].discount(priceFormat) %>                        <input type="hidden" name="discount_amount_<%= idx %>" value="<%= items[i].discount() %>" />                    </li>                    <% } %>                    <% for (var options = items[i].options(), j = 0, len2 = options.length; j < len2; j++) { %>                        <li>                            <%= options[j].key %>: <%= options[j].value %>                            <input type="hidden" name="on<%= j %>_<%= idx %>" value="<%= options[j].key %>" />                            <input type="hidden" name="os<%= j %>_<%= idx %>" value="<%= options[j].value %>" />                        </li>                    <% } %>                </ul>            </div>            <div class="minicart-details-quantity">                <input class="minicart-quantity" data-minicart-idx="<%= i %>" name="quantity_<%= idx %>" type="text" pattern="[0-9]*" value="<%= items[i].get("quantity") %>" autocomplete="off" />            </div>            <div class="minicart-details-remove">                <button type="button" class="minicart-remove" data-minicart-idx="<%= i %>">&times;</button>            </div>            <div class="minicart-details-price">                <span class="minicart-price"><%= items[i].total(priceFormat) %></span>            </div>            <input type="hidden" name="item_name_<%= idx %>" value="<%= items[i].get("item_name") %>" />            <input type="hidden" name="amount_<%= idx %>" value="<%= items[i].amount() %>" />            <input type="hidden" name="shipping_<%= idx %>" value="<%= items[i].get("shipping") %>" />            <input type="hidden" name="shipping2_<%= idx %>" value="<%= items[i].get("shipping2") %>" />        </li>        <% } %>    </ul>    <div class="minicart-footer">        <% if (hasItems) { %>            <div class="minicart-subtotal">                <%= config.strings.subtotal %> <%= cart.total(totalFormat) %>            </div>            <button class="minicart-submit" type="submit" data-minicart-alt="<%= config.strings.buttonAlt %>"><%- config.strings.button %></button>        <% } else { %>            <p class="minicart-empty-text"><%= config.strings.empty %></p>        <% } %>    </div>    <input type="hidden" name="cmd" value="_cart" />    <input type="hidden" name="upload" value="1" />    <% for (var key in settings) { %>        <input type="hidden" name="<%= key %>" value="<%= settings[key] %>" />    <% } %></form>',styles:'@keyframes pop-in {    0% { opacity: 0; transform: scale(0.1); }    60% { opacity: 1; transform: scale(1.2); }    100% { transform: scale(1); }}@-webkit-keyframes pop-in {    0% { opacity: 0; -webkit-transform: scale(0.1); }    60% { opacity: 1; -webkit-transform: scale(1.2); }    100% { -webkit-transform: scale(1); }}@-moz-keyframes pop-in {    0% { opacity: 0; -moz-transform: scale(0.1); }    60% { opacity: 1; -moz-transform: scale(1.2); }    100% { -moz-transform: scale(1); }}.minicart-showing #PPMiniCart {    display: block;    transform: translateZ(0);    -webkit-transform: translateZ(0);    -moz-transform: translateZ(0);    animation: pop-in 0.25s;    -webkit-animation: pop-in 0.25s;    -moz-animation: pop-in 0.25s;}#PPMiniCart {    display: none;    position: fixed;    left: 50%;    top: 75px;}#PPMiniCart form {    position: relative;    width: 400px;    max-height: 400px;    margin-left: -200px;    padding: 10px 10px 40px;    background: #fbfbfb;    border: 1px solid #d7d7d7;    border-radius: 4px;    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);    font: 15px/normal arial, helvetica;    color: #333;}#PPMiniCart form.minicart-empty {    padding-bottom: 10px;    font-size: 16px;    font-weight: bold;}#PPMiniCart ul {    clear: both;    float: left;    width: 380px;    margin: 5px 0 20px;    padding: 10px;    list-style-type: none;    background: #fff;    border: 1px solid #ccc;    border-radius: 4px;    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);}#PPMiniCart .minicart-empty ul {    display: none;}#PPMiniCart .minicart-closer {    float: right;    margin: -12px -10px 0;    padding: 10px;    background: 0;    border: 0;    font-size: 18px;    cursor: pointer;    font-weight: bold;}#PPMiniCart .minicart-item {    clear: left;    padding: 6px 0;    min-height: 25px;}#PPMiniCart .minicart-item + .minicart-item {    border-top: 1px solid #f2f2f2;}#PPMiniCart .minicart-item a {    color: #333;    text-decoration: none;}#PPMiniCart .minicart-details-name {    float: left;    width: 62%;}#PPMiniCart .minicart-details-quantity {    float: left;    width: 15%;}#PPMiniCart .minicart-details-remove {    float: left;    width: 7%;}#PPMiniCart .minicart-details-price {    float: left;    width: 16%;    text-align: right;}#PPMiniCart .minicart-attributes {    margin: 0;    padding: 0;    background: transparent;    border: 0;    border-radius: 0;    box-shadow: none;    color: #999;    font-size: 12px;    line-height: 22px;}#PPMiniCart .minicart-attributes li {    display: inline;}#PPMiniCart .minicart-attributes li:after {    content: ",";}#PPMiniCart .minicart-attributes li:last-child:after {    content: "";}#PPMiniCart .minicart-quantity {    width: 30px;    height: 18px;    padding: 2px 4px;    border: 1px solid #ccc;    border-radius: 4px;    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);    font-size: 13px;    text-align: right;    transition: border linear 0.2s, box-shadow linear 0.2s;    -webkit-transition: border linear 0.2s, box-shadow linear 0.2s;    -moz-transition: border linear 0.2s, box-shadow linear 0.2s;}#PPMiniCart .minicart-quantity:hover {    border-color: #0078C1;}#PPMiniCart .minicart-quantity:focus {    border-color: #0078C1;    outline: 0;    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 3px rgba(0, 120, 193, 0.4);}#PPMiniCart .minicart-remove {    width: 18px;    height: 19px;    margin: 2px 0 0;    padding: 0;    background: #b7b7b7;    border: 1px solid #a3a3a3;    border-radius: 3px;    color: #fff;    font-size: 13px;    opacity: 0.70;    cursor: pointer;}#PPMiniCart .minicart-remove:hover {    opacity: 1;}#PPMiniCart .minicart-footer {    clear: left;}#PPMiniCart .minicart-subtotal {    position: absolute;    bottom: 17px;    padding-left: 6px;    left: 10px;    font-size: 16px;    font-weight: bold;}#PPMiniCart .minicart-submit {    position: absolute;    bottom: 10px;    right: 10px;    min-width: 153px;    height: 33px;    margin-right: 6px;    padding: 0 9px;    border: 1px solid #ffc727;    border-radius: 5px;    color: #000;    text-shadow: 1px 1px 1px #fff6e9;    cursor: pointer;    background: #ffaa00;    background: url(data:'https://res.cloudinary.com/imageuploadcloud/image/upload/v1528552106/prezzie/f3.jpg';base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZjZlOSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmFhMDAiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);    background: -moz-linear-gradient(top, #fff6e9 0%, #ffaa00 100%);    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fff6e9), color-stop(100%,#ffaa00));    background: -webkit-linear-gradient(top, #fff6e9 0%,#ffaa00 100%);    background: -o-linear-gradient(top, #fff6e9 0%,#ffaa00 100%);    background: -ms-linear-gradient(top, #fff6e9 0%,#ffaa00 100%);    background: linear-gradient(to bottom, #fff6e9 0%,#ffaa00 100%);}#PPMiniCart .minicart-submit img {    vertical-align: middle;    padding: 4px 0 0 2px;}',strings:{button:'',subtotal:"Subtotal:",discount:"Discount:",empty:"Your shopping cart is empty"}};b.exports.load=function(a){return c(d,a)}},{"./util/mixin":18}],11:[function(a,b){"use strict";b.exports={COMMANDS:{_cart:!0,_xclick:!0,_donations:!0},SETTINGS:/^(?:business|currency_code|lc|paymentaction|no_shipping|cn|no_note|invoice|handling_cart|weight_cart|weight_unit|tax_cart|discount_amount_cart|discount_rate_cart|page_style|image_url|cpp_|cs|cbt|return|cancel_return|notify_url|rm|custom|charset)/,BN:"MiniCart_AddToCart_WPS_US",KEYUP_TIMEOUT:500,SHOWING_CLASS:"minicart-showing",REMOVE_CLASS:"minicart-remove",CLOSER_CLASS:"minicart-closer",QUANTITY_CLASS:"minicart-quantity",ITEM_CLASS:"minicart-item",ITEM_CHANGED_CLASS:"minicart-item-changed",SUBMIT_CLASS:"minicart-submit",DATA_IDX:"data-minicart-idx"}},{}],12:[function(a,b){"use strict";var c,d,e,f=a("./cart"),g=a("./view"),h=a("./config"),i={};i.render=function(a){d=i.config=h.load(a),c=i.cart=new f(d.name,d.duration),e=i.view=new g({config:d,cart:c}),c.on("add",e.addItem,e),c.on("change",e.changeItem,e),c.on("remove",e.removeItem,e),c.on("destroy",e.hide,e)},i.reset=function(){c.destroy(),e.hide(),e.redraw()},"undefined"==typeof window?b.exports=i:(window.paypal||(window.paypal={}),window.paypal.minicart=i)},{"./cart":9,"./config":10,"./view":22}],13:[function(a,b){"use strict";function c(a){a.quantity=g.quantity(a.quantity),a.amount=g.amount(a.amount),a.href=g.href(a.href),this._data=a,this._options=null,this._discount=null,this._amount=null,this._total=null,e.call(this)}var d=a("./util/currency"),e=a("./util/pubsub"),f=a("./util/mixin"),g={quantity:function(a){return a=parseInt(a,10),(isNaN(a)||!a)&&(a=1),a},amount:function(a){return parseFloat(a)||0},href:function(a){return a?a:"undefined"!=typeof window?window.location.href:null}};f(c.prototype,e.prototype),c.prototype.get=function(a){return a?this._data[a]:this._data},c.prototype.set=function(a,b){var c=g[a];this._data[a]=c?c(b):b,this._options=null,this._discount=null,this._amount=null,this._total=null,this.fire("change",a)},c.prototype.options=function(){var a,b,c,d,e,f;if(!this._options){for(a=[],e=0;b=this.get("on"+e);){for(c=this.get("os"+e),d=0,f=0;"undefined"!=typeof this.get("option_select"+f);){if(this.get("option_select"+f)===c){d=g.amount(this.get("option_amount"+f));break}f++}a.push({key:b,value:c,amount:d}),e++}this._options=a}return this._options},c.prototype.discount=function(a){var b,c,e,f,h,i;return this._discount||(h=0,e=parseInt(this.get("discount_num"),10)||0,f=Math.max(e,this.get("quantity")-1),void 0!==this.get("discount_amount")?(b=g.amount(this.get("discount_amount")),h+=b,h+=g.amount(this.get("discount_amount2")||b)*f):void 0!==this.get("discount_rate")&&(c=g.amount(this.get("discount_rate")),i=this.amount(),h+=c*i/100,h+=g.amount(this.get("discount_rate2")||c)*i*f/100),this._discount=h),d(this._discount,a)},c.prototype.amount=function(a){var b,c,e,f;if(!this._amount){for(b=this.get("amount"),c=this.options(),f=0,e=c.length;e>f;f++)b+=c[f].amount;this._amount=b}return d(this._amount,a)},c.prototype.total=function(a){var b;return this._total||(b=this.get("quantity")*this.amount(),b-=this.discount(),this._total=g.amount(b)),d(this._total,a)},c.prototype.isEqual=function(a){var b=!1;if(a instanceof c&&(a=a._data),this.get("item_name")===a.item_name&&this.get("item_number")===a.item_number&&this.get("amount")===g.amount(a.amount)){var d=0;for(b=!0;"undefined"!=typeof a["os"+d];){if(this.get("os"+d)!==a["os"+d]){b=!1;break}d++}}return b},c.prototype.isValid=function(){return this.get("item_name")&&this.amount()>0},c.prototype.destroy=function(){this._data=[],this.fire("destroy",this)},b.exports=c},{"./util/currency":15,"./util/mixin":18,"./util/pubsub":19}],14:[function(a,b){"use strict";b.exports.add=function(a,b){var c;return a?void(a&&a.classList&&a.classList.add?a.classList.add(b):(c=new RegExp("\\b"+b+"\\b"),c.test(a.className)||(a.className+=" "+b))):!1},b.exports.remove=function(a,b){var c;return a?void(a.classList&&a.classList.add?a.classList.remove(b):(c=new RegExp("\\b"+b+"\\b"),c.test(a.className)&&(a.className=a.className.replace(c,"")))):!1},b.exports.inject=function(a,b){var c;
return a?void(b&&(c=document.createElement("style"),c.type="text/css",c.styleSheet?c.styleSheet.cssText=b:c.appendChild(document.createTextNode(b)),a.appendChild(c))):!1}},{}],15:[function(a,b){"use strict";var c={AED:{before:"ج"},ANG:{before:"ƒ"},ARS:{before:"$",code:!0},AUD:{before:"$",code:!0},AWG:{before:"ƒ"},BBD:{before:"$",code:!0},BGN:{before:"лв"},BMD:{before:"$",code:!0},BND:{before:"$",code:!0},BRL:{before:"R$"},BSD:{before:"$",code:!0},CAD:{before:"$",code:!0},CHF:{before:"",code:!0},CLP:{before:"$",code:!0},CNY:{before:"¥"},COP:{before:"$",code:!0},CRC:{before:"₡"},CZK:{before:"Kc"},DKK:{before:"kr"},DOP:{before:"$",code:!0},EEK:{before:"kr"},EUR:{before:"€"},GBP:{before:"£"},GTQ:{before:"Q"},HKD:{before:"$",code:!0},HRK:{before:"kn"},HUF:{before:"Ft"},IDR:{before:"Rp"},ILS:{before:"₪"},INR:{before:"Rs."},ISK:{before:"kr"},JMD:{before:"J$"},JPY:{before:"¥"},KRW:{before:"₩"},KYD:{before:"$",code:!0},LTL:{before:"Lt"},LVL:{before:"Ls"},MXN:{before:"$",code:!0},MYR:{before:"RM"},NOK:{before:"kr"},NZD:{before:"$",code:!0},PEN:{before:"S/"},PHP:{before:"Php"},PLN:{before:"z"},QAR:{before:"﷼"},RON:{before:"lei"},RUB:{before:"руб"},SAR:{before:"﷼"},SEK:{before:"kr"},SGD:{before:"$",code:!0},THB:{before:"฿"},TRY:{before:"TL"},TTD:{before:"TT$"},TWD:{before:"NT$"},UAH:{before:"₴"},USD:{before:"$",code:!0},UYU:{before:"$U"},VEF:{before:"Bs"},VND:{before:"₫"},XCD:{before:"$",code:!0},ZAR:{before:"R"}};b.exports=function(a,b){var d=b&&b.currency||"USD",e=c[d],f=e.before||"",g=e.after||"",h=e.length||2,i=e.code&&b&&b.showCode,j=a;return b&&b.format&&(j=f+j.toFixed(h)+g),i&&(j+=" "+d),j}},{}],16:[function(a,b){"use strict";b.exports=function(a,b){var c=[];return b?b.addEventListener?{add:function(a,b,d,e){e=e||a;var f=function(a){d.call(e,a)};a.addEventListener(b,f,!1),c.push([a,b,d,f])},remove:function(a,b,d){var e,f,g,h=c.length;for(g=0;h>g;g++)if(f=c[g],f[0]===a&&f[1]===b&&f[2]===d&&(e=f[3]))return a.removeEventListener(b,e,!1),c=c.slice(g),!0}}:b.attachEvent?{add:function(b,d,e,f){f=f||b;var g=function(){var b=a.event;b.target=b.target||b.srcElement,b.preventDefault=function(){b.returnValue=!1},e.call(f,b)};b.attachEvent("on"+d,g),c.push([b,d,e,g])},remove:function(a,b,d){var e,f,g,h=c.length;for(g=0;h>g;g++)if(f=c[g],f[0]===a&&f[1]===b&&f[2]===d&&(e=f[3]))return a.detachEvent("on"+b,e),c=c.slice(g),!0}}:void 0:{add:function(){},remove:function(){}}}("undefined"==typeof window?null:window,"undefined"==typeof document?null:document)},{}],17:[function(a,b){"use strict";var c=b.exports={parse:function(a){var b,d,e,f,g=a.elements,h={};for(e=0,f=g.length;f>e;e++)b=g[e],(d=c.getInputValue(b))&&(h[b.name]=d);return h},getInputValue:function(a){var b=a.tagName.toLowerCase();return"select"===b?a.options[a.selectedIndex].value:"textarea"===b?a.innerText:"radio"===a.type?a.checked?a.value:null:"checkbox"===a.type?a.checked?a.value:null:a.value}}},{}],18:[function(a,b){"use strict";b.exports=function c(a,b){var d;for(var e in b)d=b[e],d&&d.constructor===Object&&a[e]?c(a[e]||{},d):a[e]=d;return a}},{}],19:[function(a,b){"use strict";function c(){this._eventCache={}}c.prototype.on=function(a,b,c){var d=this._eventCache[a];d||(d=this._eventCache[a]=[]),d.push([b,c])},c.prototype.off=function(a,b){var c,d,e=this._eventCache[a];if(e)for(c=0,d=e.length;d>c;c++)e[c]===b&&(e=e.splice(c,1))},c.prototype.fire=function(a){var b,c,d,e,f=this._eventCache[a];if(f)for(b=0,c=f.length;c>b;b++)d=f[b][0],e=f[b][1]||this,"function"==typeof d&&d.apply(e,Array.prototype.slice.call(arguments,1))},b.exports=c},{}],20:[function(a,b){"use strict";var c=b.exports=function(a,b){this._name=a,this._duration=b||30},d=c.prototype;d.load=function(){if("object"==typeof window&&window.localStorage){var a,b,c=window.localStorage.getItem(this._name);return c&&(c=JSON.parse(decodeURIComponent(c))),c&&c.expires&&(a=new Date,b=new Date(c.expires),a>b)?void this.destroy():c&&c.value}},d.save=function(a){if("object"==typeof window&&window.localStorage){var b,c=new Date;c.setTime(c.getTime()+24*this._duration*60*60*1e3),b={value:a,expires:c.toGMTString()},window.localStorage.setItem(this._name,encodeURIComponent(JSON.stringify(b)))}},d.destroy=function(){"object"==typeof window&&window.localStorage&&window.localStorage.removeItem(this._name)}},{}],21:[function(a,b){"use strict";var c=a("ejs");b.exports=function(a,b){return c.render(a,b)},String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")})},{ejs:6}],22:[function(a,b){"use strict";function c(a){var b;this.el=b=document.createElement("div"),this.model=a,this.isShowing=!1,b.id=d.name,d.parent.appendChild(b),h.inject(document.getElementsByTagName("head")[0],d.styles),e.add(document,"ontouchstart"in window?"touchstart":"click",i.click,this),e.add(document,"keyup",i.keyup,this),e.add(document,"readystatechange",i.readystatechange,this),e.add(window,"pageshow",i.pageshow,this)}var d=a("./config"),e=a("./util/events"),f=a("./util/template"),g=a("./util/forms"),h=a("./util/css"),i=a("./viewevents"),j=a("./constants");c.prototype.redraw=function(){e.remove(this.el.querySelector("form"),"submit",this.model.cart.checkout,this.model.cart),this.el.innerHTML=f(d.template,this.model),e.add(this.el.querySelector("form"),"submit",this.model.cart.checkout,this.model.cart)},c.prototype.show=function(){this.isShowing||(h.add(document.body,j.SHOWING_CLASS),this.isShowing=!0)},c.prototype.hide=function(){this.isShowing&&(h.remove(document.body,j.SHOWING_CLASS),this.isShowing=!1)},c.prototype.toggle=function(){this[this.isShowing?"hide":"show"]()},c.prototype.bind=function(a){var b=this;return j.COMMANDS[a.cmd.value]?a.hasMinicart?!1:(a.hasMinicart=!0,a.display?e.add(a,"submit",function(a){a.preventDefault(),b.show()}):e.add(a,"submit",function(c){c.preventDefault(c),b.model.cart.add(g.parse(a))}),!0):!1},c.prototype.addItem=function(a){this.redraw(),this.show();var b=this.el.querySelectorAll("."+j.ITEM_CLASS);h.add(b[a],j.ITEM_CHANGED_CLASS)},c.prototype.changeItem=function(a){this.redraw(),this.show();var b=this.el.querySelectorAll("."+j.ITEM_CLASS);h.add(b[a],j.ITEM_CHANGED_CLASS)},c.prototype.removeItem=function(){this.redraw()},b.exports=c},{"./config":10,"./constants":11,"./util/css":14,"./util/events":16,"./util/forms":17,"./util/template":21,"./viewevents":23}],23:[function(a,b){"use strict";var c,d=a("./constants"),e=a("./util/events");b.exports=c={click:function(a){var b=a.target,c=b.className;if(this.isShowing)if(c===d.CLOSER_CLASS)this.hide();else if(c===d.REMOVE_CLASS)this.model.cart.remove(b.getAttribute(d.DATA_IDX));else if(c===d.QUANTITY_CLASS)b[b.setSelectionRange?"setSelectionRange":"select"](0,999);else if(!/input|button|select|option/i.test(b.tagName)){for(;1===b.nodeType;){if(b===this.el)return;b=b.parentNode}this.hide()}},keyup:function(a){var b,c=this,e=a.target;e.className===d.QUANTITY_CLASS&&(b=setTimeout(function(){var a=parseInt(e.getAttribute(d.DATA_IDX),10),b=c.model.cart,f=b.items(a),g=parseInt(e.value,10);f&&(g>0?f.set("quantity",g):0===g&&b.remove(a))},d.KEYUP_TIMEOUT))},readystatechange:function(){if(/interactive|complete/.test(document.readyState)){var a,b,f,g;for(a=document.getElementsByTagName("form"),f=0,g=a.length;g>f;f++)b=a[f],b.cmd&&d.COMMANDS[b.cmd.value]&&this.bind(b);this.redraw(),e.remove(document,"readystatechange",c.readystatechange)}},pageshow:function(a){a.persisted&&(this.redraw(),this.hide())}}},{"./constants":11,"./util/events":16}]},{},[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
/*
 *  jQuery OwlCarousel v1.31
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

if ( typeof Object.create !== "function" ) {
    Object.create = function( obj ) {
        function F() {};
        F.prototype = obj;
        return new F();
    };
}
(function( $, window, document, undefined ) {

    var Carousel = {
        init :function(options, el){
            var base = this;

            base.$elem = $(el);

            // options passed via js override options passed via data attributes
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function(){
            var base = this;

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this,[base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                var url = base.options.jsonPath;

                function getData(data) {
                    if (typeof base.options.jsonSuccess === "function") {
                        base.options.jsonSuccess.apply(this,[data]);
                    } else {
                        var content = "";
                        for(var i in data["owl"]){
                            content += data["owl"][i]["item"];
                        }
                        base.$elem.html(content);
                    }
                    base.logIn();
                }
                $.getJSON(url,getData);
            } else {
                base.logIn();
            }
        },

        logIn : function(action){
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"))
                      .data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible;
            base.setVars();
        },

        setVars : function(){
            var base = this;
            if(base.$elem.children().length === 0){return false}
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function(){
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if(base.options.transitionStyle !== false){
                base.transitionTypes(base.options.transitionStyle);
            }
            if(base.options.autoPlay === true){
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display","block")

            if(!base.$elem.is(":visible")){
                base.watchVisibility();
            } else {
                base.$elem.css("opacity",1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this,[base.$elem]);
            }
        },

        eachMoveUpdate : function(){
            var base = this;

            if(base.options.lazyLoad === true){
                base.lazyLoad();
            }
            if(base.options.autoHeight === true){
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this,[base.$elem]);
            }
        },

        updateVars : function(){
            var base = this;
            if(typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this,[base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if(typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this,[base.$elem]);
            }
        },

        reload : function(elements){
            var base = this;
            setTimeout(function(){
                base.updateVars();
            },0)
        },

        watchVisibility : function(){
            var base = this;

            if(base.$elem.is(":visible") === false){
                base.$elem.css({opacity: 0});
                clearInterval(base.autoPlayInterval);
                clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = setInterval(function(){
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1},200);
                    clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function(){
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display","block");
        },

        baseClass : function(){
            var base = this;
            var hasBaseClass = base.$elem.hasClass(base.options.baseClass);
            var hasThemeClass = base.$elem.hasClass(base.options.theme);

            if(!hasBaseClass){
                base.$elem.addClass(base.options.baseClass);
            }

            if(!hasThemeClass){
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function(){
            var base = this;

            if(base.options.responsive === false){
                return false;
            }
            if(base.options.singleItem === true){
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            var width = $(base.options.responsiveBaseWidth).width();

            if(width > (base.options.itemsDesktop[0] || base.orignalItems) ){
                base.options.items = base.orignalItems;
            }

            if(typeof(base.options.itemsCustom) !== 'undefined' && base.options.itemsCustom !== false){
                //Reorder array by screen size
                base.options.itemsCustom.sort(function(a,b){return a[0]-b[0];});
                for(var i in base.options.itemsCustom){
                    if(typeof(base.options.itemsCustom[i]) !== 'undefined' && base.options.itemsCustom[i][0] <= width){
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }
            } else {

                if(width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false){
                    base.options.items = base.options.itemsDesktop[1];
                }

                if(width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false){
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if(width <= base.options.itemsTablet[0]  && base.options.itemsTablet !== false){
                    base.options.items = base.options.itemsTablet[1];
                }

                if(width <= base.options.itemsTabletSmall[0]  && base.options.itemsTabletSmall !== false){
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if(width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false){
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if(base.options.items > base.itemsAmount && base.options.itemsScaleUp === true){
                base.options.items = base.itemsAmount;
            }
        },

        response : function(){
            var base = this,
                smallDelay;
            if(base.options.responsive !== true){
                return false
            }
            var lastWindowWidth = $(window).width();

            base.resizer = function(){
                if($(window).width() !== lastWindowWidth){
                    if(base.options.autoPlay !== false){
                        clearInterval(base.autoPlayInterval);
                    }
                    clearTimeout(smallDelay);
                    smallDelay = setTimeout(function(){
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    },base.options.responsiveRefreshRate);
                }
            }
            $(window).resize(base.resizer)
        },

        updatePosition : function(){
            var base = this;
            base.jumpTo(base.currentItem);
            if(base.options.autoPlay !== false){
                base.checkAp();
            }
        },

        appendItemsSizes : function(){
            var base = this;

            var roundPages = 0;
            var lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function(index){
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item",Number(index));

                if(index % base.options.items === 0 || index === lastItem){
                    if(!(index > lastItem)){
                        roundPages +=1;
                    }
                }
                $this.data("owl-roundPages",roundPages)
            });
        },

        appendWrapperSizes : function(){
            var base = this;
            var width = 0;

            var width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width*2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function(){
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function(){
            var base = this;
            base.itemWidth = Math.round(base.$elem.width()/base.options.items)
        },

        max : function(){
            var base = this;
            var maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if(base.options.items > base.itemsAmount){
                base.maximumItem = 0;
                maximum = 0
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function(){
            return 0;
        },

        loops : function(){
            var base = this;

            base.positionsInArray = [0];
            base.pagesInArray = [];
            var prev = 0;
            var elWidth = 0;

            for(var i = 0; i<base.itemsAmount; i++){
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if(base.options.scrollPerPage === true){
                    var item = $(base.$owlItems[i]);
                    var roundPageNum = item.data("owl-roundPages");
                    if(roundPageNum !== prev){
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function(){
            var base = this;
            if(base.options.navigation === true || base.options.pagination === true){
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if(base.options.pagination === true){
                base.buildPagination();
            }
            if(base.options.navigation === true){
                base.buildButtons();
            }
        },

        buildButtons : function(){
            var base = this;
            var buttonsWrapper = $("<div class=\"owl-buttons\"/>")
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>",{
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
                });

            base.buttonNext = $("<div/>",{
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
                });

            buttonsWrapper
            .append(base.buttonPrev)
            .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function(event){
                event.preventDefault();
            })

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function(event){
                event.preventDefault();
                if($(this).hasClass("owl-next")){
                    base.next();
                } else{
                    base.prev();
                }
            })
        },

        buildPagination : function(){
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function(event){
                event.preventDefault();
                if(Number($(this).data("owl-page")) !== base.currentItem){
                    base.goTo( Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function(){
            var base = this;
            if(base.options.pagination === false){
                return false;
            }

            base.paginationWrapper.html("");

            var counter = 0;
            var lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for(var i = 0; i<base.itemsAmount; i++){
                if(i % base.options.items === 0){
                    counter +=1;
                    if(lastPage === i){
                        var lastItem = base.itemsAmount - base.options.items;
                    }
                    var paginationButton = $("<div/>",{
                        "class" : "owl-page"
                        });
                    var paginationButtonInner = $("<span></span>",{
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page",lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages",counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function(){
            var base = this;
            if(base.options.pagination === false){
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function(i,v){
                if($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages") ){
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function(){
            var base = this;

            if(base.options.navigation === false){
                return false;
            }
            if(base.options.rewindNav === false){
                if(base.currentItem === 0 && base.maximumItem === 0){
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if(base.currentItem === 0 && base.maximumItem !== 0){
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem){
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if(base.currentItem !== 0 && base.currentItem !== base.maximumItem){
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function(){
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if(base.owlControls){
                if(base.options.items >= base.itemsAmount){
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function(){
            var base = this;
            if(base.owlControls){
                base.owlControls.remove();
            }
        },

        next : function(speed){
            var base = this;

            if(base.isTransition){
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if(base.currentItem > base.maximumItem + (base.options.scrollPerPage == true ? (base.options.items - 1) : 0)){
                if(base.options.rewindNav === true){
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem,speed);
        },

        prev : function(speed){
            var base = this;

            if(base.isTransition){
                return false;
            }

            if(base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items){
                base.currentItem = 0
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if(base.currentItem < 0){
                if(base.options.rewindNav === true){
                    base.currentItem = base.maximumItem;
                    speed = "rewind"
                } else {
                    base.currentItem =0;
                    return false;
                }
            }
            base.goTo(base.currentItem,speed);
        },

        goTo : function(position,speed,drag){
            var base = this;

            if(base.isTransition){
                return false;
            }
            if(typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this,[base.$elem]);
            }
            if(position >= base.maximumItem){
                position = base.maximumItem;
            }
            else if( position <= 0 ){
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if( base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true){
                base.swapSpeed(0)
                if(base.browser.support3d === true){
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position],1);
                }
                base.afterGo();
                base.singleItemTransition();
                
                return false;
            }
            var goToPixel = base.positionsInArray[position];

            if(base.browser.support3d === true){
                base.isCss3Finish = false;

                if(speed === true){
                    base.swapSpeed("paginationSpeed");
                    setTimeout(function() {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if(speed === "rewind" ){
                    base.swapSpeed(base.options.rewindSpeed);
                    setTimeout(function() {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    setTimeout(function() {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if(speed === true){
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if(speed === "rewind" ){
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function(position){
            var base = this;
            if(typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this,[base.$elem]);
            }
            if(position >= base.maximumItem || position === -1){
                position = base.maximumItem;
            }
            else if( position <= 0 ){
                position = 0;
            }
            base.swapSpeed(0)
            if(base.browser.support3d === true){
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position],1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function(){
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length -2];
            base.prevArr.shift(0)

            if(base.prevItem !== base.currentItem){
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if(base.options.autoPlay !== false){
                    base.checkAp();
                }
            }
            if(typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this,[base.$elem]);
            }
        },

        stop : function(){
            var base = this;
            base.apStatus = "stop";
            clearInterval(base.autoPlayInterval);
        },

        checkAp : function(){
            var base = this;
            if(base.apStatus !== "stop"){
                base.play();
            }
        },

        play : function(){
            var base = this;
            base.apStatus = "play";
            if(base.options.autoPlay === false){
                return false;
            }
            clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = setInterval(function(){
                base.next(true);
            },base.options.autoPlay);
        },

        swapSpeed : function(action){
            var base = this;
            if(action === "slideSpeed"){
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if(action === "paginationSpeed" ){
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if(typeof action !== "string"){
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function(speed){
            var base = this;
            return {
                "-webkit-transition": "all "+ speed +"ms ease",
                "-moz-transition": "all "+ speed +"ms ease",
                "-o-transition": "all "+ speed +"ms ease",
                "transition": "all "+ speed +"ms ease"
            };
        },

        removeTransition : function(){
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function(pixels){
            return {
                "-webkit-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "-moz-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "-o-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "-ms-transform": "translate3d("+pixels+"px, 0px, 0px)",
                "transform": "translate3d("+pixels+"px, 0px,0px)"
            };
        },

        transition3d : function(value){
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function(value){
            var base = this;
            base.$owlWrapper.css({"left" : value})
        },

        css2slide : function(value,speed){
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true,true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed ,
                complete : function(){
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function(){
            var base = this;

            //Check 3d support
            var translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div");

            tempElem.style.cssText= "  -moz-transform:"    + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            var regex = /translate3d\(0px, 0px, 0px\)/g,
                asSupport = tempElem.style.cssText.match(regex),
                support3d = (asSupport !== null && asSupport.length === 1);

            var isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            }
        },

        moveEvents : function(){
            var base = this;
            if(base.options.mouseDrag !== false || base.options.touchDrag !== false){
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function(){
            var base = this;
            var types = ["s","e","x"];

            base.ev_types = {};

            if(base.options.mouseDrag === true && base.options.touchDrag === true){
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if(base.options.mouseDrag === false && base.options.touchDrag === true){
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if(base.options.mouseDrag === true && base.options.touchDrag === false){
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types["start"] = types[0];
            base.ev_types["move"] = types[1];
            base.ev_types["end"] = types[2];
        },

        disabledEvents :  function(){
            var base = this;
            base.$elem.on("dragstart.owl", function(event) { event.preventDefault();});
            base.$elem.on("mousedown.disableTextSelect", function(e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function(){
            var base = this;

            var locals = {
                offsetX : 0,
                offsetY : 0,
                baseElWidth : 0,
                relativePos : 0,
                position: null,
                minSwipe : null,
                maxSwipe: null,
                sliding : null,
                dargging: null,
                targetElement : null
            }

            base.isCssFinish = true;

            function getTouches(event){
                if(event.touches){
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    }
                } else {
                    if(event.pageX !== undefined){
                        return {
                            x : event.pageX,
                            y : event.pageY
                        }
                    } else {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        }
                    }
                }
            }

            function swapEvents(type){
                if(type === "on"){
                    $(document).on(base.ev_types["move"], dragMove);
                    $(document).on(base.ev_types["end"], dragEnd);
                } else if(type === "off"){
                    $(document).off(base.ev_types["move"]);
                    $(document).off(base.ev_types["end"]);
                }
            }

            function dragStart(event) {
                var event = event.originalEvent || event || window.event;

                if (event.which === 3) {
                    return false;
                }
                if(base.itemsAmount <= base.options.items){
                    return;
                }
                if(base.isCssFinish === false && !base.options.dragBeforeAnimFinish ){
                    return false;
                }
                if(base.isCss3Finish === false && !base.options.dragBeforeAnimFinish ){
                    return false;
                }

                if(base.options.autoPlay !== false){
                    clearInterval(base.autoPlayInterval);
                }

                if(base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")){
                    base.$owlWrapper.addClass("grabbing")
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                var position = $(this).position();
                locals.relativePos = position.left;
                
                locals.offsetX = getTouches(event).x - position.left;
                locals.offsetY = getTouches(event).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = event.target || event.srcElement;
            }

            function dragMove(event){
                var event = event.originalEvent || event || window.event;

                base.newPosX = getTouches(event).x- locals.offsetX;
                base.newPosY = getTouches(event).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;  

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base,[base.$elem]);
                }

                if(base.newRelativeX > 8 || base.newRelativeX < -8 && base.browser.isTouch === true){
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    locals.sliding = true;
                }

                if((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false){
                    $(document).off("touchmove.owl");
                }

                var minSwipe = function(){
                    return  base.newRelativeX / 5;
                }
                var maxSwipe = function(){
                    return  base.maximumPixels + base.newRelativeX / 5;
                }

                base.newPosX = Math.max(Math.min( base.newPosX, minSwipe() ), maxSwipe() );
                if(base.browser.support3d === true){
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event){
                var event = event.originalEvent || event || window.event;
                event.target = event.target || event.srcElement;

                locals.dragging = false;

                if(base.browser.isTouch !== true){
                    base.$owlWrapper.removeClass("grabbing");
                }

                if(base.newRelativeX<0){
                    base.dragDirection = base.owl.dragDirection = "left"
                } else {
                    base.dragDirection = base.owl.dragDirection = "right"
                }

                if(base.newRelativeX !== 0){
                    var newPosition = base.getNewPosition();
                    base.goTo(newPosition,false,"drag");
                    if(locals.targetElement === event.target && base.browser.isTouch !== true){
                        $(event.target).on("click.disable", function(ev){
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(event.target).off("click.disable");
                        });
                        var handlers = $._data(event.target, "events")["click"];
                        var owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types["start"], ".owl-wrapper", dragStart); 
        },

        getNewPosition : function(){
            var base = this,
                newPosition;
            
            newPosition = base.closestItem();

            if(newPosition>base.maximumItem){
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if( base.newPosX >=0 ){
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function(){
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function(i,v){
                if( goal - (base.itemWidth/20) > array[i+1] && goal - (base.itemWidth/20)< v && base.moveDirection() === "left") {
                    closest = v;
                    if(base.options.scrollPerPage === true){
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } 
                else if (goal + (base.itemWidth/20) < v && goal + (base.itemWidth/20) > (array[i+1] || array[i]-base.itemWidth) && base.moveDirection() === "right"){
                    if(base.options.scrollPerPage === true){
                        closest = array[i+1] || array[array.length-1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i+1];
                        base.currentItem = i+1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function(){
            var base = this,
                direction;
            if(base.newRelativeX < 0 ){
                direction = "right"
                base.playDirection = "next"
            } else {
                direction = "left"
                base.playDirection = "prev"
            }
            return direction
        },

        customEvents : function(){
            var base = this;
            base.$elem.on("owl.next",function(){
                base.next();
            });
            base.$elem.on("owl.prev",function(){
                base.prev();
            });
            base.$elem.on("owl.play",function(event,speed){
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop",function(){
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo",function(event,item){
                base.goTo(item)
            });
            base.$elem.on("owl.jumpTo",function(event,item){
                base.jumpTo(item)
            });
        },
        
        stopOnHover : function(){
            var base = this;
            if(base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false){
                base.$elem.on("mouseover", function(){
                    base.stop();
                });
                base.$elem.on("mouseout", function(){
                    if(base.hoverStatus !== "stop"){
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function(){
            var base = this;

            if(base.options.lazyLoad === false){
                return false;
            }
            for(var i=0; i<base.itemsAmount; i++){
                var $item = $(base.$owlItems[i]);

                if($item.data("owl-loaded") === "loaded"){
                    continue;
                }

                var itemNumber = $item.data("owl-item"),
                    $lazyImg = $item.find(".lazyOwl"),
                    follow;

                if( typeof $lazyImg.data("src") !== "string"){
                    $item.data("owl-loaded","loaded");
                    continue;
                }               
                if($item.data("owl-loaded") === undefined){
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded","checked");
                }
                if(base.options.lazyFollow === true){
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if(follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length){
                    base.lazyPreload($item,$lazyImg);
                }
            }
        },

        lazyPreload : function($item,$lazyImg){
            var base = this,
                iterations = 0;
                if ($lazyImg.prop("tagName") === "DIV") {
                    $lazyImg.css("background-image", "url(" + $lazyImg.data("src")+ ")" );
                    var isBackgroundImg=true;
                } else {
                    $lazyImg[0].src = $lazyImg.data("src");
                }
                checkLazyImage();

            function checkLazyImage(){
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if(iterations <= 100){//if image loads in less than 10 seconds 
                    setTimeout(checkLazyImage,100);
                } else {
                    showImage();
                }
            }
            function showImage(){
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                base.options.lazyEffect === "fade" ? $lazyImg.fadeIn(400) : $lazyImg.show();
                if(typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this,[base.$elem]);
                }
            }
        },

        autoHeight : function(){
            var base = this;
            var $currentimg = $(base.$owlItems[base.currentItem]).find("img");

            if($currentimg.get(0) !== undefined ){
                var iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
            function checkImage(){
                iterations += 1;
                if ( base.completeImg($currentimg.get(0)) ) {
                    addHeight();
                } else if(iterations <= 100){ //if image loads in less than 10 seconds 
                    setTimeout(checkImage,100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            function addHeight(){
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height",$currentItem+"px");
                if(!base.wrapperOuter.hasClass("autoHeight")){
                    setTimeout(function(){
                        base.wrapperOuter.addClass("autoHeight");
                    },0);
                }
            }
        },

        completeImg : function(img) {
            if (!img.complete) {
                return false;
            }
            if (typeof img.naturalWidth !== "undefined" && img.naturalWidth == 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function(){
            var base = this;

            if(base.options.addClassActive === true){
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for(var i=base.currentItem; i<base.currentItem + base.options.items; i++){
                base.visibleItems.push(i);

                if(base.options.addClassActive === true){
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function(className){
            var base = this;
            //Currently available: "fade","backSlide","goDown","fadeUp"
            base.outClass = "owl-"+className+"-out";
            base.inClass = "owl-"+className+"-in";
        },

        singleItemTransition : function(){
            var base = this;
            base.isTransition = true;

            var outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem])+base.itemWidth/2;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin+"px",
                    "-moz-perspective-origin" : origin+"px",
                    "perspective-origin" : origin+"px"
                });
            function transStyles(prevPos,zindex){
                return {
                    "position" : "relative",
                    "left" : prevPos+"px"
                };
            }

            var animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            $prevItem
            .css(transStyles(prevPos,10))
            .addClass(outClass)
            .on(animEnd, function() {
                base.endPrev = true;
                $prevItem.off(animEnd);
                base.clearTransStyle($prevItem,outClass);
            });

            $currentItem
            .addClass(inClass)
            .on(animEnd, function() {
                base.endCurrent = true;
                $currentItem.off(animEnd);
                base.clearTransStyle($currentItem,inClass);
            });
        },

        clearTransStyle : function(item,classToRemove){
            var base = this;
            item.css({
                    "position" : "",
                    "left" : ""
                })
                .removeClass(classToRemove);
            if(base.endPrev && base.endCurrent){
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function(){
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            }
        },

        clearEvents : function(){
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function(){
            var base = this;
            if(base.$elem.children().length !== 0){
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if(base.owlControls){
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function(){
            var base = this;
            base.stop();
            clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function(newOptions){
            var base = this;
            var options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options,base.$elem);
        },

        addItem : function(htmlString,targetPosition){
            var base = this,
                position;

            if(!htmlString){return false}

            if(base.$elem.children().length === 0){
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if(targetPosition === undefined || targetPosition === -1){
                position = -1;
            } else {
                position = targetPosition;
            }
            if(position >= base.$userItems.length || position === -1){
                base.$userItems.eq(-1).after(htmlString)
            } else {
                base.$userItems.eq(position).before(htmlString)
            }

            base.setVars();
        },

        removeItem : function(targetPosition){
            var base = this,
                position;

            if(base.$elem.children().length === 0){return false}
            
            if(targetPosition === undefined || targetPosition === -1){
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function( options ){
        return this.each(function() {
            if($(this).data("owl-init") === true){
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create( Carousel );
            carousel.init( options, this );
            $.data( this, "owlCarousel", carousel );
        });
    };

    $.fn.owlCarousel.options = {

        items : 1,
        itemsCustom : false,
        itemsDesktop : [1199,1],
        itemsDesktopSmall : [979,1],
        itemsTablet : [768,1],
        itemsTabletSmall : false,
        itemsMobile : [479,1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev","next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,
        

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
        
    };
})( jQuery, window, document );

/*! http://responsiveslides.com v1.54 by @viljamis */
(function(c,I,B){c.fn.responsiveSlides=function(l){var a=c.extend({auto:!0,speed:500,timeout:4E3,pager:!1,nav:!1,random:!1,pause:!1,pauseControls:!0,prevText:"Previous",nextText:"Next",maxwidth:"",navContainer:"",manualControls:"",namespace:"rslides",before:c.noop,after:c.noop},l);return this.each(function(){B++;var f=c(this),s,r,t,m,p,q,n=0,e=f.children(),C=e.size(),h=parseFloat(a.speed),D=parseFloat(a.timeout),u=parseFloat(a.maxwidth),g=a.namespace,d=g+B,E=g+"_nav "+d+"_nav",v=g+"_here",j=d+"_on",
w=d+"_s",k=c("<ul class='"+g+"_tabs "+d+"_tabs' />"),x={"float":"left",position:"relative",opacity:1,zIndex:2},y={"float":"none",position:"absolute",opacity:0,zIndex:1},F=function(){var b=(document.body||document.documentElement).style,a="transition";if("string"===typeof b[a])return!0;s=["Moz","Webkit","Khtml","O","ms"];var a=a.charAt(0).toUpperCase()+a.substr(1),c;for(c=0;c<s.length;c++)if("string"===typeof b[s[c]+a])return!0;return!1}(),z=function(b){a.before(b);F?(e.removeClass(j).css(y).eq(b).addClass(j).css(x),
n=b,setTimeout(function(){a.after(b)},h)):e.stop().fadeOut(h,function(){c(this).removeClass(j).css(y).css("opacity",1)}).eq(b).fadeIn(h,function(){c(this).addClass(j).css(x);a.after(b);n=b})};a.random&&(e.sort(function(){return Math.round(Math.random())-0.5}),f.empty().append(e));e.each(function(a){this.id=w+a});f.addClass(g+" "+d);l&&l.maxwidth&&f.css("max-width",u);e.hide().css(y).eq(0).addClass(j).css(x).show();F&&e.show().css({"-webkit-transition":"opacity "+h+"ms ease-in-out","-moz-transition":"opacity "+
h+"ms ease-in-out","-o-transition":"opacity "+h+"ms ease-in-out",transition:"opacity "+h+"ms ease-in-out"});if(1<e.size()){if(D<h+100)return;if(a.pager&&!a.manualControls){var A=[];e.each(function(a){a+=1;A+="<li><a href='#' class='"+w+a+"'>"+a+"</a></li>"});k.append(A);l.navContainer?c(a.navContainer).append(k):f.after(k)}a.manualControls&&(k=c(a.manualControls),k.addClass(g+"_tabs "+d+"_tabs"));(a.pager||a.manualControls)&&k.find("li").each(function(a){c(this).addClass(w+(a+1))});if(a.pager||a.manualControls)q=
k.find("a"),r=function(a){q.closest("li").removeClass(v).eq(a).addClass(v)};a.auto&&(t=function(){p=setInterval(function(){e.stop(!0,!0);var b=n+1<C?n+1:0;(a.pager||a.manualControls)&&r(b);z(b)},D)},t());m=function(){a.auto&&(clearInterval(p),t())};a.pause&&f.hover(function(){clearInterval(p)},function(){m()});if(a.pager||a.manualControls)q.bind("click",function(b){b.preventDefault();a.pauseControls||m();b=q.index(this);n===b||c("."+j).queue("fx").length||(r(b),z(b))}).eq(0).closest("li").addClass(v),
a.pauseControls&&q.hover(function(){clearInterval(p)},function(){m()});if(a.nav){g="<a href='#' class='"+E+" prev'>"+a.prevText+"</a><a href='#' class='"+E+" next'>"+a.nextText+"</a>";l.navContainer?c(a.navContainer).append(g):f.after(g);var d=c("."+d+"_nav"),G=d.filter(".prev");d.bind("click",function(b){b.preventDefault();b=c("."+j);if(!b.queue("fx").length){var d=e.index(b);b=d-1;d=d+1<C?n+1:0;z(c(this)[0]===G[0]?b:d);if(a.pager||a.manualControls)r(c(this)[0]===G[0]?b:d);a.pauseControls||m()}});
a.pauseControls&&d.hover(function(){clearInterval(p)},function(){m()})}}if("undefined"===typeof document.body.style.maxWidth&&l.maxwidth){var H=function(){f.css("width","100%");f.width()>u&&f.css("width",u)};H();c(I).bind("resize",function(){H()})}})}})(jQuery,this,0);

  
