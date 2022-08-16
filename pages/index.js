import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { initFirebase, realDB } from '../lib/firebase/initFirebase'
import { ref, onValue } from "firebase/database";
import axios from "@lib/axios"

initFirebase()

export default function Home() {
  const [task, setTask] = useState('')
  const [data, setData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    getTodos({ todo: task })
  }, [task])

  useEffect(() => {
    const db = ref(realDB, 'todo');

    onValue(db, (snapshot) => {
      let results = []
      snapshot.forEach((data) => {
        results.push({
          id: data.key,
          ...data.val()
        })
      });

      setData(results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      setTask('')
    }, (err) => {
      console.log(err);
    });

  }, [])

  const getTodos = async (params = {}) => {
    const { data } = await axios.get('todo', { params })
    setData(data.data)
  }

  const onSubmit = async e => {
    e.preventDefault()
    try {
      if (selectedItem) {
        await axios.put(`todo/${selectedItem.id}`, {
          todo: selectedItem.todo
        })
        setSelectedItem(null)
      } else {
        await axios.post('todo', {
          todo: task,
          isCompleted: false,
          createdAt: (new Date()).toISOString()
        })
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message)
    }
  }

  const onDelete = async (item) => {
    try {
      await axios.delete(`todo/${item.id}`)
      if (item.id === selectedItem?.id) {
        setSelectedItem(null)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const onMarkComplete = async (item) => {
    try {
      await axios.put(`todo/${item.id}/mark-complete`, { is_complete: !item.isCompleted })
    } catch (err) {
      console.log(err);
      alert("Failed")
    }
  }

  const onChange = e => {
    const { value } = e.target
    if (selectedItem) {
      setSelectedItem(prev => ({
        ...prev,
        todo: value
      }))
    } else {
      setTask(value)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="The greatest todo app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={`${styles.title} pb-4`}>
        ToDo App
        </h1>

        <form className='w-full' onSubmit={onSubmit}>
          <input
            name='title'
            type='text'
            className='border-2 p-2'
            value={selectedItem ? selectedItem.todo : task}
            required
            onChange={onChange} />
        </form>

        <ul className='w-full m-0'>
          {!data.length ? "No result. Create a new one instead!" : data.map(todo => {
            return (
              <div className='group flex items-center' key={todo.id}>
                <div className='flex items-center border p-2 my-2' >
                  <input
                    className='mr-2'
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => onMarkComplete(todo)} />
                  <li className={todo.isCompleted ? 'line-through' : ''}>{todo.todo}</li>
                </div>
                <button
                  className='border-2 p-1 m-1 hidden group-hover:block'
                  onClick={() => setSelectedItem(todo)} >
                  edit
                </button>
                <button
                  className='border-2 p-1 m-1 hidden group-hover:block'
                  onClick={() => onDelete(todo)} >
                  delete
                </button>
              </div>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
