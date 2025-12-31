// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// ローカルストレージからTodoリストを取得
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});

// Enterキーで追加
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 追加ボタンのイベントリスナー
addBtn.addEventListener('click', addTodo);

// Todoを追加する関数
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('タスクを入力してください');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
}

// Todoを削除する関数
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Todoを編集する関数
function editTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const todoText = todoItem.querySelector('.todo-text');
    const editBtn = todoItem.querySelector('.edit-btn');
    const deleteBtn = todoItem.querySelector('.delete-btn');

    // 編集モードに切り替え
    const currentText = todoText.textContent;
    todoText.innerHTML = `<input type="text" class="edit-input" value="${currentText}">`;

    const editInput = todoItem.querySelector('.edit-input');
    editInput.focus();

    // ボタンを保存ボタンに変更
    editBtn.textContent = '保存';
    editBtn.classList.remove('edit-btn');
    editBtn.classList.add('save-btn');
    editBtn.onclick = () => saveTodo(id, editInput.value);

    // 削除ボタンをキャンセルに変更
    deleteBtn.textContent = 'キャンセル';
    deleteBtn.onclick = () => renderTodos();

    // Enterキーで保存
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTodo(id, editInput.value);
        }
    });
}

// 編集を保存する関数
function saveTodo(id, newText) {
    const text = newText.trim();

    if (text === '') {
        alert('タスクを入力してください');
        return;
    }

    todos = todos.map(todo =>
        todo.id === id ? { ...todo, text: text } : todo
    );

    saveTodos();
    renderTodos();
}

// ローカルストレージに保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Todoリストを表示する関数
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-id', todo.id);

        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <button class="edit-btn" onclick="editTodo(${todo.id})">編集</button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">削除</button>
        `;

        todoList.appendChild(li);
    });
}
