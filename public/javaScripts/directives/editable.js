angular.module("editable",[])
    .directive('editor', function() {
        return {
            require: '?ngModel',
            compile: function (tElement, tAttrs, transclude) {

                tElement.after(angular.element('<div class="ui-cover"></div>'));

                return function (scope, element, attrs, ctrl) {
                    if (!ctrl) return;

                    // UI -> model
                    element.bind('focus', function() {
                        element.addClass('ui-editable');
                        this.nextSibling.style.display = 'none';
                        scope.oldVal = ctrl.$viewValue;

                    }).bind('blur', function() {
                        element.removeClass('ui-editable');
                        this.nextSibling.style.display = 'block';

                        // Add class for empty element
                        if (!ctrl.$viewValue || ctrl.$viewValue === '') {
                            element.addClass('ui-empty');
                        } else {
                            element.removeClass('ui-empty');
                        }
                    }).bind('keydown', function (e) {
                        if (e.keyCode === 13 && this.tagName !== 'TEXTAREA') {
                            // Focus to next input from group on ENTER
                            e.preventDefault();
                            element[0].blur();
                            //var $group = self.$element.filter('[data-group=' + $this.attr('data-group') + ']:visible')
                            //$group.eq($group.index($this) + 1).focus();

                        } else if (e.keyCode === 27) {
                            // Blur on ESC and restore previous value
                            scope.$apply(ctrl.$setViewValue(scope.oldVal));
                            this.value = scope.oldVal;
                            element[0].blur();
                        }
                    }).next().bind('click', function(e) {
                        element.addClass('ui-editable');
                        element[0].focus();
                    }).css({
                        position:          'absolute',
                        wordWrap:          'break-word',
                        borderColor:       'transparent',
                        borderRadius:      window.getComputedStyle(element[0]).borderRadius,
                        minHeight:         window.getComputedStyle(element[0]).minHeight+'px',
                        marginTop:         -(element[0].offsetHeight + parseInt(window.getComputedStyle(element[0]).marginTop) +  parseInt(window.getComputedStyle(element[0]).marginBottom))+'px',
                        marginBottom:      window.getComputedStyle(element[0]).marginBottom+'px',
                        marginLeft:        window.getComputedStyle(element[0]).marginLeft+'px',
                        marginRight:       window.getComputedStyle(element[0]).marginRight+'px',
                        height:            element[0].offsetHeight+'px',
                        width:             element[0].offsetWidth+'px'
                    });

                    // model -> UI
                    ctrl.$render = function() {
                        scope.oldVal = ctrl.$modelValue;
                        element.val(scope.oldVal);
                        if (!ctrl.$viewValue || ctrl.$viewValue === '') element.addClass('ui-empty') ;
                    };
                };
            }
        };
    })