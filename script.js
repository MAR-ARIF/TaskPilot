//Global Variables

//sidebar navigation buttons
const navItems = document.querySelectorAll(".side-bar li");
const pages = document.querySelectorAll(".page");
//task elements
const addBtn = document.getElementById("add-task-btn");
const completionBar = document.getElementById("completion-bar");
const lastBar = document.getElementById("last-bar");
const todayTask = document.getElementById("today-task");
const todayComTask = document.getElementById("today-com-task");
//task counters
let allTasksCount = 0;
let activeTasksCount = 0;
let completedTasksCount = 0;
//pomodoro timer elemetns
const focusBtn = document.getElementById("focus-btn");
const breakBtn = document.getElementById("break-btn");
const timer = document.getElementById("timerr");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
//timer logic variables
let time = 25 * 60;
let interval;
let running = false;
//dashboard cards
const timerText = document.getElementById("timer-text");
const completedCard = document.getElementById("completed-task-card");
const activeCard = document.getElementById("active-task-card");
const totalCard = document.getElementById("total-task-card"); 
const comp = document.getElementById("comp");
const pend = document.getElementById("pend");
const tot = document.getElementById("tot");

//progress bar elements
let percentage;
const pBarFill = document.getElementById("p-bar-fill");
const pgAmount = document.getElementById("pg-amount");
const pgMotivation = document.getElementById("pg-motivation");
//user setting elements
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const saveChangesBtn = document.getElementById("save-cng-btn");
const greetings = document.getElementById("greeting");
const themeToggle = document.getElementById("theme-toggle");
const main = document.querySelector(".main");


//update filter buttons
function barUpdate(){
    completionBar.innerHTML = `
    <button id="all-task-btn" class="active">All (${allTasksCount})</button>
    <button id="active-task-btn">Active(${activeTasksCount})</button>
    <button id="completed-task-btn">Completed(${completedTasksCount})</button>
    `;
}

//update total summary bar
function barTotalUpdate(){
    lastBar.innerHTML = `
    <p>Total: ${allTasksCount}</p>
    <p>Completed: ${completedTasksCount}</p>
    `;
}
//update dashboard cards
function cardUpdate(){
    completedCard.innerText = `${completedTasksCount}`;
    activeCard.innerText = `${activeTasksCount}`;
    totalCard.innerText = `${allTasksCount}`;
    comp.innerText = `${completedTasksCount}`;
    tot.innerText = `${allTasksCount}`;
    pend.innerText = `${activeTasksCount}`;

    
}
//update progress bar percentage
function progressBarUpdate(){
    percentage = Math.round((completedTasksCount / allTasksCount) * 100);
    pBarFill.style.width = percentage+"%" ;
    pgAmount.innerText = percentage + "%";
    //change color based on progress
    if (percentage < 40){
        pBarFill.style.background = "#b63636ff"; 
    }
    else {
        pBarFill.style.background = "linear-gradient(to bottom right, #2563eb , #8102ff)" ;    
    }
    //motivational message
    if (percentage < 50 ){
        pgMotivation.innerText = "Every tiny achievements makes a bigger one. Never give up!"
    } else if (percentage > 50 && percentage < 80){
        pgMotivation.innerText = "You are doing a great job. Keep going. "
    } else {
        pgMotivation.innerText = "You are almost there. Accomplish your goal for today."
    }


}


//page navigation
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageId = item.dataset.page;
        //hides all pages
        pages.forEach(page => page.classList.remove("active"));
        //show selected pages
        document.getElementById(pageId).classList.add("active");
        //highlight active nav item
        navItems.forEach(nav => nav.classList.remove("actv"));

        item.classList.add("actv");
        
    });
});
//date display
function updateDate() {
    const dateEl = document.getElementById("date-id");

    const today = new Date();

    const options = {
        weekday : "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    dateEl.textContent = today.toLocaleDateString("en-US",options).replace(",","");

}

updateDate();

const API_URL ="http://localhost:8080/api/tasks";
//loads tasks from local storage or set empty array
let tasks = [];

async function loadTasks() {
    try{
        const res = await fetch(API_URL);
        const data = await res.json();
        tasks=data;
        renderTasks();
    } catch(error){
        console.error("error loading task",error);
    }
    
}

//save tasks to local storage
async function saveTasks(task){
   try{
     const res = await fetch(API_URL,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(task)

    });
    const data = await res.json();
    await loadTasks();
   } catch(error){
    console.error("Error saving task",error);
   }
    
}

