import { TODO_DB } from "@lib/firebase/firebaseAdmin";

export default function handler(req, res) {
    const METHOD = req.method

    switch (METHOD) {
        case "PUT":
            return update(req, res)
    }

    return res.status(405).json({ 'message': 'Method not allow', method: req.method })
}

async function update(req, res) {
    try {
        const { is_complete } = req.body
        TODO_DB.child(req.query.id).update({ isCompleted: is_complete })

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ error })
    }
}