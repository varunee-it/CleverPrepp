export function serializeFocusSession(session) {
    if (!session) return null;
    
    // If it's a Mongoose document, convert to plain object
    const obj = typeof session.toObject === 'function' ? session.toObject() : session;
    
    // Normalize _id to id
    const serialized = {
        ...obj,
        id: obj._id || obj.id,
    };
    
    // Delete the original _id from the serialized output to enforce id usage
    delete serialized._id;
    delete serialized.__v;
    
    // Normalize checklist tasks too if present
    if (Array.isArray(serialized.checklist)) {
        serialized.checklist = serialized.checklist.map(task => {
            const taskObj = { ...task, id: task._id || task.id };
            delete taskObj._id;
            return taskObj;
        });
    }

    return serialized;
}
