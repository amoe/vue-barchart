const directives = {
    axis: {
        bind(el, binding, vnode, oldVnode) {
            console.log("inside bind");
        },
        inserted(el, binding, vnode, oldVnode) {
            console.log("inside inserted");
        },
        update(el, binding, vnode, oldVnode) {
            console.log("inside update");
        },
        componentUpdated(el, binding, vnode, oldVnode) {
            console.log("inside componentUpdated");
        },
        unbind(el, binding, vnode, oldVnode) {
            console.log("inside unbind");
        }
    }
};

export default directives;
