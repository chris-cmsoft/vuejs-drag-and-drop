# VueJS2 Drag & Drop

> VueJS drag and drop is an attempt to create a usable drag & drop interface, that can be plugged into any existing VueJS2 application  

### Installation

```bash
$ npm install vuejs-drag-and-drop --save 
```

### Setup

In your entry point add
```javascript
import VueJSDragAndDrop from 'vuejs-drag-and-drop';  

Vue.use(VueJSDragAndDrop);
```

### Global Configuration

If you would like to add global configurations you can do so in you entry point & use statement

```javascript
import VueJSDragAndDrop from 'vuejs-drag-and-drop';  

Vue.use(VueJSDragAndDrop, {
    draggable: { // Settings for draggable directive
        /**
         * How long an item takes to pop back to its original position.
         * 
         * Type: {Integer} milliseconds
         * Default: 300
         */
        transitionTiming: 3000, 
        /**
         * How far the mouse should drag before object starts dragging. 
         * This prevents accidental dragging by clicking. 
         * 
         * Type: {Integer} px|pixels
         * Default: 5
         */
        debounceValue: 100, // how far the mouse should drag before object starts dragging. This prevents accidental dragging by clicking.
    },
});
```

### Draggable

draggable is a directive that can be added to any existing element by doing the following

```html
<div v-cc-draggable >
    Draggable Content Here
</div>
```

You can configure item specific setting by data attributes or by passing a object to the directive

```html
<!-- Object Notation -->
<div v-cc-draggable="{debounceValue: 100, transitionTiming: 200}">
    Draggable Content
</div>

<!-- Dataset Notation --> 
<div 
    v-cc-draggable 
    data-debounce-value="100"
    data-transition-timing="200"
>
    Draggable Content
</div>
```

### Project Roadmap

* [x] Draggable Directive
* [ ] Droppable Component
* [ ] Sortable Component (`<ul> & <ol> & <table>`)
* [ ] Add More settings to draggable interface
    * [ ] Do not snap back after completion
* [ ] Add classes to states to allow styling of components 
