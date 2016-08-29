export default class AS24AdSlot extends HTMLElement {
    createdCallback() {}
    attachedCallback () {}
    detachedCallback() {}

    static registerElement(name) {
        document.registerElement(name, AS24AdSlot);
    }
}
