import {tweetsDataDF} from "/data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

let tweetsData = JSON.parse(localStorage.getItem("user"))
if (!tweetsData){
    tweetsData = localStorage.setItem("user", JSON.stringify(tweetsDataDF))
    tweetsData = JSON.parse(localStorage.getItem("user"))
}


const feedEl = document.getElementById("feed")
const randomname = `@anonymous` + Math.floor(Math.random()*1000)

document.addEventListener("click", function(e){
    if (e.target.dataset.type){
        if (e.target.dataset.type === "like"){
            let clickedTweet = tweetsData.filter((tweet) => tweet.uuid === e.target.dataset.uuid)[0]
            // en caso de que el likeado sea un comentario
            if (!clickedTweet){   
                // busca de onde viene el comentario, osea su main tweet
                clickedTweet = tweetsData.find((mainTweet) => mainTweet.replies.find((reply) => reply.uuid === e.target.dataset.uuid))
                // busca el comentario en si
                clickedTweet = (clickedTweet.replies.find((element) => element.uuid === e.target.dataset.uuid))
            }
            if (clickedTweet.isLiked){
                clickedTweet.likes--
            }else {
                clickedTweet.likes++
            }
            clickedTweet.isLiked = !clickedTweet.isLiked
            render()

        } else if (e.target.dataset.type === "retweet"){
            let clickedTweet = tweetsData.filter((tweet) => tweet.uuid === e.target.dataset.uuid)[0]
            // en caso de que el likeado sea un comentario
            if (!clickedTweet){   
                // busca de onde viene el comentario, osea su main tweet
                clickedTweet = tweetsData.find((mainTweet) => mainTweet.replies.find((reply) => reply.uuid === e.target.dataset.uuid))
                // busca el comentario en si
                clickedTweet = (clickedTweet.replies.find((element) => element.uuid === e.target.dataset.uuid))
            }
            if (clickedTweet.isRetweeted){
                clickedTweet.retweets--
            }else {
                clickedTweet.retweets++
            }
            clickedTweet.isRetweeted = !clickedTweet.isRetweeted
            render()
        } else if (e.target.dataset.type === "comment") {
            let clickedTweet = tweetsData.filter((tweet) => tweet.uuid === e.target.dataset.uuid)[0]
            if (clickedTweet){
                clickedTweet.areRepliesVisible = !clickedTweet.areRepliesVisible
                render()}
        } else if (e.target.dataset.type === "delete") {
            let index = -1
            tweetsData.forEach(element => {
                index++
                if (element.uuid === e.target.dataset.uuid){
                    tweetsData.splice(index, 1)
                }
            }) 
            render()
        } else if (e.target.dataset.type === "reset") {
            localStorage.removeItem("user")
            tweetsData = localStorage.setItem("user", JSON.stringify(tweetsDataDF))
            tweetsData = JSON.parse(localStorage.getItem("user"))
            render()
        }
    }
    if (e.target.classList.value === "tweetBtn" && document.getElementById("tweetingplace").value.replace(/\s+/g, '')) {
        commentSending ()
        }
})

document.addEventListener("keyup", function(event){
    event.preventDefault()
    if(event.keyCode === 13 && document.getElementById("tweetingplace").value.replace(/\s+/g, '')){
        commentSending()
    }
})

function render (){
    let html = ``
    tweetsData.forEach(tweet => {

        let isLikedcolor = ""
        if (tweet.isLiked){
            isLikedcolor = "liked"
        }

        let isRetweetedcolor = ""
        if (tweet.isRetweeted){
            isRetweetedcolor = "retweeted"
        }
        
        let comments = ``

        let visibility = "hidden"
        let visibilitycolor = ""

        if (tweet.areRepliesVisible && tweet.replies.length > 0){
            visibility = "show"
            visibilitycolor = "viewingComents"
        }

        if (tweet.replies.length > 0){
            tweet.replies.forEach(reply => {
                let isLikedcolorreply = ""
                if (reply.isLiked){
                    isLikedcolorreply = "liked"
                }
        
                let isRetweetedcolorreply = ""
                if (reply.isRetweeted){
                    isRetweetedcolorreply = "retweeted"
                }

                comments += `  
                <div class="reply">   
                    <img class="icon" src=${reply.profilePic}>
                    <div class="allTweetTxt">
                        <p class="username">${reply.handle}</p>
                        <p class="message">${reply.tweetText}</p>
                        <div class="socialBtns">
                            <button class="comments" data-type="comment" data-uuid=${reply.uuid}>
                                <i class="fa-regular fa-comment" data-type="comment" data-uuid=${reply.uuid}></i> 0
                            </button>
                            <button class="likes" data-type="like" data-uuid=${reply.uuid}>
                                <i class="fa-solid fa-heart ${isLikedcolorreply}" data-type="like" data-uuid=${reply.uuid}></i> ${reply.likes}
                            </button>
                            <button class="retweets" data-type="retweet" data-uuid=${reply.uuid}>
                                <i class="fa-solid fa-retweet ${isRetweetedcolorreply}" data-type="retweet" data-uuid=${reply.uuid}></i>
                                ${reply.retweets}
                            </button>
                            <button class="deletes" data-type="delete" data-uuid=${tweet.uuid}>
                                <i class="fa-solid fa-trash" data-type="delete" data-uuid=${tweet.uuid}></i>
                            </button>
                        </div>
                    </div>
                </div>`
            })
        
        }

        html +=  ` 
        <div class="twitt">          
            <img class="icon" src=${tweet.profilePic}>
            <div class="allTweetTxt">
                <p class="username">${tweet.handle}</p>
                <p class="message">${tweet.tweetText}</p>
                <div class="socialBtns">
                    <button class="comments" data-type="comment" data-uuid=${tweet.uuid}>
                        <i class="fa-regular fa-comment ${visibilitycolor}" data-type="comment" data-uuid=${tweet.uuid}></i>
                        ${tweet.replies.length}
                    </button>
                    <button class="likes" data-type="like" data-uuid=${tweet.uuid}>
                        <i class="fa-solid fa-heart ${isLikedcolor}" data-type="like" data-uuid=${tweet.uuid}></i>
                        ${tweet.likes}
                    </button>
                    <button class="retweets" data-type="retweet" data-uuid=${tweet.uuid}>
                        <i class="fa-solid fa-retweet ${isRetweetedcolor}" data-type="retweet" data-uuid=${tweet.uuid}></i>
                        ${tweet.retweets}
                    </button>
                    <button class="deletes" data-type="delete" data-uuid=${tweet.uuid}>
                        <i class="fa-solid fa-trash" data-type="delete" data-uuid=${tweet.uuid}></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="replies ${visibility}" id="replies${tweet.uuid}">
            ${comments}
        </div>`

    tweetsData = localStorage.setItem("user", JSON.stringify(tweetsData))
    tweetsData = JSON.parse(localStorage.getItem("user"))
            
    })
    feedEl.innerHTML = html

}

function commentSending (){
    const newTweet = {
    handle: randomname,
    profilePic: `images/Twitter_default_profile_400x400.png`,
    likes: 0,
    retweets: 0,
    tweetText: document.getElementById("tweetingplace").value,
    replies: [],
    isLiked: false,
    isRetweeted: false,
    areRepliesVisible: false,
    uuid: uuidv4()}
    document.getElementById("tweetingplace").value = ""
    
    tweetsData.unshift(newTweet)
    render()}

render()
