export default {
    inserted(el, binding, vnode) {

        /**
         * ###########################
         * ########## SETUP ##########
         * ###########################
         */

        const configurationOptions = window._cc_drag_and_drop_options || {};

        /**
         * ######################################
         * ########## USER PREFERENCES ##########
         * ######################################
         */

        /**
         * This value is used to define how far a user must drag an object before the dragging procedure starts.
         * This prevents the user from initializing the dragging procedure by clicking on draggable object to as an example, select text in the object.
         *
         * Can be specified in the following ways
         *  <tag v-cc-draggable data-debounce-value="VALUE" />
         *  <tag v-cc-draggable="{ debounceValue: VALUE }" />
         *
         * @type {number}
         */
        let debounceValue =
            el.dataset.debounceValue ||
            (binding.value || {}).debounceValue ||
            configurationOptions.draggable.debounceValue;

        /**
         * This value is used to define how long the dragging transition should be.
         * This will be used at drag time and *snap back time*.
         * *Snap back* is when a object returns to its original position if not placed on an appropriate drop-zone
         *
         * Can be specified in the following ways
         *  <tag v-cc-draggable data-transition-timing="VALUE" />
         *  <tag v-cc-draggable="{ transitionTiming: VALUE }" />
         *
         * @type {number}
         */
        let transitionTimingInMilliSeconds =
            el.dataset.transitionTiming ||
            (binding.value || {}).transitionTiming ||
            configurationOptions.draggable.transitionTiming;

        /**
         * #################################
         * ########## LOCAL STATE ##########
         * #################################
         */

        /**
         * This value is set to true once dragging of an object starts.
         * Once the user "lets go" of the object, this value is reverted to false.
         * This is used to make sure the user has surpassed the debounce distance before starting the dragging procedure.
         *
         * @type {boolean}
         */
        let dragging = false;

        /**
         * This value is set to true when the user clicks down on a draggable object.
         * Once the user "lets go" of the object, this value is reverted to false.
         * This is used to make sure the user has not let go of the mouse click when running the dragging procedure.
         *
         * @type {boolean}
         */
        let mouseDown = false;

        /**
         * This is used to store the coordinates of the mouse when dragging starts.
         * This is later used to calculate the difference between mouse movements,
         *  to accordingly move the dragging object.
         *
         * @type {{x: number, y: number}}
         */
        let mouseStartPosition = {
            x: 0,
            y: 0,
        };

        /**
         * This is used to store the position of the draggable object when dragging starts.
         * This is first used to calculate how far to move the object together with this.mouseStartPosition,
         * Then later to return the draggable object to its original position after dragging if applicable.
         *
         * @type {{x: number, y: number}}
         */
        let movableStartPosition = {
            x: 0,
            y: 0,
        };

        /**
         * This method gets executed when the user clicks down on the draggable object.
         * This initializes the dragging state for the "drag event".
         * It saves the position of the object before dragging starts in order to move it relatively,
         *  as well as the original mouse position to calculate moved distance to apply to draggable object.
         *
         * @param mouseClickEvent: MouseEvent
         */
        let clickDownHandler = (mouseClickEvent) => {
            /**
             * Store the original coordinates of the mouse pointer,
             * in order to later calculate movement,
             * and adjust the position of the draggable object accordingly
             */
            mouseStartPosition.x = mouseClickEvent.clientX;
            mouseStartPosition.y = mouseClickEvent.clientY;

            /**
             * Store the original coordinates of the draggable object,
             * so we don't have to read it from the DOM,
             * and thus making our drag smoother
             */
            movableStartPosition.y = Number.parseInt(el.style.top, 10) || 0;
            movableStartPosition.x = Number.parseInt(el.style.left, 10) || 0;
            mouseDown = true;
        };

        /**
         * This method gets fired when mouse is moving across screen.
         *
         * If the mouse previously pressed down on a draggable object,
         *  this method will move the draggable object in accordance to mouse movements.
         *
         * It does this by setting the top and left style attributes of the element,
         *  relevant to the objects previous position &
         *  mouse movements relative to starting position.
         *
         * @param mouseMovedEvent: MouseEvent
         */
        let mouseMovedHandler = (mouseMovedEvent) => {
            let getValuesMoved = function() {
                return {
                    x: movableStartPosition.x + mouseMovedEvent.clientX - mouseStartPosition.x,
                    y: movableStartPosition.y + mouseMovedEvent.clientY - mouseStartPosition.y,
                };
            };
            if(dragging) {
                let valuesMoved = getValuesMoved();
                el.style.zIndex = '300';
                el.style.position = 'relative';
                el.style.top = `${valuesMoved.y}px`;
                el.style.left = `${valuesMoved.x}px`;
            } else {
                if(mouseDown) {
                    let valuesMoved = getValuesMoved();
                    if(Math.abs(valuesMoved.x) > debounceValue || Math.abs(valuesMoved.y) > debounceValue) {
                        dragging = true;
                    }
                }
            }
        };

        /**
         * This method gets fired when mouse click is released.
         *
         * It will remove the state for the mouse click to stop the dragging procedure.
         * This will also trigger retransition to original position.
         *
         * @param mouseUpEvent: MouseEvent
         */
        let clickUpHandler = (mouseUpEvent) => {
            dragging = false;
            mouseDown = false;
            el.style["transition-timing-function"] = "cubic-bezier(.08,.82,.08,1.11)";
            el.style["transition"] = `top ${transitionTimingInMilliSeconds}ms, left ${transitionTimingInMilliSeconds}ms`;
            el.style.top = `${movableStartPosition.y}px`;
            el.style.left = `${movableStartPosition.x}px`;
            setTimeout(() => {
                el.style["transition-timing-function"] = "";
                el.style["transition"] = "";
                el.style.zIndex = '';
            }, transitionTimingInMilliSeconds);
        };

        /**
         * Initialize Mouse click events to point to local methods.
         * mousedown is registered on draggable item,
         *  whereas mouseup and mousemove are registered on the document in order to prevent
         *      accidental release with the coincidence of the dragging procedure not being cancelled
         */
        el.addEventListener('mousedown', clickDownHandler);
        el.addEventListener('mouseup', clickUpHandler);
        document.addEventListener('mousemove', mouseMovedHandler);
    }
};
