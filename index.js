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
    todoList.push({ text: todo, priority: todoList.length})
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

function updateUI() {
    let newInnerHTML = ''           // empty string

    todoList.forEach((todoElement, todoIndex) => {
        newInnerHTML += `
            <div class="todo">
                <p>${todoElement.text}</p>
                <div class="btnContainer">
                    <button class="iconBtn" onclick="moveUp(${todoIndex})"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="iconBtn" onclick="moveDown(${todoIndex})"><i class="fa-solid fa-arrow-down"></i></button>
                    <button class="iconBtn" onclick="editTodo(${todoIndex})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="iconBtn" onclick="deleteTodo(${todoIndex})"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
            `
    })

    todoContainer.innerHTML = newInnerHTML

    localStorage.setItem('todos', JSON.stringify({ todoList }))     // to save to localstorage

}

addBtn.addEventListener('click', addTodo)       // When add todo btn clicked addTodo called.