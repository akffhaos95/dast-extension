// This file is injected as a content script
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ResultJson } from './types'
import axios from 'axios';
import "./content.css";

var createReactClass = require("create-react-class")
var ce = React.createElement

console.log("Hello from content script!")


// Tab Id 받아오기
chrome.runtime.onMessage.addListener(
    function (request) {
        var div = document.createElement('div');
        div.id = 'content-script';
        document.body.appendChild(div);

        ReactDOM.render(
            ce(TodoDiv, { todoList: request }),
            document.getElementById('content-script')
        )
    }
)

/** TodoList: Toggle onClick => TodoCount | TodoList */
const TodoDiv = createReactClass({
    getInitialState: function () {
        return {
            todoList: this.props.todoList,
            toggle: false
        };
    },

    toggleTodo: function () {
        const currentState = this.state.toggle
        this.setState({ toggle: !currentState })
    },

    setTodoState: function (newTodo: JSON) {
        this.setState({ todoList: newTodo })
    },

    render: function () {
        return ([
            ce("div", { className: "todoDiv", onClick: () => this.toggleTodo() }, [
                this.state.toggle ?
                    ce(TodoList, { todoList: this.state.todoList })
                    : ce(TodoCount, { todoCount: this.state.todoList.length })
            ]),
            this.state.toggle ?
                "" : ce(TodoForm, { setTodoState: this.setTodoState })
        ])
    }
})

const TodoList = createReactClass({
    render: function () {
        const isEmpty = !(this.props.todoList.length === 0)

        const todos: typeof Todo = []
        this.props.todoList.map((todo: ResultJson) => {
            todos.push(ce(Todo, { todo: todo }))
        })
        return ce('div', { className: "todoList" }, isEmpty ? todos : "this is empty")
    }
})

const Todo = createReactClass({
    render: function () {
        return ce('h3', { className: "todo" }, `${this.props.todo.id} ${this.props.todo.title}`)
    }
})

const TodoCount = createReactClass({
    render: function () {
        return ce('h3', { className: "todoCount" }, `${this.props.todoCount}`)
    }
})

const TodoForm = createReactClass({
    getInitialState: function () {
        return {
            uid: 0
        };
    },

    onChange: function (e: Event) {
        this.setState({ uid: (<HTMLInputElement>e.target).value })
    },

    onSubmit: function (e: Event) {
        e.preventDefault();
        axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${this.state.uid}`)
            .then((res) => {
                this.props.setTodoState(res.data)
            })
            .catch((err) => console.log(err))
    },

    render: function () {
        return ce('form', { className: "todoForm", onSubmit: this.onSubmit }, [
            ce("input", { className: "todoInput", type: "number", onChange: this.onChange }),
            ce("input", { className: "todoSubmit", type: "submit" })
        ])
    }
})