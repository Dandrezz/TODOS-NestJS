"use client"

import { useEffect, useState } from 'react'
import { TodoResponse } from '@/interfaces/TodoResponse'

interface TodosProps {
    id: number,
    nombre: string,
    estado: boolean,
    editable: boolean
}

const URL_API = process.env.urlApi||'http://localhost:8000/todo'

const TodoList = () => {

    const [todos, setTodos] = useState<TodosProps[]>([])

    const fetchTodos = async () => {
        const res = await fetch(URL_API,
            {
                method: "GET",
                headers: {"Content-type": "application/json;charset=UTF-8"}
            })
        const data = await res.json()
        const DTOdata = data.map((todo: TodoResponse)=>({
            id: todo._id,
            nombre: todo.name,
            estado: todo.status,
        }))
        return DTOdata
    }

    useEffect(() => {
        fetchTodos().then(data=>setTodos(data))
    }, [])

    const handleAddClick = () => {
        const newTodo = {
            nombre: 'Tarea ' + (Math.floor(Math.random() * 100)),
            estado: false,
            editable: false,
        }
        fetch(URL_API,
        {
            method: "POST",
            headers: {"Content-type": "application/json;charset=UTF-8"},
            body: JSON.stringify({
                name: newTodo.nombre,
                status: newTodo.estado
            })
        }).then(data => data.json()).then(data => {
            setTodos([...todos, {
                id: data._id,
                nombre: newTodo.nombre,
                estado: newTodo.estado,
                editable: newTodo.editable
            }])
        })
    }

    const handleEditClick = (id: number) => {
        const todo = todos.find(todo => todo.id === id)
        if(todo?.editable) {
            fetch(URL_API+'/'+id,
            {
                method: "PUT",
                headers: {"Content-type": "application/json;charset=UTF-8"},
                body: JSON.stringify({
                    name: todo!.nombre,
                    status: todo!.estado
                })
            })
        }
        setTodos(todos.map(todo => {
            return todo.id === id ? { ...todo, editable: !todo.editable } : todo
        }))
    }

    const handleRemoveClick = (id: number) => {
        fetch(URL_API+'/'+id,
        {
            method: "DELETE",
            headers: {"Content-type": "application/json;charset=UTF-8"}
        })
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const handleChangeStatus = (id: number) => {
        setTodos(todos.map(todo => {
            return todo.id === id ? { ...todo, estado: !todo.estado } : todo
        }))
    }

    const handleEditTextChange = (id: number, value: string) => {
        setTodos(todos.map(todo => {
            return todo.id === id ? { ...todo, nombre: value } : todo
        }))
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl">Table</h1>
                <button
                    onClick={handleAddClick}
                    className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mb-4 ml-auto'>Añadir</button>
            </div>

            <div className='not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25'>
                <div className='relative rounded-xl overflow-auto bg-[#121b2e]'>
                    <div className='shadow-sm overflow-hidden my-8 '>
                        <table className='border-collapse table-fixed w-full text-center'>
                            <thead className='bg-[#121b2e]'>
                                <tr className=''>
                                    <th className='py-2'>#</th>
                                    <th className='py-2'>Nombre de la tarea</th>
                                    <th className='py-2'>Estatus</th>
                                    <th className='py-2'>Editar</th>
                                    <th className='py-2'>Remover</th>
                                </tr>
                            </thead>
                            <tbody className='bg-[#1e293b] text-[#94a3b8]'>
                                {
                                    todos.map((todo, index) => (
                                        <tr key={index}>
                                            <td className='py-2'>
                                                {index + 1}
                                            </td>
                                            <td className='py-2'>
                                                {
                                                    todo.editable ? <input
                                                        onChange={(e) => handleEditTextChange(todo.id, e.target.value)}
                                                        value={todo.nombre}
                                                        className='w-full text-black text-center' type="text" /> :
                                                        todo.nombre
                                                }
                                            </td>
                                            <td className='py-2'>
                                                {
                                                    todo.editable ? <button
                                                        onClick={() => handleChangeStatus(todo.id)}
                                                        className={`${todo.estado ? 'bg-green-500' : 'bg-orange-500'} font-bold py-2 px-4 rounded text-white`} defaultValue={todo.nombre} >{todo.estado ? 'Completado' : 'Pendiente'}</button> :
                                                        todo.estado ? 'Completado' : 'Pendiente'
                                                }
                                            </td>
                                            <td className='py-2'>
                                                <button className={`${todo.editable ? 'bg-green-500 hover:bg-green-700' : 'bg-sky-500 hover:bg-sky-700'} text-white font-bold py-2 px-4 rounded`}
                                                    onClick={() => handleEditClick(todo.id)}>{todo.editable ? 'Guardar' : 'Editar'}</button>
                                            </td>
                                            <td className='py-2'>
                                                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                                    onClick={() => handleRemoveClick(todo.id)}>Remover</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TodoList