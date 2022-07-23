$(function () {
    function todoArray() {
        fetch("/todo/", {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
        })
            .then(res => res.json())
            .then(tab)
            .catch(function (error) {
                console.log(error);
            })

    }

    todoArray();

    let arrayAllTodos = [];
    let flagWhatTab = "all";
    let _id = 0;
    const numberTodosOnList = 5;
    let activePage = 1;

    const ENTER_BUTTON = 13;
    const list = '#list-todos';
    const checkAll = ".check-all";
    const newTodos = "#new-todos";
    const complete = '#complete-todos';
    const actived = '#active-todos';
    const clear = '#clear';
    const all = '#all';
    const addTodo = '#add-todo';
    const enterTodo = ".enter-todo";
    const pagination = '.pagination';


    function createListTodos(arr, id) {
        let listTodos = '';
        let position = (id - 1) % numberTodosOnList;
        let id_p = id-(position+1);
        let t=0;
        (id>numberTodosOnList)?t=id_p:t=0;
        for (let j = t; j < id; j++) {
            listTodos += `<li class="todo" id=${j}><input class="input-check"  id="input-check${arr[j]._id}"  type="checkbox" ${((arr[j].status) ? 'checked' : '')}><label for="input-check${arr[j]._id}"></label><p id="${arr[j]._id}" class="edit-todo ${((arr[j].status) ? 'line-through' : '')}" >${arr[j].name}</p><button class="butdel btn btn-danger" id="${arr[j]._id}">x</button></li>`;
        }
        return listTodos;
    }

    function renderCountPage(arr, activePage) {
        if (arr.length) {
            const countPage = Math.ceil(arr.length / numberTodosOnList);
            let nav = "";
            for (let k = 1; k <= countPage; k++) {
                nav += `<li class="page-item  ${((k === activePage) ? 'active' : '')}" id="${k}page"><a class="page-link" href="#">${k}</a></li>`;
            }
            $(pagination).append(nav);
        }
    }

    //clear li todos & paginator
    function removeTodos() {
        $('.todo').remove();
        $('.page-item').remove();
    }

    //render page
    function actualPage(activePage, arr) {
        let last = 0;
        const countPage = Math.ceil(arr.length / numberTodosOnList);
        let l=activePage*numberTodosOnList;
        (activePage < countPage) ? last = l : last = arr.length;
        return last;
    }

    //if click change add todos.status=true
    function checkedAllStatus(item) {
        return item.status
    }

    function checkStatusCheckAll() {
        $(checkAll).prop("checked", arrayAllTodos.every(checkedAllStatus));
    }

    function createPage(array, activePage, lastTodo) {
        removeTodos();
        $(list).append(createListTodos(array, lastTodo));
        renderCountPage(array, activePage);
    }

    function count() {
        counterUncomplete();
        counterComplete();
        counterAll();
    }

    function tab(data) {
        if (data.length) {
            let array = [];
            arrayAllTodos = data;
            if ($(all).hasClass('active')) {
                array = data;
            }
            else if ($(actived).hasClass('active')) {
                array = selectionUncomplete();
            }
            else if ($(complete).hasClass('active')) {
                array = selectionComplete();
            }
            activePage = 1;
            const lastTodo = actualPage(activePage, array);
            createPage(array, activePage, lastTodo);
            checkStatusCheckAll();
            count();
        } else {
            $(checkAll).prop("checked", false);
            removeTodos();
        }
    }

    function addTodoByEnter(e) {
        if (e.keyCode === ENTER_BUTTON) {
            addTodos();
        }

    }

    function workTabIfAdd(data) {
        let todo = {
            name: data.name,
            status: false,
            _id: data._id
        };
        arrayAllTodos.push(todo);
        if (flagWhatTab === 'all') {
            activePage = Math.ceil(arrayAllTodos.length / numberTodosOnList);
            createPage(arrayAllTodos, activePage, arrayAllTodos.length);

        }
        else if (flagWhatTab === 'uncomplete') {
            let arrayUnComplete = selectionUncomplete();
            activePage = Math.ceil(arrayUnComplete.length / numberTodosOnList);
            createPage(arrayUnComplete, activePage, arrayUnComplete.length);

        }
        else if (flagWhatTab === 'complete') {
            let arrayComplete = selectionComplete();
            if ($(checkAll).prop('checked')) {
                activePage = Math.ceil(arrayComplete.length / numberTodosOnList);
                let lastPage = actualPage(activePage, arrayComplete);
                createPage(arrayComplete, activePage, lastPage);
            } else arrayComplete = [];
        }
        checkStatusCheckAll();
        count();


    }

    function workTabsIfDelete(number) {
        activePage = Math.floor(number / numberTodosOnList) + 1;
        arrayAllTodos.splice(number, 1);
        const first = (activePage * numberTodosOnList - numberTodosOnList) + 1;
        checkStatusCheckAll();
        removeTodos();
        number = number + 1;
        if (flagWhatTab === 'complete') {
            let arrayComplete = selectionComplete();

            if ((number === arrayComplete.length + 1) && (number === first)) {
                activePage = Math.ceil(number / numberTodosOnList) - 1;
            }
            let lastPage = actualPage(activePage, arrayComplete);
            createPage(arrayComplete, activePage, lastPage);
        }
        else if (flagWhatTab === 'uncomplete') {
            let arrayUnComplete = selectionUncomplete();
            if ((number === arrayUnComplete.length + 1) && (number === first)) {
                activePage = Math.ceil(number / numberTodosOnList) - 1;
            }
            let lastPage = actualPage(activePage, arrayUnComplete);
            createPage(arrayUnComplete, activePage, lastPage);
        }
        else if (flagWhatTab === 'all') {
            $(checkAll).prop("checked", false);
            if ((number === arrayAllTodos.length + 1) && (number === first)) {
                activePage = Math.ceil(number / numberTodosOnList) - 1;
            }
            let lastPage = actualPage(activePage, arrayAllTodos);
            createPage(arrayAllTodos, activePage, lastPage);
        }
        count();

    }

    function workTabsIfDeleteAll() {
        if (arrayAllTodos.length) {
            activePage = 1;
            arrayAllTodos = arrayAllTodos.filter((item) => !item.status);
            if (flagWhatTab === 'all') {
                if ($(checkAll).prop('checked')) {
                    $(checkAll).prop('checked', false);
                    arrayAllTodos = [];
                    removeTodos();

                } else {
                    const lastTodo = actualPage(activePage, arrayAllTodos);
                    createPage(arrayAllTodos, activePage, lastTodo);
                }

            }
            else if (flagWhatTab === 'complete') {
                $(checkAll).prop('checked', false);
                let arrayComplete = [];
                removeTodos();
                renderCountPage(arrayComplete, activePage);
            }
            else if (flagWhatTab === "uncomplete") {
                let arrayUnComplete = selectionUncomplete();
                if ($(checkAll).prop('checked')) {
                    removeTodos();
                    $(checkAll).prop('checked', false);
                }
                else {
                    activePage = 1;
                    const lastTodo = actualPage(activePage, arrayUnComplete);
                    createPage(arrayUnComplete, activePage, lastTodo);
                }
            }

        }
        count();
    }

    function workTabsIfCheck(number, id) {
        if (flagWhatTab === 'all') {
            arrayAllTodos[number].status = !arrayAllTodos[number].status;
            checkStatusCheckAll();
        }
        else if (flagWhatTab === 'uncomplete') {
            arrayAllTodos.forEach(function (item) {
                if (item._id === id) {
                    item.status = !item.status;
                }
            })
            let arrayUnComplete = selectionUncomplete();
            activePage = Math.floor(number / numberTodosOnList) + 1;
            number = number + 1;
            let first = (activePage * numberTodosOnList - numberTodosOnList) + 1;
            if ((number === arrayUnComplete.length + 1) && (number === first)) {
                activePage = Math.ceil(number / numberTodosOnList) - 1;
            }
            let lastPage = actualPage(activePage, arrayUnComplete);
            createPage(arrayUnComplete, activePage, lastPage);

        }
        else if (flagWhatTab === 'complete') {
            arrayAllTodos.forEach(function (item) {
                if (item._id === id) {
                    item.status = !item.status;
                }
            })
            let arrayComplete = selectionComplete();
            activePage = Math.floor(number / numberTodosOnList) + 1;
            number = number + 1;
            let first = (activePage * numberTodosOnList - numberTodosOnList) + 1;
            if ((number === arrayComplete.length + 1) && (number === first)) {
                activePage = Math.ceil(number / numberTodosOnList) - 1;
            }
            let lastPage = actualPage(activePage, arrayComplete);
            createPage(arrayComplete, activePage, lastPage);

        }
        count();

    }

    function addTodoToDataBase(name) {

        fetch("/todo/", {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({name: name})

        })
            .then(res => res.json())
            .then((data) => {
                workTabIfAdd(data);
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    function deleteTodoFromDataBase(id, number) {
        fetch(`/todo/${id}`, {
            method: 'DELETE',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})

        })
            .then(res => res.json())
            .then((data) => {
                workTabsIfDelete(number);
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    function deleteAllCompleteDataBase() {

        fetch("/todo/", {
            method: 'DELETE',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},

        })
            .then(res => res.json())
            .then((data) => {
                workTabsIfDeleteAll();
            })
            .catch(function (error) {
                console.log(error);
            })


    }

    function checkTodoInDataBase(id, status, number, name) {
        let obj = {name: name, status: status};

        fetch(`/todo/${id}`, {
            method: 'PUT',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({data: obj})

        })
            .then(res => res.json())
            .then((data) => {
                workTabsIfCheck(number, id);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function editTodoInDataBase(id, name, status) {
        let obj = {name: name, status: status};
        fetch(`/todo/${id}`, {
            method: 'PUT',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({data: obj})

        })
            .then(res => res.json())
            .catch(function (error) {
                console.log(error);
            })
    }

    function checkAllCompleteDataBase(status) {

        fetch("/todo/", {
            method: 'PUT',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({status: status})

        })
            .then(res => res.json())
            .catch(function (error) {
                console.log(error);
            })


    }


    function selectionUncomplete() {
        let arrayUncomplete = arrayAllTodos.filter((item) => !item.status)
        return arrayUncomplete;
    }

    function selectionComplete() {
        let arrayComplete = arrayAllTodos.filter((item) => {
            return item.status === true
        })
        return arrayComplete;
    }


///////////////////////////////////////////////////////
    function addTodos() {
        let todoValue = $(enterTodo).val();
        todoValue = _.escape(todoValue);
        if (todoValue.trim()) {
            addTodoToDataBase(todoValue);
        }
        else {
            alert("Enter todo");
        }
        $(newTodos).val('');
    }

//add if press key Enter
    $(newTodos).on("keypress", addTodoByEnter);

//add if press button Add

    $(addTodo).on('click', addTodos);

//check on 1todo
    $(list).on('change', '.input-check', function () {
        let number = parseInt($(this).parent().attr("id"));
        let name = $(this).parent().children('p').text();
        console.log(name);
        let id = $(this).attr("id");
        let status;
        const spliceIdFromInputAttr=11;
        id = id.slice(spliceIdFromInputAttr, id.length);
       status= $(this).is(":checked");
        let curentNumderOnList = number % numberTodosOnList + 1;
        $(".todo:nth-child(" + curentNumderOnList + ")>.edit-todo").toggleClass("line-through");
        checkTodoInDataBase(id, status, number, name);
    });

    //delete todos separately
    $(list).on('click', 'button', function () {
        let number = parseInt($(this).parent().attr("id"));
        let del = $(this).attr("id");
        deleteTodoFromDataBase(del, number);
    });


    //check all li in page
    $(checkAll).on('change', function () {
        if (arrayAllTodos.length) {
            if ($(this).prop('checked')) {
                checkAllCompleteDataBase(true);
                arrayAllTodos.forEach(function (item) {
                    item.status = true;
                })
                if (flagWhatTab === 'all') {
                    let lastPage = actualPage(activePage, arrayAllTodos);
                    createPage(arrayAllTodos, activePage, lastPage);
                }
                if (flagWhatTab === 'uncomplete') {
                    removeTodos();
                }
                if (flagWhatTab === 'complete') {
                    let arrayComplete = selectionComplete()
                    activePage = 1;
                    let lastPage = actualPage(activePage, arrayComplete);
                    createPage(arrayComplete, activePage, lastPage);
                }
            }
            else {
                checkAllCompleteDataBase(false);
                arrayAllTodos.forEach(function (item) {
                    item.status = false;
                })
                if (flagWhatTab === 'all') {
                    let lastPage = actualPage(activePage, arrayAllTodos);
                    createPage(arrayAllTodos, activePage, lastPage);

                }
                if (flagWhatTab === 'uncomplete') {
                    activePage = 1;
                    let arrayUnComplete = selectionUncomplete();
                    let lastPage = actualPage(activePage, arrayUnComplete);
                    createPage(arrayUnComplete, activePage, lastPage);


                }
                if (flagWhatTab === 'complete') {
                    removeTodos();

                }
            }
            count();
        }
    });

//delete all check todos, click on button clear complete
    $(clear).on('click', function () {
        deleteAllCompleteDataBase();
    });

    //edit todos
    $(list).on("dblclick", '.edit-todo', function () {
        let id = parseInt($(this).parent().attr("id"));
        let _id = $(this).attr("id");
        let curentNumderOnList = id % numberTodosOnList + 1;
        let pinput = '<input class="edit-input" id="' + _id + '"/>';
        let p = $(this).text();
        $(".todo:nth-child(" + (curentNumderOnList) + ")>p").after(pinput);
        $('.edit-input').focus().attr('value', p);
        $(this).hide();
    });
    $(list).on('focusout', '.edit-input', function () {
        let valueinput = $(this).val();
        let id = parseInt($(this).parent().attr("id"));
        let curentNumderOnList = id % numberTodosOnList + 1;
        let _id = $(this).attr("id");
        valueinput=_.escape(valueinput);
        if (valueinput.trim()) {
            $(".todo:nth-child(" + (curentNumderOnList) + ")>p").text(valueinput);
            if ($(this).parent().children('input').is(':checked')) {
                status = true;
            } else {
                status = false;
            }
            console.log(status);
            editTodoInDataBase(_id, valueinput, status);
            arrayAllTodos[id].name = valueinput;
        }
        $(".todo:nth-child(" + (curentNumderOnList) + ")>p").show();
        $(this).hide();

    });

    $(list).on('keypress', '.edit-input', function (e) {
        if (e.keyCode === ENTER_BUTTON) {
            let valueinput = $(this).val();
            let id = parseInt($(this).parent().attr("id"));
            let curentNumderOnList = id % numberTodosOnList + 1;
            let _id = $(this).attr("id");
            let status = $(this).parent().children('input').attr("checked");
            valueinput=_.escape(valueinput);
            if (valueinput.trim()) {
                $(".todo:nth-child(" + (curentNumderOnList) + ")>p").text(valueinput);
                if ($(this).parent().children('input').is(':checked')) {
                    status = true;
                } else {
                    status = false;
                }
                editTodoInDataBase(_id, valueinput, status);
                arrayAllTodos[id].name = valueinput;
            }
            $(".todo:nth-child(" + (curentNumderOnList) + ")>p").show();
            $(this).hide();

        }
    });


    //all completed todos
    $(complete).on('click', function () {
        activePage = 1;
        flagWhatTab = 'complete';
        //switch tabs
        if ($(all).hasClass('active')) {
            $(all).removeClass('active');
        }
        if ($(actived).hasClass('active')) {
            $(actived).removeClass('active');
        }
        $(complete).addClass('active');
        todoArray();
    });

    //all uncompleted todos
    $(actived).on('click', function () {
        activePage = 1;
        flagWhatTab = 'uncomplete';
        //switch tabs
        if ($(all).hasClass('active')) {
            $(all).removeClass('active');
        }
        if ($(complete).hasClass('active')) {
            $(complete).removeClass('active');
        }
        $(actived).addClass('active');
        todoArray();
    });

    //all todos
    $(all).on('click', function () {
        activePage = 1;
        flagWhatTab = 'all';

        if ($(actived).hasClass('active')) {
            $(actived).removeClass("active");
        }
        if ($(complete).hasClass('active')) {
            $(complete).removeClass("active");
        }
        $(all).addClass('active');
        if (arrayAllTodos.length) {
            const lastTodo = actualPage(activePage, arrayAllTodos);
            createPage(arrayAllTodos, activePage, lastTodo);
        } else $(checkAll).prop("checked", false);
    });

    //counter all uncompleted todos
    function counterUncomplete() {
        let count = 0;
        arrayAllTodos.forEach(function (item) {
            if (item.status === false) {
                count++;
            }
        });
        $('.count-uncomplete').prop("value", count + " items uncomplete");
    }

    //counter all complete todos
    function counterComplete() {
        let count = 0;
        arrayAllTodos.forEach(function (item) {
            if (item.status === true) {
                count++;
            }
        });
        $('.count-complete').prop("value", count + " items complete");
    }

    //counter all todos
    function counterAll() {
        let count = 0;
        arrayAllTodos.forEach(function () {
            count++;
        });
        $('.count-all').prop("value", count + " all todos");
    }

    //click on pagination
    $(pagination).on('click', 'a', function () {
        activePage = parseInt($(this).parent().attr("id"));
        if (flagWhatTab === 'all') {
            const lastTodo = actualPage(activePage, arrayAllTodos);
            createPage(arrayAllTodos, activePage, lastTodo);
        }
        else if (flagWhatTab === 'uncomplete') {
            let arrayUnComplete = selectionUncomplete();
            const lastTodo = actualPage(activePage, arrayUnComplete);
            createPage(arrayUnComplete, activePage, lastTodo);
        }
        else if (flagWhatTab === 'complete') {
            let arrayComplete = selectionComplete();
            const lastTodo = actualPage(activePage, arrayComplete);
            createPage(arrayComplete, activePage, lastTodo);
        }
    });
});


