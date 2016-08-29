/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDLComponent from 'mdl-base';
import MDLTempDrawerFoundation from './foundation';

export default class MDLTempDrawer extends MDLComponent {
  static buildDom() {
    const {ROOT: CSS_ROOT} = MDLTempDrawerFoundation.cssClasses;

    const root = document.createElement('div');
    root.classList.add(CSS_ROOT);
    root.innerHTML = `
      <aside class="${CSS_ROOT}">
        <nav class="${CSS_ROOT}__container">
          <div class="${CSS_ROOT}__toolbar-spacer"></div>
          <div class="${CSS_ROOT}__content"></div>
        </nav>
      </aside>
    `;

    return root;
  }

  static attachTo(root) {
    return new MDLTempDrawer(root);
  }

  /* Remap touch events to pointer events, if the browser supports them. */
  static remapEvent(eventName) {
    const {TOUCH_EVENT_TYPE} = MDLTempDrawerFoundation.strings;

    if (TOUCH_EVENT_TYPE === 'pointer') {
      switch (eventName) {
        case 'touchstart':
          return 'pointerdown';
        case 'touchmove':
          return 'pointermove';
        case 'touchend':
          return 'pointerup';
        default:
          return eventName;
      }
    }

    return eventName;
  }

  get open() {
    return this.foundation_.isOpen();
  }

  set open(value) {
    if (value) {
      this.foundation_.open();
    } else {
      this.foundation_.close();
    }
  }

  /* Return the drawer element inside the component. */
  get drawer() {
    return this.root_.querySelector(MDLTempDrawerFoundation.strings.DRAWER_SELECTOR);
  }

  getDefaultFoundation() {
    const {FOCUSABLE_ELEMENTS, OPACITY_VAR_NAME, TAB_DATA_PROPERTY, TRANSFORM_NAME} =
        MDLTempDrawerFoundation.strings;

    return new MDLTempDrawerFoundation({
      addClass: className => this.root_.classList.add(className),
      removeClass: className => this.root_.classList.remove(className),
      hasClass: className => this.root_.classList.contains(className),
      hasNecessaryDOM: () => Boolean(this.drawer),
      registerComponentInteractionHandler: (evt, handler) =>
          this.root_.addEventListener(MDLTempDrawer.remapEvent(evt), handler),
      deregisterComponentInteractionHandler: (evt, handler) =>
          this.root_.removeEventListener(MDLTempDrawer.remapEvent(evt), handler),
      registerDrawerInteractionHandler: (evt, handler) =>
          this.drawer.addEventListener(MDLTempDrawer.remapEvent(evt), handler),
      deregisterDrawerInteractionHandler: (evt, handler) =>
          this.drawer.removeEventListener(MDLTempDrawer.remapEvent(evt), handler),
      registerAnimationEndHandler: handler => this.drawer.addEventListener('transitionend', handler),
      deregisterAnimationEndHandler: handler => this.drawer.removeEventListener('transitionend', handler),
      getDrawerWidth: () => this.drawer.offsetWidth,
      updateDrawerPosition: value => this.drawer.style.setProperty(TRANSFORM_NAME, value),
      updateComponentBackground: value => this.root_.style.setProperty(OPACITY_VAR_NAME, value),
      getFocusableElements: () => Array.from(this.drawer.querySelectorAll(FOCUSABLE_ELEMENTS)),
      saveElementTabState: el => {
        if (el.hasAttribute('tabindex')) {
          el.setAttribute(TAB_DATA_PROPERTY, el.getAttribute('tabindex'));
        }
      },
      restoreElementTabState: el => {
        if (el.hasAttribute(TAB_DATA_PROPERTY)) {
          el.setAttribute('tabindex', el.getAttribute(TAB_DATA_PROPERTY));
          el.removeAttribute(TAB_DATA_PROPERTY);
        } else {
          el.removeAttribute('tabindex');
        }
      },
      makeElementUntabbable: el => el.setAttribute('tabindex', -1),
      forceLayout: () => this.root_.offsetWidth,
      isAttachedToDOM: () => Boolean(this.root_.parentNode)
    });
  }
}
