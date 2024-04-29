(async()=>{
    //Sends a messgae to the service worker and receives a tip in response
    const {tip} = await chrome.runtime.sendMessage({greeting: 'tip'});

    const nav = document.querySelector('.upper-tabs > nav');

    const tipWidget = createDomElement(`
    <button type="button" popovertarget="tip-popover" popovertargetaction="show" style="padding: 0 12px; height: 36px;">
      <span style="display: block; font: var(--devsite-link-font,500 14px/20px var(--devsite-primary-font-family));">Tip</span>
    </button>
  `);

    const popover = createDomElement(
      `<div id='tip-popover' popover style="margin: auto;">${tip}</div>`
    );

    document.body.append(popover);
    nav.append(tipWidget);
})();


function createDomElement(html){
    //This basically creates a document element and then returns the first child of the document.
    const dom = new DOMParser().parseFromString(html, 'text/html');
    return dom.body.firstElementChild;
}