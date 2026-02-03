const navItems = document.querySelectorAll(".side-bar li");
const pages = document.querySelectorAll(".page");
const addBtn = document.getElementById("add-task-btn");
const completionBar = document.getElementById("completion-bar");
const lastBar = document.getElementById("last-bar");
const todayTask = document.getElementById("today-task");
const todayComTask = document.getElementById("today-com-task");
let allTasksCount = 0;
let activeTasksCount = 0;
let completedTasksCount = 0;
const focusBtn = document.getElementById("focus-btn");
const breakBtn = document.getElementById("break-btn");
const timer = document.getElementById("timerr");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
let time = 25 * 60;
let interval;
let running = false;
const timerText = document.getElementById("timer-text");
const completedCard = document.getElementById("completed-task-card");
const activeCard = document.getElementById("active-task-card");
const totalCard = document.getElementById("total-task-card"); 
const comp = document.getElementById("comp");
const pend = document.getElementById("pend");
const tot = document.getElementById("tot");
let percentage;
const pBarFill = document.getElementById("p-bar-fill");
const pgAmount = document.getElementById("pg-amount");
const pgMotivation = document.getElementById("pg-motivation");
const nameInput = document.getElementById("name-input");
const saveChangesBtn = document.getElementById("save-cng-btn");
const greetings = document.getElementById("greeting");
const themeToggle = document.getElementById("theme-toggle");
const main = document.querySelector(".main");
function barUpdate(){
    completionBar.innerHTML = `
    <button id="all-task-btn" class="active">All (${allTasksCount})</button>
    <button id="active-task-btn">Active(${activeTasksCount})</button>
    <button id="completed-task-btn">Completed(${completedTasksCount})</button>
    `;
}
function barTotalUpdate(){
    lastBar.innerHTML = `
    <p>Total: ${allTasksCount}</p>
    <p>Completed: ${completedTasksCount}</p>
    `;
}
function cardUpdate(){
    completedCard.innerText = `${completedTasksCount}`;
    activeCard.innerText = `${activeTasksCount}`;
    totalCard.innerText = `${allTasksCount}`;
    comp.innerText = `${completedTasksCount}`;
    tot.innerText = `${allTasksCount}`;
    pend.innerText = `${activeTasksCount}`;

    
}
function progressBarUpdate(){
    percentage = (completedTasksCount / allTasksCount ) * 100;
    pBarFill.style.width = percentage+"%" ;
    pgAmount.innerText = percentage + "%";

    if (percentage < 40){
        pBarFill.style.background = "#b63636ff"; 
    }
    else {
        pBarFill.style.background = "linear-gradient(to bottom right, #2563eb , #8102ff)" ;    
    }

    if (percentage < 50 ){
        pgMotivation.innerText = "Every tiny achievements makes a bigger one. Never give up!"
    } else if (percentage > 50 && percentage < 80){
        pgMotivation.innerText = "You are doing a great job. Keep going. "
    } else {
        pgMotivation.innerText = "You are almost there. Accomplish your goal for today."
    }


}



navItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageId = item.dataset.page;

        pages.forEach(page => page.classList.remove("active"));

        document.getElementById(pageId).classList.add("active");

        navItems.forEach(nav => nav.classList.remove("actv"));

        item.classList.add("actv");
        
    });
});

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


//loads tasks from local storage or set empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//save tasks to local storage
function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

