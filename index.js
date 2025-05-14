const textarea = document.querySelector('textarea') 
const addBtn = document.getElementById('addBtn')    // select element by ID.
const todoContainer = document.querySelector('.todoContainer')

let todoList = []
let editingIndex = null

function initialLoad() {
    const stored = localStorage.getItem('todos')
    if (!stored) return
    todoList = JSON.parse(stored).todoList
    updateUI()
}

initialLoad()


function addTodo() {
    const todoText = textarea.value.trim();
    if (!todoText) return;

    if (editingIndex !== null) {
        // editing an existing item
        todoList[editingIndex].text = todoText;
        editingIndex = null;
    } else {
        // Adding new item
        todoList.push({
        text: todoText,
        priority: todoList.length,
        completed: false
        })
    }

    textarea.value = ''
    updateUI()
}

function editTodo(index) {
    editingIndex = index
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
    const isEditing = index === editingIndex;

    return `
        <div class="todo ${isCompleted ? 'completed' : ''}">
            ${isEditing ? `
                <input type="text" class="editInput" value="${todo.text}" onkeyup="handleEditKey(event, ${index})" />
                <div class="btnContainer">
                    <button class="iconBtn" onclick="saveEdit(${index})"><i class="fa-solid fa-floppy-disk"></i></button>
                    <button class="iconBtn" onclick="cancelEdit()"><i class="fa-solid fa-xmark"></i></button>
                </div>
            ` : `
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
            `}
        </div>
    `;
}

function saveEdit(index) {
    const input = document.querySelector('.editInput');
    if (!input) return;

    const updatedText = input.value.trim();
    if (!updatedText) return;

    todoList[index].text = updatedText;
    editingIndex = null;
    updateUI();
}

function cancelEdit() {
    editingIndex = null;
    updateUI();
}

function handleEditKey(event, index) {
    if (event.key === 'Enter') {
        saveEdit(index);
    }
}

addBtn.addEventListener('click', addTodo)       // When add todo btn clicked addTodo called.