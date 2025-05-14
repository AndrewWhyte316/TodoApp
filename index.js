const textarea = document.querySelector('textarea') 
const addBtn = document.getElementById('addBtn')    // select element by ID.
const todoContainer = document.querySelector('.todoContainer')

let todoList = []

function initialLoad() {
    const stored = localStorage.getItem('todos')
    if (!stored) return
    todoList = JSON.parse(stored).todoList
    updateUI()
}

initialLoad()


function addTodo() {
    const todo = textarea.value.trim()
    if (!todo) { return}

    console.log('Added todo: ',todo)
    todoList.push({ text: todo, priority: todoList.length, completed: false })

    textarea.value = ''                 // resets to empty
    updateUI()
}

function editTodo(index) {
    textarea.value = todoList[index].text

    todoList.splice(index, 1) // remove the item
    updatePriorities()
    updateUI()
}

function deleteTodo(index) {
    todoList.splice(index, 1)
    updatePriorities()
    updateUI()
}

function moveUp(index) {
    if (index === 0) return
    [todoList[index], todoList[index - 1]] = [todoList[index - 1], todoList[index]]
    updatePriorities()
    updateUI()
}

function moveDown(index) {
    if (index === todoList.length - 1) return
    [todoList[index], todoList[index + 1]] = [todoList[index + 1], todoList[index]]
    updatePriorities()
    updateUI()
}

function updatePriorities() {
    todoList.forEach((todo, i) => {
    todo.priority = i
    })
}

function toggleComplete(index) {
    todoList[index].completed = !todoList[index].completed
    updateUI()
}


function updateUI() {
    todoList.sort((a, b) => a.priority - b.priority)

    const activeContainer = document.querySelector('.todoContainer')
    const completedContainer = document.querySelector('.completedContainer')

    activeContainer.innerHTML = ''
    completedContainer.innerHTML = ''

    todoList.forEach((todo, index) => {
        const container = todo.completed ? completedContainer : activeContainer
        container.innerHTML += generateTodoHTML(todo, index, todo.completed)
    });

    localStorage.setItem('todos', JSON.stringify({ todoList }))
}


function generateTodoHTML(todo, index, isCompleted = false) {
    return `
        <div class="todo ${isCompleted ? 'completed' : ''}">
            <p>${todo.text}</p>
            <div class="btnContainer">
                ${!isCompleted ? `
                <button class="iconBtn" onclick="moveUp(${index})"><i class="fa-solid fa-arrow-up"></i></button>
                <button class="iconBtn" onclick="moveDown(${index})"><i class="fa-solid fa-arrow-down"></i></button>
                <button class="iconBtn" onclick="editTodo(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
                ` : ''}
                <button class="iconBtn" onclick="toggleComplete(${index})">
                    <i class="fa-solid ${isCompleted ? 'fa-rotate-left' : 'fa-check'}"></i>
                </button>
                <button class="iconBtn" onclick="deleteTodo(${index})"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>
    `
}


addBtn.addEventListener('click', addTodo)       // When add todo btn clicked addTodo called.