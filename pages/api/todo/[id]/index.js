import { TODO_DB } from "@lib/firebase/firebaseAdmin";
import { getAllTodo } from "..";


export default function handler(req, res) {
    const METHOD = req.method

    switch (METHOD) {
        case "PUT":
            return update(req, res)

        case "DELETE":
            return destroy(req, res)
    }

    return res.status(405).json({ 'message': 'Method not allow', method:  req.method})
}

async function update(req, res) {
    try {

        var {todo} = req.body
        if (todo) {
            var allTodos = await getAllTodo();
            var isExist = allTodos.find((item) => (item.todo === todo) && (item.id != req.query.id))
            if (isExist) {
                return res.status(422).json({ message: 'The Todo already exist'})
            }

            TODO_DB.child(req.query.id).update({todo})
            return res.status(200).json({ success: true })
        }

        return res.status(422).json({ message: 'The Field name is require'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

async function destroy(req, res) {
    try {
        TODO_DB.child(req.query.id).remove()

        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}