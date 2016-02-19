/**
     * to apply water marl in text box
     * @param mark
     * @returns {*}
     */
    $.fn.watermark = function (mark) {

        if (mark) // if we have a mark, let's override what's in the attribute of the element (in case we're handling this as HTML5 mode)
        {
            this.attr(watermarkAttr, mark);
        }
        else {
            mark = this.attr(watermarkAttr);
        } // otherwise, get the mark from the attribute

        if (!mark) // if there's no mark, then we need to return
        {
            return;
        }

        // rely on HTML5 to do this for us
        if (hasNativeWatermark) {
            return;
        }

        var className = 'watermark';

        if (!mark) {
            return this;
        }

        this.val(mark).addClass(className);

        this.focus(function () {
            var $t = $(this);
            if ($t.val() === mark) {
                $t.val(null).removeClass(className);
            }
        });

        this.blur(function () {
            var $t = $(this);
            if ($t.val().length === 0) {
                $t.val(mark).addClass(className);
            }
        });

        return this;
    };

    /**
     * To create header that do not scroll with the content of the table
     * @param options
     * @returns {*}
     */
    $.fn.stickyHeader = function (options) {
        options = $.extend({
            setHeaderPercentage: false
        }, options);

        // this should be a div with overflow. we could traverse closest until we find one, but it's best if this is just used correctly.
        var stickyHeaderId = this.find('table').attr('id') + '-stickyHeader';
        var $stickyHeaderId = $('#' + stickyHeaderId);
        $stickyHeaderId.show();
        if ($stickyHeaderId.length > 0) {
            return false;
        }
        var $clone = this.find('table').clone();

        var id = $clone.attr('id') + '-stickyHeader';

        if (options.setHeaderPercentage) {

            this.find('thead tr').each(function (i, o) {
                var $tr = $clone.find('thead tr').eq(i).find('th');
                var twidth = 0;

                $(o).find('th').each(function (i2, o2) {
                    twidth += $(o2).width();
                });

                $(o).find('th').each(function (i2, o2) {
                    var p = ($(o2).width() / twidth * 100);
                    $tr.eq(i2).css('width', p + '%');
                });
            });
        }

        $clone.find('tbody').remove();
        $clone = $('<div>').append($clone);

        // Modified for JM-423
        var marginRight = 0;
        var overflow = this.css('overflow');
        if (overflow == 'scroll') {
            marginRight = getScrollBarWidth();
        }

        $clone.css({
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'right': '0',
            'margin-right': marginRight + 'px', // this will always have the margin even if the scrollbar isn't present
            'display': 'block',
            'z-index': '9999999'
        });

        $clone.attr('id', id);

        var $container = $('<div>');

        $container.css({
            'margin': '0',
            'padding': '0',
            'border': '0',
            'font-size': '100%',
            'font': 'inherit',
            'vertical-align': 'baseline',
            'position': 'relative'
        });
		function getScrollBarWidth(){
                var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
                $('body').append(div);
                var w1 = $('div', div).innerWidth();
                div.css('overflow-y', 'auto');
                var w2 = $('div', div).innerWidth();
                $(div).remove();
                return (w1 - w2);
        }
        $container.insertBefore(this).append($clone).append(this);

        return this;
    };
	
	/**
     * conversion between 2 multiple select lists
     * @param options
     */
    $.fn.multiSelect = function (options) {
        var $btnSel = $('.btn-select');
        var $btnRem = $('.btn-remove');
        var $availableList = $('select.available-list');
        var $selectedList = $('select.selected-list');

        // On double click move to right/selected list
        $availableList.bind('dblclick', function () {
            var $opt = $(this).find(':selected');
            $selectedList.append(moveOption($opt));
            if (options) {
                options.clickSelect();
            }
            handelProcess($opt, $btnSel);
        });

        // On double click move to right/selected list
        $availableList.bind('click', function () {
            var $selectedListSel = $('select.selected-list option:selected');
            $selectedListSel.removeAttr('selected');
            $btnSel.removeAttr('disabled', 'disabled').addClass('active');
            $btnRem.attr('disabled', 'disabled').removeClass('active');
        });

        // On double click move to left/available list
        $selectedList.bind('click', function () {
            var $availableListSel = $('select.available-list option:selected');
            $availableListSel.removeAttr('selected');
            $btnSel.attr('disabled', 'disabled').removeClass('active');
            $btnRem.removeAttr('disabled', 'disabled').addClass('active');
        });

        // On double click move to left/available list
        $selectedList.bind('dblclick', function () {
            var $opt = $(this).find(':selected');

            var isProcess = true;
            if (options) {
                isProcess = options.clickRemove();
            }
            if (isProcess) {
                $availableList.append(moveOption($opt));
                handelProcess($opt, $btnRem);
            }
        });

        // On click button move to right/selected list
        $btnSel.click(function () {
            var $availableListSel = $('select.available-list option:selected');
            $availableListSel.each(function () {
                $selectedList.append(moveOption($(this)));
            });
            if (options) {
                options.clickSelect();
            }
            handelProcess($availableListSel, $btnSel);
        });

        // On click button move to left/available list
        $btnRem.click(function () {
            var $selectedListSel = $('select.selected-list option:selected');

            var isProcess = true;
            if (options) {
                isProcess = options.clickRemove();
            }
            if (isProcess) {
                $selectedListSel.each(function () {
                    $availableList.append(moveOption($(this)));
                });
                handelProcess($selectedListSel, $btnRem);

            }
        });

        // On click the option enable/disable button
        $('select[multiple="multiple"]').bind('click', function () {
            var $opt = $(this);
            $btnSel.attr('disabled', 'disabled').removeClass('active');
            $btnRem.attr('disabled', 'disabled').removeClass('active');
            var $curBtn = ($opt.hasClass('available-list')) ? $btnSel : $btnRem;
            if ($opt.find('option:selected').length === 0) {
                $curBtn.attr('disabled', 'disabled').removeClass('active');
            }
            else {
                $curBtn.removeAttr('disabled').addClass('active');
            }
        });

        // Handle processes
        function handelProcess(panel, btn) {
		
            $(panel).remove();

            $(btn).attr('disabled', 'disabled').removeClass('active');
            
        }

        // Move options
        function moveOption(opt) {
            var $opt = $(opt);
            var optPos = $opt.attr('rel');
            var optVal = $opt.val();
            var optText = $opt.text();
            if (optVal && optText) {
                return $('<option/>').attr({ 'value': optVal }).text(optText).attr({ 'rel': optPos });
            }
        }

    };