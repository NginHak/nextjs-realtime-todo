import { TODO_DB } from "@lib/firebase/firebaseAdmin";

export default function handler(req, res) {

    switch (req.method) {
        case "GET":
            return index(req, res)

        case "POST":
            return create(req, res)
    }

    return res.status(405).json({ message: 'Method not allow' })
}

async function index(req, res) {
    try {
        let results = await getAllTodo()

        const search = req.query.todo
        if (search) {
            results = results.filter((item) => item.todo.includes(search))
        }

        return res.status(200).json({ data: results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

async function create(req, res) {
    try {
        const { todo, isCompleted, createdAt } = req.body

        if (!todo) {
            return res.status(422).json({ message: 'todo is require' })
        }

        const allTodos = await getAllTodo();
        const isExist = allTodos.find((item) => item.todo === todo)
        if (isExist) {
            return res.status(422).json({ message: `${todo} is already exist`})
        }

        TODO_DB.push({
            todo,
            isCompleted: isCompleted ?? false,
            createdAt: createdAt ?? new Date()
        })

        return res.status(200).json({ success: true })

    } catch (error) {
        return res.status(500).json({ error })
    }
}

export async function getAllTodo() {
    let snapshot = await TODO_DB.get()

    var results = []
    snapshot.forEach((data) => {
        results.push({
            id: data.key,
            ...data.val()
        })
    });

    return results
}
