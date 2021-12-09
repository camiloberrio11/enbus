/*
Template: Sofbox - Responsive Bootstrap 4 Admin Dashboard Template
Author: iqonicthemes.in
Design and Developed by: iqonicthemes.in
NOTE: This file contains the styling for responsive Template.
*/

/*----------------------------------------------
Index Of Script
------------------------------------------------

:: Tooltip
:: Sidebar Widget
:: Magnific Popup
:: Ripple Effect
:: Accordion
:: Ticket Booking
:: Owl Carousel
:: Search input
:: Scrollbar
:: Counter
:: Progress Bar
:: Page Loader
:: Page Menu
:: Wow Animation
:: Mail Inbox

------------------------------------------------
Index Of Script
----------------------------------------------*/

(function (jQuery) {
    "use strict";
    jQuery(document).ready(function () {

        //#region Tooltip
        jQuery('[data-toggle="popover"]').popover();
        jQuery('[data-toggle="tooltip"]').tooltip();
        //#endregion

        //#region Sidebar Widget
        function checkClass(ele, type, className) {
            switch (type) {
                case 'addClass':
                    if (!ele.hasClass(className)) {
                        ele.addClass(className);
                    }
                    break;
                case 'removeClass':
                    if (ele.hasClass(className)) {
                        ele.removeClass(className);
                    }
                    break;
                case 'toggleClass':
                    ele.toggleClass(className);
                    break;
            }
        }
        jQuery('.iq-sidebar-menu .active').each(function (ele, index) {
            jQuery(this).addClass('active');
            jQuery(this).find('.iq-submenu').addClass('show');
        })
        //#endregion

        //#region Magnific Popup

        // jQuery('.popup-gallery').magnificPopup({
        //     delegate: 'a.popup-img',
        //     type: 'image',
        //     tLoading: 'Loading image #%curr%...',
        //     mainClass: 'mfp-img-mobile',
        //     gallery: {
        //         enabled: true,
        //         navigateByImgClick: true,
        //         preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        //     },
        //     image: {
        //         tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        //         titleSrc: function(item) {
        //             return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
        //         }
        //     }
        // });
        // jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        //     disableOn: 700,
        //     type: 'iframe',
        //     mainClass: 'mfp-fade',
        //     removalDelay: 160,
        //     preloader: false,
        //     fixedContentPos: false
        // });

        //#endregion

        //#region Ripple Effect

        jQuery(document).on('click', ".iq-waves-effect", function (e) {
            // Remove any old one
            jQuery('.ripple').remove();
            // Setup
            let posX = jQuery(this).offset().left,
                posY = jQuery(this).offset().top,
                buttonWidth = jQuery(this).width(),
                buttonHeight = jQuery(this).height();

            // Add the element
            jQuery(this).prepend("<span class='ripple'></span>");

            // Make it round!
            if (buttonWidth >= buttonHeight) {
                buttonHeight = buttonWidth;
            } else {
                buttonWidth = buttonHeight;
            }

            // Get the center of the element
            let x = e.pageX - posX - buttonWidth / 2;
            let y = e.pageY - posY - buttonHeight / 2;

            // Add the ripples CSS and start the animation
            jQuery(".ripple").css({
                width: buttonWidth,
                height: buttonHeight,
                top: y + 'px',
                left: x + 'px'
            }).addClass("rippleEffect");
        });

        //#endregion

        //#region FullScreen

        jQuery(document).on('click', '.iq-full-screen', function () {
            let elem = jQuery(this);
            if (!document.fullscreenElement &&
                !document.mozFullScreenElement && // Mozilla
                !document.webkitFullscreenElement && // Webkit-Browser
                !document.msFullscreenElement) { // MS IE ab version 11

                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            elem.find('i').toggleClass('ri-fullscreen-line').toggleClass('ri-fullscreen-exit-line');
        });

        //#endregion

        jQuery('.iq-accordion .iq-accordion-block .accordion-details').hide();
        jQuery('.iq-accordion .iq-accordion-block:first').addClass('accordion-active').children().slideDown('slow');
        jQuery(document).on("click", '.iq-accordion .iq-accordion-block', function () {
            if (jQuery(this).children('div.accordion-details ').is(':hidden')) {
                jQuery('.iq-accordion .iq-accordion-block').removeClass('accordion-active').children('div.accordion-details ').slideUp('slow');
                jQuery(this).toggleClass('accordion-active').children('div.accordion-details ').slideDown('slow');
            }
        });
    });

    jQuery(window).on('load', function (e) {

        //#region Page Loader

        jQuery("#load").fadeOut();
        jQuery("#loading").delay().fadeOut("");

        //#endregion

        //#region Ticket Booking

        jQuery(document).on('click', '.iq-booking-screen .iq-booking-no .list-inline-item .iq-seat ', function (e) {
            e.preventDefault();
            let sheet = 0;
            if (!jQuery(this).hasClass('bg-secondary')) {
                jQuery(this).toggleClass('active');
                sheet = jQuery('.iq-booking-screen').find('.iq-seat.active').length;
                jQuery('.iq-film-block').find('span').text(sheet);
            }
        });
        jQuery(document).on('click', '.ri-close-circle-line', function () {
            jQuery(this).parent().parent().parent().parent().parent().removeClass('film-side');
        });

        jQuery(document).on('click', '.iq-film-block', function () {
            if (parseInt(jQuery(this).find('span').text()) > 0) {
                jQuery('.iq-sidebar-right-menu').addClass('film-side');
            }
        });

        //#endregion

        //#region Owl Carousel

        // jQuery('.owl-carousel').each(function () {
        //     let jQuerycarousel = jQuery(this);
        //     jQuerycarousel.owlCarousel({
        //         items: jQuerycarousel.data("items"),
        //         loop: jQuerycarousel.data("loop"),
        //         margin: jQuerycarousel.data("margin"),
        //         nav: jQuerycarousel.data("nav"),
        //         dots: jQuerycarousel.data("dots"),
        //         autoplay: jQuerycarousel.data("autoplay"),
        //         autoplayTimeout: jQuerycarousel.data("autoplay-timeout"),
        //         navText: ["<i class='fa fa-angle-left fa-2x'></i>", "<i class='fa fa-angle-right fa-2x'></i>"],
        //         responsiveClass: true,
        //         responsive: {
        //             // breakpoint from 0 up
        //             0: {
        //                 items: jQuerycarousel.data("items-mobile-sm"),
        //                 nav: false,
        //                 dots: true
        //             },
        //             // breakpoint from 480 up
        //             480: {
        //                 items: jQuerycarousel.data("items-mobile"),
        //                 nav: false,
        //                 dots: true
        //             },
        //             // breakpoint from 786 up
        //             786: {
        //                 items: jQuerycarousel.data("items-tab")
        //             },
        //             // breakpoint from 1023 up
        //             1023: {
        //                 items: jQuerycarousel.data("items-laptop")
        //             },
        //             1199: {
        //                 items: jQuerycarousel.data("items")
        //             }
        //         }
        //     });
        // });

        //#endregion

        //#region Search input

        jQuery(document).on('click', function (e) {
            let myTargetElement = e.target;
            let selector, mainElement;
            if (jQuery(myTargetElement).hasClass('search-toggle') || jQuery(myTargetElement).parent().hasClass('search-toggle') || jQuery(myTargetElement).parent().parent().hasClass('search-toggle')) {
                if (jQuery(myTargetElement).hasClass('search-toggle')) {
                    selector = jQuery(myTargetElement).parent();
                    mainElement = jQuery(myTargetElement);
                } else if (jQuery(myTargetElement).parent().hasClass('search-toggle')) {
                    selector = jQuery(myTargetElement).parent().parent();
                    mainElement = jQuery(myTargetElement).parent();
                } else if (jQuery(myTargetElement).parent().parent().hasClass('search-toggle')) {
                    selector = jQuery(myTargetElement).parent().parent().parent();
                    mainElement = jQuery(myTargetElement).parent().parent();
                }
                if (!mainElement.hasClass('active') && jQuery(".navbar-list li").find('.active')) {
                    jQuery('.navbar-list li').removeClass('iq-show');
                    jQuery('.navbar-list li .search-toggle').removeClass('active');
                }

                selector.toggleClass('iq-show');
                mainElement.toggleClass('active');

                e.preventDefault();
            } else if (jQuery(myTargetElement).is('.search-input')) { } else {
                jQuery('.navbar-list li').removeClass('iq-show');
                jQuery('.navbar-list li .search-toggle').removeClass('active');
            }
        });

        //#endregion

        //#region Scrollbar

        let Scrollbar = window.Scrollbar;
        if (jQuery('#sidebar-scrollbar').length) {
            Scrollbar.init(document.querySelector('#sidebar-scrollbar'), options);
        }
        let Scrollbar1 = window.Scrollbar;
        if (jQuery('#right-sidebar-scrollbar').length) {
            Scrollbar1.init(document.querySelector('#right-sidebar-scrollbar'), options);
        }

        //#endregion

        //#region Counter

        // jQuery('.counter').counterUp({
        //     delay: 10,
        //     time: 1000
        // });

        //#endregion

        //#region Progress Bar

        jQuery('.iq-progress-bar > span').each(function () {
            let progressBar = jQuery(this);
            let width = jQuery(this).data('percent');
            progressBar.css({
                'transition': 'width 2s'
            });

            setTimeout(function () {
                progressBar.appear(function () {
                    progressBar.css('width', width + '%');
                });
            }, 100);
        });

        //#endregion

        //#region Page Menu

        jQuery(document).on('click', '.wrapper-menu', function () {
            jQuery(this).toggleClass('open');
        });

        jQuery(document).on('click', ".wrapper-menu", function () {
            jQuery("body").toggleClass("sidebar-main");
        });

        //#endregion

        //#region Wow Animation

        let wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: false,
            live: true
        });
        wow.init();

        //#endregion

        //#region Mailbox

        jQuery(document).ready(function () {
            jQuery('ul.iq-email-sender-list li').click(function () {
                jQuery(this).next().addClass('show');
            });

            jQuery('.email-app-details li h4').click(function () {
                jQuery('.email-app-details').removeClass('show');
            });
        });

        //#endregion

        //#region chatuser

        jQuery(document).ready(function () {
            jQuery('.chat-head .chat-user-profile').click(function () {
                jQuery(this).parent().next().toggleClass('show');
            });
            jQuery('.user-profile .close-popup').click(function () {
                jQuery(this).parent().parent().removeClass('show');
            });
        });

        //#endregion

        //#region chatuser main

        jQuery(document).ready(function () {
            jQuery('.chat-search .chat-profile').click(function () {
                jQuery(this).parent().next().toggleClass('show');
            });
            jQuery('.user-profile .close-popup').click(function () {
                jQuery(this).parent().parent().removeClass('show');
            });
        });

        //#endregion

        //#region Chat start

        jQuery(document).ready(function () {
            jQuery('#chat-start').click(function () {
                jQuery('.chat-data-left').toggleClass('show');
            });
            jQuery('.close-btn-res').click(function () {
                jQuery('.chat-data-left').removeClass('show');
            });
            jQuery('.iq-chat-ui li').click(function () {
                jQuery('.chat-data-left').removeClass('show');
            });
            jQuery('.sidebar-toggle').click(function () {
                jQuery('.chat-data-left').addClass('show');
            });
        });

        //#endregion

        //#region todo Page

        jQuery(document).ready(function () {
            jQuery('.todo-task-list > li > a').click(function () {
                jQuery('.todo-task-list li').removeClass('active');
                jQuery('.todo-task-list .sub-task').removeClass('show');
                jQuery(this).parent().toggleClass('active');
                jQuery(this).next().toggleClass('show');
            });
            jQuery('.todo-task-list > li li > a').click(function () {
                jQuery('.todo-task-list li li').removeClass('active');
                jQuery(this).parent().toggleClass('active');
            });
        });

        //#endregion

        //#region Form Validation

        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (function () {
            'use strict';
            window.addEventListener('load', function () {
                // Fetch all the forms we want to apply custom Bootstrap validation styles to
                var forms = document.getElementsByClassName('needs-validation');
                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function (form) {
                    form.addEventListener('submit', function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    }, false);
                });
            }, false);
        })();

        //#endregion

        //#region Sidebar Widget

        jQuery(document).ready(function () {
            jQuery('.todo-task-lists li').click(function () {
                if ($(this).find('input:checkbox[name=todo-check]').is(":checked")) {

                    $(this).find('input:checkbox[name=todo-check]').attr("checked", false);
                    jQuery(this).removeClass('active-task');
                }
                else {
                    $(this).find('input:checkbox[name=todo-check]').attr("checked", true);
                    jQuery(this).addClass('active-task');
                }
                // jQuery(this).addClass('active-task');
            });
        });

        //#endregion

        //#region checkout

        jQuery(document).ready(function () {
            jQuery('#place-order').click(function () {
                jQuery('#cart').removeClass('show');
                jQuery('#address').addClass('show');
                jQuery('#step1').removeClass('active');
                jQuery('#step1').addClass('done');
                jQuery('#step2').addClass('active');
            });
            jQuery('#deliver-address').click(function () {
                jQuery('#address').removeClass('show');
                jQuery('#payment').addClass('show');
                jQuery('#step2').removeClass('active');
                jQuery('#step2').addClass('done');
                jQuery('#step3').addClass('active');
            });
        });

        //#endregion

        //#region Scroll up menu

        var position = $(window).scrollTop();
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            //  console.log(scroll);

            if (scroll < position) {
                $('.tab-menu-horizontal').addClass('menu-up');
                $('.tab-menu-horizontal').removeClass('menu-down');
            }
            else {
                $('.tab-menu-horizontal').addClass('menu-down');
                $('.tab-menu-horizontal').removeClass('menu-up');
            }
            if (scroll == 0) {
                $('.tab-menu-horizontal').removeClass('menu-up');
                $('.tab-menu-horizontal').removeClass('menu-down');
            }
            position = scroll;
        });

        //#endregion
    });

})(jQuery);







