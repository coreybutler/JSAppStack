Ext.onReady(function() {
    var config = {
        serverUrl: 'http://localhost:1987', 
        slideSelector: '.slide',
        titleSlideId: 'title-slide',
        titleSelector: 'h3',
        selfGuidedText: '[ Now in self-guided mode. <a href="#">Rejoin</a> the presentation. ]',
        syncText: 'Synced to the server. Sit back and enjoy!',
        wrapSlides: false  // wrap to the beginning after the last slide
    };
    
    var slideshow = new Ext.ux.Carousel('slides', {
        itemSelector: '.slide',
        //transitionType: 'fade',
        transitionDuration: .3,
        transitionEasing: 'easeIn',
        pagingCaption: true,
        wrap: config.wrapSlides
    });
    
    var socket = io.connect(config.serverUrl),
        selfGuided = false;
        
    var unsync = function() {
        var syncMsg = Ext.get('sync-msg');
        
        if (syncMsg) {
            syncMsg.update(config.selfGuidedText)
        }
        else {
            syncMsg = Ext.DomHelper.insertAfter(slideshow.els.caption, {
                tag: 'span',
                id: 'sync-msg',
                cls: 'ux-carousel-sync-msg',
                html: config.selfGuidedText,
                style: 'display:none'
            }, true);
            
            syncMsg.on('click', function(e) {
                e.preventDefault();
                socket.emit('sync');
            }, this, { delegate: 'a' });
        }
        
        if (!syncMsg.isVisible()) {
            syncMsg.slideIn('t');
        }
        
        selfGuided = true;
    }
    
    var resync = function() {
        var syncMsg = Ext.get('sync-msg');
        if (syncMsg && syncMsg.isVisible()) {
            syncMsg.update(config.syncText).highlight('ffff9c', {
                endColor: 'd1ccc7'
            }).pause(1).ghost('t');
        }
    }
    
    slideshow.on({
        'next': unsync,
        'prev': unsync
    });
    
    Ext.get(document).on('keydown', function(e) {
        switch (e.keyCode) {
            case 39: { // right
                slideshow.next();
                break;
            }
            case 37: { // left
                slideshow.prev();
                break;
            }
        }
    });
    
    socket.on('nav', function(o) {
        if (!selfGuided) {
            slideshow.setSlide(o.page);
        }
    });
    
    socket.on('sync', function(o) {
        selfGuided = false;
        slideshow.setSlide(o.page);
        resync();
    });
    
    socket.on('config', function() {
        var slides = Ext.select(config.slideSelector),
            count = slides.getCount(),
            title = Ext.get(config.titleSlideId).child(config.titleSelector).dom.innerHTML;
        
        socket.emit('config', {
            title: title,
            slideCount: count,
            wrap: config.wrapSlides
        });
    });
});