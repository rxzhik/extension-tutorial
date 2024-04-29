const URL_CHROME_EXTENSIONS_DOC = 'https://developer.chrome.com/docs/extensions/reference/'
const NUMBER_OF_PREVIOUS_SEARCHES = 4


//EVENT LISTENERS
//run on service-worker installation
chrome.runtime.onInstalled.addListener(({reason})=>{
    if(reason === "install"){
        chrome.storage.local.set({
            apiSuggestions: ['tabs', 'storage', 'scripting']
        })
    }
})

//Display the suggestions after user starts typing
chrome.omnibox.onInputChanged.addListener(async (input, suggest)=>{
    await chrome.omnibox.setDefaultSuggestion({
        description: 'Enter a Chrome API or choose from past searches'
    }); 

    const {apiSuggestions} = await chrome.storage.local.get('apiSuggestions')
    const suggestions = apiSuggestions.map((api)=> {
        return {content: api, description: `Open chrome.${api} API`}
    })
    suggest(suggestions)
})

//Action for when the user selections a suggestion
chrome.omnibox.onInputEntered.addListener((input)=>{
    chrome.tabs.create({url: URL_CHROME_EXTENSIONS_DOC + input});
    //save the latest keyword
    //the updateHistory() function takes the omnibox input and saves it to storage.local. 
    updateHistory(input)
})


//FUNCTIONS
//Updates suggestion history
async function updateHistory(input){
    const {apiSuggestions} = await chrome.storage.local.get('apiSuggestions')
    apiSuggestions.unshift(input)
    //This makes sure that we do not have more than four suggestions.
    apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES)
    return chrome.storage.local.set({apiSuggestions})
}
// Fetch tip & save in storage
async function updateTip(){
    const response = await fetch('https://extension-tips.glitch.me/tips.json')
    //explantion for why .json() returns a promise: https://stackoverflow.com/questions/39435842/javascript-fetch-api-why-does-response-json-return-a-promise-object-instead
    const tips = await response.json();
    const randomIndex = Math.floor(Math.random()*tips.length)
    return chrome.storage.local.set({tip: tips[randomIndex]})
}

const ALARM_NAME = 'tip';


// Check if alarm exists to avoid resetting the timer.
// The alarm might be removed when the browser session restarts.
async function createAlarm(){
    const alarm = await chrome.alarms.get(ALARM_NAME)
    if(typeof alarm === "undefined"){
        chrome.alarms.create(ALARM_NAME,{
            delayInMinutes: 1,
            periodInMinutes: 1440
        });
        updateTip()
    }
}

createAlarm()

//EVENT LISTNER on alarmto update the tips
chrome.alarms.onAlarm.addListener(updateTip)