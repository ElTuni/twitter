import {tweetsData} from "/data.js"

const feedEl = document.getElementById("feed")
function render (){
    let html = ``
    tweetsData.forEach(tweet => {
        console.log(tweet)
        html +=  ` 
        <div class="twitt">          
            <img class="icon" src=${tweet.profilePic}>
            <div class="allTweetTxt">profilePic
                <p class="username">${tweet.handle}</p>
                <p class="message">${tweet.tweetText}</p>
                <div class="socialBtns">
                    <div class="comments">
                        <i class="fa-regular fa-comment"></i>
                        <span>${tweet.replies.length}</span>
                    </div>
                    <div class="likes">
                        <i class="fa-solid fa-heart"></i>
                        <span>${tweet.likes}</span>
                    </div>
                    <div class="retweets">
                        <i class="fa-solid fa-retweet"></i>
                        <span>${tweet.retweets}</span>
                    </div>
                </div>
            </div>
        </div>`
            
    })
    feedEl.innerHTML = html

}

render()
