/**
 * Created by Tony_Zhang on 8/22/15.
 */

var TodoHeader = React.createClass({
    render: function () {
        return (
            <h2>Sample Todo List</h2>
        );
    }
});

var TodoInput = React.createClass({
    writeTodo: function (e) {
        e.preventDefault();

        var content = React.findDOMNode(this.refs.content).value.trim();
        this.props.onWriteTodo({content: content});
        React.findDOMNode(this.refs.content).value = '';
    },
    render: function () {
        return (
            <form className="todoInput" onSubmit={this.writeTodo}>
                <input type="text" placeholder="Todo content" ref="content"/>
                <input type="submit" value="Save"/>
            </form>
        );
    }
});

var Todo = React.createClass({
    finishTodo: function () {
        this.props.onFinishTodo({id: this.props.todo.objectId});
    },
    render: function () {
        var todoContent = (this.props.todo.hasFinished) ?
            (<td><strike>{this.props.todo.content}</strike></td>) :
            (<td>{this.props.todo.content}</td>);
        return (
            <tr>
                <td>{this.props.index + 1}</td>
                <td>{todoContent}</td>
                <td><input type="checkbox" disabled={this.props.todo.hasFinished}
                           onClick={this.finishTodo}/></td>
            </tr>
        );
    }
});

var TodoContent = React.createClass({
    render: function () {
        var { data, ...other } = this.props;
        var Todos = this.props.data.map(function (todo, index) {
            return (
                <Todo {...other} index={index} todo={todo}/>
            )
        });
        return (
            <table>
                <th>
                    <tr>
                        <td><strong>Index</strong></td>
                        <td><strong>Content</strong></td>
                        <td><strong>Done?</strong></td>
                    </tr>
                </th>
                <tbody>
                {Todos}
                </tbody>
            </table>
        );
    }
});

var TodosContainer = React.createClass({
    loadTodoList: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    writeTodo: function (todo) {
        var curData = this.state.data;
        var newData = curData.concat([todo]);
        this.setState({data: newData});

        $.ajax({
            url: '/todo',
            method: 'POST',
            dataType: 'json',
            data: todo,
            cache: false,
            success: function (newTodo) {
                console.log("Successfully add a todo");
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('/finish', status, err.toString());
            }.bind(this)
        });
    },
    finishTodo: function (id) {
        var newData = this.state.data;
        for (var i = 0; i < newData.length; ++i) {
            if (newData[i].objectId == id.id) {
                newData[i].hasFinished = true;
            }
        }
        this.setState({data: newData});

        $.ajax({
            url: '/finish',
            method: 'POST',
            dataType: 'json',
            data: id,
            cache: false,
            success: function () {
                console.log("marked as finished");
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('/finish', status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []}
    },
    componentDidMount: function () {
        this.loadTodoList();
    },
    render: function () {
        return (
            <div className="todosContainer">
                <TodoHeader />
                <TodoInput onWriteTodo={this.writeTodo}/>
                <TodoContent data={this.state.data} onFinishTodo={this.finishTodo}/>
            </div>
        );
    }
});

React.render(
    <TodosContainer url="/todos" interval={2000}/>,
    document.getElementById('content')
);
