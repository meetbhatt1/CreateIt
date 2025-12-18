import Task from "../models/TaskModel.js";
import { createJiraIssue } from "../services/jiraService.js";

export const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req?.params?.projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, due, xp, assignee, projectId } = req?.body;

        const task = new Task({
            title,
            description,
            priority,
            status,
            due,
            xp,
            assignee,
            projectId,
            createdBy: req?.user?._id,
        });

        const jiraIssue = await createJiraIssue({
            projectKey: "CRE", // or dynamic per project
            summary: title,
            description
        });

        task.jira = {
            issueId: jiraIssue.id,
            issueKey: jiraIssue.key,
            synced: true
        };


        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: "Failed to create task" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // 🔁 JIRA status sync
        if (task.jira?.issueId && req.body.status) {
            const transitionMap = {
                todo: "11",
                inProgress: "21",
                review: "31",
                done: "41",
            };

            await transitionJiraIssue(
                task.jira.issueId,
                transitionMap[req.body.status]
            );
        }

        Object.assign(task, req.body);
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update task" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findByIdAndDelete(req.params.taskId);
        if (!deleted) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