//render tasks 
function renderTasks(){
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    todayComTask.innerHTML="";
    todayTask.innerHTML="";

    allTasksCount = tasks.length;
    activeTasksCount = tasks.filter( t => !t.done).length;
    completedTasksCount = tasks.filter(t => t.done).length;
    barUpdate();
    barTotalUpdate();
    cardUpdate();
    progressBarUpdate();
    document.getElementById("all-task-btn").addEventListener("click", renderTasks);
    document.getElementById("active-task-btn").addEventListener("click",showActiveTasks);
    document.getElementById("completed-task-btn").addEventListener("click",showCompletedTasks);

    tasks.forEach ((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <label>
                <input type="checkbox" class="task-check" data-index="${index}" ${task.done ? "checked" : ""} >
                <span class="task-text">${task.text}</span>
            </label>
            <button data-index="${index}" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        `;
        list.appendChild(li);
        if(!task.done){
            todayTask.innerHTML += `<li>${task.text}</li>`;
        } else {
            todayComTask.innerHTML += `<li>${task.text}</li>`;
        }

    });

}
function showActiveTasks() {
    let activeTasks = tasks.map((task, originalIndex) => ({...task, originalIndex})).filter(t => !t.done);
    document.getElementById("active-task-btn").classList.add("active");
    document.getElementById("all-task-btn").classList.remove("active");
    document.getElementById("completed-task-btn").classList.remove("active");
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    activeTasks.forEach ((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <label>
                <input type="checkbox" class="task-check" data-index="${index}" ${task.done ? "checked" : ""} >
                <span class="task-text">${task.text}</span>
            </label>
            <button data-index="${index}" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        `;
        list.appendChild(li);

    });
    

};
function showCompletedTasks() {
    let completedTasks = tasks.map((task, originalIndex) => ({...task, originalIndex})).filter(t => t.done);
    document.getElementById("completed-task-btn").classList.add("active");
    document.getElementById("active-task-btn").classList.remove("active");
    document.getElementById("all-task-btn").classList.remove("active");
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    completedTasks.forEach ((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.innerHTML = `
            <label>
                <input type="checkbox" class="task-check" data-index="${index}" ${task.done ? "checked" : ""} >
                <span class="task-text">${task.text}</span>
            </label>
            <button data-index="${index}" class="delete-btn">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        `;
        list.appendChild(li);

    });
    

};

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

    if (text === "") return;

    tasks.push({text , done: false});
    allTasksCount++;
    saveTasks();
    renderTasks();
    input.value = "";

}
addBtn.addEventListener("click", addTask);
document.getElementById("task-input").addEventListener("keydown",(e)=>{
    if (e.key === "Enter"){
        addTask();
    }
})

//toggle 
document.getElementById("task-list").addEventListener("change" , (e) => {
    if(e.target.type === "checkbox"){
        const index = e.target.dataset.index;
        tasks[index].done = e.target.checked ;
        saveTasks();
        renderTasks();
    }
});
//delete task 
document.getElementById("task-list").addEventListener("click" , (e) => {
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")){
        const index = e.target.dataset.index || e.target.closest(".delete-btn").dataset.index ;
        tasks.splice(index,1);
        saveTasks();
        renderTasks();
    }
});
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
resetBtn.addEventListener("click",()=>{
    clearInterval(interval);
    running = false;

    time = 25 * 60;
    updateTimer();
    timerText.innerText="";

});

focusBtn.addEventListener("click",()=> {
    if(running) return;
    time = 25 * 60;
    updateTimer();

})
breakBtn.addEventListener("click", ()=>{
    if(running) return;
    time = 5 * 60;
    updateTimer();
})
themeToggle.addEventListener("change",() => {
    main.classList.toggle("dark",themeToggle.checked);
})

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
const savedName = localStorage.getItem("savedName");

if(savedName){
    const timeGrt = getTimeGreeting();
    greetings.textContent = `${timeGrt}, ${savedName} !`;
    nameInput.value =savedName; 
}
saveChangesBtn.addEventListener("click",() => {
    const name = nameInput.value.trim();
    const timeGreeting = getTimeGreeting();

    if (name !== ""){
        greetings.textContent = `${timeGreeting}, ${name} !`;
        localStorage.setItem("savedName",name);

    } else {
        greetings.textContent = `${timeGreeting}, Guest !`;
        localStorage.removeItem("savedName");
    }
})
renderTasks();

