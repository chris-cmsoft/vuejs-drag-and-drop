/**
 * Created by christiaanvermeulen on 2018/02/01.
 */

import CCDraggable from './src/directives/draggable';

export default {
  install(Vue, options = {}) {
    window._cc_drag_and_drop_options = {
        draggable: Object.assign({
          debounceValue: 5,
          transitionTiming: 300
        }, options.draggable || {}),
    };
    console.log(window._cc_drag_and_drop_options);
    Vue.directive('cc-draggable', CCDraggable);
    console.log('blah');
  }
}
