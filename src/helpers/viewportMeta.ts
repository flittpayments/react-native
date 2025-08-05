export const addViewportMeta = `(${String(() => {
    // @ts-ignore
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, user-scalable=0,');
    meta.setAttribute('name', 'viewport');
    // @ts-ignore
    const elementHead = document.getElementsByTagName('head');
    if (elementHead) {
        elementHead[0].appendChild(meta);
    } else {
        // @ts-ignore
        const head = document.createElement('head');
        head.appendChild(meta);
    }
})})();`;