//render tasks 
function renderTasks(){
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    todayComTask.innerHTML="";
    todayTask.innerHTML="";
    //update counters
    allTasksCount = tasks.length;
    activeTasksCount = tasks.filter( t => !t.completed).length;
    completedTasksCount = tasks.filter(t => t.completed).length;
    barUpdate();
    barTotalUpdate();
    cardUpdate();
    progressBarUpdate();

    //filter buttons
    document.getElementById("all-task-btn").addEventListener("click", renderTasks);
    document.getElementById("active-task-btn").addEventListener("click",showActiveTasks);
    document.getElementById("completed-task-btn").addEventListener("click",showCompletedTasks);
    //render task lists
    tasks.forEach (task => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <label>
                <input type="checkbox" class="task-check" data-index="${task.taskId}" ${task.completed ? "checked" : ""} >
                <span class="task-text">${task.taskName}</span>
            </label>
            <button data-index="${task.taskId}" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        `;
        list.appendChild(li);

        //today's task panel
        if(!task.completed){
            todayTask.innerHTML += `<li>${task.taskName}</li>`;
        } else {
            todayComTask.innerHTML += `<li>${task.taskName}</li>`;
        }

    });
    const lang = localStorage.getItem("language") || "en";
    translation(lang);

}
//shows active tasks
function showActiveTasks() {
    let activeTasks = tasks.filter(task => !task.completed);
    document.getElementById("active-task-btn").classList.add("active");
    document.getElementById("all-task-btn").classList.remove("active");
    document.getElementById("completed-task-btn").classList.remove("active");
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    activeTasks.forEach (task=> {
        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <label>
                <input type="checkbox" class="task-check" data-index="${task.taskId}" ${task.completed ? "checked" : ""} >
                <span class="task-text">${task.taskName}</span>
            </label>
            <button data-index="${task.taskId}" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        `;
        list.appendChild(li);

    });
    const lang = localStorage.getItem("language") || "en";
    translation(lang);
    

};
//show completed tasks
function showCompletedTasks() {
    let completedTasks = tasks.filter(task => task.completed);
    document.getElementById("completed-task-btn").classList.add("active");
    document.getElementById("active-task-btn").classList.remove("active");
    document.getElementById("all-task-btn").classList.remove("active");
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    completedTasks.forEach (task => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <label>
                <input type="checkbox" class="task-check" data-index="${task.taskId}" ${task.Completed ? "checked" : ""} >
                <span class="task-text">${task.taskName}</span>
            </label>
            <button data-index="${task.taskId}" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        `;
        list.appendChild(li);

    });
    
    const lang = localStorage.getItem("language") || "en";
    translation(lang);
    

};
//update timer
function updateTimer(){
    let minutes = Math.floor(time/60);
    let seconds = time % 60;

    timer.textContent = String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");
}
updateTimer();

//add task
function addTask () {
    const input = document.getElementById("task-input");
    const text = input.value.trim();
    const newTask = {
        taskName: text,
        completed: false
    };

    if (text === "") return;

    allTasksCount++;
    saveTasks(newTask);
    renderTasks();
    input.value = "";

}
addBtn.addEventListener("click",addTask);
document.getElementById("task-input").addEventListener("keydown",(e)=>{
    if (e.key === "Enter"){
        addTask();
    }
})

//toggle 
document.getElementById("task-list").addEventListener("change" , async (e) => {
    if(e.target.type === "checkbox"){
        const taskId = e.target.dataset.index;
        const completed = e.target.checked;
        try {
            await fetch (`${API_URL}/${taskId}`,{
                method: "PUT" ,
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    completed: completed
                })
            });
            await loadTasks();
           
        } catch (error){
            console.error(error);
        }
    }
});
//delete task 
document.getElementById("task-list").addEventListener("click" ,async (e) => {
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")){
        const index = e.target.dataset.index || e.target.closest(".delete-btn").dataset.index ;
        try {
            await fetch (`${API_URL}/delete/${index}`,{
                method: "DELETE",

            });
            await loadTasks();

        } catch(error){
            console.error(error);
        }
    }
});

//pomodoro timer start
startBtn.addEventListener("click", () => {
    if (running) return;

    running = true;
    
    interval = setInterval(()=>{
        time--;
        timerText.innerText= "Timer is running";
        updateTimer();

        if (time === 0){
            clearInterval(interval);
            running = false;
            timerText.innerText = "Timer Completed";
        }
    },1000)
    
    
})
//timer restart
resetBtn.addEventListener("click",()=>{
    clearInterval(interval);
    running = false;

    time = timeMinutes * 60;
    updateTimer();
    timerText.innerText="";

});
//focus and break timer variables
let timeMinutes = 25;
let brktimeMinutes = 5;
//focus mode button
focusBtn.addEventListener("click",()=> {
    if(running) return;
    time = timeMinutes * 60;
    updateTimer();

})
//break mode button
breakBtn.addEventListener("click", ()=>{
    if(running) return;
    time = brktimeMinutes * 60;
    updateTimer();
})
//theme toggle
themeToggle.addEventListener("change",() => {
    main.classList.toggle("dark",themeToggle.checked);
})
//user greeting settngs
function getTimeGreeting(){
    const hour = new Date().getHours();

    if (hour < 12){
        return "Good Morning";
    } else if (hour < 18){
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}
//load saved names
 async function getLastUser() {
    try{
        const res = await fetch ("http://localhost:8080/api/user/latest");
        const data = await res.json();
        return data;
    } catch (error){
        console.error("there is a error loading saved name" + error);
    }
   
    
}
async function loadLastUser() {
    const savedName = await getLastUser();
    if(savedName){
        const timeGrt = getTimeGreeting();
        greetings.textContent = `${timeGrt}, ${savedName.userName} !`;
        nameInput.value =savedName.userName; 
    
}


}
//save changes setting button
saveChangesBtn.addEventListener("click",async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const timeGreeting = getTimeGreeting();

    if (name !== ""){
        greetings.textContent = `${timeGreeting}, ${name} !`;
        const user = {
            userName : name,
            userEmail : email
        }
        await fetch ("http://localhost:8080/api/user",{
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(user)
        })

    } else {
        const lang = localStorage.getItem("language") || "en";

        greetings.textContent = `${timeGreeting}, !`;
    }
    timeMinutes = parseInt(document.getElementById("foc-time-input").value);
    brktimeMinutes = parseInt(document.getElementById("brk-time-input").value);

    focusBtn.textContent = `Focus(${timeMinutes} min)`;
    breakBtn.textContent = `Break(${brktimeMinutes}min)`;

    const lang = document.getElementById("language").value ;
    setLanguage(lang);
})

//language translation system
function getTextNode(){
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (node.parentElement && node.parentElement.classList.contains("task")){
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.textContent.trim().length > 0){
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );
    const nodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()){
        nodes.push(currentNode);
    }
    return nodes;
}
function translation(lang) {
    const nodes = getTextNode();

    for (const node of nodes){
        if(!node.originalText){
            node.originalText = node.textContent.trim();
        }
        const original = node.originalText;

        if(lang === "en"){
            node.textContent = original;
            continue;
        }

        if(dictionary[original] && dictionary[original][lang]){
            node.textContent = dictionary[original][lang];
        }
       

       

    }
    
}
function setLanguage(lang){
    localStorage.setItem("language",lang);
    translation(lang);


}
renderTasks();
loadTasks();
loadLastUser();
//initial load
const savedLang = localStorage.getItem("language") || "en";
document.getElementById("language").value = savedLang;
translation(savedLang);

