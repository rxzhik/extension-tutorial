const article = document.querySelector("div.page__content");


if(article){
    const text = article.textContent
    const wordMatchRegExp = /[^\s]+/g // Regular expression
    const words = text.matchAll(wordMatchRegExp)

    const wordCount = [...words].length
    
    const readingTime = Math.round(wordCount / 200)
    
    const badge = document.createElement("p")
    badge.classList.add("color-secondary-text", "type--caption")
    badge.textContent = `⏱️ ${readingTime} min read`

    const heading = document.querySelector("div.page__header h1")

    heading.insertAdjacentElement("afterend", badge)

}