let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput=document.querySelector("#image input")

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDtt8XdaXEYdD34nITq3Ba3kkR3isVTQfM";

let user = {
    message: null,
    file:{
        mime_type: null,
        data: null

    }
};

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": user.message },(user.file.data?[{"inline_data":user.file}]:[])
                    ]
                }
            ]
        })
    };
    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\\(.?)\\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.log(error);
        text.innerHTML = "Sorry, something went wrong. Please try again.";
    }    

    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})
        image.src=`img.svg`
        image.classList.remove("choose")
        user.file={}

    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handlechatResponse(message) {
    user.message = message;
    let html = `<img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" alt="" id="userImage" width="8%"/>
                <div class="user-chat-area">
                    ${user.message}
                    ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`:""}
                </div>`;
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behaviour:"smooth"})

    setTimeout(() => {
        let html = `<img src="https://www.neilsahota.com/wp-content/uploads/2024/05/AI-Humanoid-Robots.jpg" alt="" id="aiImage" width="10%"/>
                    <div class="ai-chat-area">
                        <img src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="" class="load" width="50px">
                    </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatResponse(prompt.value);
    }
});

submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value);
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type: file.type,
            data: base64string
    
        }    
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }                    
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})
